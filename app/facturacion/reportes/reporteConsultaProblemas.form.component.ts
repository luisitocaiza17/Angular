import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { utilidadesGenericasService } from '../../utils/utilidadesGenericas';
import { ControlFacturaFilter } from '../../common/model/controlFactura';
import { AuthService } from '../../seguridad/auth.service';
import { HangfireFacturacionElectronicaService } from '../service/HangfireFacturacionElectronica.service';

@Component({
    selector: 'reporteConsultaProblemas', 
    providers: [HangfireFacturacionElectronicaService],
    templateUrl: 'reporteConsultaProblemas.form.template.html'
})

export class ReporteConsultaProblemas implements OnDestroy {

    numeroEnvio: number
    datepickerOpts = {}
    ofSerie: number;
    serieFactura: number;
    numeroFactura: number;
    fechaDesde: Date;
    fechaHasta: Date;
    estadoFactura: number;

    constructor( 
        private hfFacturacionElectronicaService: HangfireFacturacionElectronicaService ,
        public utilidadesService: utilidadesGenericasService,
        private authService: AuthService
        ) {

            this.datepickerOpts = this.utilidadesService.datepickerOpts; 
            
    }

    ngOnInit(){
        this.estadoFactura = -1000; 
    }

    ngOnDestroy() {
    }

    generarArchivoProblemas(){
        var filtroProblema = new ControlFacturaFilter();
        filtroProblema.OfSerie = this.ofSerie;
        filtroProblema.SerieFactura = this.serieFactura;
        filtroProblema.NumeroFactura = this.numeroFactura;
        filtroProblema.FechaImpresionDesde = this.fechaDesde;
        filtroProblema.FechaImpresionHasta = this.fechaHasta;
        filtroProblema.EstadoFactura = this.estadoFactura;
        filtroProblema.TipoEmision = 'E'; 

        this.hfFacturacionElectronicaService.generarArchivoProblemas(filtroProblema)
            .subscribe( 
                res => this.authService.showSuccessPopup(res), 
                error => this.authService.showErrorPopup(error)
            );
    }
}