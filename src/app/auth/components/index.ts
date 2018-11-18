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
    selector   : 'index',
    templateUrl: './index.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': ''}
})
export class IndexMain {

    public credentials:Credentials;
    public http:Http;
    public router:Router; 
    public busy = false;
    public errors:any;

    constructor(http: Http, 
        router:Router, 
        public auth:AuthService,
        private authService: socialAs
    ){
        this.credentials = {};
        this.http = http;
        this.errors = {};
        this.router = router;
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

    redirectTo(d){    
        this.auth.setRegUser(d);
        this.router.navigate(['/verification']);
    }
    sociallogin(t){

        if(t=='f')
        {
            this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then((v)=>{
               
                var data = {
                    id:v.id,
                    name:v.name,
                    email:v.email
                };
                this.redirectTo(data);                 
            }) ;

        }else
        { 
            this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then((v)=>{                 
                var data = {
                    id:v.id,
                    name:v.name,
                    email:v.email
                };
                this.redirectTo(data); 
            },(v)=>{
                 
            }) ;
        }        
    }
}