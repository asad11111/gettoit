import { Component,Output, ElementRef,EventEmitter, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../shared/components/confirm";
import { AuthService } from "../auth/auth.service";
import {Router} from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { CarouselModule,SlideComponent } from 'ngx-bootstrap/carousel';
import '../../assets/css/carousel.css';
import * as moment from 'moment';

@Component({
    selector: 'jobcomplaint',
    templateUrl: './job_complaint.html' 
})
export class Jobs_Complaint{


    public router:Router; 
    public errors: any;
    public busy:any=false;
    public data: any ;
    public id: any;
    public type:any="complaint";
    public app_id:any;
    public scale: any = "";
    public nature: any = "";
    public incid: any = "";
    public situ: any = "";
    public coments: any = "";
    
     
    @ViewChild('confirm') public confirm:Confirm;
    inpustName:string;
    designations = [];
    constructor(
        protected http: Http,
        router:Router, 
        protected toastr: ToastsManager,
        public auth: AuthService,  
        private activatedRoute: ActivatedRoute,
    ) {
        this.errors = {};
        this.router = router;
        this.auth.hideLogo();
        this.activatedRoute.params.subscribe((param: any) => {
            this.id = param['id'];
            this.app_id=param['app_id']; 
        });    
    }
    ngOnInit() {
    
        this.auth.hideLogo();
        this.auth.eEmit('headerTitle', 'Complaints form');
        this.auth.eEmit('backLink', ['/', 'jobs', this.id]);
        this.auth.eEmit('showNext', false);
        this.auth.hideFooter();
        this.loadReview();
    }
     
    postComplaint() {
        this.busy = true;
        var uu = {
            incident_periority: this.scale,
            nature_of_complnt: this.nature,
            details: this.incid,
            recomendation: this.situ,
            other_comment: this.coments,
            type:this.type,
            against: this.app_id,
        };
        this.data = uu
        this.http.post(`/api/v1/jobs/${this.id}/complaint`, this.data).subscribe((res) => {
            this.auth.reddirect(['/', 'jobs', 'myjobs']);
            this.busy = false;
            this.toastr.success('Complaint saved successfully.');
        }, (res) => {
            this.busy = false;
            if (res.status != 422) return;
            this.errors = res.json().errors;
            if (typeof this.errors.length == 'undefined' && typeof this.errors == 'object') {
                for (var k in this.errors) {
                    this.errors[k].forEach((v, i) => {
                        this.toastr.error(v);
                    });
                }
            }else
            {
                this.errors.forEach((v, i) => {
                    this.toastr.error(v);
                });
            }           
        });
    }

    loadReview() {
        this.http.get(`/api/v1/users/${this.app_id}/reviews`).subscribe((re) => {
            this.data = re.json().data;           
        }, (re) => { });
    }
}