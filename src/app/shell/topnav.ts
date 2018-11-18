import { Component } from '@angular/core';
import { AuthService, Permission } from '../auth/auth.module';
import { Http } from "@angular/http";
import { Router } from "@angular/router";
declare var Pusher: any;

@Component({
    selector: 'top-nav',
    templateUrl: './topnav.html',
})
export class TopNav {

    public steps: any = 1;
    public title:any;
    public naveNext:any='Next';
    public showNext:any=true;
    public backLink:any=[];
    public userType:any=0;
    public notifications:any=0;
    public pusher:any;
    public notifyChannel:any=null;

    constructor(
        public auth: AuthService,
        public permission: Permission,
        public http: Http,
        public router: Router        
    ) {
        this.userType=this.auth.getUserType();       
    }
    ngOnInit() {
        this.auth.events.on('headerTitle',(d)=>{ 
            this.title = d;
         });
         this.auth.events.on('naveNext',(d)=>{ 
            this.naveNext = d;
         });  
         this.auth.events.on('backLink',(d)=>{ 
            this.backLink = d;
         });  
         this.auth.events.on('showNext',(d)=>{ 
            this.showNext = d;
         });  

       //  this.auth.events.on('notifications',(d)=>{ 
         //   this.notifications = d;
         //});  
                  
      /*   this.pusher = new Pusher('771046c9c67d0ae6e036', {
            cluster: 'ap1',
            encrypted: true
        });  */
       // this.subChannel();
       // this.loadCount();
     }


   

    logout($event) {
        $event.preventDefault();
        this.auth.logout();
    }
/* 
    loadCount(){
        this.http.get(`/api/v1/notifications/counts`).subscribe((re)=>{
            this.notifications = re.json().data;
        },(re)=>{});
    }
 */




    back_link(){
      //  (backLink.length>0)?backLink:javascript:void(0)
      return (this.backLink.length>0)?this.backLink:this.router.url;
    }

    step(d) {
        if (d == 1)
            this.steps = parseInt(this.steps) + 1;
        else
            this.steps = parseInt(this.steps) - 1;
        if (this.steps < 1)
            this.steps = 1;
        if (this.steps > 5)
            this.steps = 5;
        this.auth.eEmit('jobCreate', this.steps);
    }
}