import {NgModule} from "@angular/core";
import {SharedModule} from '../shared/shared.module';
import {TopNav} from './topnav';
import {FooterNave} from './footer-nave';
import {Shell} from './shell';


@NgModule({
    imports: [SharedModule],
    declarations: [
        TopNav, FooterNave, Shell
    ],
    exports: [TopNav, FooterNave, Shell],
    providers   : [],
})
export class ShellModule {
}

export {Shell};