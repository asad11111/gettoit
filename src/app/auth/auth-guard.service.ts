import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(protected auth: AuthService, protected act: Location, protected router: Router) {    }
    canActivate() {
        if (this.auth.isAuthenticated())
            return true;
        var adminside = this.act.path().search('/admin');
        if (adminside >= 0)
            this.auth.reddirect(['/', 'admin', 'login']);
        else
            this.auth.reddirect(['/login']);
        return false;
    }
}