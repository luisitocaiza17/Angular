import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { Region } from '../../../common/model/region';
import { RegionService } from '../../../common/servicios/region.service';
import { AuthService } from '../../../seguridad/auth.service';
import { CitaClienteFilter, CitaCliente } from '../../../common/model/cobranzas';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { CobranzaService } from '../../../common/servicios/cobranza.service';
import { ReporteService } from '../../../common/servicios/reporte.service';
import { GenericosService } from '../../../common/servicios/genericos.service';
import { ContratoKey } from '../../../common/model/contrato';
import { SucursalDeRegion } from '../../../common/model/genericos';


@Component({
    selector: 'busquedaCitasCliente',
    providers: [GenericosService],
    templateUrl: 'busquedaCitasCliente.template.html' 
})

export class BusquedaCitasClienteComponent implements OnInit {

    regiones: Region[]; 
    filtroCitas: CitaClienteFilter; 
    citasCliente: CitaCliente[]; 
    citaSelected: CitaCliente; 
    observacionCita: string;
    citaCumplida: number; 
    ruta: number; 
    sucursalesDeRegion: SucursalDeRegion[];

    datepickerOpts = {}

    constructor(
        private regionService: RegionService, 
        private authService: AuthService,
        public utilidadesService: utilidadesGenericasService,
        public cobranzaService: CobranzaService, 
        private reporteService: ReporteService, 
        private genericosService: GenericosService
    ) {
        this.datepickerOpts = this.utilidadesService.datepickerOpts; 
    }

    ngOnInit(){
        this.citasCliente = []; 
        this.citaSelected = new CitaCliente(); 
        this.filtroCitas = new CitaClienteFilter(); 
        this.loadRegiones(); 
        this.filtroCitas.FechaDesde = this.utilidadesService.getDateFirstDayOfMonth(); 
        this.filtroCitas.FechaHasta = this.utilidadesService.getDateLastDayOfMonth(); 
        this.citaCumplida = 0; 
        this.sucursalesDeRegion = []; 
    }

    loadCitasCliente(): void{ 
        this.cobranzaService.getCitasClientesPaginated(this.filtroCitas)
            .subscribe( res => { 
                this.citasCliente = res; 
            }); 
    }

    loadRegiones(): void {
        this.regionService.getAll()
            .subscribe(regiones => {
                this.regiones = regiones;
            },
                error => this.authService.showErrorPopup(error));
    }

    seleccionar(cita: CitaCliente): void {
        this.citaSelected = new CitaCliente(); 
        if (this.citasCliente != undefined) {
            this.citasCliente.forEach(element => {
                element.Selected = false;
            });
        }
        cita.Selected = true;
        this.citaSelected = cita;
    }

    pageChanged(): void {
        this.citaSelected = new CitaCliente(); 
        this.loadCitasCliente();
    }

    limpiar(){ 
        this.citasCliente = []; 
        this.citaSelected = new CitaCliente(); 
        this.filtroCitas.FechaDesde = this.utilidadesService.getDateFirstDayOfMonth(); 
        this.filtroCitas.FechaHasta = this.utilidadesService.getDateLastDayOfMonth();
        this.filtroCitas.Region = undefined; 
        this.filtroCitas.RealizadoPor = undefined;  
        this.filtroCitas.CodigoSucursal = undefined; 
        this.filtroCitas.Sector = undefined; 
        this.filtroCitas.Turno = undefined; 
    }

    orderByRealizadoPor(type: string){ 
        if(type=='DESC')
            this.citasCliente.sort((a, b) => a.RealizadoPor.localeCompare(b.RealizadoPor));
        if(type=='ASC')
            this.citasCliente.sort((a, b) => b.RealizadoPor.localeCompare(a.RealizadoPor));
    }

    limpiarModalObservacion(){
        this.observacionCita = undefined; 
        this.citaCumplida = 0; 
    }

    cancelarModalObservacion() { 
        this.closeModal('#modalObservacionCita'); 
        this.limpiarModalObservacion(); 
    }

    addObservacioCitaYCumplida() { 
        this.citaSelected.ObservacionCita = this.observacionCita; 
        this.citaSelected.Cumplida = this.citaCumplida; 
        this.cobranzaService.addObservacionYCumplida(this.citaSelected)
            .subscribe( res => { 
                this.authService.showSuccessPopup(res); 
            }); 
        this.closeModal('#modalObservacionCita'); 
        this.limpiarModalObservacion(); 
        this.loadCitasCliente(); 
        this.citaSelected = new CitaCliente(); 
    }

    limpiarModalRuta(){
        this.ruta = undefined; 
    }

    cancelarModalRuta() { 
        this.closeModal('#modalRuta'); 
        this.limpiarModalRuta(); 
    }

    addRutaToCitaCliente() { 
        this.citaSelected.Ruta = this.ruta; 
        this.cobranzaService.addRutaToCitaCliente(this.citaSelected)
            .subscribe( res => { 
                this.authService.showSuccessPopup(res); 
            }); 
        this.closeModal('#modalRuta'); 
        this.limpiarModalRuta(); 
        this.loadCitasCliente(); 
        this.citaSelected = new CitaCliente(); 
    }

    generarReporteGeneralCitasCobranza(){
        this.reporteService.descargarReporteGeneralCitasCobranza(this.filtroCitas).subscribe(
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

    generarReporteRutasCitasCobranza(){
        this.reporteService.descargarReporteRutasCitasCobranza(this.filtroCitas).subscribe(
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

    loadSucursalesDeRegion() { 
        var contratoKey = new ContratoKey(); 
        contratoKey.CodigoRegion = this.filtroCitas.Region; 
        this.genericosService.getSucursalPorRegion(contratoKey) 
                .subscribe(
                    datos => { 
                        this.sucursalesDeRegion = datos; 
                    }
                ); 
    }

    openModal(modalName: string) {
        $(modalName).modal(); 
    }

    closeModal(modalName: string) {
        $(modalName).modal('hide');
    }

}