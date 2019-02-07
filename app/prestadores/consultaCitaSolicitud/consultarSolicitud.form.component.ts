import { Component, OnInit, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { correctHeight } from '../../app.helpers';
import { AuthService } from '../../seguridad/auth.service';


import { Catalogo, CatalogoGenericoEntity } from '../../common/model/catalogo';
import { SolicitudDestacadoFilter, SolicitudDestacadoEntity, AgendarCitaKey, Horario } from '../../common/model/cita';

import { EspecialidadEntity } from '../../common/model/especialidadVeris';
import { CatalogoService } from '../../common/servicios/catalogo.service';
import { ServicioCitaMedicaService } from '../../common/servicios/sevicioCitaMedica.service';
import { PrestadorService } from '../../common/servicios/prestador.service';
import { ReporteService } from '../../common/servicios/reporte.service';
import { GenericosService } from '../../common/servicios/genericos.service';
import { utilidadesGenericasService } from '../../utils/utilidadesGenericas';




@Component({
    selector: 'consultarSolicitud',
    providers: [ServicioCitaMedicaService],
    templateUrl: 'consultarSolicitud.form.component.html'
})

export class ConsultarSolicitudFormComponent {


    agendarKey: AgendarCitaKey;
    filter: SolicitudDestacadoFilter;
    estados: CatalogoGenericoEntity[];
    especialidades: EspecialidadEntity[];
    horarios: Horario[];
    motivosRechazo: CatalogoGenericoEntity[];
    solicitudes: SolicitudDestacadoEntity[];
    solicitudSeleccionada: SolicitudDestacadoEntity;
    fecha: Date;
    hora: string;
    hora2: string;
    tipoDocumento: number;
    correo1: string;
    correo2: string;
    minutos: number;
    horas: string;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    hourOpts = {
        autoclose: true,
        todayHighlight: true,
        icon: 'fa fa-clock-o',
        placeholder: 'Escoja una hora',
        language: 'es',
        showMeridian: false
    };


    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private catalogoService: CatalogoService,
        public servicioCitaMedica: ServicioCitaMedicaService, public prestadorService: PrestadorService,
        public resporteService: ReporteService, public genericas: utilidadesGenericasService) {

        this.servicioCitaMedica.resetDefaultPaginationConstanst();
        this.agendarKey = new AgendarCitaKey();
        this.filter = new SolicitudDestacadoFilter();
        this.estados = [];
        this.especialidades = [];
        this.horarios = [];
        this.solicitudes = [];
        this.motivosRechazo = [];
        this.solicitudSeleccionada = new SolicitudDestacadoEntity();
        this.fecha = new Date();
        this.tipoDocumento = undefined;
        this.correo1 = undefined;
        this.correo2 = undefined;
        this.hora2 = undefined;
        this.horas = undefined;
        this.minutos = undefined;
        this.loadMotivosRechazo();
    }

    loadMotivosRechazo() {
        this.catalogoService.getCatalogoById("REHCIM").subscribe(
            result => {
                this.motivosRechazo = result;
                this.loadEstados();
            },
            error => this.authService.showErrorPopup(error));
    }

    loadEstados() {
        this.catalogoService.getCatalogoById("ESTCIM").subscribe(
            result => {
                this.estados = result;
                this.loadEspecialidades();
            },
            error => this.authService.showErrorPopup(error));
    }

    loadEspecialidades(): void {
        if (this.especialidades == undefined || this.especialidades.length == 0) {
            this.servicioCitaMedica.obtenerEspecialidades().subscribe(
                result => {
                    this.especialidades = result;
                    this.servicioCitaMedica.resetDefaultPaginationConstanst();
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    buscar() {
        this.validarFilter();
        this.servicioCitaMedica.obtenerSolicitudesCitaMedicoDestacado(this.filter).subscribe(
            result => {
                this.solicitudes = result;
            },
            error => {
                this.solicitudes = [];
                this.servicioCitaMedica.resetDefaultPaginationConstanst();
                this.authService.showErrorPopup(error);
            }
        );
    }

    modalRechazar(solicitud: SolicitudDestacadoEntity) {
        this.solicitudSeleccionada = new SolicitudDestacadoEntity();
        this.solicitudSeleccionada = solicitud;

        $("#myModalRechazarSolicitudes").modal();
    }

    actualizarSolicitud(estado: number) {

        var filtro = new SolicitudDestacadoFilter();
        filtro.id = this.solicitudSeleccionada.id;
        filtro.estadoSolicitud = estado;
        filtro.motivoRechazo = this.solicitudSeleccionada.motivoRechazo;

        this.servicioCitaMedica.actualizarEstadoSolicitudCitaMedicoDestacado(filtro).subscribe(
            result => {
                if (result.estaActualizado == true) {
                    this.authService.showSuccessPopup("La Solicitud ha sido cancelada");
                }
                else {
                    this.authService.showErrorPopup("Ha ocurrido un error");
                }
                this.buscar();
                this.salirCancelacion();
            },
            error => this.authService.showErrorPopup(error));
    }

    salirCancelacion() {
        $('#myModalRechazarSolicitudes').modal('hide');
    }

    modalDetalles(solicitud: SolicitudDestacadoEntity) {
        this.solicitudSeleccionada = new SolicitudDestacadoEntity();
        this.solicitudSeleccionada = solicitud;
        this.motivosRechazo.forEach(element => {
            if (element.Codigo == this.solicitudSeleccionada.motivoRechazo) {
                this.solicitudSeleccionada.motivoRechazo = element.Descripcion;
            }
        });

        this.solicitudSeleccionada = solicitud;
        $("#myModalDetallesSolicitud").modal();
    }

    salirDetalles() {
        $('#myModalDetallesSolicitud').modal('hide');
    }

    modalAgendar(solicitud: SolicitudDestacadoEntity) {
        this.solicitudSeleccionada = new SolicitudDestacadoEntity();
        this.solicitudSeleccionada = solicitud;
        this.correo1 = undefined;
        this.correo2 = undefined;
        this.hora = undefined;
        this.horas = undefined;
        this.minutos = undefined;
        this.fecha = new Date();
        $("#myModalAgendarCita").modal();
    }

    salirAgendar() {
        $('#myModalAgendarCita').modal('hide');
    }

    limpiar() {
        this.filter = new SolicitudDestacadoFilter();
        this.tipoDocumento = undefined;
    }

    pageChanged() {
        this.buscar();
    }


    getDireccion() {
        this.prestadorService.prestador(this.solicitudSeleccionada.convenioMedicoPrestador.toString()).subscribe(
            result => {
                this.agendarCita(result.Direccion);

            },
            error =>
                this.agendarCita("0")
        );
    }

    agendarCita(direccion: string) {

        this.agendarKey = new AgendarCitaKey();
        this.agendarKey.numeroTitularContrato = this.solicitudSeleccionada.numeroBeneficiario;
        this.agendarKey.codigoContrato = this.solicitudSeleccionada.codigoContrato;
        this.agendarKey.numeroContrato = this.solicitudSeleccionada.numeroContrato;
        this.agendarKey.IdPersona = this.solicitudSeleccionada.numeroBeneficiario.toString();
        this.agendarKey.numeroPersonaPaciente = this.solicitudSeleccionada.numeroBeneficiario;
        this.agendarKey.nombrePaciente = this.solicitudSeleccionada.nombreBeneficiario;
        this.agendarKey.idCentroMedico = 20;
        this.agendarKey.nombreSucursalCentroMedico = direccion;
        this.agendarKey.codigoMedico = this.solicitudSeleccionada.convenioMedicoPrestador.toString();
        this.agendarKey.nombreMedicoPrestador = this.solicitudSeleccionada.nombreMedicoPrestador;
        this.agendarKey.codigoSucursal = "SaludSA";
        this.agendarKey.idHorarioDisponible = this.solicitudSeleccionada.id.toString();
        this.agendarKey.fechaDate = this.fecha;
        //this.agendarKey.hora = this.horas.toString() + ":" + this.minutos.toString();
        this.agendarKey.hora = this.hora;
        this.agendarKey.duracion = 0;
        this.agendarKey.codigoPlataforma = undefined;
        this.agendarKey.codigoEspecialidad = this.solicitudSeleccionada.codigoEspecialidad;
        this.agendarKey.idTurno = "0";
        this.agendarKey.correoNotificacion = this.correo1;

        this.servicioCitaMedica.agendarCitaMedica(this.agendarKey).subscribe(
            result => {
                if (result.respuesta == true) {
                    this.getMensaje(result.codigoCita);
                }
                else {
                    this.authService.showErrorPopup("La cita no ha sido Agendada");
                }
                this.buscar();
                this.salirAgendar();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    getMensaje(codigoCita: any): void {

        this.authService.showSuccessPopup(
            "<h4>¡Tu cita #" + codigoCita + " en " + this.agendarKey.nombreSucursalCentroMedico + " ha sido agendada con éxito!</h4>" +
            "<div class='panel panel-success'>" +
            "   <h4>Información de tu cita</h4>" +
            "   <center>" +
            "   <table width='90%'>" +
            "       <tr>" +
            "           <td align='left' ><h4>Médico: </h4></td>" +
            "           <td align='left' ><h5>" + this.agendarKey.nombreMedicoPrestador + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Especialidad: </h4></td>" +
            "           <td align='left' ><h5>" + this.getEspecialidad() + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Paciente: </h4></td>" +
            "           <td align='left' ><h5>" + this.agendarKey.nombrePaciente + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Fecha: </h4></td>" +
            "           <td align='left' ><h5>" + this.genericas.convertDatetoString(this.agendarKey.fechaDate) + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Hora: </h4></td>" +
            "           <td align='left' ><h5>" + this.agendarKey.hora + "</h5></td>" +
            "       </tr>" +
            "   </table>" +
            "   </center>" +
            " </div>" +
            "<h5>Recibirás una confirmación de tu cita en tu correo electrónico.</h5>");

    }

    getEspecialidad(): string {

        var especialidad;
        this.especialidades.forEach(element => {
            if (this.agendarKey.codigoEspecialidad == element.codigoEspecialidad) {
                especialidad = element.nombreEspecialidad;
            }
        });
        return especialidad;
    }

    generarReporte(): void {
        this.validarFilter();
        this.resporteService.descargarResporteSolicitudCita(this.filter).subscribe(
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

    validarFilter() {
        if (this.tipoDocumento == 1) {
            this.filter.tipoDocumento = "C";
        }
        if (this.tipoDocumento == 2) {
            this.filter.tipoDocumento = "P";
        }
    }

    horaChange() {


        if (this.horas == undefined || this.horas.length == 0 || this.horas == "") {
            this.horas = "00";
        }
        else {

            var patron = /^\d*$/;
            if (patron.test(this.horas.toString())) {

                if (parseInt(this.horas) > 23) {
                    this.horas = "23";
                }
                if (parseInt(this.horas) < 0) {
                    this.horas = "00";
                }
            }
            else {
                this.horas = "00";
            }
        }

        if (this.horas.length == 1) {
            this.horas = "0" + this.horas
        }

    }

    minutoChange() {
        if (this.minutos == undefined) {
            this.minutos = 0;
        }
        else {
            var patron = /^\d*$/;
            if (patron.test(this.minutos.toString())) {

                if (this.minutos > 59) {
                    this.minutos = 59;
                }
                if (this.minutos < 0) {
                    this.minutos = 0;
                }
            }
            else {
                this.minutos = 0;
            }
        }
    }





}