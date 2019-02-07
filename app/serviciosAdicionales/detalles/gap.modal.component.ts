import {Component, OnInit} from '@angular/core';
import {ServiciosAdicionalesBasesService} from '../../common/servicios/serviciosAdicionalesBases.service';
import {AuthService} from '../../seguridad/auth.service';
import {Resumen, Gap} from '../models/Detalles';

@Component({
    selector: 'app-gap-modal',
    templateUrl: 'gap.modal.template.html',
    styleUrls: ['detalles.component.css']
})

export class GapModalComponent implements OnInit {

    visible = false;
    animate = false;
    resumen: Resumen = null;
    altas: Gap[] = null;
    bajas: Gap[] = null;
    cambios: Gap[] = null;

    constructor(public serviciosAdicionalesService: ServiciosAdicionalesBasesService, public authService: AuthService) {
    }

    ngOnInit(): void {
    }

    show(baseId: number): void {
        this.visible = true;
        setTimeout(() => {
            this.animate = true;
            this.serviciosAdicionalesService.obtenerResumenGap(baseId)
                .subscribe(resumen => this.resumen = resumen,
                    error => this.authService.showErrorPopup(error));
            this.serviciosAdicionalesService.obtenerAltasGap(baseId)
                .subscribe(items => this.altas = items,
                    error => this.authService.showErrorPopup(error));
            this.serviciosAdicionalesService.obtenerBajasGap(baseId)
                .subscribe(items => this.bajas = items,
                    error => this.authService.showErrorPopup(error));
            this.serviciosAdicionalesService.obtenerCambiosTarifaGap(baseId)
                .subscribe(items => this.cambios = items,
                    error => this.authService.showErrorPopup(error));
        }, 100);
    }

    hide(): void {
        this.animate = false;
        setTimeout(() => this.visible = false, 100);
    }

}
