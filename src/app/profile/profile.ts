import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../shared/components/confirm";
import { Alert } from "../shared/components/alert";
import { AuthService } from "../auth/auth.service";
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'profile',
    templateUrl: './profile.html',
})
export class Profile {

    public errors: any = {};
    public steps: any = 1;
    public userType: any = 0;
    public data: any;
    public id: any;
    public job_id: any;
    public rating: number=0; 

    constructor(
        protected http: Http,
        protected toastr: ToastsManager,
        public auth: AuthService,
        private activatedRoute: ActivatedRoute,

    ) {
        this.activatedRoute.params.subscribe((param: any) => {
            this.id = param['id'];
            this.job_id = param['job_id']; 
        });
    }

    ngOnInit() {
        this.auth.hideLogo();
        this.auth.eEmit('headerTitle', 'Profile');
        this.auth.eEmit('backLink', ['/', 'jobs', this.job_id]);
        this.auth.eEmit('showNext', false);
        this.auth.hideFooter();
        this.loadProfile();
        this.userType = this.auth.getUserType();
        
        if(this.userType==1)
            this.auth.reddirect(['/','admin','profile']);

    }

    avatar(url) {
        if (url && typeof url != 'undefined')
            return this.auth.setAvatar(url.avator);
        else
            return this.auth.setAvatar(null);
    }

    ratings(r){
        this.rating =r;     
    }

    step(d) {
        if (d == 1)
            this.steps = 1;

        if (d == 2)
            this.steps = 2;
    }


    loadProfile() {
        this.http.get(`/api/v1/profile/${this.id}?job_id=${this.job_id}`).subscribe((re) => {
            this.data = re.json().data;
            //this.rating = this.data[0].rating;          
        }, (re) => { });
    }


}
