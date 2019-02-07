import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuditoriaSistema, AuditoriaAutorizacionFilter, AccionAuditable } from '../common/model/auditoria';
import { Catalogo } from '../common/model/catalogo';
import { EmailTracking } from '../common/model/emailTracking';

import { AuditoriaSistemaService } from '../common/servicios/auditoriaSistema.service';
import { AuthService } from '../seguridad/auth.service';
import { ReporteService } from '../common/servicios/reporte.service';
import { CatalogoService } from '../common/servicios/catalogo.service';
import { UsuarioService } from '../common/servicios/usuario.service';

@Component({
    providers: [AuditoriaSistemaService],
    templateUrl: 'auditoriaSistema.list.template.html'
})

export class AuditoriaSistemaListComponent implements OnInit {
    auditorias: AuditoriaSistema[];
    auditoria: AuditoriaSistema;
    filter: AuditoriaAutorizacionFilter;
    accionesAuditadas: string[];
    usuarios: string[];

    accionAuditable: AccionAuditable;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, public auditoriaSistemaService: AuditoriaSistemaService,
        private reporteService: ReporteService, private catalogoService: CatalogoService,
        private usuarioService: UsuarioService) {
    }

    ngOnInit(): void {
        this.accionAuditable = new AccionAuditable();
        this.filter = new AuditoriaAutorizacionFilter();
        this.auditorias = [];
        this.auditoria = new AuditoriaSistema();
        this.getAuditoriaList();
        this.loadAccionesAuditadas();
        this.loadUsuarios();
    }

    getAuditoriaList(): void {
        this.auditoriaSistemaService.getAllPaginated()
            .subscribe(auditorias => {
                this.loadData(auditorias);
            },
            error => this.authService.showErrorPopup(error));
    }

    pageChanged(): void {
        this.buscar();
    }

    loadAccionesAuditadas(): void {
        this.catalogoService.getAccionesAuditadasSistema().subscribe(
            acciones => {
                this.accionesAuditadas = acciones;                
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadUsuarios(): void {
        this.usuarioService.getAll().subscribe(
            result => {
                this.usuarios = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadData(auditorias: AuditoriaSistema[]): void {
        this.auditorias = auditorias;        
    }

    loadAuditoria(auditoriaId): void {
        this.auditoriaSistemaService.getById(auditoriaId).subscribe(
            auditoria => {
                this.auditoria = auditoria;
                this.auditoria.Generales = AuditoriaSistema.prototype.convertToFieldArrray(this.auditoria.DatosGenerales);
                this.auditoria.Complementarios = AuditoriaSistema.prototype.convertToFieldArrray(this.auditoria.DatosComplementarios);
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    consultar(): void {
        this.auditoriaSistemaService.resetDefaultPaginationConstanst();
        this.buscar();
    }

    buscar(): void {
        this.auditoriaSistemaService.getByFiltersPaginated(this.filter)
            .subscribe(auditorias => {
                this.loadData(auditorias);
                if (this.auditorias != undefined && this.auditorias.length > 0) {
                    var inipos = jQuery("#resultadosBusqAuditorias").position().top;
                    jQuery("html, body").animate({ scrollTop: inipos + 190 }, 300);
                }                
            },
            error => this.authService.showErrorPopup(error));
    }

    limpiar(): void {
        this.auditoriaSistemaService.resetDefaultPaginationConstanst();
        this.filter = new AuditoriaAutorizacionFilter();
        this.getAuditoriaList();
    }

    generarReporte(): void {
        this.reporteService.descargarReporteAuditoriasSistema(this.filter).subscribe(
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
