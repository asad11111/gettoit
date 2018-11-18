import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router';  
import { Messages } from "./messages"; 
import { Message } from "./message";
import {googleMaps} from "./../jobs/map";
import {MapsResolver} from "./../jobs/google-maps-resolver";
import { DateTimePickerModule } from 'ng-pick-datetime';
import { ProgressHttpModule } from "angular-progress-http"; 
 
var routes = RouterModule.forChild([
    {path: '',component:Messages},
    // {path: ':id',component:Message,resolve: {maps: PusherResolver} },
    {path: ':id/:job_id',component:Message},
]);

@NgModule({
    imports: [routes, SharedModule,DateTimePickerModule,ProgressHttpModule],
    declarations: [Messages,Message],
    providers   : [MapsResolver],
})

export class MessagesModule { }