import {Component} from '@angular/core';
import {Permission} from '../auth/permission.service';
import {AuthService} from '../auth/auth.service';
import { Router } from "@angular/router";
let logoSrc = require('../../assets/logo/128x128.png');

@Component({
    selector   : 'footer-nave',
    templateUrl: './footer-nave.html',
})
export class FooterNave {

    public footer:any=false;
    public userType:any=0;
    public dropdown:any=false;

    constructor(
        public permission:Permission,
        public auth:AuthService,
        public router: Router,
    ){
        this.dropdown = false;
    }
    ngOnInit(){
        this.userType = this.auth.getUserType();   
        
    }
    ngAfterViewInit(){
      //  $('#side-menu').metisMenu();        
    }

    toggle(){
        if(this.dropdown)
            this.dropdown = false;
            else
            this.dropdown=true;
            return;    }
    getEmployeePicPath(){        
        return `/images/gettoit-logo.png`;
    }
    logout($event){
        $event.preventDefault();
        this.auth.logout();
    }
    getLogoUrl(){
       return  `/images/gettoit-logo.png`;
    }
}
