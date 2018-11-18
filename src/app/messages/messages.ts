import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../shared/components/confirm";
import { Alert } from "../shared/components/alert";
import { AuthService } from "../auth/auth.service";
import './style.css';
import * as moment from 'moment'; 
declare var Pusher: any;

@Component({
    selector: 'messages',
    templateUrl: './messages.html',
})
export class Messages {

    public errors: any = {};
    protected pusher: any;
    public channel: any;
    public mesgUsers:any=[];
    public currentUser:any={};

    constructor(
        protected http: Http,
        protected toastr: ToastsManager,        
        public auth: AuthService
    ) {
        this.currentUser=this.auth.getUser();
     }

    sendM(){
        this.http.post(`/api/v1/message/5`,{}).subscribe((re)=>{
           
        },(re)=>{
            
        });
    }
    
    avatar(d) {
        var url = (this.currentUser.id==d.send_by)?d.reciever_avatar:d.sender_avatar;
        return this.auth.setAvatar(url);
    }

    ngOnInit() {
        this.auth.hideLogo();
        this.auth.eEmit('headerTitle', 'Messages');
        this.auth.eEmit('backLink', ['/', 'jobs', 'myjobs']);
        this.auth.eEmit('showNext', false);
        this.auth.showFooter();
        // this.pusher = new Pusher('771046c9c67d0ae6e036', {
        //     cluster: 'ap1',
        //     encrypted: true
        // });

        // this.channel= this.pusher.subscribe('chatbox-1');
        // this.channel.bind('sendMessage',(data) => {
        //     console.log(data);
        // });
        this.loadUsers();
    }

    loadUsers(){

        this.http.get(`api/v1/message/users`).subscribe((re)=>{
            this.mesgUsers = re.json().data;         
        },(re)=>{

        });

    }
}
