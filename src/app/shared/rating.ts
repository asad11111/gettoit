import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import * as moment from 'moment';

@Component({
    selector: 'rating',
    template: `<fieldset class="rating"><input type="radio" value="5"  [checked]="ratings===5" /><label (click)='onClick(5)'></label>
    <input type="radio" value="4" [checked]="ratings===4" /><label (click)='onClick(4)'></label>
    <input type="radio" value="3" [checked]="ratings===3" /><label (click)='onClick(3)'></label>
    <input type="radio" value="2" [checked]="ratings===2" /><label (click)='onClick(2)'></label>
    <input type="radio" value="1" [checked]="ratings===1" /><label (click)='onClick(1)'></label></fieldset>`,
})
export class RatingStars {

    _value: string;
    ratings:number = 0;
    public onlyviews:any=false;

    @Input()
    public set rating(value) {   this.ratings = parseInt(value); }

    @Input()
    public set onlyview(value) {   this.onlyviews =(value)?true:false;    }
     
    @Output()
    onChange = new EventEmitter();

    constructor(protected el: ElementRef) { }

    ngAfterViewInit() { }

    onClick(c) {
        if(this.onlyviews!=false)
            return ;
        this.ratings = c;
        this.onChange.emit(c)           
    }   
}