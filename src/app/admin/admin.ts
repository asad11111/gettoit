import {Component, Input, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr";
import {Confirm} from "../shared/components/confirm";
import {Alert} from "../shared/components/alert";
import {AuthService} from "../auth/auth.service";
import * as moment from 'moment'; 

@Component({
    selector   : 'admin',
    templateUrl: './admin.html',
})
export class Admin {
    public errors:any = {}; 
    constructor(
        protected http: Http,
        protected toastr:ToastsManager,
        public auth:AuthService
    ) {   } 
    ngOnInit() {
       this.auth.showLogo();
       this.auth.eEmit('headerTitle','Admin Panel');
       this.auth.eEmit('backLink',['/','admin']); 
       this.auth.eEmit('showNext',false);      
       this.auth.showFooter();   
       this.auth.reddirect(['/','admin','jobs']);          
    }     
}