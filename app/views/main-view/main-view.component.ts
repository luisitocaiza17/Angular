import { Component } from '@angular/core';
import { correctHeight } from '../../app.helpers';

@Component({
    selector: 'mianView',
    templateUrl: 'main-view.template.html',
    styleUrls: ['main-view.template.css']
})
export class mainViewComponent {
    ngAfterViewInit() {
        setTimeout(() => {
            correctHeight();
        }, 100)
    }
 }