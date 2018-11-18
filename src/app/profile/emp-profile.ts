import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../shared/components/confirm";
import { Alert } from "../shared/components/alert";
import { AuthService } from "../auth/auth.service";
import * as moment from 'moment';

@Component({
    selector: 'emp-profile',
    templateUrl: './emp-profile.html',
})

export class EmpProfile {

    public errors: any = {};
    public steps: any = 1;
    public edit: any = 1;
    public userType: any = 0;
    public data: any;
    public rating: any=[] ; 
    public user:any=[];
    public busy:any=false;

    constructor(
        protected http: Http,
        protected toastr: ToastsManager,
        public auth: AuthService
    ) { }

    ngOnInit() {
        this.auth.hideLogo();
        this.auth.eEmit('headerTitle', 'My profile');
        this.auth.eEmit('backLink', ['/', 'profile']);
        this.auth.eEmit('showNext', false);
        this.auth.hideFooter();
        this.loadProfile();
        this.userType = this.auth.getUserType();
        
    }

    avatar(url) {
        if (url && typeof url != 'undefined')
            return this.auth.setAvatar(url.avator);
        else
            return this.auth.setAvatar(null);
    }

    save(){
        
        this.busy =true;
        this.http.post(`/api/v1/users/${this.user.id}`,this.user).subscribe((re)=>{
            this.toastr.success('Information saved successfully.');
            this.edit=1;
            this.busy=false;
        },(re)=>{

        });
    }

    step(d) {
        if (d == 1)
            this.steps = 1;

        if (d == 2)
            this.steps = 2;
    }
    edits(d) {
        if (d == 1)
            this.edit = 1;

        if (d == 2)
            this.edit = 2;
    }

    loadProfile() {
        this.http.get('/api/v1/profile').subscribe((re) => {
            this.data = re.json().data;
            this.user = this.data.user;
        }, (re) => { });
    }
}