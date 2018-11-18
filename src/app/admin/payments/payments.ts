import {Component, Input, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr";
import {Confirm} from "../../shared/components/confirm";
import {Alert} from "../../shared/components/alert";
import {AuthService} from "../../auth/auth.service";
import * as moment from 'moment'; 

@Component({
    selector   : 'admin-payments',
    templateUrl: './payments.html',
})
export class AdminPayments {

    public errors:any = {};
    public data:any=[];
     constructor(
        protected http: Http,
        protected toastr:ToastsManager,
        public auth:AuthService
    ) {}
 
    ngOnInit() {
        this.auth.showLogo();
        this.auth.showFooter();
        this.transHistory();    
    }

    transHistory(){
        this.http.get(`/api/v1/transaction/admin`).subscribe((re)=>{
            this.data = re.json().data;
        },(re)=>{

        });
    }    
}