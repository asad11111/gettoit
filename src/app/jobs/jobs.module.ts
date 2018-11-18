import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import { RouterModule } from '@angular/router'; 
import {ModalModule} from 'ngx-bootstrap/modal';
import { Jobs } from "./jobs";
import { Jobs_Create}  from "./jobs_Create";
import { MyJobs}  from "./myjobs";
import { Jobs_Review}  from "./job_review";
import { Jobs_Complaint}  from "./job_complaint";
import {googleMaps} from "./map";
import {MapsResolver} from "./google-maps-resolver";
import { DateTimePickerModule } from 'ng-pick-datetime';
import { ProgressHttpModule } from "angular-progress-http";
import { Jobs_Overview } from "./jobsheet/job_overview";
import { JobMap } from "./job-map/jobmap";
import { CarouselModule,SlideComponent } from 'ngx-bootstrap/carousel';
 
var routes = RouterModule.forChild([
    {path: '',component:Jobs },
    {path: 'create',component:Jobs_Create, resolve: {maps: MapsResolver}},
    {path: 'myjobs',component:MyJobs},
    {path: 'jobcomplaint',component:Jobs_Complaint},
    {path: ':id/:app_id/jobcomplaint',component:Jobs_Complaint},
    {path: ':id/:app_id/jobreview',component:Jobs_Review},
    {path: 'map',component:JobMap, resolve: {maps: MapsResolver}},   
    {path: ':id',component:Jobs_Overview, resolve: {maps: MapsResolver}},
]);

@NgModule({
    imports: [routes, SharedModule,DateTimePickerModule,ProgressHttpModule,CarouselModule],
    declarations: [Jobs,Jobs_Create,MyJobs,Jobs_Review,Jobs_Complaint, Jobs_Overview,JobMap, googleMaps],
    providers   : [MapsResolver],
})

export class JobsModule { }