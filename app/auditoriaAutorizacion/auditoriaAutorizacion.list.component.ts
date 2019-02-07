import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuditoriaAutorizacion, AuditoriaAutorizacionFilter, AccionAuditable, TipoDocumento } from '../common/model/auditoria';
import { Catalogo } from '../common/model/catalogo';
import { EmailTracking } from '../common/model/emailTracking';

import { AuditoriaAutorizacionService } from '../common/servicios/auditoriaAutorizacion.service';
import { AuthService } from '../seguridad/auth.service';
import { ReporteService } from '../common/servicios/reporte.service';
import { CatalogoService } from '../common/servicios/catalogo.service';

@Component({
    providers: [AuditoriaAutorizacionService],
    templateUrl: 'auditoriaAutorizacion.list.template.html'
})

export class AuditoriaAutorizacionListComponent implements OnInit {
    auditorias: AuditoriaAutorizacion[];
    auditoria: AuditoriaAutorizacion;
    filter: AuditoriaAutorizacionFilter;
    accionesAuditadas: string[];
    estadosAuditados: Catalogo[];

    accionAuditable: AccionAuditable;
    emailTrackingList: EmailTracking[];
    tipoDocumento: TipoDocumento;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, public auditoriaAutorizacionService: AuditoriaAutorizacionService,
        private reporteService: ReporteService, private catalogoService: CatalogoService) {
    }

    ngOnInit(): void {
        this.accionAuditable = new AccionAuditable();
        this.tipoDocumento = new TipoDocumento();
        this.filter = new AuditoriaAutorizacionFilter();
        this.auditorias = [];
        this.auditoria = new AuditoriaAutorizacion();
        this.getAuditoriaList();
        this.loadAccionesAuditadas();
        this.emailTrackingList = [];
    }

    getAuditoriaList(): void {
        this.auditoriaAutorizacionService.getAllPaginated()
            .subscribe(auditorias => {
                this.loadData(auditorias);
            },
            error => this.authService.showErrorPopup(error));
    }

    pageChanged(): void {
        this.buscar();
    }

    loadAccionesAuditadas(): void {
        this.catalogoService.getAccionesAuditadasAutorizacion().subscribe(
            acciones => {
                this.accionesAuditadas = acciones;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadEstadosAuditados(accion: string): void {
        this.estadosAuditados = [];
        if (accion != undefined && accion != '') {
            this.catalogoService.getEstadosAuditados(accion).subscribe(
                estados => {
                    this.estadosAuditados = estados;
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    loadData(movauditorias: AuditoriaAutorizacion[]): void {
        this.auditorias = movauditorias;
    }

    loadAuditoria(auditoriaId): void {
        this.emailTrackingList = [];
        this.auditoriaAutorizacionService.getById(auditoriaId).subscribe(
            auditoria => {
                this.auditoria = auditoria;
                this.auditoria.Datos = AuditoriaAutorizacion.prototype.convertToFieldArrray(this.auditoria.DatosCompletos);
                if (this.auditoria.Accion == this.accionAuditable.MODIFICACION_AUTORIZACION) {
                    this.auditoria.CamposOriginales = AuditoriaAutorizacion.prototype.convertToFieldArrray(this.auditoria.ValorOriginalCamposModificados);
                    this.auditoria.CamposModificados = AuditoriaAutorizacion.prototype.convertToFieldArrray(this.auditoria.ValorActualizadoCamposModificados);
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    consultar(): void {
        this.auditoriaAutorizacionService.resetDefaultPaginationConstanst();
        this.buscar();
    }

    buscar(): void {
        this.auditoriaAutorizacionService.getByFiltersPaginated(this.filter)
            .subscribe(auditorias => {
                this.loadData(auditorias);
            },
            error => this.authService.showErrorPopup(error));
    }

    limpiar(): void {
        this.auditoriaAutorizacionService.resetDefaultPaginationConstanst();
        this.filter = new AuditoriaAutorizacionFilter();
        this.getAuditoriaList();
    }

    generarReporte(): void {
        this.reporteService.descargarReporteTracking(this.filter).subscribe(
            result => {
                var blob: Blob = null;
                blob = new Blob([result._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                if (blob != null) {
                    var fileName = result.headers._headers.get("file-name")[0];
                    var url = window.URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    document.body.appendChild(link);
                    link.href = url;
                    link.download = fileName;
                    link.click();
                }
            },
            error => this.authService.showBlobErrorPopup(error));
    }

    consultarTrackingMail(): void {
        this.auditoriaAutorizacionService.emailTracking(this.auditoria.IdTrackingMail).subscribe(
            result => {
                this.emailTrackingList = result;
            },
            error => this.authService.showBlobErrorPopup(error)
        );
    }

    verArchivoCorte(idAuditoria: number) {
        this.auditoriaAutorizacionService.verArchivoCorte(idAuditoria).subscribe(
            result => {
                var blob: Blob = null;
                blob = new Blob([result._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                if (blob != null) {
                    var fileName = result.headers._headers.get("file-name")[0];
                    var url = window.URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    document.body.appendChild(link);
                    link.href = url;
                    link.download = fileName;
                    link.click();
                }
            },
            error => this.authService.showBlobErrorPopup(error));
    }
}
