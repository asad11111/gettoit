import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable()
export class AuthService {

    public data: any;
    public registerdUser: any = {};
    public Footer: any = true;
    public headerWithLogo: any = true;
    public events: any;

    public constructor(
        protected http: Http,
        protected router: Router,
        protected loc: Location
    ) {
        var EventEmitter = require('events').EventEmitter;
        this.events = new EventEmitter();
    }
    getUser() {
        return this.data;
    }
    getUserType() {

        var user_role=3;
        return user_role;
       /*  this.data.user_role=2;
        return this.data.user_role ? this.data.user_role : 0; */
    }

    reddirect(l) { this.router.navigate(l); }
    fetchUser() {
        var opts = { body: { token: this.getToken() } };
        return new Promise((resolve, reject) => {
            this.http.get('/api/v1/currentuser', opts).subscribe((res) => {
                this.data = res.json().data;
                this.eEmit('fetchUser', this.data);
                resolve(this.data);
            }, (res) => {
                resolve();
                localStorage.removeItem('_token');
                this.logout();
                this.router.navigate(['/']);
            });
        });
    }
    getToken() {
        return localStorage.getItem('_token');
    }
    login(data: any) {
        localStorage.setItem('_token', data.token);
        this.data = data;
        switch (this.getUserType()) {
            case 1://Admin ...
                this.router.navigate(['/', 'admin']);
                break;
            case 2://Worker ...
                this.router.navigate(['/', 'jobs']);
                break;
            case 3://Employer ...
                this.router.navigate(['/', 'jobs', 'myjobs']);
                break;
            default:
                this.router.navigate(['/', 'jobs']);
                break;
        }
    }
    logout() {
        localStorage.removeItem('_token');

        if (this.loc.path().search('/admin') > 0)
            this.reddirect(['/', 'admin', 'login'])
        else
            this.router.navigate(['/']);
    }
    isAuthenticated() {
        var token = localStorage.getItem('_token');
        return token !== null;
    }
    hasModule(name) {
        return this.data.modules.some((m) => {
            return m.name === name;
        });
    }

    setRegUser(u) { this.registerdUser = u; }
    setRegKey(k, v) { this.registerdUser[k] = v; }
    getRegUser() { return this.registerdUser; }
    hideFooter() { this.Footer = false; }
    showFooter() { this.Footer = true; }
    hideLogo() { this.headerWithLogo = false; }
    showLogo() { this.headerWithLogo = true; }
    eEmit(name, val) { this.events.emit(name, val); }
    setImageUrl(url) {
        var host = window.location.host;
        if (host == 'localhost:3000')
        return url;
        return '/api/' + url;
    }

    setAvatar(url) {
        var host = window.location.host;
        if (url == '' || url == null)
            return '/img/photos/no_avatar.jpg';
        if (host == 'localhost:3000')
        return '/' + url;
        return '/api/' + url;
    }
} 