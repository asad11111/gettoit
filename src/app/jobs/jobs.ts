import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { Router } from '@angular/router';
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../shared/components/confirm";
import { Alert } from "../shared/components/alert";
import { AuthService } from "../auth/auth.service";
import * as moment from 'moment';

@Component({
    selector: 'jobs',
    templateUrl: './jobs.html',
})
export class Jobs {

    public errors: any = {};
    public jobs: any = [];
    public rout_id: any;
    public userType: any = 0;
    public steps: any = 1;
    public categories: any = [];
    public search: any = { category: '' };
    public busy: any = false;

    constructor(
        protected http: Http,
        protected toastr: ToastsManager,
        protected router: Router,
        public auth: AuthService
    ) {
        if (this.auth.getUserType() == 3)
            this.router.navigate(['/', 'jobs', 'myjobs']);        
    }
    ngOnInit() {
        this.auth.showLogo();
        this.auth.showFooter();
        this.getJobs();
        this.userType = this.auth.getUserType();
        var job = moment().format('YYYY');
        this.loadCategories();
        if (this.auth.getUserType() == 1)
            this.router.navigate(['/', 'admin']);
    }


    jobFormate(c, f) {
        return moment(c).format(f);
    }

    imageUrl(url) {
        if (url == '' || url == null)
            return '/img/photos/no-category-image.jpg';
        return this.auth.setImageUrl(url);
    }

    step(d) {
        if (d == 1) {
            this.steps = 1;
            document.getElementById("inner-content").classList.remove('search-bg');
        }
        else if (d == 2) {
            this.steps = 2;
            document.getElementById("inner-content").classList.add('search-bg');
        }

    }
    applyForJob(id) {
        var url = `/api/v1/jobs/${id}/apply`;
        this.busy = true;
        this.http.get(url).subscribe((re) => {
            this.toastr.success('Your application for job is submitted.');
            this.busy = false;
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

    changeRoute(j) {
        this.rout_id = j;
        this.router.navigate(['/', 'jobs', this.rout_id]);
    }
    getJobs() {

        var params = [];

        if (this.search.title && this.search.title != '')
            params.push('title=' + this.search.title);

        if (this.search.category && this.search.category > 0)
            params.push('category=' + this.search.category);

        if (this.search.address && this.search.address != '')
            params.push('address=' + this.search.address);

        this.busy = true;
        this.http.get(`api/v1/jobs?${params.join('&')}`, this.search).subscribe((res) => {
            this.jobs = res.json().data;
            this.busy = false;
            this.step(1);
        }, (res) => {
            this.busy = false;
        })

    }

    avatar(url) {
        return this.auth.setAvatar(url);
    }

    loadCategories() {
        this.http.get('/api/v1/categories').subscribe((res) => {
            this.categories = res.json().data;
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });
    }

    message(d) {
        this.router.navigate(['/', 'messages', d.created_by, d.id]);
    }
}
