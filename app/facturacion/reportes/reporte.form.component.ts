import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';


import { AuthService } from '../../seguridad/auth.service';
import { Permiso } from '../../seguridad/usuario';
import { ReporteService } from '../../common/servicios/reporte.service';

@Component({
    providers: [ReporteService],
    templateUrl: 'reporte.form.template.html'
})

export class ReporteViewComponent implements OnInit {
    visualizarReporteMorosos: boolean;
    visualizarReporteFacturas: boolean;
    visualizarReporteProblemas: boolean;
    accessReporteMorosoCobrar: boolean;
    accessReporteFacturasEmitidas: boolean;
    accessReporteConsultaProblemas: boolean;
    mostrarPantallaMorosos: boolean;
    mostrarPantallaFacturas: boolean;
    mostrarPantallaProblemas: boolean;

    constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef, private authService: AuthService,
        private reporteService: ReporteService) {
        this.accessReporteMorosoCobrar = false;
        this.accessReporteFacturasEmitidas = false;
        this.accessReporteConsultaProblemas = false;
        this.verificarPermisos();

    }

    loadReporteMorosos() {
        this.visualizarReporteFacturas = true;
        this.visualizarReporteMorosos = false;
        this.visualizarReporteProblemas = false;

        this.mostrarPantallaMorosos = true;
        this.mostrarPantallaFacturas = false;
        this.mostrarPantallaProblemas = false;

    }

    loadReporteFacturas() {
        this.visualizarReporteFacturas = false;
        this.visualizarReporteMorosos = true;
        this.visualizarReporteProblemas = false;

        this.mostrarPantallaMorosos = false;
        this.mostrarPantallaFacturas = true;
        this.mostrarPantallaProblemas = false;
    }

    loadReporteProblemas() {
        this.visualizarReporteFacturas = false;
        this.visualizarReporteMorosos = false;
        this.visualizarReporteProblemas = true;

        this.mostrarPantallaMorosos = false;
        this.mostrarPantallaFacturas = false;
        this.mostrarPantallaProblemas = true;
    }

    ngOnInit() {
        this.visualizarReporteFacturas = true;
    }

    verificarPermisos(): void {
        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {
            var admin = listaPermisos.find(p => p == Permiso.ADMINISTRADOR);
            if (admin != undefined) {
                this.accessReporteMorosoCobrar = true;
                this.accessReporteFacturasEmitidas = true;
                this.accessReporteConsultaProblemas = true;
            }
            else {
                var auth = listaPermisos.find(p => p == Permiso.REPORTE_MOROSOS_POR_COBRAR);
                if (auth != undefined)
                    this.accessReporteMorosoCobrar = true;

                auth = listaPermisos.find(p => p == Permiso.REPORTE_FACTURAS_EMITIDAS);
                if (auth != undefined)
                    this.accessReporteFacturasEmitidas = true;

                this.accessReporteConsultaProblemas = true;
            }
        }
    }
}