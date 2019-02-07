import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../../../seguridad/auth.service';
import { Permiso } from '../../../seguridad/usuario';
import { ConsultasFacturacionElectronicaService } from '../../../common/servicios/consultasFacturacionElectronica.service';
import { DocumentoFacturacion, FilterDocumentoFacturacion, DetalleDocumentoFacturacion, DetalleDocumentoFe03Filter, ContadorEstadosDocumentosFacturacion } from '../../../common/model/facturacion';
import { ReporteService } from '../../../common/servicios/reporte.service';
import { HangfireFacturacionElectronicaService } from '../../service/HangfireFacturacionElectronica.service';


@Component({
    selector: 'consultaRespuestasFacturacion',
    providers: [ConsultasFacturacionElectronicaService, HangfireFacturacionElectronicaService],
    templateUrl: 'consultaFacturas.component.view.html', 
    styleUrls: ['consultaFacturas.component.view.css']
})

export class ConsultaFacturasComponent implements OnDestroy, OnInit{

    suscription: any;
    consultaFull: boolean;
    consultaExterna: boolean;
    documentosFacturacion: DocumentoFacturacion[];
    documentoFacturacionSelected: DocumentoFacturacion; 
    detallesDocumentoSeleccionado: DetalleDocumentoFacturacion[]; 
    filterDF: FilterDocumentoFacturacion;
    filterDetalleDF: DetalleDocumentoFe03Filter; 
    cantidadDFPorEstado: ContadorEstadosDocumentosFacturacion; 
    filterOptions = [
        { value: 'mayorQue', label: 'Mayor' }, 
        { value: 'mayorIgual', label: 'Mayor o igual' }, 
        { value: 'igual', label: 'Igual' }, 
        { value: 'menorIgual', label: 'Menor o igual' }, 
        { value: 'menorQue', label: 'Menor' }
     ];

    constructor( 
        private chRef: ChangeDetectorRef, 
        private authService: AuthService, 
        public facturacionConsultasService: ConsultasFacturacionElectronicaService, 
        private reporteService: ReporteService, 
        private hangfireFacturacionElectronicaService: HangfireFacturacionElectronicaService
        ) {           
    }

    ngOnInit(){
        this.filterDF = new FilterDocumentoFacturacion(); 
        this.cantidadDFPorEstado = new ContadorEstadosDocumentosFacturacion();
        this.documentoFacturacionSelected = new DocumentoFacturacion(); 
    }

    ngOnDestroy() {
    }

    loadDocumentosFacturacion(){ 
        this.documentosFacturacion = [];
        this.detallesDocumentoSeleccionado = []; 
        this.documentoFacturacionSelected = new DocumentoFacturacion();
        this.filterDF.NoObtenerRetenciones = true;  
        this.facturacionConsultasService.getDocumentosFacturacionByFiltersPaginated(this.filterDF)
            .subscribe( result => {         
                this.documentosFacturacion = result; 
            }); 
            error => {
                this.authService.showErrorPopup(error)
            }
    }

    seleccionar(documentoFacturacion: DocumentoFacturacion): void {
        this.documentoFacturacionSelected = new DocumentoFacturacion(); 
        this.cantidadDFPorEstado = new ContadorEstadosDocumentosFacturacion(); 
        if (this.documentosFacturacion != undefined) {
            this.documentosFacturacion.forEach(element => {
                element.Selected = false;
            });
        }
        documentoFacturacion.Selected = true;
        this.documentoFacturacionSelected = documentoFacturacion;
        this.loadDetallesDocumento();
    }

    loadDetallesDocumento(){ 
        this.filterDetalleDF = new DetalleDocumentoFe03Filter(); 
        this.filterDetalleDF.Establecimiento = this.documentoFacturacionSelected.Establecimiento; 
        this.filterDetalleDF.PuntoEmision = this.documentoFacturacionSelected.PuntoEmision; 
        this.filterDetalleDF.Secuencial = this.documentoFacturacionSelected.Secuencial; 
        this.filterDetalleDF.TipoDocumento = this.documentoFacturacionSelected.TipoDocumento;
        this.facturacionConsultasService.getDetallesDocumentoFacturacionByFilters(this.filterDetalleDF)
            .subscribe( result => {
                this.detallesDocumentoSeleccionado = result;
            }); 
            error => {
                this.authService.showErrorPopup(error)
            }
    }

    limpiarFiltroDocumento(){
        this.documentosFacturacion = [];
        this.documentoFacturacionSelected = new DocumentoFacturacion(); 
        this.detallesDocumentoSeleccionado = []; 
        this.filterDF = new FilterDocumentoFacturacion();
        this.facturacionConsultasService.paginationConstants.pageNumber = 1; 
    }

    generarReporteDocumentos(){
        this.filterDF.NoObtenerRetenciones = true;  
        this.hangfireFacturacionElectronicaService.EnviarReporteDocumentosFacturacionPorCorreo(this.filterDF)
                .subscribe(
                    res => { 
                        this.authService.showSuccessPopup(res);
                    }, 
                    error => { 
                        this.authService.showErrorPopup(error);
                    }
                ); 
    }

    loadCantidadesDocumentosFacturacionPorEnvio(){
        this.facturacionConsultasService.getCantidadFacturasEnDiferentesEstados(this.documentoFacturacionSelected.NumeroEnvio, this.documentoFacturacionSelected.SecuencialEnvio)
        .subscribe( result => {
            this.cantidadDFPorEstado = result;
        }); 
        error => {
            this.authService.showErrorPopup(error)
        }
    }
    
    keyDownFunction(event) {
        if(event.keyCode == 13) {
            this.loadDocumentosFacturacion(); 
            this.salir(); 
        }
    }

    pageChanged(): void {
        this.loadDocumentosFacturacion();
    }

    openModal(modalName: string) {
        $(modalName).modal(); 
    }

    salir() {
        $('#modalFiltros').modal('hide');
    }


}