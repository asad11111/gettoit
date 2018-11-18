import { Component, Output, ElementRef, EventEmitter, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../shared/components/confirm";
import { AuthService } from "../auth/auth.service";
import { Router } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { CarouselModule, SlideComponent } from 'ngx-bootstrap/carousel';
import '../../assets/css/carousel.css';
import * as moment from 'moment';

@Component({
    selector: 'jobreview',
    templateUrl: './job_review.html'
})
export class Jobs_Review {


    public router: Router;
    public n:any=false;
    public errors: any;
    public busy: any = false;
    public data: any;
    public review: any = [];
    public rev: any = "";
    public currentUser: any;
    public compl: any = {};
    public id: any;
    public app_id: any;
    public rating: number = 0;
    @Input() itemId: number;

    @ViewChild('confirm') public confirm: Confirm;
    inpustName: string;
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
            this.app_id = param['app_id'];
        });
    }
    ngOnInit() {
        this.inpustName = this.itemId + '_rating';
        this.auth.hideLogo();
        this.auth.eEmit('headerTitle', 'Job Review');
        this.auth.eEmit('backLink', ['/', 'jobs', this.id]);
        this.auth.eEmit('showNext', false);
        this.auth.hideFooter();
        this.loadReview();
    }

    ratings(r) {
        this.rating = r;
    }
    postReview() {
        this.busy = true;
        var uu = {
            rating: this.rating,
            comments: this.rev,
            job_id: this.id,
        };
        this.data = uu
        this.http.post(`/api/v1/users/${this.app_id}/reviews?job_id=${this.id}`, this.data).subscribe((res) => {
           if(this.n==true)
           {
               this.router.navigate(['/', 'jobs', this.id, this.app_id, 'jobcomplaint']);
           }
           else 
            this.router.navigate(['/', 'jobs', 'myjobs']);

            this.busy = false;
            this.toastr.success('Rating saved successfully.');
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

    changeChecked(t, e) {
        this.review[t] = e.checked;
        return true;
    }

    checkCheked(t) {
        if (this.review[t]) {
            if (this.review[t] == true)
            {
                return this.n=true;
            }
        } else
        {
            return this.n=false;
        }
    }

    loadReview() {
        this.http.get(`/api/v1/users/${this.app_id}/reviews?job_id=${this.id}`).subscribe((re) => {
            this.data = re.json().data;
            if (this.data.length > 0)
                this.rating = this.data[0].rating;
            else
                this.rating = 0;
        }, (re) => { });
    }
}