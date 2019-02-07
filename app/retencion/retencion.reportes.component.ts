import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { AuthService } from '../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FiltroReportes, Opcion, Reporte } from '../common/model/retencion';
import { RetencionService } from '../common/servicios/retencion.service';
import { Catalogo } from '../common/model/catalogo';

@Component({
    templateUrl: 'retencion.reportes.template.html'
})

export class ReportesRetencionComponent {
    filtro: FiltroReportes;
    reportes: Reporte[];
    ListaDesicionCliente: Opcion[];
    ListaContactabilidad: Opcion[];
    urlExcel: string;
    listaOficinas: Catalogo[];
    descuentosPendientes: any[]

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(private retencionService: RetencionService) {
        this.filtro = new FiltroReportes();
        this.filtro.IdOficina = undefined;
        this.filtro.Region = undefined;
        this.filtro.FechaDesde = undefined;
        this.filtro.FechaHasta = undefined;
        this.reportes = [];
        this.listaOficinas = [];
        this.urlExcel = "";

        this.retencionService.obtenerOpciones()
            .subscribe(opciones => {
                this.ListaDesicionCliente = opciones.ListaDesicionCliente;
                this.ListaContactabilidad = opciones.ListaContactabilidad;
                this.loadOficinas();
            });
        
    }

    loadOficinas() {
        this.retencionService.obtenerOficinas().subscribe(result => {
            this.listaOficinas = result;
        });
    }

    generarReporte() {
        this.retencionService.generarReporte(this.filtro)
            .subscribe(reportes => {
                this.reportes = reportes;
            });
    }

    descargarReporte() {
        this
            .retencionService
            .generarReporteExcel(this.filtro)
            .subscribe(urlExcel => {

                window.open(urlExcel);
            });
    }

    decision(id: number): string {
        return this.ListaDesicionCliente.find(x => x.Id == id).Detalle;
    }

    contactabilidad(id: number): string {
        return this.ListaContactabilidad.find(x => x.Id == id).Detalle;
    }

    
    limpiar(){
        this.filtro.IdOficina = undefined;
        this.filtro.Region = undefined;
        this.filtro.FechaDesde = undefined;
        this.filtro.FechaHasta = undefined;
    }
}
