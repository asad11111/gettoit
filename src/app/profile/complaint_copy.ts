import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../shared/components/confirm";
import { Alert } from "../shared/components/alert";
import { AuthService } from "../auth/auth.service";
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";

@Component({
    selector: 'complaint_copy',
    templateUrl: './complaint_copy.html',
})
export class ComplaintCopy {

    public errors: any = {};
    public steps: any = 1;
    public userType: any = 0;
    public data: any;
    public id: any;
    public comp_id:any;
    public job_id: any;
    public rating: number=0; 

    constructor(
        protected http: Http,
        protected toastr: ToastsManager,
        public auth: AuthService,
        private activatedRoute: ActivatedRoute,
        public router: Router,

    ) {
        this.activatedRoute.params.subscribe((param: any) => {
            this.id = param['id'];
            this.comp_id= param['comp_by'];      
            this.loadComplaints();
        });
    }

    ngOnInit() {
        this.auth.hideLogo();
        this.auth.eEmit('headerTitle', 'My Complaints');
        this.auth.eEmit('backLink', ['/','profile', this.comp_id, 'complaints']);
        this.auth.eEmit('showNext', false);
        this.auth.hideFooter();
        this.userType = this.auth.getUserType();
    }

    avatar(url) {
        if (url && typeof url != 'undefined')
            return this.auth.setAvatar(url.avator);
        else
            return this.auth.setAvatar(null);
    }
 
    loadComplaints() {
        this.http.get(`/api/v1/complaint/${this.id}`).subscribe((re) => {
            this.data = re.json().data;
        }, (re) => { });
    }


}
