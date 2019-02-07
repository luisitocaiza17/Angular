import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'app-toggle',
    templateUrl: './toggle.component.html',
})
export class ToggleComponent {
    @Input() on: boolean;
    @Input() size: string;
    @Output() toggled: EventEmitter<boolean> = new EventEmitter();

    onClick() {
        this.on = !this.on;
        this.toggled.emit(this.on);
    }
}
