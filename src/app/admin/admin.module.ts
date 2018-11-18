import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router';  
import { Admin } from "./admin"; 
import { AdminComplaints } from "./complaints/complaints"; 
import { DateTimePickerModule } from 'ng-pick-datetime';
import { ProgressHttpModule } from "angular-progress-http";
import {AuthService} from "../auth/auth.service";
import { CarouselModule,SlideComponent } from 'ngx-bootstrap/carousel';
import {MapsResolver} from "./jobs/google-maps-resolver";
import { JobMap } from "./jobs/job-map/jobmap";
import {googleMaps} from "./jobs/map";
import { AdminJobs } from "./jobs/jobs";
import { AdminProfile } from "./profile/profile";
import { AdminUsers } from "./users/users";
import { AdminPayments } from "./payments/payments";
import { Jobs_Overview} from "./jobs/jobsheet/job_overview";
import { Complaint } from "./complaints/complaint"; 

var routes = RouterModule.forChild([
    {path: '',component:Admin}, 
    {path: 'complaints',component:AdminComplaints}, 
    {path: 'jobs',component:AdminJobs}, 
    {path: 'payments',component:AdminPayments}, 
    {path: 'users',component:AdminUsers}, 
    {path: 'profile',component:AdminProfile},
    {path: 'map',component:JobMap, resolve: {maps: MapsResolver}},   
    {path: 'jobs/:id',component:Jobs_Overview, resolve: {maps: MapsResolver}},
    {path: 'complaint/:id',component:Complaint}, 
]);

@NgModule({
    imports: [routes, SharedModule,DateTimePickerModule,ProgressHttpModule,CarouselModule],
    declarations: [Admin,googleMaps,JobMap,Jobs_Overview,Complaint,AdminComplaints,AdminJobs,AdminProfile,AdminUsers,AdminPayments],
    providers   : [MapsResolver],
})

export class AdminPanelModule {
    constructor(      
        public auth:AuthService
    ){    }
 
 }