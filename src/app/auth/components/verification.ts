import {Component, Input} from '@angular/core';
import {Http} from "@angular/http";
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../auth.service'; 
import { routerTransition } from '../../router.animations';
//import { AuthService as socialAs } from "angular4-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angular4-social-login";
import { ToastsManager } from "ng2-toastr";
import { Toast } from 'ng2-toastr/src/toast';

@Component({
    selector   : 'verification',
    templateUrl: './verification.html',
    animations: [routerTransition()],
    host: {'[@routerTransition]': ''}
   
})
export class Verification {

    public busy:boolean = false;
    public process:boolean = false;
    public passcode:boolean = false;
    public tel_no:any=""; 
    public user:any={};
    public verify_code:any; 
    public passcode_server:any;
    public errors:any; 

    constructor(public http: Http,
                public router:Router,
                public auth:AuthService,
                //private authService: socialAs,
                public route: ActivatedRoute,
                public toester:ToastsManager,
    ){
        
        this.errors = {};
        let d = new Date(); 
    }
    ngOnInit() {
       this.user =this.auth.getRegUser();
       if(typeof this.user.email=='undefined')
            this.router.navigate(['/']);               
    }
    ngOnDestroy(){
        //document.body.classList.remove('login-page');
    }

    verifyPasscode(){
        if(this.passcode_server.passcode==this.verify_code)
           {
            this.auth.setRegKey('tel_no',this.tel_no);                  
            this.router.navigate(['/','register']);
            return ;
           }
        this.toester.error('Please enter valid code.');   
    }
   
    getVerifyCode(){
        this.process = true;
        var data = {
            email:this.user.email ,
            name:this.user.email , 
            tel_no:this.tel_no ,
        }; 
      
        this.http.post('/api/v1/sendpasscode',data).subscribe((res)=>{
            this.process = false;
            this.passcode=true;
            this.passcode_server = res.json().data; 
        }, (res)=>{
            this.process = false;
            if(res.status != 422) return;
            this.errors = res.json().errors;
        }); 
    }
}