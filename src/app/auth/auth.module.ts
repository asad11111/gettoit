import { NgModule } from "@angular/core";
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';
import { UserResolver } from './user-resolver.service';
import { Permission } from './permission.service';
import { Register } from "./components/register";
import { AdminLogin } from "./components/admin-login";
import { Login } from "./components/login";
import { IndexMain } from "./components/index";
import { Verification } from "./components/verification";

import { SocialLoginModule, AuthServiceConfig } from "angular4-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angular4-social-login";

let config = new AuthServiceConfig([
    {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider("546510154219-s8gco5e3vtu79l3f3impv9n9eac7ob94.apps.googleusercontent.com")
    },
    {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider("461386787588981")
    }
]);

export function provideConfig() { return config; }

@NgModule({
    imports: [SharedModule, SocialLoginModule],
    declarations: [IndexMain, Login, Register,AdminLogin,Verification],
    exports: [IndexMain, Login, Register,AdminLogin,Verification],
    providers: [AuthService, AuthGuard, UserResolver, Permission, { provide: AuthServiceConfig, useFactory: provideConfig }],
})
export class AuthModule { }

export { Login, Verification,AdminLogin,Register, IndexMain, UserResolver, AuthGuard, AuthService, Permission };