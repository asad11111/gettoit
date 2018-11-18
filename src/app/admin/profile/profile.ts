import {Component, Input, ViewChild} from '@angular/core';
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr";
import {Confirm} from "../../shared/components/confirm";
import {Alert} from "../../shared/components/alert";
import {AuthService} from "../../auth/auth.service";
import * as moment from 'moment'; 

@Component({
    selector   : 'admin-profile',
    templateUrl: './profile.html',
})
export class AdminProfile {

    public errors: any = {};
    public userType: any = 0;
    public data: any;
    public user:any=[];
    public admin:any={};
    public busy:any=false;

    constructor(
        protected http: Http,
        protected toastr: ToastsManager,
        public auth: AuthService
    ) { }

    ngOnInit() {
        this.auth.showLogo();
        this.auth.showFooter();
        this.auth.eEmit('headerTitle', 'My profile');
        this.auth.eEmit('backLink', ['/','admin']);
        this.auth.eEmit('showNext', false);
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
        this.http.post(`/api/v1/users/${this.user.id}`, this.admin ).subscribe((re)=>{
            this.toastr.success('Information saved successfully.');
            this.busy=false;
            this.errors =[];
        },(re)=>{
            this.errors = re.json().errors;
            this.busy=false;
        });
    }

    logout(){
        this.auth.logout();
    }

    loadProfile() {
        this.http.get('/api/v1/profile').subscribe((re) => {
            this.data = re.json().data;
            this.user = this.data.user;
            this.admin.name = this.user.name;
        }, (re) => {

         });
    }  
}