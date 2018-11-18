import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../shared/components/confirm";
import { DateTimePickerModule } from 'ng-pick-datetime';
import { AuthService } from "../auth/auth.service";
import * as moment from 'moment';
import { Router } from '@angular/router';
import './style.css';

@Component({
    selector: 'banking',
    templateUrl: './banking.html',
})
export class Banking {
    public errors: any = {};
    public errorsVerify: any = [];
    public data: any={bank_info:[]};
    public account_info: any = {};
    public show: any = false;
    public verifiModal: any = false;
    public busy: any = false;
    public router: Router;
    public user_type: any = 2;
    public edits: any = false;
    public maxDob: any = '';
    public verifyAccount: any = {};
    @ViewChild('confirm') public confirm: Confirm;

    constructor(
        protected http: Http,
        router: Router,
        protected toastr: ToastsManager,
        public auth: AuthService
    ) {
        this.user_type = this.auth.getUserType();
        this.maxDob = moment().subtract(3, 'years').format('YYYY-MM-DD');

    }

    ngOnInit() {
        this.auth.hideLogo();
        this.auth.eEmit('headerTitle', 'Payment Accounts');
        this.auth.eEmit('backLink', ['/', 'profile']);
        this.auth.eEmit('showNext', false);
        this.auth.hideFooter();
        this.loadProfile();

    }

    loadProfile() {
        this.http.get('/api/v1/profile').subscribe((re) => {
            this.data = re.json().data;
            this.verifyAccount.user = this.data.user;
            if (this.data.user.age > 0)
                this.verifyAccount.dob = moment().subtract(this.data.user.age, 'years').format('YYYY-MM-DD');
        }, (re) => { });
    }
    onHide() { this.show = false; }
    showModal(s) { this.show = s; }
    edit(d) {
        this.account_info = d;
        this.showModal(true);
        this.edits = true;
    }

    del(d) {
 
        this.confirm.show(`Are you sure you want to delete account/credit information ?`)
            .then((opt) => {
                if (opt == true) {
                    this.http.delete(`/api/v1/bank/${d.id}`)
                        .subscribe((re) => {
                            this.toastr.success('Deleted successfully.');
                            this.data.bank_info.forEach((v, i) => {
                                if (v.id == d.id)
                                    this.data.bank_info.splice(i, 1);
                            });
                        }, (re) => { })
                }
            })
    }
    postBankInfo() {
        this.busy = true;
        if (this.auth.getUserType() == 3) {
            this.account_info.acount_type = "card";
        }
        else
            this.account_info.acount_type = "bank";

        if (this.edits)
            var url = `/api/v1/profile/bank/${this.account_info.id}`;
        else
            var url = `/api/v1/profile/bank`;

        this.http.post(url, this.account_info).subscribe((res) => {
            this.busy = false;
            this.toastr.success('Account Information saved successfully.');
            this.showModal(false);
            this.loadProfile();
            this.edits = false;
        }, (res) => {
            this.busy = false;
            if (res.status != 422) return;
            this.errors = res.json().errors;
        });
    }


    onHide2() { this.verifiModal = false; }

    verifyBank() {
        var url = `/api/v1/profile/payments/${this.verifyAccount.id}`;
        if(!this.busy)
        {
            this.busy = true;
            this.http.post(url, this.verifyAccount).subscribe((re) => {
                this.onHide2();
                this.busy = false;
                this.toastr.success("Your bank account is verified successfully.");
                this.loadProfile();
            }, (re) => {
                this.errorsVerify = re.json().errors;
                this.busy = false;
            });
        }
    }

    verify(d) {

        var names = this.verifyAccount.user.name.split(' ');
        if (names.length > 1) {
            this.verifyAccount.first_name = names[0];
            this.verifyAccount.last_name = names[1];
        } else {
            this.verifyAccount.first_name = names[0];
            this.verifyAccount.last_name = '';
        }

        for (var i in d) {
            switch (i) {
                case 'routing':
                    this.verifyAccount['routing_number'] = d[i];
                    this.verifyAccount[i] = d[i];
                    break;
                default:
                    this.verifyAccount[i] = d[i];
                    break
            }
        }
        this.verifiModal = true; 
    }
}