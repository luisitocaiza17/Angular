import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {ServiciosAdicionalesBasesService} from '../../common/servicios/serviciosAdicionalesBases.service';
import {AuthService} from '../../seguridad/auth.service';
import {Base} from '../models/Bases';

@Component({
    selector: 'app-liberarbase-modal',
    templateUrl: 'liberarbase.modal.template.html',
    styleUrls: ['detalles.component.css']
})

export class LiberarBaseModalComponent implements OnInit {

    visible = false;
    animate = false;
    base: Base = null;
    observaciones: string;

    @Output() success: EventEmitter<boolean> = new EventEmitter();

    constructor(public serviciosAdicionalesService: ServiciosAdicionalesBasesService, public authService: AuthService) {
    }

    ngOnInit(): void {
    }

    liberar(): void {
        const data = {
            Id: this.base.Id,
            ObservacionLiberada: this.observaciones
        };
        this.serviciosAdicionalesService.liberarBase(data)
            .subscribe(base => {
                    this.success.emit(true);
                    this.hide();
                },
                error => this.authService.showErrorPopup(error));
    }

    cancelar(): void {
        this.hide();
    }

    show(base: Base): void {
        this.visible = true;
        setTimeout(() => {
            this.base = base;
            this.animate = true;
        }, 100);
    }

    hide(): void {
        this.animate = false;
        setTimeout(() => this.visible = false, 100);
    }

}
