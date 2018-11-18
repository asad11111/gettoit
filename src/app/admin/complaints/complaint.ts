import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../../shared/components/confirm";
import { AuthService } from "../../auth/auth.service";
import * as moment from 'moment';
import { ActivatedRoute } from "@angular/router"; 

@Component({
    selector: 'complaint',
    templateUrl: './complaint.html',
})
export class Complaint {

    public errors: any = {};
    public userType: any = 0;
    public data: any={};
    public id: any; 

    constructor(
        protected http: Http,
        protected toastr: ToastsManager,
        public auth: AuthService,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.params.subscribe((param: any) => {
            this.id = param['id']; 
            this.loadComplaint();
        });
    }

    ngOnInit() {
        this.auth.hideLogo();
        this.auth.eEmit('headerTitle', 'Complaint');
        this.auth.eEmit('backLink', ['/','admin', 'complaints']);
        this.auth.eEmit('showNext', false);
        this.auth.hideFooter();
        this.userType = this.auth.getUserType();
    }

    changeStatus(s){
        this.http.get(`/api/v1/complaint/${this.id}/status?status=${s}`).subscribe((re)=>{
            this.toastr.success('Status is changed successfully.');
            this.data.status = s;
        },(re)=>{

        });

    }
 
    loadComplaint() {
        this.http.get(`/api/v1/complaint/${this.id}`).subscribe((re) => {
            this.data = re.json().data;
        }, (re) => { });
    }


}
