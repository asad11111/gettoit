import {Component, Input, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr";
import {AuthService} from "../auth/auth.service";
import * as moment from 'moment'; 

@Component({
    selector   : 'notification',
    templateUrl: './notification.html',
})
export class Notification {

    public errors:any = {};
    public notes:any=[];
 
    constructor(
        protected http: Http,
        protected toastr:ToastsManager,
        public auth:AuthService
    ) {}
 
    ngOnInit() {
       this.auth.hideLogo();
       this.auth.eEmit('headerTitle','Notifications');
       this.auth.eEmit('backLink',['/','profile']); 
       this.auth.eEmit('showNext',false);      
       this.auth.showFooter(); 
       this.notifications();            
    }

    notifications(){
        this.http.get(`/api/v1/notifications`).subscribe((re)=>{
            this.notes = re.json().data; 
        this.http.get(`/api/v1/notifications/read`).subscribe((re)=>{            
            this.auth.eEmit('notifications',0); 
        },(re)=>{

        })
        },(re)=>{

        });

    }



     
}
