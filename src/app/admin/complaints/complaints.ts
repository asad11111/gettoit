import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../../shared/components/confirm";
import { Alert } from "../../shared/components/alert";
import { AuthService } from "../../auth/auth.service";
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'admin-complaints',
    templateUrl: './complaints.html',
})
export class AdminComplaints {

    public errors: any = {};
    public steps: any = 1;
    public userType: any = 0;
    public data: any = [];
    public id: any;
    public job_id: any;
    public rating: number = 0;

    constructor(
        protected http: Http,
        protected toastr: ToastsManager,
        public auth: AuthService, 
        private activatedRoute: ActivatedRoute,

    ) {
        this.activatedRoute.params.subscribe((param: any) => {
            this.id = param['id'];
            this.loadComplaints();
        });
    }

    ngOnInit() {
        this.auth.showLogo();
        this.auth.eEmit('headerTitle', 'Complaints');
        this.auth.showFooter();
        this.userType = this.auth.getUserType();
    }

    avatar(url) {
        if (url && typeof url != 'undefined')
            return this.auth.setAvatar(url.avator);
        else
            return this.auth.setAvatar(null);
    }
    changeRoute(d) {
        this.auth.reddirect(['/','admin', 'complaint',d.id]);
    }

    loadComplaints() {
        this.http.get(`/api/v1/admin/complaints`).subscribe((re) => {
            this.data = re.json().data; 
        }, (re) => { });
    }

    comp_status(d) {

        var st = 'Pending';
        //Resolved=2,Canceled=3
        switch (d.status) {
            case 2:
                st = 'Resolved'            
            break;
            case 3:
                st = 'Canceled'            
            break;
        };
        return st
    }
}