import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import {AuthService} from '../auth.service'; 
import { AuthService as socialAs } from "angular4-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angular4-social-login";
import { routerTransition } from '../../router.animations';
import './login.css';

interface Credentials {
    email?:string;
    password?:string;
}

@Component({
    selector   : 'admin-login',
    templateUrl: './admin-login.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': ''}
})
export class AdminLogin {

    public credentials:Credentials;
    public http:Http; 
    public busy = false;
    public errors:any;

    constructor(http: Http,   
        public auth:AuthService,
        private authService: socialAs
    ){
        this.credentials = {};
        this.http = http;
        this.errors = {};
    }
    ngOnInit() {
        document.body.classList.add('login-page'); 
        
    }
    ngOnDestroy(){
        document.body.classList.remove('login-page');
    }
    onKeyPress($event){
        if($event.keyCode != 13) return;
        this.login();
    }
    login(){
        this.busy = true;
        this.http.post('/api/v1/login', this.credentials).subscribe((res)=>{
            this.auth.login(res.json().data);
            this.busy = false;
        }, (res)=>{
            this.busy = false;
            if(res.status != 422) return;
            this.errors = res.json().errors;
        });
    }
  
}