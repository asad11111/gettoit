import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {Router, NavigationEnd, NavigationStart} from "@angular/router";
import { routerTransition } from '../router.animations';
declare let window:any;
@Component({
    selector: 'shell',
    templateUrl: './shell.html',
    animations: [routerTransition()],
    host: { '[@routerTransition]': '' }
})
export class Shell {
    public loading:any = false;
    constructor(protected router:Router){}

    ngOnInit(){
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.loading = true;
            }
            else if (event instanceof NavigationEnd) {
                this.loading = false;
            }
        });        
    }
}