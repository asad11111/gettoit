import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../shared/components/confirm";
import { Alert } from "../shared/components/alert";
import { AuthService } from "../auth/auth.service";
import * as moment from 'moment';
declare var Pusher: any;
import './style.css';

@Component({
    selector: 'message',
    templateUrl: './message.html',
})
export class Message {

    public errors: any = {};
    public id: any;
    public messages: any = [];
    public currentUser: any = {};
    public mesg: any = {};
    public job_id: any = 0;
    public channels: any = '';
    protected channel: any;
    protected pusher: any;
    public busy: any = false;

    constructor(
        protected http: Http,
        protected toastr: ToastsManager,
        private activatedRoute: ActivatedRoute,
        public auth: AuthService
    ) {
        this.currentUser = this.auth.getUser();
        this.activatedRoute.params.subscribe((param: any) => {
            this.id = param['id'];
            this.mesg.send_to = param['id'];
            if (typeof param['job_id'] != 'undefined')
                this.job_id = param['job_id'];
        });
    }

    avatar(url) {
        return this.auth.setAvatar(url);
    }

    ngOnInit() {
        this.auth.hideLogo();
        this.auth.eEmit('headerTitle', 'Conversation');
        this.auth.eEmit('backLink', ['/', 'messages']);
        this.auth.eEmit('showNext', false);
        this.auth.hideFooter();        
        this.pusher = new Pusher('771046c9c67d0ae6e036', {
            cluster: 'ap1',
            encrypted: true
        });
        this.loadMessage();
    }

    loadMessage() {
        this.http.get(`/api/v1/messages/${this.id}`).subscribe((re) => {
            this.messages = re.json().data;
            if (this.messages.length > 0)
                this.subChannel(this.messages[0], this.messages[0].channel);
        }, (re) => { });
    }

    addNewMesg(d, local = false) {
        var lastMesg = {
            id: d.mesg.mesg.id,
            job_id: this.job_id,
            mesg: d.mesg.mesg,
            read_at: null,
            reciever: (d.mesg.reciever) ? d.mesg.reciever : d.reciever.name,
            reciever_avatar: (d.mesg.reciever_avatar) ? d.mesg.reciever_avatar : d.reciever.avator,
            send_at: d.mesg.send_at,
            send_by: d.mesg.send_by,
            send_to: d.mesg.send_to,
            sender: this.currentUser.name,
            sender_avatar: (local) ? this.currentUser.avator : d.reciever.avator,
        };
        this.messages.push(lastMesg);
    }

    dateFormate(d) {
        return moment(d).format("DD MMM YYYY HH:mm A");
    }
    subChannel(d, channel = '') {
        this.channels = (channel != '') ? channel : d.channel;
        this.channel = this.pusher.channel(this.channels);     
        if (typeof this.channel == 'undefined') {
            this.channel = this.pusher.subscribe(this.channels);
            this.channel.bind('sendMessage', (data) => {
                if (this.currentUser.id != data.mesg.send_by) {
                    this.addNewMesg(data);
                }
            });
        }
    }

    sendMessage() {
        this.mesg.send_at = moment().format("YYYY-MM-DD HH:mm:ss");
        this.mesg.job_id =this.job_id;
        if (!this.busy) {
            this.busy = true;
            this.http.post(`/api/v1/messages`, this.mesg).subscribe((re) => {
                this.addNewMesg(re.json().data, true);
                this.subChannel(re.json().data);
                this.mesg.mesg = '';
                this.busy = false;
            }, (re) => {
                this.errors = re.json().errors;
                this.busy = false;
                for (var i in this.errors) {
                    this.errors[i].forEach((v, k) => {
                        this.toastr.error(v);
                    });
                }
            });
        }
    }
}