import { Component, OnInit, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { correctHeight } from '../../app.helpers';
import { AuthService } from '../../seguridad/auth.service';
import { CatalogoService } from '../../common/servicios/catalogo.service';
import { CentroMedicoService } from '../../common/servicios/centroMedico.service';
import { PrestadorService } from '../../common/servicios/prestador.service';
import { BeneficiarioService } from '../../common/servicios/beneficiario.service';

import { CiudadEntity } from '../../common/model/ciudad';
import { Catalogo } from '../../common/model/catalogo';
import { ContratoKey } from '../../common/model/contrato';
import { EspecialidadEntity } from '../../common/model/especialidadVeris';
import { RegistarPacienteKey, ValidarPacienteKey, CitaMedicaFilter, MedicosEntity, HorarioMedicoEntity, AgendarCitaKey } from '../../common/model/cita';
import { AgendarCitaCentroMedicoContratoListComponent } from './../agendarCentrosMedicos/agendarCentrMedContrato.list.component';
import { BeneficiarioKey, Beneficiario, BeneficiarioPaciente } from '../../common/model/beneficiario';
import { ConstantService } from '../../utils/constant.service';
//import { GoogleAnalyticsEventsService } from '../../common/servicios/googleAnalyticsEvents.service';
import { ServicioCitaMedicaService } from '../../common/servicios/sevicioCitaMedica.service';
import { Usuario } from '../../seguridad/usuario';
import { utilidadesGenericasService } from '../../utils/utilidadesGenericas';
import { CentroMedico, CentroMedicoEntity } from '../../common/model/centroMedico';


@Component({
    selector: 'agendarCitaCentroMedico',
    providers: [ServicioCitaMedicaService],
    templateUrl: 'agendarCitaCentroMedico.form.template.html'
})



export class AgendarCitaCentroMedicoListComponent implements OnInit {

    suscription: any;

    idPersona: string;
    isDesplegar: boolean;
    numero: number;

    contratoKey: ContratoKey;
    beneficiarioSelected: Beneficiario;
    datosAgendar: AgendarCitaKey
    filter: CitaMedicaFilter;
    horarioSeleccionado: HorarioMedicoEntity;
    prestadorSelected: MedicosEntity;
    regPaciente: RegistarPacienteKey;
    validarPaciente: ValidarPacienteKey;
    genero: Catalogo[];
    tipoDocumento: Catalogo[];
    centroMedico: CentroMedicoEntity;
    listaCentroMedico: CentroMedico[];


    beneficiarios: Beneficiario[];
    beneficiariosOriginales: Beneficiario[];

    ciudades: CiudadEntity[];
    especialidades: EspecialidadEntity[];
    horarios: HorarioMedicoEntity[];
    prestadores: MedicosEntity[];
    agendarKey: AgendarCitaKey;
    correo1: string;
    correo2: string;
    idHorario: string;
    actualizarRegistrar: boolean; //TRUE ---> REGISTRAR && FALSE ---> ACTUALIZAR

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
        private centroMedicoService: CentroMedicoService,
        private prestadorService: PrestadorService,
        private contratoList: AgendarCitaCentroMedicoContratoListComponent,
        private beneficiarioService: BeneficiarioService,
        private constantService: ConstantService,
        //public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
        public servicioCitaMedica: ServicioCitaMedicaService,
        public servicioGenerico: utilidadesGenericasService) {

        this.ciudades = [];
        this.especialidades = [];

        this.setearCatalogos();
        this.setear();
        this.contratoKey = new ContratoKey();
        this.centroMedico = new CentroMedicoEntity();
        this.listaCentroMedico = [];

        this.suscription = this.contratoList.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined && contratoKey.CodigoContrato != undefined) {
                    this.contratoKey = contratoKey;
                    this.obtenerEspecialidades();
                }
            }
        );
    }

    ngOnInit(): void {
        this.cargarCentrosMedicos();
    }

    ngOnDestroy() {
        if (this.suscription != undefined)
            this.suscription.unsubscribe();
    }

    setearCatalogos() {
        this.genero = [];
        var valor = new Catalogo;
        valor.Codigo = "M";
        valor.Valor = "Masculino";
        this.genero.push(valor);

        valor = new Catalogo;
        valor.Codigo = "F";
        valor.Valor = "Femenino";
        this.genero.push(valor);

        this.tipoDocumento = [];
        valor = new Catalogo;
        valor.Codigo = "C";
        valor.Valor = "Cédula";
        this.tipoDocumento.push(valor);

        valor = new Catalogo;
        valor.Codigo = "P";
        valor.Valor = "Pasaporte";
        this.tipoDocumento.push(valor);
    }

    setear() {
        this.actualizarRegistrar = false;
        this.idPersona = undefined;
        this.isDesplegar = false;
        this.numero = 0;

        this.agendarKey = new AgendarCitaKey();
        this.beneficiarioSelected = new Beneficiario();
        this.datosAgendar = new AgendarCitaKey();
        this.filter = new CitaMedicaFilter();
        this.filter.CodigoCiudad = undefined;
        this.filter.CodigoEspecialidad = undefined;
        this.filter.Fecha = new Date();
        this.horarioSeleccionado = new HorarioMedicoEntity();
        this.prestadorSelected = new MedicosEntity();
        this.regPaciente = new RegistarPacienteKey();
        this.validarPaciente = new ValidarPacienteKey();

        this.beneficiarios = [];
        this.beneficiariosOriginales = [];
        this.horarios = [];
        this.prestadores = []
    }

    obtenerEspecialidades() {
        this.servicioCitaMedica.obtenerEspecialidades().subscribe(
            result => {
                this.especialidades = result;
                this.loadCiudades();
            },
            error => this.authService.showErrorPopup(error));
    }

    loadCiudades(): void {
        this.servicioCitaMedica.obtenerCiudades().subscribe(
            result => {
                this.ciudades = result;
                this.servicioCitaMedica.resetDefaultPaginationConstanst();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadBeneficiario() {
        this.beneficiarios = [];
        this.beneficiariosOriginales = [];
        this.filter.CodigoContrato = this.contratoKey.CodigoContrato;
        this.filter.NumeroContrato = this.contratoKey.NumeroContrato;

        if (this.filter != undefined) {
            this.beneficiarioService.getBeneficiarioAutorizacion(this.filter).subscribe(
                beneficiarios => {
                    this.beneficiarios = beneficiarios;
                    if (this.beneficiarios != undefined && this.beneficiarios.length > 0) {
                        this.beneficiarios.forEach(element => {
                            if (element.Estado == "Activo") {
                                this.beneficiariosOriginales.push(element);
                            }
                        });
                    }

                    this.beneficiarios = this.beneficiariosOriginales;
                    if (this.beneficiarios.length == 0) {
                        this.authService.showErrorPopup("El contrato no posee beneficiarios Activos");
                    }
                    else {
                        $("#beneficiarioViewModal").modal();
                    }
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    seleccionarBeneficiario(ben: Beneficiario) {
        this.beneficiarioSelected = ben;
        jQuery("#beneficiarioViewModal").modal("hide");
    }

    filtarBeneficiarios(searchValue: string) {
        if (this.beneficiarios != undefined && this.beneficiarios.length > 0) {
            var a = this.beneficiariosOriginales.filter(item => item.NombreCompleto.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.beneficiarios = a;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.beneficiarios = this.beneficiariosOriginales;
        }
    }

    buscar(): void {
        this.filter.CodigoCentroMedico = this.centroMedico.idCentroMedico;
        this.filter.CodigoPlan = this.contratoKey.Plan;
        this.filter.CodigoProducto = this.contratoKey.CodigoProducto;
        this.filter.Nivel = this.contratoKey.NivelReferencia;
        if (this.beneficiarioSelected.Genero.toUpperCase() == "MASCULINO") {
            this.filter.Genero = "M";
        }
        else {
            this.filter.Genero = "F";
        }
        this.filter.FechaNacimiento = this.servicioGenerico.convertStringToDate(this.beneficiarioSelected.FechaNacimiento);

        this.servicioCitaMedica.consultarMedicosPorEspecialidadFecha(this.filter).subscribe(
            result => {
                this.prestadores = result;
            },
            error => {
                this.authService.showErrorPopup(error);
                this.servicioCitaMedica.resetDefaultPaginationConstanst();
                this.prestadores = [];
            }
        );

    }

    cargarCentrosMedicos() {
        this.servicioCitaMedica.centroMedico().subscribe(
            respuestaCentroMedico => {
                this.listaCentroMedico = respuestaCentroMedico;
            }
        );
    }

    pageChanged() {
        this.buscar();
    }

    /*Proceso de validacion del paciente*/

    validacionPaciente(): boolean {
        //VERIFICO EL TIPO DE DOCUMETNO
        if (this.beneficiarioSelected.NumeroCedula != undefined && this.beneficiarioSelected.NumeroCedula != "") {
            this.validarPaciente.TipoDocumento = "C";
            this.validarPaciente.NumeroDocumento = this.beneficiarioSelected.NumeroCedula;
        }
        else {
            if (this.beneficiarioSelected.NumeroPasaporte != undefined) {
                this.validarPaciente.TipoDocumento = "P";
                this.validarPaciente.NumeroDocumento = this.beneficiarioSelected.NumeroPasaporte;
            }
            else {
                this.validarPaciente.TipoDocumento = undefined;
            }
        }

        if (this.validarPaciente.TipoDocumento != undefined) {
            return true;
        }
        else {
            this.authService.showInfoPopup("El paciente seleccionado no posee Identificación");
            return false;
        }
    }

    procesoValidacionPaciente(prestador: MedicosEntity) {

        this.correo1 = undefined;
        this.correo2 = undefined;
        this.idHorario = undefined;

        this.prestadorSelected = new MedicosEntity();
        this.prestadorSelected = prestador;

        this.validarPaciente = new ValidarPacienteKey();
        this.validarPaciente.CodigoCentroMedico = prestador.idCentroMedico;

        this.regPaciente = new RegistarPacienteKey();

        if (this.validacionPaciente()) {
            this.validarPaciente.CodigoCentroMedico = prestador.idCentroMedico;

            this.servicioCitaMedica.validarPaciente(this.validarPaciente).subscribe(
                result => {
                    this.idPersona = result.IdPersona;
                    if (this.idPersona == "") {
                        this.actualizarRegistrar = true;
                        this.getDetalleBeneficiario(true);
                    }
                    else {
                        if (result.RequiereActualizar == true) {
                            this.actualizarRegistrar = false;
                            this.getDetalleBeneficiario(true);
                        }
                        else {
                            this.getDetalleBeneficiario(false);
                        }
                    }
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    getDetalleBeneficiario(registro: boolean) {
        var filtroBeneficiario = new BeneficiarioKey();
        filtroBeneficiario.NumeroPersona = this.beneficiarioSelected.NumeroPersona;
        filtroBeneficiario.CodigoContrato = this.contratoKey.CodigoContrato;
        if (this.filter != undefined) {
            this.beneficiarioService.getOneBeneficiarioByKey(filtroBeneficiario).subscribe(
                result => {
                    this.cargaDatosPaciente(result);
                    if (registro) {
                        this.correo1 = this.regPaciente.correoElectronico;
                        $("#registroPacienteViewModal").modal();
                    } else {
                        if (this.beneficiarioSelected.TrabajoEmail == undefined || this.beneficiarioSelected.TrabajoEmail == "") {
                            this.correo1 = this.beneficiarioSelected.DomicilioMail;
                        }
                        else {
                            this.correo1 = this.beneficiarioSelected.TrabajoEmail;
                        }
                        this.modalHorarios();
                    }
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    cargaDatosPaciente(ben: Beneficiario) {

        this.beneficiarioSelected = new Beneficiario();
        this.beneficiarioSelected = ben;
        this.regPaciente = new RegistarPacienteKey();
        this.regPaciente.idCentroMedico = this.prestadorSelected.idCentroMedico;
        this.regPaciente.tipoDocumento = this.validarPaciente.TipoDocumento;
        this.regPaciente.numeroDocumento = this.validarPaciente.NumeroDocumento;
        this.regPaciente.numeroCelular = this.beneficiarioSelected.TelefonoMovil;
        this.regPaciente.clave = this.beneficiarioSelected.FechaNacimiento;
        this.regPaciente.repetirClave = this.beneficiarioSelected.FechaNacimiento;
        this.regPaciente.fechaNacimiento = new Date(this.beneficiarioSelected.FechaNacimientoDate);

        if (this.beneficiarioSelected.Genero.toUpperCase() == "MASCULINO") {
            this.regPaciente.genero = "M";
        }
        else {
            this.regPaciente.genero = "F";
        }

        if (this.beneficiarioSelected.TrabajoEmail == undefined || this.beneficiarioSelected.TrabajoEmail == "") {
            this.regPaciente.correoElectronico = this.beneficiarioSelected.DomicilioMail;
        }
        else {
            this.regPaciente.correoElectronico = this.beneficiarioSelected.TrabajoEmail;
        }

        var splitNombres = this.beneficiarioSelected.Nombres.split(" ");
        var splitApellidos = this.beneficiarioSelected.Apellidos.split(" ");

        if (splitNombres.length == 2) {
            this.regPaciente.primerNombre = splitNombres[0];
            this.regPaciente.segundoNombre = splitNombres[1];
        }
        else {
            this.regPaciente.primerNombre = this.beneficiarioSelected.Nombres;
        }

        if (splitApellidos.length == 2) {
            this.regPaciente.primerApellidos = splitApellidos[0];
            this.regPaciente.segundoApellidos = splitApellidos[1];
        }
        else {
            this.regPaciente.primerApellidos = this.beneficiarioSelected.Apellidos;
        }


    }

    registroPaciente() {
        if (this.regPaciente.segundoApellidos == "" || this.regPaciente.segundoApellidos == undefined) {
            this.regPaciente.segundoApellidos = " ";
        }
        if (this.regPaciente.segundoNombre == "" || this.regPaciente.segundoNombre == undefined) {
            this.regPaciente.segundoNombre = " ";
        }
        this.servicioCitaMedica.registrarPaciente(this.regPaciente).subscribe(
            result => {
                this.idPersona = result.IdPersona;
                this.salirModalRegistro();
                this.modalHorarios();
            },
            error => this.authService.showErrorPopup(error)
        )
    }

    actualizarPaciente() {
        this.regPaciente.idPaciente = this.idPersona;
        this.regPaciente.clave = undefined;
        this.regPaciente.repetirClave = undefined;

        if (this.regPaciente.segundoApellidos == "" || this.regPaciente.segundoApellidos == undefined) {
            this.regPaciente.segundoApellidos = " ";
        }
        if (this.regPaciente.segundoNombre == "" || this.regPaciente.segundoNombre == undefined) {
            this.regPaciente.segundoNombre = " ";
        }
        this.servicioCitaMedica.actualizarPaciente(this.regPaciente).subscribe(
            result => {
                this.idPersona = result.IdPersona;
                this.salirModalRegistro();
                this.modalHorarios();
            },
            error => this.authService.showErrorPopup(error)
        )
    }

    /* Fin Proceso de validacion del paciente*/

    modalHorarios() {
        this.horarios = [];
        var filtro = new CitaMedicaFilter();
        filtro.CodigoCiudad = this.filter.CodigoCiudad;
        filtro.CodigoCentroMedico = this.prestadorSelected.idCentroMedico;
        filtro.CodigoEspecialidad = this.filter.CodigoEspecialidad;
        filtro.CodigoMedico = this.prestadorSelected.codigoMedico;
        filtro.Fecha = this.filter.Fecha;
        filtro.CodigoPlan = this.contratoKey.Plan;
        filtro.CodigoProducto = this.contratoKey.CodigoProducto

        this.servicioCitaMedica.consultarCitasDisponiblesPorMedicoFecha(filtro).subscribe(
            result => {
                if (result.length != undefined && result.length > 0) {
                    this.horarios = result;
                    this.numero = Math.trunc(result.length / 5);
                    $("#myModalHorarios").modal();
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    salirModalHorarios() {
        $('#myModalHorarios').modal('hide');
    }

    salirModalRegistro() {
        $('#registroPacienteViewModal').modal('hide');
    }


    limpiar(): void {
        this.filter.CodigoCiudad = undefined;
        this.filter.CodigoEspecialidad = undefined;
        this.filter.Fecha = new Date();
        this.beneficiarioSelected = new Beneficiario();
        this.prestadores = [];
        this.servicioCitaMedica.resetDefaultPaginationConstanst();
    }


    agendarCita() {
        this.agendarKey.numeroTitularContrato = this.contratoKey.NumeroPersona;
        this.agendarKey.codigoContrato = this.contratoKey.CodigoContrato;
        this.agendarKey.numeroContrato = this.contratoKey.NumeroContrato;
        this.agendarKey.IdPersona = this.idPersona;
        this.agendarKey.numeroPersonaPaciente = this.beneficiarioSelected.NumeroPersona;
        this.agendarKey.nombrePaciente = this.beneficiarioSelected.NombreCompleto;
        this.agendarKey.idCentroMedico = this.prestadorSelected.idCentroMedico;
        this.agendarKey.codigoMedico = this.prestadorSelected.codigoMedico;
        this.agendarKey.nombreMedicoPrestador = this.prestadorSelected.nombreMedico;
        this.agendarKey.codigoSucursal = this.horarioSeleccionado.codigoSucursal;
        this.agendarKey.nombreSucursalCentroMedico = this.horarioSeleccionado.nombreSucursal;
        this.agendarKey.idHorarioDisponible = this.horarioSeleccionado.idHorarioDisponible;
        this.agendarKey.fechaDate = this.filter.Fecha;
        this.agendarKey.hora = this.horarioSeleccionado.horaInicio;
        this.agendarKey.duracion = this.servicioGenerico.devolverMinutosentreHoras(this.horarioSeleccionado.horaInicio, this.horarioSeleccionado.horaFin);
        this.agendarKey.codigoPlataforma = undefined;
        this.agendarKey.codigoEspecialidad = this.horarioSeleccionado.codigoEspecialidad;
        this.agendarKey.idTurno = this.horarioSeleccionado.idTurno;
        this.agendarKey.costoCita = this.horarioSeleccionado.costoServicio;
        this.agendarKey.correoNotificacion = this.correo1;

        this.servicioCitaMedica.agendarCitaMedica(this.agendarKey).subscribe(
            result => {
                if (result.respuesta == true) {
                    $('#myModalHorarios').modal('hide');
                    this.getMensaje(result.codigoCita);
                    //this.buscar();
                }
                else {
                    this.authService.showErrorPopup(result.mensaje);
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    getMensaje(codigoCita: any): void {
        this.authService.showSuccessPopup(
            "<h4>¡Tu cita código " + codigoCita + " en " + this.prestadorSelected.nombreCentroMedico + " ha sido agendada con éxito!</h4>" +
            "<div class='panel panel-success'>" +
            "   <h4>Información de tu cita</h4>" +
            "   <center>" +
            "   <table width='90%'>" +
            "       <tr>" +
            "           <td align='left' ><h4>Médico: </h4></td>" +
            "           <td align='left' ><h5>" + this.prestadorSelected.nombreMedico + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Especialidad: </h4></td>" +
            "           <td align='left' ><h5>" + this.getEspecialidad() + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Paciente: </h4></td>" +
            "           <td align='left' ><h5>" + this.beneficiarioSelected.NombreCompleto + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Fecha: </h4></td>" +
            "           <td align='left' ><h5>" + this.horarioSeleccionado.fecha + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Hora: </h4></td>" +
            "           <td align='left' ><h5>" + this.horarioSeleccionado.horaInicio + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Centro: </h4></td>" +
            "           <td align='left' ><h5>" + this.prestadorSelected.nombreCentroMedico + "</h5></td>" +
            "       </tr>" +
            "       <tr>" +
            "           <td align='left' ><h4>Sucursal: </h4></td>" +
            "           <td align='left' ><h5>" + this.horarioSeleccionado.nombreSucursal + "</h5></td>" +
            "       </tr>" +
            "   </table>" +
            "   </center>" +
            " </div>" +
            "<h5>Recibirás una confirmación de tu cita en tu correo electrónico.</h5>");
    }

    getEspecialidad(): string {

        var especialidad;

        this.especialidades.forEach(element => {
            if (this.filter.CodigoEspecialidad == element.codigoEspecialidad) {
                especialidad = element.nombreEspecialidad;
            }
        });
        return especialidad;
    }


    confirmar() {
        if (this.horarioSeleccionado.horaInicio != undefined) {
            this.showPopupResultadoConfirm("Esta seguro que desea Agendar la cita de " + this.horarioSeleccionado.horaInicio + " a " + this.horarioSeleccionado.horaFin)
        } else {
            this.authService.showErrorPopup("Debe seleccionar un horario");
        }
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
                    this.agendarCita();
                }

            });
    }

}
