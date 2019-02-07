import { Component } from '@angular/core';
import { FiltroReportes, Reporte } from '../common/model/reportes';
import { ReportesService } from '../common/servicios/reportes.service';

@Component({
    templateUrl: 'reportes.template.html'
})

export class ReportesComponent {
    filtro: FiltroReportes
    reportes: Reporte[]

    constructor(private reportesService: ReportesService) {
        this.filtro = new FiltroReportes
    }

    generarReporte() {
        this
            .reportesService
            .generarReporte(this.filtro)
            .subscribe(reportes => {
                this.reportes = reportes;
            });
    }
}
