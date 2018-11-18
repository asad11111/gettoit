import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../shared/components/confirm";
import { ProgressHttp } from "angular-progress-http";
import { Alert } from "../shared/components/alert";
import { AuthService } from "../auth/auth.service";
import * as moment from 'moment';

@Component({
    selector: 'my-profile',
    templateUrl: './my-profile.html',
})
export class MyProfile {

    public errors: any = {};
    public selPhoto: any;
    public fileReader: any;
    public photo: any;
    public progr: number = 0;
    public user: any = {user:{}};
    public id:any;

    @ViewChild('useravatar') public useravatar: ElementRef;

    constructor(
        protected http: Http,
        protected toastr: ToastsManager,
        private httpprog: ProgressHttp,
        public auth: AuthService
    ) {
        this.fileReader = new FileReader();
    }

    ngOnInit() {
        this.auth.hideLogo();
        this.auth.eEmit('headerTitle', 'More');
        this.auth.eEmit('backLink', ['/', 'jobs', 'myjobs']);
        this.auth.eEmit('showNext', false);
        this.auth.showFooter();
        this.loadProfile();
        if(this.auth.getUserType() ==1)
            this.auth.reddirect(['/','admin','profile']);
    }
    avatar(url) {
        if (typeof url != 'undefined')
            return this.auth.setAvatar(url.avator);
        else
            return this.auth.setAvatar('');
    }

    logout($event) {
        $event.preventDefault();
        this.auth.logout();
    }
    loadProfile() {
        this.http.get('/api/v1/profile').subscribe((re) => {
            this.user = re.json().data;
            this.id = this.user.id;
        }, (re) => {
            var error = re.json().errors;
        });
    }

    onFileChange(e) {
        var files = e.target.files;

        if (files.length == 0) {
            this.toastr.error("Please select avatar photo.");
            return;
        }

        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                this.fileReader.readAsDataURL(files[i]);
                this.fileReader.onload = (e) => {
                    this.selPhoto = e.target.result;
                }
                this.photo = files[i];
                this.photoUpload();
            }
        }
    }


    photoUpload() {
        let fd: FormData = new FormData();
        fd.append('avatarphoto', this.photo);
        this.httpprog.withUploadProgressListener(progress => {
            this.progr = progress.percentage;
        }).post(`/api/v1/profile/avatar`, fd).subscribe((re) => {
            this.toastr.success('Avatar saved successfully.');
        }, (re) => {
            this.errors = re.json().errors;
            this.errors.forEach((v, i) => {
                this.toastr.error(v);
            });
        });

    }
}
