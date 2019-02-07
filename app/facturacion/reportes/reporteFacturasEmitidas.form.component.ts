import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../seguridad/auth.service';
import { ReporteService } from '../../common/servicios/reporte.service';


import { TransaccionKey } from '../../common/model/transacciones';
import { ProductosReporteMorosoEntity, RegionEntity } from '../../common/model/genericos';
import { FiltroReportesFacturasEmitidas } from '../../common/model/reportes';
import { HangfireFacturacionElectronicaService } from '../service/HangfireFacturacionElectronica.service';
import { ControlFacturaFilter } from '../../common/model/controlFactura';

@Component({
    selector: 'reporteFacturasEmitidas',
    providers: [ReporteService, HangfireFacturacionElectronicaService],
    templateUrl: 'reporteFacturasEmitidas.form.template.html'
})

export class ReporteFacturasEmitidasFormComponent {

    listaProductos: ProductosReporteMorosoEntity[];
    listaRegiones: RegionEntity[];
    filter: FiltroReportesFacturasEmitidas;
    opciones: object =
        [
            {
                mensaje: 'TODOS',
                codigo: 'T'
            },
            {
                mensaje: 'FACTURA',
                codigo: 'F'
            }, {
                mensaje: 'NOTA DE CREDITO',
                codigo: 'C'
            }
        ];


    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef, private authService: AuthService,
        private reporteService: ReporteService, private hfFacturacionElectronicaService: HangfireFacturacionElectronicaService) {
        this.filter = new FiltroReportesFacturasEmitidas();
        this.filter.TipoDocumento = "T"; 
     }
  
    Generar() { 
        let fltroControlDoc = new ControlFacturaFilter(); 

        fltroControlDoc.TipoDocumento = this.filter.TipoDocumento; 
        fltroControlDoc.FechaImpresionDesde = this.filter.FechaDesde; 
        fltroControlDoc.FechaImpresionHasta = this.filter.FechaHasta; 
        fltroControlDoc.TipoEmision = 'E'; 

        this.hfFacturacionElectronicaService.EnviarReporteCuadreDocumentosElectronicos(fltroControlDoc).subscribe(
            result => {
                this.authService.showSuccessPopup(result);
            },
            error => this.authService.showErrorPopup(error)
        );
    }

}