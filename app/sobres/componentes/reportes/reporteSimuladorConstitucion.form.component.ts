import { Component, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../../seguridad/auth.service';

import { ReporteSobreReembolsoService } from '../../service/reporteSobreReembolso.service';

@Component({
    providers: [ReporteSobreReembolsoService],
    templateUrl: 'reporteSimuladorConstitucion.form.template.html'
})

export class SimuladorReporteConstitucionFormComponent {


    constructor(public domSanitizer: DomSanitizer, private authService: AuthService,
        public reporteSobreReembolsoService: ReporteSobreReembolsoService) {
    }

    generarReporte(): void {
        this.reporteSobreReembolsoService.generarReporteSimuladorConstitucion().subscribe(
            result => {
                this.authService.showSuccessPopup(result);
            },
            error => this.authService.showBlobErrorPopup(error)
        );
    }
}