import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";

@Injectable()
export class PusherResolver implements Resolve<any> {

    protected url = 'https://js.pusher.com/4.2/pusher.min.js';
    protected loaded = false;
    constructor(private http:Http) {

    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>|Promise<any>|any {
        return new Promise((resolve, reject)=>{
            if(this.loaded) return resolve();
            var url = this.url ;
            this.loadGoogleMapsLib(url, resolve);
        });        
    }
    loadGoogleMapsLib(url, cb){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.id = "pusherScript";
        script.onload = () => {
            this.loaded = true;
            cb();
        };
        script.src = url;         
        document.getElementsByTagName("head")[0].appendChild(script);
    }
}