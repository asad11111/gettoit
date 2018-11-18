import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import {Router} from '@angular/router';
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
    selector   : 'login-page',
    templateUrl: './login.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': ''}
})
export class Login {

    public credentials:Credentials;
    public http:Http;
    public router:Router;
    public busy = false;
    public errors:any;  
    t: boolean = false;

    constructor(http: Http, 
        router:Router, 
        public auth:AuthService,
        private authService: socialAs
    ){
        this.credentials = {};
        this.http = http;
        this.errors = {};
        this.router = router; 
        if(this.auth.isAuthenticated())
            {
                this.auth.fetchUser();
                this.auth.events.on('fetchUser',(e)=>{                  
                    var url=(this.auth.getUserType()==3)?['/','jobs','myjobs']:['/','jobs'];
                    this.router.navigate(url);
                });               
                return ;
            }else
            this.auth.logout();    
    }
   
    login(u){
        this.busy = true;
        this.http.post('/api/v1/login',u).subscribe((res)=>{
           this.auth.login(res.json().data) 
            this.busy = false;
        }, (res)=>{
            this.busy = false;
            if(res.status != 422) return;
            this.errors = res.json().errors;
        });
    }

    sociallogin(t){
        var $this = this;
        var u = {'password':'','email':''};

        if(t=='f')
        {            
            this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((v)=>{
                u = {'password':v.id,'email':v.email};
                this.login(u); 
            }) ;
        }else
        { 
            this.busy = true;
            this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((v)=>{
                this.busy = false;
                u = {'password':v.id,'email':v.email};
                this.login(u);               
            },(v)=>{
                 
            }) ;
        }  
        
    }
}