import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { AbstractClassPart } from '@angular/compiler/src/output/output_ast';
import { ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core/src/metadata/di';

import { correctHeight } from '../../app.helpers';
import { AuthService } from '../../seguridad/auth.service';
import { ConstantService } from '../../utils/constant.service';
import { LogErroresService } from '../../common/servicios/logErrores.service';
import { LogError, LogErrorFilter, LogErrorDetalle, LogErrorDetalleFilter } from '../../common/model/LogError';



@Component({
    providers: [LogErroresService],
    templateUrl: 'logErrores.form.template.html'
})

export class LogErroresFormComponent implements OnInit {

    logErrores: LogError[];
    LogErrorFilter: LogErrorFilter;
    logErroresDetalle: LogErrorDetalle[];
    LogErrorDetalleFilter: LogErrorDetalleFilter;
    

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private constantService: ConstantService,
        public logErroresService: LogErroresService) {
        this.logErrores = [];
        this.LogErrorFilter = new LogErrorFilter();
        this.logErroresDetalle = [];
        this.LogErrorDetalleFilter = new LogErrorDetalleFilter();
    }

    ngOnInit(): void {
        //this.verPendientes();
    }

    buscar(): void {
        this.logErroresService.getProcesoPaginated(this.LogErrorFilter)
            .subscribe(result => {
                this.logErrores = result;
            },
                error => this.authService.showErrorPopup(error));
    }

    verPendientes(): void {
        this.logErroresService.getTotalPendientes()
            .subscribe(result => {
                
                swal({
                    title: "",
                    text: "<h3>" + "Total Pendientes: "+ result + "</h3>",
                    html: true,
                    type: 'info',
                    closeOnConfirm: true,
                    confirmButtonColor: "#1a7bb9",
                    confirmButtonText: "OK",
                });
                
                console.log(result);




            },
                error => this.authService.showErrorPopup(error));
    }

    pageChanged(): void {
        this.buscar();
    }

    limpiar(): void {
        this.logErrores = [];
        this.LogErrorFilter = new LogErrorFilter();
        this.logErroresDetalle = [];
        this.LogErrorDetalleFilter = new LogErrorDetalleFilter();
        this.buscar();
    }

    inicializarSubPanel(logErrores: LogError): void {
        this.buscarDetalle(logErrores.NumeroProceso, logErrores.TotalErrores);
    }


    buscarDetalle(numeroProceso: number, cantidadRegistros: number): void {
        this.LogErrorDetalleFilter.NumeroProceso = numeroProceso;
        this.LogErrorDetalleFilter.TotalRegistros = cantidadRegistros;
        this.logErroresService.getProcesoDetallePaginated(this.LogErrorDetalleFilter)
            .subscribe(result => {
                this.logErroresDetalle = result;
                console.log(this.logErroresDetalle);
            },
                error => this.authService.showErrorPopup(error));
    }

    colapsarTab(): void {

    }

}
