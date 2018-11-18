import {NgModule} from '@angular/core'
import {RouterModule, Routes} from "@angular/router";
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {SharedModule} from './shared/shared.module';
import {AuthModule, UserResolver, AuthGuard, Login, Register,IndexMain,AdminLogin,Verification} from './auth/auth.module';
import {ShellModule, Shell} from './shell/shell.module';
import {AppComponent} from "./app";
import {ToastModule } from "ng2-toastr";
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PopoverModule} from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import {NgbPaginationModule} from './shared/pagination/pagination.module';
import {loadModule} from "./shared/services/loadModule";
import {HttpClient} from "./shared/services/Http";
import { AccordionModule } from 'ngx-bootstrap/accordion'; 
import { About } from './pages/about';
import { PusherResolver} from "./pusher-resolver";
declare let require:any;

const rootRouterConfig: Routes = [
    {path: 'signup', component: IndexMain}, 
    {path: 'login', component: Login},
    {path: 'admin/login', component: AdminLogin},  
    {path: '', component: Login},
    {path: 'register', component: Register},  
    {path: 'verification', component: Verification},  
    { path: '', data:{title: 'Home'}, component: Shell ,children:[      
        {path: 'jobs', loadChildren: './jobs/jobs.module#JobsModule'},
        {path: 'profile', loadChildren: './profile/profile.module#ProfileModule'},
        {path: 'messages', loadChildren: './messages/messages.module#MessagesModule'},
        {path: 'about', component: About},
        {path: 'notification', loadChildren: './notifications/notifications.module#NotificationsModule'}, 
        {path: 'admin', loadChildren: './admin/admin.module#AdminPanelModule'},
    ] },
];

@NgModule({
    declarations: [AppComponent,About],
    imports     : [        
        BrowserModule,
        BrowserAnimationsModule,
        ShellModule, AuthModule,
        ToastModule.forRoot(),
        BsDropdownModule.forRoot(),
        ModalModule.forRoot(),
        CarouselModule.forRoot(),
        PopoverModule.forRoot(),
        TabsModule.forRoot(),
        NgbPaginationModule.forRoot(),
        AccordionModule.forRoot(),
        SharedModule,
        RouterModule.forRoot(rootRouterConfig),
    ],
    exports: [
    ],
    providers   : [
         HttpClient,PusherResolver,
        // {provide: ToastOptions, useClass: CustomToastrOpts},
        {provide: LocationStrategy, useClass: HashLocationStrategy},         
    ],
    bootstrap   : [AppComponent]
})
export class AppModule { }