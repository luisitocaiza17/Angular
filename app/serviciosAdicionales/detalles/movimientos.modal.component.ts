import {Component, OnInit} from '@angular/core';
import {ServiciosAdicionalesBasesService} from '../../common/servicios/serviciosAdicionalesBases.service';
import {AuthService} from '../../seguridad/auth.service';
import {Resumen, Movimiento} from '../models/Detalles';

@Component({
    selector: 'app-movimientos-modal',
    templateUrl: 'movimientos.modal.template.html',
    styleUrls: ['detalles.component.css']
})

export class MovimientosModalComponent implements OnInit {

    visible = false;
    animate = false;
    resumen: Resumen = null;
    inclusiones: Movimiento[] = null;
    exclusiones: Movimiento[] = null;
    cambios: Movimiento[] = null;

    constructor(public serviciosAdicionalesService: ServiciosAdicionalesBasesService, public authService: AuthService) {
    }

    ngOnInit(): void {
    }

    show(baseId: number): void {
        this.serviciosAdicionalesService.paginationConstants.pageNumber = 1;
        this.visible = true;
        setTimeout(() => {
            this.animate = true;
            this.serviciosAdicionalesService.obtenerResumenMovimientos(baseId)
                .subscribe(resumen => this.resumen = resumen,
                    error => this.authService.showErrorPopup(error));
            this.serviciosAdicionalesService.obtenerInclusionesMovimientos(baseId)
                .subscribe(items => this.inclusiones = items,
                    error => this.authService.showErrorPopup(error));
            this.serviciosAdicionalesService.obtenerExclusionesMovimientos(baseId)
                .subscribe(items => this.exclusiones = items,
                    error => this.authService.showErrorPopup(error));
            this.serviciosAdicionalesService.obtenerCambiosCoberturaMovimientos(baseId)
                .subscribe(items => this.cambios = items,
                    error => this.authService.showErrorPopup(error));
        }, 100);
    }

    hide(): void {
        this.animate = false;
        setTimeout(() => this.visible = false, 100);
    }

}
