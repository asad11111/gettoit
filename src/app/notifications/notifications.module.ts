import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router';  
import { Notification} from "./notification"; 
import { DateTimePickerModule } from 'ng-pick-datetime';
import { ProgressHttpModule } from "angular-progress-http";
 
var routes = RouterModule.forChild([
    {path: '',component:Notification},
    // {path: ':id',component:Message,resolve: {maps: PusherResolver} },
]);

@NgModule({
    imports: [routes, SharedModule,DateTimePickerModule,ProgressHttpModule],
    declarations: [Notification],
})

export class NotificationsModule { }