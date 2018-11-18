import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router'; 
import {ModalModule} from 'ngx-bootstrap/modal';
import { MyProfile } from "./my-profile";
import { Profile } from "./profile";
import { EmpProfile } from "./emp-profile";
import { ComplaintsList } from "./complaints-list";
import { ComplaintCopy } from "./complaint_copy";
import { Banking } from "./banking";
import {googleMaps} from "./../jobs/map";
import {MapsResolver} from "./../jobs/google-maps-resolver";
import {DateTimePickerModule } from 'ng-pick-datetime';
import {ProgressHttpModule } from "angular-progress-http"; 
import { Payment } from "./payment/payment";
 
var routes = RouterModule.forChild([
    {path: '',component:MyProfile },
    {path: 'banking',component:Banking },
    {path: 'myprofile',component:EmpProfile },
    {path: 'payment',component:Payment},
    {path:':id/complaints', component:ComplaintsList},
    {path:':id/:comp_by/complaintcopy', component:ComplaintCopy},
    {path: ':id/:job_id',component:Profile},   
    
]);

@NgModule({
    imports: [routes, SharedModule,DateTimePickerModule,ProgressHttpModule],
    declarations: [MyProfile,Profile,ComplaintCopy,ComplaintsList,Payment, EmpProfile,Banking],
    providers   : [MapsResolver],
})

export class ProfileModule { 
    
}