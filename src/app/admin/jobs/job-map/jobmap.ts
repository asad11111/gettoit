import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { Router } from "@angular/router";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../../../shared/components/confirm";
import { AuthService } from "../../../auth/auth.service";
import { DateTimePickerModule } from 'ng-pick-datetime';
import { ProgressHttp } from "angular-progress-http";
import { googleMaps } from "../../jobs/map";
import * as moment from 'moment';

@Component({
    selector: 'job-map',
    templateUrl: './jobmap.html' 
})
export class JobMap {
    public busy: boolean = false;
    public val: boolean = false;
    public data: any = {};
    public errors: any;
    public steps: any = 1;
    public progr:any=0;
    public categories: any = [];
    public job: any = { categories: [],tasks:[]};
    public work: any = [];
    public images: any = [];
    public finished: any = 0;
    public events: any;
    public defaultMap: any = { lat: -41.282966, lng: 174.773254 };
    @Input() multiple: boolean = false;
    @ViewChild('fileInput') public fileInput: ElementRef;
    @ViewChild('confirm') public confirm:Confirm;

    designations = [];
    constructor(
        protected http: Http,
        protected toastr: ToastsManager,
        public auth: AuthService, 
        public router:Router,
    ) {
        this.errors = {};      
    }

    ngOnInit() {
       
        this.auth.hideLogo();
        this.auth.eEmit('backLink',[]); 
        this.auth.eEmit('showNext',true);      
        this.auth.hideFooter();  
    }

   
    googleLat(el) {
        this.job.google_lat = el.lat();
        this.job.google_long = el.lng();
    }  
   
}