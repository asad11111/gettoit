import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { Router } from "@angular/router";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../shared/components/confirm";
import { AuthService } from "../auth/auth.service";
import { DateTimePickerModule } from 'ng-pick-datetime';
import { ProgressHttp } from "angular-progress-http";
import { googleMaps } from "./map";
import * as moment from 'moment';

@Component({
    selector: 'job-create',
    templateUrl: './jobs_create.html',
    // template: '<input type="file" (change)="upload()" [attr.multiple]="multiple ? true : null" accept="image/png"> <br> <button (click)="postPics()" > Upload </button>' 
})
export class Jobs_Create {
    public busy: boolean = false;
    public val: boolean = false;
    public data: any = {};
    public errors: any;
    public steps: any = 1;
    public fileReader: any = [];
    public progr: any = 0;
    public categories: any = [];
    public job: any = { categories: [], tasks: [], no_workers: 1 };
    public work: any = [];
    public images: any = [];
    public dumyImages: any = [];
    public finished: any = 0;
    public events: any;
    public defaultMap: any = { lat: -41.282966, lng: 174.773254 };
    public userAccounts: any = [];
    public paymentError: any = [];
    public Notificationshow: any = false;
    public selectPayment: any = false;

    @Input() multiple: boolean = false;
    @ViewChild('fileInput') public fileInput: ElementRef;
    @ViewChild('googlemapaddress') public input: ElementRef;
    @ViewChild('confirm') public confirm: Confirm;

    designations = [];
    constructor(
        protected http: Http,
        private httpprog: ProgressHttp,
        protected toastr: ToastsManager,
        public auth: AuthService,
        public router: Router,
    ) {
        this.errors = {};
    }

    ngOnInit() {
        this.progr = 0;
        this.loadCategories();
        this.loadAccounts();
        this.auth.hideLogo();
        this.auth.eEmit('backLink', []);
        this.auth.eEmit('showNext', true);
        this.auth.eEmit('naveNext', 'Next');
        this.auth.hideFooter();
        this.auth.events.on('jobCreate', (d) => {

            if (this.finished == 1 && d == 5)
                this.saveJob();

            if (d == 1 && this.steps == 1)
                this.router.navigate(['/', 'jobs', 'myjobs']);

            this.steps = d;
            var title = '';
            switch (d) {
                case 1:
                    title = "Categories";
                    this.finished = 0;
                    break;
                case 2:
                    title = "Overview";
                    this.finished = 0;
                    break;
                case 3:
                    title = "Details";
                    this.finished = 0;
                    break;
                case 4:
                    title = "Tasks";
                    this.finished = 0;
                    break;
                case 5:
                    title = "Location";
                    this.finished = 1;
                    this.auth.eEmit('naveNext', 'Finish');
                    break;
            }
            if (d < 5)
                this.auth.eEmit('naveNext', 'Next');

            this.auth.eEmit('headerTitle', [title]);
        });
        this.auth.eEmit('headerTitle', ['Categories']);
    }

    onFileChange(e) {
        var files = e.target.files;
        // this.images = [];
        // this.dumyImages = [];
        if ((parseInt(this.images.length) + parseInt(files.length)) > 5) {
            this.toastr.error("Maximam 5 images are allowed to upload.");
            return;
        }

        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                this.fileReader[i] = new FileReader();
                this.fileReader[i].readAsDataURL(files[i]);
                this.fileReader[i].onload = (e) => {
                    this.dumyImages.push(e.target.result);
                }
                this.images.push(files[i]);
            }
        }
    }


    tot_Hrs(s, e, t) {
        if (isNaN(t)) {
            return 0;
        }
        var a = moment(s);
        var b = moment(e);
        var c = parseInt(t);
        var d = (b.diff(a, 'days') + 1) * c;

        if (isNaN(d))
            return 0;

        this.job.total_hours = d;
        return d;
    }

    totAmount() {
        var job = this.job;

        if (isNaN(job.per_hour) || job.per_hour == '' || job.per_hour == null ||
            isNaN(job.hours_per_day) || job.hours_per_day == '' || job.hours_per_day == null ||
            isNaN(job.no_workers) || job.no_workers == '' || job.no_workers == null)
            return 0;

        var a = moment(job.start_date);
        var b = moment(job.end_date);
        var c = parseInt(job.hours_per_day);
        var t_am = parseInt(job.per_hour);
        var n_wrk = parseInt(job.no_workers);
        var f = ((b.diff(a, 'days') + 1) * c * t_am) * n_wrk;
        this.job.total_amount = f;
        return f;
    }

    dateFormate(c, f) {
        if (c == '' || c == null)
            return '';
        return moment(c).format(f);
    }

    setCat(c) {
        if (!this.checkCat(c.id))
            this.job.categories.push(c.id);
        else
            this.job.categories.forEach((v, k) => {
                if (c.id == v)
                    this.job.categories.splice(k, 1);
            });
    }
    store(newValue) {
        this.val = true;
        this.work.push(newValue);
    }

    del(ind) {
        this.confirm.show(`Are you sure you want to remove task ?`)
            .then((opt) => {
                if (opt == true)
                    this.work.splice(ind, 1);
            })
    }

    checkCat(id) {
        var status = false;
        this.job.categories.forEach((v, k) => {
            if (id == v)
                status = true;
        });
        return status;
    }

    loadAccounts() {

        this.http.get('/api/v1/users/accounts').subscribe((res) => {
            this.userAccounts = res.json().data;
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });
    }

    loadCategories() {
        this.http.get('/api/v1/categories').subscribe((res) => {
            this.categories = res.json().data;
        }, (res) => {
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });
    }

    googleLat(el) {
        this.job.google_lat = el.lat();
        this.job.google_long = el.lng();
    }

    changeChecked(t, e) {
        this.job[t] = e.checked;
    }
    checkCheked(t) {
        if (this.job[t]) {
            if (this.job[t] == true)
                return true;
        } else
            return false;
    }

    changeDate(e) {

    }

    saveJob() {

        let fd: FormData = new FormData();
        this.images.forEach((v, i) => { fd.append('job_image[]', v); });
        this.job.address = this.input.nativeElement.value;

        if (this.userAccounts.length == 1)
            this.job.account_id = this.userAccounts[0].id;

        for (var k in this.job) {
            switch (k) {
                case 'end_date':
                case 'start_date':
                    var sd = moment(this.job[k]).format("YYYY-MM-DD HH:mm:ss");
                    fd.append(k, sd);
                    break;
                case "tasks":
                    this.work.forEach((v, i) => { fd.append("tasks[]", v); });
                    break;
                case "categories":
                    this.job.categories.forEach((v, i) => { fd.append("categories[]", v); });
                    break;
                default:
                    fd.append(k, this.job[k]);
                    break;
            }
        }

        if (!this.busy) {
            this.busy = true;
            this.httpprog.withUploadProgressListener(progress => {
                this.progr = progress.percentage;
            }).post(`/api/v1/jobs`, fd).subscribe((re) => {
                this.router.navigate(['/', 'jobs', 'myjobs']);
                this.busy = false;
                this.images = [];
                this.work = [];
                this.job = { categories: [], tasks: [] };
            }, (re) => {
                this.errors = re.json().errors;
                this.busy = false;
                this.paymentError = [];
                if (re.status == 406) {
                    this.paymentError = this.errors;
                    this.Notificationshow = true;
                    this.paymentError.push('Your job is in pending state(Available at myjobs),You may publish it after successful payments.');
                    this.errors = [];
                }
            });

        } else
            this.toastr.error('Create job form submission is still in progress.');
    }

    selectAcount(e) {
        this.job.account_id = e;
    }

    onHide() {
        this.Notificationshow = false;
        this.router.navigate(['/', 'profile', 'banking']);
        this.selectPayment = false;
    }

    onHide2() {
        this.selectPayment = false;
    }
    selectPayments() {
        this.selectPayment = true;
    }
}