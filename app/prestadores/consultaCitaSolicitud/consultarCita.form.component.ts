import { Component, OnInit, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { correctHeight } from '../../app.helpers';
import { AuthService } from '../../seguridad/auth.service';

import { CentroMedicoEntity } from '../../common/model/centroMedico';
import { CatalogoGenericoEntity } from '../../common/model/catalogo';
import { ConsultarCitaFilter, CitaMedicaEntity } from '../../common/model/cita';

import { CatalogoService } from '../../common/servicios/catalogo.service';
import { ServicioCitaMedicaService, } from '../../common/servicios/sevicioCitaMedica.service';
import { ReporteService } from '../../common/servicios/reporte.service';
import { utilidadesGenericasService } from '../../utils/utilidadesGenericas';


@Component({
    selector: 'consultarCita',
    providers: [ServicioCitaMedicaService],
    templateUrl: 'consultarCita.form.component.html'
})

export class ConsultarCitaFormComponent {

    filter: ConsultarCitaFilter;
    citas: CitaMedicaEntity[];
    citaSeleccionada: CitaMedicaEntity;
    listaCentroMedico: CentroMedicoEntity[];
    estados: CatalogoGenericoEntity[];
    tipoDocumento: number;
    tipoOrdenamiento:boolean;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private catalogoService: CatalogoService,
        public servicioCitaMedica: ServicioCitaMedicaService, public resporteService: ReporteService, public genericos:utilidadesGenericasService) {

        this.servicioCitaMedica.resetDefaultPaginationConstanst();
        this.limpiar();
        this.centrosMedicos();
        this.tipoOrdenamiento = false;
    }

    limpiar() {
        this.tipoDocumento = undefined;
        this.filter = new ConsultarCitaFilter();
        this.citas = [];
    }

    centrosMedicos() {
        this.listaCentroMedico = [];
        this.servicioCitaMedica.centroMedico().subscribe(
            result => {
                this.listaCentroMedico = result;
                this.loadEstados();
            },
            error => this.authService.showErrorPopup(error));
    }

    loadEstados() {
        this.estados = [];
        this.catalogoService.getCatalogoById("ESTCIM").subscribe(
            result => {
                this.estados = result;
                this.servicioCitaMedica.resetDefaultPaginationConstanst();
            },
            error => this.authService.showErrorPopup(error));
    }

    buscar() {

        if (this.filter.codigoCitaPrestador == undefined) {
            this.filter.codigoCitaPrestador = "";
        }
        if (this.filter.codigoMedicoCentroMedico == undefined) {
            this.filter.codigoMedicoCentroMedico = "";
        }
        if (this.filter.codigoSucursalCentroMedico == undefined) {
            this.filter.codigoSucursalCentroMedico = "";
        }

        if (this.tipoDocumento == 1) {
            this.filter.tipoDocumento = "C";
        }
        if (this.tipoDocumento == 2) {
            this.filter.tipoDocumento = "P";
        }
            
        this.servicioCitaMedica.obtenerCitaMedicas(this.filter).subscribe(
            result => {
                this.citas = result;
                this.citas.forEach(c=>{
                    c.fecha = this.genericos.GetDateTimeUTCTimeZone(c.fecha);
                    c.fechaRegistro = this.genericos.GetDateTimeUTCTimeZone(c.fechaRegistro);
                })
            },
            error => {
                this.citas = [];
                this.servicioCitaMedica.resetDefaultPaginationConstanst();
                this.authService.showErrorPopup(error);
            }
        );
    }

    pageChanged() {
        this.buscar();
    }

    cancelarCita(cita: CitaMedicaEntity) {
        this.citaSeleccionada = new CitaMedicaEntity();
        this.citaSeleccionada.codigoCentroMedico = cita.codigoCentroMedico;
        this.citaSeleccionada.idCita = Number(cita.idCitaCentroMedico);
        this.showPopupResultadoConfirm("Está seguro que desea cancelar la Cita");
    }

    showPopupResultadoConfirm(msg: string): void {
        swal({
            title: "",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "SI",
            cancelButtonText: "NO",
            closeOnConfirm: true,

        },
            confirmed => {

                if (confirmed) {
                    this.servicioCitaMedica.cancelarCitaMedica(this.citaSeleccionada).subscribe(
                        result => {
                            if (result.respuesta) {
                                this.buscar();
                                this.authService.showSuccessPopup("La cita ha sido Cancelada");
                            }
                            else {
                                this.authService.showErrorPopup("Ha ocurrido un error");
                            }

                        },
                        error => this.authService.showErrorPopup(error));
                }

            });
    }

    metodoOrdenamiento(criterioOrdenamiento: string){
        this.tipoOrdenamiento = !this.tipoOrdenamiento;
        this.filter.tipoOrdenamiento = this.tipoOrdenamiento == true? "Ascendente": "Descendente";  
        this.filter.criterioOrdenamiento = criterioOrdenamiento;
        this.buscar();
    }


    generarReporte(): void {
        this.resporteService.descargarReporteCita(this.filter).subscribe(
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
            error => this.authService.showBlobErrorPopup(error.srcElement));
    }

}