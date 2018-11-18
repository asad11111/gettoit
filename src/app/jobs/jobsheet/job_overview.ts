import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../../shared/components/confirm";
import { AuthService } from "../../auth/auth.service";
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { googleMaps } from ".././map";
import { CarouselModule, SlideComponent } from 'ngx-bootstrap/carousel';
import '../../../assets/css/carousel.css';
import * as moment from 'moment';

@Component({
    selector: 'jobsoverview',
    templateUrl: './job_overview.html'
})
export class Jobs_Overview {
    public steps: any = 1;
    public data: any = { images: [] };
    public id: any;
    public app_id: any;
    public router: Router;
    public errors: any;
    public userType: any = 0;
    public defaultMap: any = { lat: 33.6323473, lng: 73.0700421 };
    public busy: any = false;
    public currentUser: any;
    public viewMarker:any = true;
    public mapCircle:any = false;

    @ViewChild('confirm') public confirm: Confirm;

    designations = [];
    constructor(
        protected http: Http,
        router: Router,
        protected toastr: ToastsManager,
        public auth: AuthService,
        private activatedRoute: ActivatedRoute,
    ) {
        this.errors = {};
        this.router = router;
        this.auth.hideLogo();
        this.currentUser = this.auth.getUser();       
        this.activatedRoute.params.subscribe((param: any) => {
            this.id = param['id'];
        });
    }

    ngOnInit() {
        
        if (this.auth.getUserType() == 2)
            this.auth.eEmit('backLink', ['/', 'jobs']);
        else
            this.auth.eEmit('backLink', ['/', 'jobs', 'myjobs']);

        this.auth.eEmit('showNext', false);
        this.auth.hideFooter();
        this.userType = this.auth.getUserType();
        this.loadJob();
    }

    loadJob() {
        this.http.get(`/api/v1/jobs/${this.id}`).subscribe((re) => {
            this.data = re.json().data;          
            this.auth.eEmit('headerTitle', this.data.job.title);
            this.defaultMap = { lat: parseFloat(this.data.job.google_lat), lng: parseFloat(this.data.job.google_long) };          
            if(this.userType==2)
            {
                var bid =  this.data.applicants ;
                if(bid.length==0)
                {
                    this.viewMarker = false;
                    this.mapCircle = true;
                }else{
                    if(bid[0].status==1 || bid[0].status==4)
                    {
                        this.viewMarker = false;
                        this.mapCircle = true;
                    }
                }               
            }

        }, () => { });
    }

    applyForJob() {
        var url = `/api/v1/jobs/${this.id}/apply`;
        this.busy = true;
        this.http.get(url).subscribe((re) => {
            this.toastr.success('Your application for job is submitted.');
            this.busy = false;
            this.loadJob();
        }, (re) => {
            var errors = re.json().errors;
            this.busy = false;
            if (re.status != 422)
                return;
            errors.forEach((v, i) => {
                this.toastr.error(v);
            });

        })

    }



    imageUrl(url) { return this.auth.setImageUrl(url); }

    checked(k) {
        var data = this.data.job;
        if (data[k] && parseInt(data[k]) == 1)
            return true;
        return false;
    }
    // changeRoute(ap_id) {
    //     this.app_id = ap_id;
    //     this.router.navigate(['/', 'jobs', this.id, this.app_id, 'jobreview']);
    // }

    step(d) {
        if (d == 1)
            this.steps = 1;

        if (d == 2)
            this.steps = 2;

        if (d == 3)
            this.steps = 3;

        if (d == 4)
            this.steps = 4;
    }

    dateDifference(s, e) {
        var a = moment(s);
        var b = moment(e);
        return b.diff(a, 'days');
    }

    dateFormate(c, f) {
        if (c == '' || c == null)
            return '';
        return moment(c).format(f);
    }

    status() {
        var a = this.data.applicants.status.length();
    }

    avatar(url) {
        if (url && typeof url != 'undefined')
            return this.auth.setAvatar(url.avator);
        else
            return this.auth.setAvatar(null);
    }


    changeStatus(id, s) {
        // 1. Pending.
        // 2. Accept.
        // 3. Complete.
        // 4. Cancel.
        // 5. Start (Inprogress)
        this.busy = true;
        var startDate = moment().format('YYYY-MM-DD');
        var url = `/api/v1/applicant/${id}/status/${s}/job/${this.id}?`;

        if (s == 5)
            url += `work_start=${startDate}&`;
        if (s == 3)
            url += `work_completion=${startDate}&`;

        this.http.get(url).subscribe((re) => {
            if (s == 2)
                this.toastr.success('Worker accepted for this job successfully.');
            if (s == 3)
            {
                this.toastr.success('Worker job status is changed to completed.');
                this.router.navigate(['/', 'jobs', this.id, id, 'jobreview']);
            }
            if (s == 5)
                this.toastr.success('Job is started.');

            this.loadJob();
        }, (re) => {
            this.busy = false;
            this.errors = re.json().errors;

            for (var k in this.errors)
                this.errors[k].forEach((v, i) => {
                    this.toastr.error(v);
                });
        });

    }


    payNow(d){
         
        this.http.get(`/api/v1/users/${d.applied_by}/${this.id}/payNow`).subscribe((re)=>{
            this.toastr.success('Payment transfered successfully.');
        },(re)=>{
            this.errors = re.json().errors;
            for(var i in this.errors)
            {
                if(typeof this.errors[i]=='string')
                    this.toastr.error(this.errors[i]);
                    else
                    this.errors[i].forEach((v,k) => {
                        this.toastr.error(this.errors[v]);                        
                    }); 
            }
        });
    }
}