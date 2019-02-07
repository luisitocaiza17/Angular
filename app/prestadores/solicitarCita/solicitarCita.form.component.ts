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
import { ConstantService } from '../../utils/constant.service';

import { EspecialidadEntity } from '../../common/model/especialidadVeris';
import { Ciudad, CiudadEntity } from '../../common/model/ciudad';
import { Catalogo, CatalogoGenericoEntity } from '../../common/model/catalogo';
import { ContratoKey } from '../../common/model/contrato';
import { CitaMedicaFilter, MedicosEntity, AgendarCitaKey, MedicoDestacadoEntity, SolicitarCitaDestacadoKey } from '../../common/model/cita';
import { MedicosFilter } from '../../common/model/prestador';
import { SolicitarCitaContratoListComponent } from './../solicitarCita/solicitarCitaContrato.list.component';
import { BeneficiarioKey, Beneficiario, BeneficiarioPaciente, } from '../../common/model/beneficiario';
import { ServicioCitaMedicaService } from '../../common/servicios/sevicioCitaMedica.service';


@Component({
    selector: 'solicitarCita',
    providers: [ServicioCitaMedicaService],
    templateUrl: 'solicitarCita.form.template.html'
})

export class SolicitarCitaFormComponent implements OnInit {

    suscription: any;

    isDesplegar: boolean;
    contratoKey: ContratoKey;
    beneficiarioSelected: Beneficiario;
    datosAgendar: AgendarCitaKey;
    filter: CitaMedicaFilter;
    prestadoresSeleccionado: MedicoDestacadoEntity;

    beneficiarios: Beneficiario[];
    beneficiariosOriginales: Beneficiario[];
    ciudades: CiudadEntity[];
    especialidades: EspecialidadEntity[];
    jornadas: CatalogoGenericoEntity[];
    prestadores: MedicoDestacadoEntity[]

    casoFecha1: boolean;
    casoFecha2: boolean;
    casoFecha3: boolean;
    codigoJornada: number;
    observaciones: string;
    fechaHasta: Date;

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
        private contratoList: SolicitarCitaContratoListComponent,
        private beneficiarioService: BeneficiarioService,
        private constantService: ConstantService,
        public servicioCitaMedica: ServicioCitaMedicaService,
    ) {

        this.setear();
        this.contratoKey = new ContratoKey();
        this.suscription = this.contratoList.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined && contratoKey.CodigoContrato != undefined) {
                    this.contratoKey = contratoKey;
                    this.loadJornadas();
                }
            }
        );
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        if (this.suscription != undefined)
            this.suscription.unsubscribe();
    }

    colapsarTab(): void {
        this.isDesplegar = false;
    }


    setear() {
        this.beneficiarioSelected = new Beneficiario();
        this.datosAgendar = new AgendarCitaKey();
        this.filter = new CitaMedicaFilter();
        this.prestadoresSeleccionado = new MedicoDestacadoEntity();

        this.beneficiarios = [];
        this.beneficiariosOriginales = [];
        this.ciudades = [];
        this.especialidades = [];
        this.jornadas = [];
        this.prestadores = [];

        this.casoFecha1 = true;
        this.casoFecha2 = false;
        this.casoFecha3 = false;
        this.codigoJornada = undefined;
        this.observaciones = undefined;

        this.filter.CodigoCiudad = undefined;
        this.filter.CodigoEspecialidad = undefined;

        this.fechaHasta = new Date();
        this.fechaHasta.setDate(this.fechaHasta.getDate() + 2);
    }


    loadJornadas() {
        this.catalogoService.getCatalogoById("JORDIA").subscribe(
            result => {
                this.jornadas = result;
                this.loadEspecialidades();
            },
            error => this.authService.showErrorPopup(error));
    }


    loadEspecialidades(): void {
        if (this.especialidades == undefined || this.especialidades.length == 0) {
            this.servicioCitaMedica.obtenerEspecialidades().subscribe(
                result => {
                    this.especialidades = result;
                    this.loadCiudades();
                },
                error => this.authService.showErrorPopup(error));
        }
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

    filtarBeneficiarios(searchValue: string) {
        if (this.beneficiarios != undefined && this.beneficiarios.length > 0) {
            var a = this.beneficiariosOriginales.filter(item => item.NombreCompleto.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.beneficiarios = a;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.beneficiarios = this.beneficiariosOriginales;
        }
    }

    seleccionarBeneficiario(ben: Beneficiario) {
        this.beneficiarioSelected = ben;
        this.getDetalleBeneficiario();
        jQuery("#beneficiarioViewModal").modal("hide");
    }

    getDetalleBeneficiario() {

        var filtroBeneficiario = new BeneficiarioKey();
        filtroBeneficiario.NumeroPersona = this.beneficiarioSelected.NumeroPersona;
        filtroBeneficiario.CodigoContrato = this.contratoKey.CodigoContrato;
        if (this.filter != undefined) {
            this.beneficiarioService.getOneBeneficiarioByKey(filtroBeneficiario).subscribe(
                result => {
                    if (result != undefined) {
                        this.beneficiarioSelected.TelefonoDomicilio = result.TelefonoDomicilio;
                        this.beneficiarioSelected.TelefonoMovil = result.TelefonoMovil;
                        if (result.DomicilioMail != undefined && result.DomicilioMail != undefined) {
                            this.beneficiarioSelected.Mail = result.DomicilioMail;
                        }
                        else {
                            this.beneficiarioSelected.Mail = result.TrabajoEmail;
                        }
                    }
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }


    buscar(): void {

        var filtroMedicosDestacados = new MedicosFilter();

        filtroMedicosDestacados.CodigoCiudad = parseInt(this.filter.CodigoCiudad);
        filtroMedicosDestacados.NumeroPersonaBeneficiario = this.beneficiarioSelected.NumeroPersona;
        filtroMedicosDestacados.codigoEspecialidad = this.filter.CodigoEspecialidad;
        filtroMedicosDestacados.CodigoContrato = this.contratoKey.CodigoContrato;
        filtroMedicosDestacados.NivelDesde = 1;
        filtroMedicosDestacados.NivelHasta = 0;
        filtroMedicosDestacados.TipoCliente = 1;
        filtroMedicosDestacados.ValorConsulta = 0;



        this.servicioCitaMedica.medicos(filtroMedicosDestacados).subscribe(
            result => {
                this.prestadores = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    pageChanged() {
        this.buscar();
    }

    onSelectionChange(numero: number) {
        if (numero == 1) {
            this.casoFecha2 = false;
            this.casoFecha3 = false;

            this.fechaHasta = new Date();
            this.fechaHasta.setDate(this.fechaHasta.getDate() + 2);
        }
        if (numero == 2) {
            this.casoFecha1 = false;
            this.casoFecha3 = false;

            this.fechaHasta = new Date();
            this.fechaHasta.setDate(this.fechaHasta.getDate() + 8);
        }
        if (numero == 3) {
            this.casoFecha1 = false;
            this.casoFecha2 = false;

            this.fechaHasta = new Date();
        }
    }

    solicitar(prestador: MedicoDestacadoEntity) {
        this.prestadoresSeleccionado = new MedicoDestacadoEntity();
        this.prestadoresSeleccionado = prestador;
        $("#myModalAgendar").modal();
    }


    limpiar(): void {
        this.filter.CodigoCiudad = undefined;
        this.filter.CodigoEspecialidad = undefined;
        this.beneficiarioSelected = new Beneficiario();
        this.prestadores = [];
        this.servicioCitaMedica.resetDefaultPaginationConstanst();
    }

    solicitarCitaDestacado() {

        var solocitarKey = new SolicitarCitaDestacadoKey();

        solocitarKey.id = 0;
        solocitarKey.codigoContrato = this.contratoKey.CodigoContrato;
        solocitarKey.numeroContrato = this.contratoKey.NumeroContrato;
        solocitarKey.numeroPersonaPaciente = this.beneficiarioSelected.NumeroPersona;
        solocitarKey.convenioMedicoPrestador = this.prestadoresSeleccionado.Numero;
        solocitarKey.correoElectronico = this.beneficiarioSelected.Mail;
        solocitarKey.telefono = this.beneficiarioSelected.TelefonoDomicilio;
        solocitarKey.telefonoCelular = this.beneficiarioSelected.TelefonoMovil;
        solocitarKey.fechaDesde = new Date();
        solocitarKey.fechaHasta = this.fechaHasta;
        solocitarKey.jornada = this.codigoJornada;
        solocitarKey.observaciones = this.observaciones;
        solocitarKey.numeroTitularContrato = this.contratoKey.NumeroPersona;
        solocitarKey.codigoEspecialidad = this.prestadoresSeleccionado.CodigoEspecialidad;

        if (this.validar(solocitarKey)) {
            this.servicioCitaMedica.solicitarCitaMedicoDestacado(solocitarKey).subscribe(
                result => {
                    if (result.respuesta) {
                        this.authService.showSuccessPopup("Se ha realizado la solicitud #"+result.idSolicitud);
                        this.salir();
                    }
                    else {
                        this.authService.showErrorPopup("Ha ocurrido un error");
                    }
                },
                error => this.authService.showErrorPopup(error)
            );
        }
        else {
            this.authService.showErrorPopup("Completar todos los campos")
        }
    }

    validar(solocitarKey: SolicitarCitaDestacadoKey): boolean {

        if (solocitarKey.telefono == undefined || solocitarKey.telefonoCelular == "") {
            return false;
        }

        if (solocitarKey.telefonoCelular == undefined || solocitarKey.telefonoCelular == "") {
            return false;

        } if (solocitarKey.correoElectronico == undefined || solocitarKey.correoElectronico == "") {
            return false;
        }

        if (this.casoFecha1 == false && this.casoFecha2 == false && this.casoFecha3 == false) {
            return false;
        }

        if (this.jornadas == undefined) {
            return false;
        }

        return true;
    }

    salir() {
        $('#myModalAgendar').modal('hide');
        this.observaciones = undefined;
        this.casoFecha2 = false;
        this.casoFecha3 = false;
        this.codigoJornada = undefined;
        this.fechaHasta = new Date();
        this.fechaHasta.setDate(this.fechaHasta.getDate() + 2);
    }
}
