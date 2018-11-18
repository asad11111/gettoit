import { Component, Input } from '@angular/core';
import { Http } from "@angular/http";
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastsManager } from "ng2-toastr";
import { routerTransition } from '../../router.animations';
import './login.css';

@Component({
    selector: 'register',
    templateUrl: './register.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class Register {

    public busy: boolean = false;
    public data: any = {};
    public errors: any;
    public steps: any = 1;
    public categories:any=[];

    constructor(public http: Http,
        public router: Router,
        public auth: AuthService,
        public route: ActivatedRoute,
        public toaster:ToastsManager,
    ) {
        this.errors = {};
        this.data = this.auth.getRegUser();
        this.data['user_role']=2;
        this.categories = [];
        this.data['category'] = [];
    }
    ngOnInit() {
        document.body.classList.add('theme-black');
        this.loadCategories();
       if(typeof this.data.email=='undefined')
          this.router.navigate(['/']);       
    }

    loadCategories(){
        this.http.get('/api/v1/categories').subscribe((res) => {
             this.categories = res.json().data;
        }, (res) => {
            this.busy = false;
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });
    }
    ngOnDestroy() {
        document.body.classList.remove('theme-black');
    }

    roleType(r){
        this.data.user_role = r;
    }

    changeChecked(t,e){
        this.data[t] = e.checked;
    }

    setCat(c){
        if(!this.checkCat(c.id))
            this.data.category.push(c.id);                    
    }

    checkCat(id){
        var status = false;        
        this.data.category.forEach((v,k) => {
            if(id == v)
                status = true;         
        });
        return status;
    }

    checkCheked(t){
        if(this.data[t])
         {
             if(this.data[t]==true)
                return true;
         }else
         return false;
    }
    register() {
        this.busy = true;
        this.data.user_role=2;
        if(this.data.user_role==2)
            this.data.acount_type = 'bank';       
        if(this.data.user_role==3)
            this.data.acount_type = 'card';    
        this.data.password  =   this.data.id;
        this.http.post('/api/v1/register', this.data).subscribe((res) => {
            this.busy = false;
           this.auth.login(res.json().data);
        }, (res) => {
            this.busy = false;
            if (res.status != 422) return;
            this.errors = res.json().errors;
            for(var i in this.errors)
                {
                    var e = this.errors[i]
                    this.toaster.error(e[0]);
                }
        });
    }

    step(d) {
        if (d == 1)
            this.steps = parseInt(this.steps) + 1;
        else
            this.steps = parseInt(this.steps) - 1;
        
        if (this.steps < 1)
            this.steps = 1;

        if(this.data.user_role==2)
            {
                if (this.steps > 5)
                    this.steps = 5; 
            }   
        
        if(this.data.user_role==3)
            {
                if (this.steps > 4)
                    this.steps = 4; 
            }   



    }

}
