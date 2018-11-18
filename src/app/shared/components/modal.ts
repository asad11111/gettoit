import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'modal',
    template: ` <div class="b-modal fade " [ngClass]="{'in':show==true,'hide':show==false}" >
                <div class="modal-dialog"> </div>
                <div class="modal-content">
                        <div class="modal-header">
                                <button type="button" (click)="_hide()" class="close">×</button>
                                <h4 class="modal-title"><ng-content select="[header]"></ng-content></h4>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <ng-content select="[body]"></ng-content>
                            </div>
                        </div>
                        <div class="modal-footer">
                        <ng-content select="[footer]"></ng-content>
                        </div></div></div>
                <div class="modal-backdrop fade " [ngClass]="{'in':show==true,'hide':show==false}" ></div>`
                })
export class Modal {

    @Input() loading = false;
    @Input() public show = false;
    @Input() public size = 'md';
    @Input() public title = 'Untitled';
    @Output() public hide = new EventEmitter();

    constructor() { 
         
    }
    _hide() { this.hide.emit(); }
}




// <div class="modal fade" [ngClass]="{'in': show}" style="overflow: auto">       
// <h1 class="loading" *ngIf="loading">Loading</h1>
// <div [ngClass]="['modal-dialog', 'modal-'+size]" [ngStyle]="{display: loading ? 'none' : 'block'}">
//     <div class="modal-content">
//         <div class="modal-header">
//             <button type="button" class="close" (click)="_hide()" aria-label="Close">
//                 <span aria-hidden="true">&times;</span>
//             </button>
//             <h4 class="modal-title">{{title}}</h4>
//         </div>
//         <div class="modal-body">
//               <ng-content select="[body]"></ng-content>
//         </div>
//         <div class="modal-footer">
//             <ng-content select="[footer]"></ng-content>
//         </div>
//     </div>
// </div>
// </div>