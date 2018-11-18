import {Component, Input, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr";
import {Confirm} from "../shared/components/confirm";
import {Alert} from "../shared/components/alert";
import {AuthService} from "../auth/auth.service";
import * as moment from 'moment'; 

@Component({
    selector   : 'about',
    templateUrl: './about.html',
})
export class About {

    public errors:any = {};
 
    constructor(
        protected http: Http,
        protected toastr:ToastsManager,
        public auth:AuthService
    ) {}
 
    ngOnInit() {
       this.auth.hideLogo();
       this.auth.eEmit('headerTitle','About');
       this.auth.eEmit('backLink',['/','profile']); 
       this.auth.eEmit('showNext',false);      
       this.auth.hideFooter(); 
            
    }



     
}
