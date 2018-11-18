import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../../shared/components/confirm";
import { DateTimePickerModule } from 'ng-pick-datetime';
import { AuthService } from "../../auth/auth.service";
import * as moment from 'moment';
import { Router } from '@angular/router'; 

@Component({
    selector: 'payment',
    templateUrl: './payment.html',
})
export class Payment {
    public errors: any = {};
    
    public data: any={available:{},payment:[]};   
    public router: Router;
    public user_type: any = 2;
    public net_amount:any = 0 ;
    
    constructor(
        protected http: Http,
        router: Router,
        protected toastr: ToastsManager,
        public auth: AuthService
    ) {
        this.user_type = this.auth.getUserType();
    }

    ngOnInit() {
        this.auth.hideLogo();
        this.auth.eEmit('headerTitle', 'Payment History');
        this.auth.eEmit('backLink', ['/', 'profile']);
        this.auth.eEmit('showNext', false);
        this.auth.hideFooter();
        this.loadPayment();

    }

    dateFormate(d){
        if(d=='' || d==null)
            return '';
        
        return moment(d).format("D MMM YYYY");    
    }

    loadPayment() { 
        this.http.get(`/api/v1/profile/payments`).subscribe((re)=>{
            this.data = re.json().data
            this.net_amount = this.data.available.net_amount?this.data.available.net_amount:0;
        },(re)=>{

        });
    }  
}