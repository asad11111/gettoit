import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../shared/components/confirm";
import { AuthService } from "../auth/auth.service";
import * as moment from 'moment';
import { Router } from "@angular/router";

@Component({
    selector: 'myjobs',
    templateUrl: './myjobs.html',
})
export class MyJobs {
    public errors: any = [];
    public jobs: any = [];
    public completedJobs: any = [];
    public steps: any = 1;
    public userType: any = 0;
    public id: any;
    public rout_id: any;
    public app_id: any;
    public selectPayment: any = false;
    public userAccounts: any = [];
    public job_id: any = 0;
    public account_id: any = 0;
    public paymentBusy: any = false;

    constructor(
        protected http: Http,
        protected toastr: ToastsManager,
        public router: Router,
        public auth: AuthService
    ) { }

    ngOnInit() {
        this.auth.showFooter();
        this.auth.showLogo();
        this.getJobs();
        var job = moment().format('YYYY');
        this.auth.eEmit('showNext', false);
        this.userType = this.auth.getUserType();
        if (this.userType == 3)
            this.loadAccounts();

        if (this.userType == 1)
            this.router.navigate(['/', 'admin']);
    }

    imageUrl(url) {
        if (url == '' || url == null)
            return '/img/photos/no-category-image.jpg';
        return this.auth.setImageUrl(url);
    }

    avatar(url) {
        return this.auth.setAvatar(url);
    }

    changeRoute(j) {
        this.rout_id = j;
        this.router.navigate(['/', 'jobs', this.rout_id]);
    }


    reviewNow(d) {
        this.router.navigate(['/', 'jobs', d.id, d.created_by, 'jobreview']);
    }

    message(d) {
        this.router.navigate(['/', 'messages', d.created_by, d.id]);
    }

    step(d) {
        if (d == 1) {
            this.steps = 1;
            this.getJobs();
        }
        else if (d == 2) {
            this.steps = 2;
            this.getJobs();
        }
    }

    jobFormate(c, f) { return moment(c).format(f); }

    getJobs() {
        var url = (this.steps == 2) ? `/api/v1/myjobs?completed=1` : `/api/v1/myjobs?completed=0`;
        this.http.get(url).subscribe((res) => {
            if (this.steps == 2) {
                this.completedJobs = res.json().data;               
            }
            else
                this.jobs = res.json().data;   

        }, (res) => {

        })
    }

    onHide2() {
        this.selectPayment = false;
    }
    selectAcount(id) {
        this.account_id = id;
    }
    selectPayments(id) {
        this.job_id = id;
        if (this.userAccounts.length == 1) {
            this.account_id = this.userAccounts[0].id;
            this.selectPayment = true;
            this.payNow();
        }

        if (this.userAccounts.length > 1) {
            this.job_id = id;
            this.selectPayment = true;
        }

        if (this.userAccounts.length == 0) {
            this.toastr.error("Please add your credit card information in your profile.");
        }

    }

    payNow() {

        if (this.paymentBusy == false) {
            this.paymentBusy = true;
            this.errors = []
            this.http.get(`/api/v1/jobs/${this.job_id}/payments/${this.account_id}`).subscribe((re) => {
                this.paymentBusy = false;
                this.onHide2();
                this.jobs.forEach((v, i) => {
                    if (v.id == this.job_id)
                        this.jobs[i].job_status = 'Published';
                });
                this.toastr.success(`You payments are succussfelly processed and job is published.`);
            }, (re) => {
                this.paymentBusy = false;
                this.errors = re.json().errors;
                if (re.status == 406)
                    this.errors.push("Please correct the card information in your profile.");
            });
        }

    }

    loadAccounts() {

        this.http.get('/api/v1/users/accounts').subscribe((res) => {
            this.userAccounts = res.json().data;
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });
    }
}