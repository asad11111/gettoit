import {Component, Input, EventEmitter, Output} from '@angular/core';
import {defer} from "../helpers/defer";

@Component({
    selector: 'confirm',
    template: `<div class="confirm_wrapper " [style.display]="_show?'block':'none'"  >
    <div class="bg"></div>
    <div class="content">
            <button  (click)="hide(false)" class="close" type="button">
                    <span aria-hidden="true">×</span>
                </button>
        <div class="message">{{message}}</div>
        <div class="buttons">
            <button (click)="hide(true)" class="btn btn-success">Yes</button>
            <button (click)="hide(false)" class="btn btn-default">No</button>
        </div>
    </div>
</div>`
})
export class Confirm {

    @Input()
    _show = false;

    @Input()
    message = 'Are you sure?';

    @Input()
    title = 'Are you sure?';

    @Output()
    onSelect= new EventEmitter();

    deferred:any;

    show(message):Promise<boolean>{
        this.message = message;
        this.deferred = defer();
        this._show = true;
        return this.deferred.promise;
    }
    hide(opt){
        if(this.deferred)
            this.deferred.resolve(opt);
        this._show = false;
        this.onSelect.emit(opt);
    }

}
