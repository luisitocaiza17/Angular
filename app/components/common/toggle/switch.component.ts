import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-switch',
    templateUrl: './switch.component.html',
    styleUrls: ['./switch.component.css']
})
export class SwitchComponent {
    @Input() on: boolean;
    @Input() size: string;

    className: string;
}
