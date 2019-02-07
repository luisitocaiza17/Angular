import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../seguridad/auth.service';
import { RegionEntity, ProductosReporteMorosoEntity } from '../../../common/model/genericos';
import { HangFireCobranzaReporteService } from '../../service/HangFireCobranzaReporte.service';
import { ClaveContratoEntity } from '../../../common/model/contrato';

@Component({
    selector: 'cuotasPendientesPago',
    providers: [HangFireCobranzaReporteService],
    templateUrl: 'cuotasPendientesPago.template.html'
})

export class CuotasPendientesPagoComponent implements OnInit {
    regiones: RegionEntity[];
    productos: ProductosReporteMorosoEntity[];
    filter: ClaveContratoEntity;
    nombreUsuario: string;

    constructor(private authService: AuthService, private cobranzaReporteService: HangFireCobranzaReporteService) {
        this.filter = new ClaveContratoEntity();
    }

    ngOnInit() {
        this.nombreUsuario = this.authService.nombreUsuario + "@saludsa.com.ec";
        this.loadCombos();
    }

    loadCombos(): void {
        if (this.regiones == undefined || this.regiones.length == 0) {
            this.regiones = RegionEntity.values;
        }
        if (this.productos == undefined || this.productos.length == 0) {
            this.productos = ProductosReporteMorosoEntity.values;
        }
    }

    reportePersonalizado() {
        if (this.filter.Region == undefined && this.filter.CodigoProducto == undefined) {
            //generar nacionales

        } else if (this.filter.Region != undefined && this.filter.CodigoProducto != undefined) {
            this.llamarReporte();
        } else {
            this.authService.showInfoPopup("Para reporte: nacionales no seleccione nada, para personaliado seleccione ambas opciones");
        }
    }

    llamarReporte() {
        this.cobranzaReporteService.ReporteCuotasPendientesPago(this.filter).subscribe(
            result => {
                if (result) {
                    this.authService.showSuccessPopup("A su correo " + this.nombreUsuario + " le llegar&aacute; el reporte");
                } else {
                    this.authService.showErrorPopup("Hemos tenido problemas para ejecutar esta tarea, por favor comun&iacute;quese con el administrador del sistema");
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

}