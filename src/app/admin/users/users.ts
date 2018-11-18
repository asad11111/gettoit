import { Component, Input, ViewChild } from '@angular/core';
import { Http } from "@angular/http";
import { ToastsManager } from "ng2-toastr";
import { Confirm } from "../../shared/components/confirm";
import { Alert } from "../../shared/components/alert";
import { AuthService } from "../../auth/auth.service";
import * as moment from 'moment';

@Component({
    selector: 'admin-users',
    templateUrl: './users.html',
})

export class AdminUsers {

    public users: any = [];
    public errors: any = {};
    public busy: any = false;
    public search: any = { page: 1 };
    @ViewChild('confirm') public confirm: Confirm;

    constructor(
        protected http: Http,
        protected toastr: ToastsManager,
        public auth: AuthService
    ) { }

    ngOnInit() {
        this.auth.showLogo();
        this.auth.showFooter();
        this.getUsers();
    }

    avatar(url) {
        if (url && typeof url != 'undefined')
            return this.auth.setAvatar(url.avator);
        else
            return this.auth.setAvatar(null);
    }


    getUsers(p = 1) {
        this.busy = true;
        this.search.page = p;
        var url = '';

        for (var i in this.search)
            url += i + '=' + this.search[i] + '&';

        this.http.get(`/api/v1/users?${url}`).subscribe((re) => {
            this.users = re.json().data;
            this.busy = false;
        }, (re) => {
            this.busy = false;
        });
    }

    disable(d,s) {
        this.confirm.show(`Are you sure to ${(s)?'enable':'disable'} "${d.name}"?`).then((o) => {
            if (o) {
                this.http.get(`/api/v1/users/${d.id}/${s}`).subscribe((re) => {
                    this.toastr.success(`User ${(s)?'enabled':'disabled'} successfully.`);
                    this.users.forEach((v,i) => {
                        if(v.id==d.id)
                            this.users[i].status =s;                        
                    });
                }, (re) => {
                    var errors = re.json().errors;
                    for (var k in errors) {
                        if (typeof errors[k] == 'string')
                            this.toastr.error(errors[k]);
                    }
                });
            }
        });
    }

    delUser(d) {
        this.confirm.show(`Are you sure to delete "${d.name}"?`).then((o) => {
            if (o) {
                this.http.delete(`/api/v1/users/${d.id}`).subscribe((re) => {

                }, (re) => {
                    var errors = re.json().errors;
                    for (var k in errors) {
                        if (typeof errors[k] == 'string')
                            this.toastr.error(errors[k]);
                    }
                });
            }
        });
    }
}