import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../../seguridad/auth.service';

import { ConvenioService } from '../../common/servicios/convenio.service';
import { PersonaService } from '../../common/servicios/persona.service';
import { GenericosService } from '../../common/servicios/genericos.service';
import { CatalogoService } from '../../common/servicios/catalogo.service';
import { EmpresaService } from '../../common/servicios/empresa.service';

import { PrestadoresListComponent } from './prestadores.list.component';


import { ConvenioFilter, Convenio, TipoPrestador, DetalleConvenioEntity } from '../../common/model/convenio';
import { DatosBancoContrato } from '../../common/model/transacciones';
import { RelacionEnity, TipoSociedadEntity, PersonaGenero, TipoIdCuenta, TipoIdentificacionEntity, TipoEstadoEntity, TipoContribuyenteEntity, TipoCuentaEntity, TipoContribEspecialEntity, ComboSiNo, EstadoCivilEntity, TipoConvenioEntity, ComboSiNoInt, ZonaEntity, VariableEntornoCiudad, FilterBancos } from '../../common/model/genericos';
import { Catalogo, CatalogoProgressEntity } from '../../common/model/catalogo';
import { error } from 'selenium-webdriver';
import { FilterPersona, PersonaEntity } from '../../common/model/persona';
import { EmpresaFilter, Empresa } from '../../common/model/empresa';

@Component({
    selector: 'agregarConvenio',
    providers: [ConvenioService, GenericosService, PersonaService, EmpresaService],
    templateUrl: 'agregarConvenio.form.template.html'
})

export class AgregarConvenioFormComponent implements OnInit {

    suscription: any;

    convenio: DetalleConvenioEntity;
    ciudadEnt: number;
    empresa: Empresa;
    filterPersona: FilterPersona;
    filterEmpresa: EmpresaFilter;
    persona: PersonaEntity;

    descripcionAnulacion: string;
    desposita: number;
    investigacion: number;
    nombreEstado: string;
    pagoInteligente: number;
    retencion: number;
    tipoPrestador: string;

    actividades: Catalogo[]
    bancos: DatosBancoContrato[];
    ciudades: Catalogo[];
    ciudadEntorno: VariableEntornoCiudad[];
    comboSiNo: ComboSiNo[];
    comboSiNoInt: ComboSiNoInt[];
    estados: Catalogo[];
    estadoCivil: EstadoCivilEntity[];
    generoPersona: PersonaGenero[];
    listaEspe: Catalogo[];
    listaEmpresas: Empresa[];
    listaSubEspe: Catalogo[];
    listaPersonas: PersonaEntity[];
    motivosAnulacion: CatalogoProgressEntity[];
    motivosAnulacionOriginales: CatalogoProgressEntity[];
    relacionEmpresa: RelacionEnity[];
    tipoContribuyente: TipoContribuyenteEntity[];
    tipoCuenta: TipoCuentaEntity[];
    tipoConvenio: TipoConvenioEntity[];
    tiposIdentificacion: TipoIdentificacionEntity[];
    tiposEstado: TipoEstadoEntity[];
    tipoIdCuenta: TipoIdCuenta[];
    tipoContribEspecial: TipoContribEspecialEntity[];
    tipoPerMed: TipoPrestador[];
    tipoSociedad: TipoSociedadEntity[];
    tipoDocumento:number;
    zonas: ZonaEntity[];


    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    listaDocumentos: object =
    [
        {   id : 0, 
            descripcion : "Cédula", 
            estado : true
        },{
            id : 1, 
            descripcion : "Pasaporte",
            estado : false
        }
    ];
    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private convenioService: ConvenioService,
        private genericoService: GenericosService, private catalogoService: CatalogoService, private personaService: PersonaService,
        private empresaService: EmpresaService, private prestadorListComponet: PrestadoresListComponent) {
            this.tipoDocumento =0;
          
    }

    ngOnInit() {
        this.convenio = new DetalleConvenioEntity();
        this.empresa = new Empresa();
        this.filterPersona = new FilterPersona();
        this.filterEmpresa = new EmpresaFilter();
        this.persona = new PersonaEntity();

        this.ciudadEnt = undefined;
        this.descripcionAnulacion = undefined
        this.desposita = 1
        this.investigacion = 1
        this.nombreEstado = undefined
        this.pagoInteligente = 1
        this.retencion = 1
        this.tipoPrestador = undefined;

        this.actividades = [];
        this.bancos = [];
        this.ciudades = [];
        this.ciudadEntorno = [];
        this.comboSiNo = [];
        this.comboSiNoInt = [];
        this.estados = [];
        this.estadoCivil = [];
        this.generoPersona = [];
        this.listaEspe = [];
        this.listaEmpresas = [];
        this.listaSubEspe = [];
        this.listaPersonas = [];
        this.motivosAnulacion = [];
        this.motivosAnulacionOriginales = [];
        this.relacionEmpresa = [];
        this.tipoContribuyente = [];
        this.tipoCuenta = [];
        this.tipoConvenio = [];
        this.tiposIdentificacion = [];
        this.tiposEstado = [];
        this.tipoIdCuenta = [];
        this.tipoContribEspecial = [];
        this.tipoPerMed = [];
        this.tipoSociedad = [];
        this.zonas = [];

        this.cargarCombos();
        this.obtenerCiudades();

        $("#myModalTipoPrestador").modal();
    }


    //CARGA DE DATOS INICIALES

    obtenerCiudades() {
        this.catalogoService.getCiudadesForOdas().subscribe(
            result => {
                this.ciudades = result;
                this.obtenerActividades();
            }
        );
    }

    obtenerActividades() {
        this.genericoService.obtenerActividades().subscribe(
            result => {
                this.actividades = result;
                this.obtenerBanco();
            }
        );
    }

    obtenerBanco() {
        var filtroBancos = new FilterBancos();
        this.genericoService.GetCargarBancos(filtroBancos).subscribe(
            result => {
                this.bancos = result;
                this.listaEspecialidades();
            }
        );
    }

    listaEspecialidades() {
        this.genericoService.GetCargarEspecialidadesPorTipo(true).subscribe(
            result => {

                this.listaEspe = result;
                this.listaSubEspecialidades();
            }
        );
    }

    listaSubEspecialidades() {
        this.genericoService.GetCargarEspecialidadesPorTipo(false).subscribe(
            result => {
                this.listaSubEspe = result;
            }
        );
    }

    cargarCombos() {

        if (this.tiposIdentificacion == undefined || this.tiposIdentificacion.length == 0) {
            this.tiposIdentificacion = TipoIdentificacionEntity.values;
        }

        if (this.tiposEstado == undefined || this.tiposEstado.length == 0) {
            this.tiposEstado = TipoEstadoEntity.values;
        }

        if (this.tipoContribuyente == undefined || this.tipoContribuyente.length == 0) {
            this.tipoContribuyente = TipoContribuyenteEntity.values;
        }

        if (this.tipoCuenta == undefined || this.tipoCuenta.length == 0) {
            this.tipoCuenta = TipoCuentaEntity.values;
        }

        if (this.tipoContribEspecial == undefined || this.tipoContribEspecial.length == 0) {
            this.tipoContribEspecial = TipoContribEspecialEntity.values;
        }

        if (this.tipoConvenio == undefined || this.tipoConvenio.length == 0) {
            this.tipoConvenio = TipoConvenioEntity.values;
        }

        if (this.comboSiNo == undefined || this.comboSiNo.length == 0) {
            this.comboSiNo = ComboSiNo.values;
        }

        if (this.comboSiNoInt == undefined || this.comboSiNoInt.length == 0) {
            this.comboSiNoInt = ComboSiNoInt.values;
        }

        if (this.tipoIdCuenta == undefined || this.tipoIdCuenta.length == 0) {
            this.tipoIdCuenta = TipoIdCuenta.values;
        }

        if (this.tipoPerMed == undefined || this.tipoPerMed.length == 0) {
            this.tipoPerMed = TipoPrestador.values;
        }

        if (this.estadoCivil == undefined || this.estadoCivil.length == 0) {
            this.estadoCivil = EstadoCivilEntity.values;
        }

        if (this.generoPersona == undefined || this.generoPersona.length == 0) {
            this.generoPersona = PersonaGenero.values;
        }

        if (this.tipoSociedad == undefined || this.tipoSociedad.length == 0) {
            this.tipoSociedad = TipoSociedadEntity.values;
        }

        if (this.zonas == undefined || this.zonas.length == 0) {
            this.zonas = ZonaEntity.values;
        }

        if (this.relacionEmpresa == undefined || this.relacionEmpresa.length == 0) {
            this.relacionEmpresa = RelacionEnity.values;
        }

        if (this.ciudadEntorno == undefined || this.ciudadEntorno.length == 0) {
            this.ciudadEntorno = VariableEntornoCiudad.values;
        }
    }

    //FIN CARGA DATOS INICIALES


    /*BUSCAR DE PRESTADORES */
    buscarPersona() {

        if (this.validarBuscarPersona()) {
            this.personaService.buscarPersona(this.filterPersona).subscribe(
                result => {
                    this.listaPersonas = result;
                    $('#myModalListadoPersonas').modal();

                },
                error => this.authService.showErrorPopup(error)
            )
        }

    }

    buscarEmpresa() {
        if (this.filterEmpresa.RazonSocial == "") {
            this.filterEmpresa.RazonSocial = undefined;
        }

        if (this.filterEmpresa.RucEmpresa == "") {
            this.filterEmpresa.RucEmpresa = undefined;
        }

        this.empresaService.buscarEmpresa(this.filterEmpresa).subscribe(
            result => {
                this.listaEmpresas = result;
                $('#myModalListadoEmpresas').modal();

            },
            error => this.authService.showErrorPopup(error)
        )
    }
    /* FIN BUSCAR PRESTADORES*/

    /* EVENTOS MODAL PRESTADOR*/
    modalPrestadorMedico() {
        this.persona = new PersonaEntity();
        this.empresa = new Empresa();
        $('#myModalTipoPrestador').modal('hide');
        $('#myModalPrestadorEmpresa').modal('hide');
        $('#myModalPrestadorMedico').modal();
    }

    modalPrestadorEmpresa() {
        this.persona = new PersonaEntity();
        this.empresa = new Empresa();
        $('#myModalTipoPrestador').modal('hide');
        $('#myModalPrestadorEmpresa').modal();
    }

    modalTipoPrestador() {
        this.filterPersona = new FilterPersona();
        this.filterEmpresa = new EmpresaFilter();
        this.filterPersona.Cedula = undefined;
        this.filterPersona.Apellidos = undefined;
        this.filterPersona.Nombres = undefined;

        this.listaPersonas = [];
        this.listaEmpresas = [];
        $('#myModalPrestadorMedico').modal('hide');
        $('#myModalPrestadorEmpresa').modal('hide');
        $('#myModalTipoPrestador').modal();
    }

    salirTipoPrestador() {
        $('#myModalTipoPrestador').modal('hide');
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelActualizarConvenio").collapse("hide");
        jQuery("#divPanelInsertar").collapse("hide");
        jQuery("#divConsultar").collapse("show");
        this.prestadorListComponet.colapsarTab();
    }


    seleccionarPersona(persona: PersonaEntity) {
        this.persona = persona;
        this.persona.PersonaFechaNacimiento = new Date(this.persona.PersonaFechaNacimiento);
        $('#myModalListadoPersonas').modal('hide');
        $('#myModalTipoPrestador').modal('hide');
        $('#myModalPrestadorMedico').modal();
    }

    seleccionarEmpresa(empresa: Empresa) {
        this.empresa = empresa;
        $('#myModalListadoEmpresas').modal('hide');
        $('#myModalTipoPrestador').modal('hide');
        $('#myModalPrestadorEmpresa').modal();
    }
    /* FIN EVENTOS MODAL PRESTADOR*/


    /* ACTUALIZAR PRESTADORES*/
    actualizarPersona() {
        this.personaService.actualizaPersona(this.persona).subscribe(
            result => {
                this.authService.showSuccessPopup("Persona Actualizada");
                this.setearPrestadorMedico();

            },
            error => this.authService.showErrorPopup(error)
        )
    }

    actualizarEmpresa() {
        this.empresaService.actualizaEmpresa(this.empresa).subscribe(
            result => {
                this.authService.showSuccessPopup("Empresa Actualizada");
                this.setearPrestadorEmpresa();
            },
            error => this.authService.showErrorPopup(error)
        )
    }

    /*FIN ACTUALIZAR PRESTADORES*/

    /*INSERTAR  PRESTADORES*/

    registarPersona() {
        this.persona.CiudadEntorno = this.ciudadEnt;
        this.personaService.registarPersona(this.persona).subscribe(
            result => {
                this.authService.showSuccessPopup("Persona Registrada Correctamente");
                this.persona.NumeroPersona = result;
                this.setearPrestadorMedico();
            },
            error => this.authService.showErrorPopup(error)
        )
    }

    registarEmpresa() {
        this.empresa.CiudadEntorno = this.ciudadEnt;
        this.empresaService.registarEmpresa(this.empresa).subscribe(
            result => {
                this.authService.showSuccessPopup("Empresa Registrada Correctamente");
                this.empresa.EmpresaNumero = result;
                this.setearPrestadorEmpresa();
            },
            error => this.authService.showErrorPopup(error)
        )
    }
    /*FIN INSERTAR  PRESTADORES*/


    /*PRECARGAR DATOS CONVENIO */

    setearPrestadorMedico() {
        jQuery("#myModalPrestadorMedico").modal("hide");
        this.convenio = new Convenio();
        this.convenio.NombrePrestador = this.persona.PersonaNombres + " " + this.persona.PersonaApellidos;
        this.convenio.PersonaNumero = this.persona.NumeroPersona;
        this.convenio.Rucins = this.persona.CedulaPersona;
        this.convenio.TipoPrestador = this.tipoPrestador;
        this.convenio.EmpresaNumero = 0;
        this.convenio.EstadoConvenio = 1;
        this.nombreEstado = "ACTIVO";
        this.cargarInicialesConvenio();
    }

    setearPrestadorEmpresa() {
        jQuery("#myModalPrestadorEmpresa").modal("hide");
        this.convenio = new Convenio();
        this.convenio.NombrePrestador = this.empresa.RazonSocial;
        this.convenio.EmpresaNumero = this.empresa.EmpresaNumero;
        this.convenio.Rucins = this.empresa.RucEmpresa;
        this.convenio.TipoPrestador = this.tipoPrestador;
        this.convenio.PersonaNumero = 0;
        this.convenio.EstadoConvenio = 1;
        this.nombreEstado = "ACTIVO";
        this.cargarInicialesConvenio();
    }

    cargarInicialesConvenio(){
        this.convenio.TrabajoHospital = false;
        this.convenio.TrabajoClinica = false;
        this.convenio.TrabajoConsultorio = false;
        this.convenio.SociedaC = false;
        this.convenio.Investigacion = false;
        this.convenio.EsRecomendado = false;
        this.convenio.Masivos = false;
        this.convenio.Staff = false;
        this.convenio.DsctoProntoPago = false;
        this.convenio.DsctoRubrosFijos = false;
        this.convenio.Deposita = false;
        this.convenio.EmiteOda = false;
        this.convenio.PlanEspecial = false;
        this.convenio.ObligadoContabilidad = false;
        this.convenio.Retencion = false;
        this.convenio.AgendarCitas = false;
        this.convenio.EsRedPreferente=false;
    }

    /*FIN DATOS CONVENIO */


    /*CONEVIO*/

    seleccionarMotivo(motivo: CatalogoProgressEntity) {
        this.convenio.CodigoMotivoAnulacion = motivo.Codigo;
        this.descripcionAnulacion = motivo.Descripcion;
        jQuery("#motivosAnulacionViewModal").modal("hide");
    }

    filtrarMotivos(searchValue: string) {
        if (this.motivosAnulacion != undefined && this.motivosAnulacion.length > 0) {
            var litaFiltrada = this.motivosAnulacionOriginales.filter(item => item.Descripcion.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.motivosAnulacion = litaFiltrada;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.motivosAnulacion = this.motivosAnulacionOriginales;
        }
    }

    abrirModalMotivos() {
        $("#motivosAnulacionViewModal").modal();
    }

    loadEspecialidades() {
        if (this.convenio.ListaEspecialidades != "" && this.convenio.ListaEspecialidades != undefined && this.convenio.ListaEspecialidades != null) {
            var convenios = this.convenio.ListaEspecialidades.split(",");

            convenios.forEach(convenio => {
                this.listaEspe.forEach(element => {
                    if (convenio == element.CodigoProgress) {
                        element.Selected = true;
                    }
                });
            });

            convenios.forEach(convenio => {
                this.listaSubEspe.forEach(element => {
                    if (convenio == element.CodigoProgress) {
                        element.Selected = true;
                    }
                });
            });
        }

        $("#myModalEspecialidades").modal();
    }

    salirEspecialidades() {
        $('#myModalEspecialidades').modal('hide');
    }

    seleccionarEspecialidad(especialidad: Catalogo) {

        if (especialidad.Selected == true) {
            especialidad.Selected = false;
            this.listaEspe.forEach(element => {
                if (element.CodigoProgress == especialidad.CodigoProgress) {
                    element.Selected = false;
                }
            })
        }
        else {
            especialidad.Selected = true;
            this.listaEspe.forEach(element => {
                if (element.CodigoProgress == especialidad.CodigoProgress) {
                    element.Selected = true;
                }
            })
        }
    }

    seleccionarSubEspecialidad(subEspecialidad: Catalogo) {

        if (subEspecialidad.Selected == true) {
            subEspecialidad.Selected = false;
            this.listaSubEspe.forEach(element => {
                if (element.CodigoProgress == subEspecialidad.CodigoProgress) {
                    element.Selected = false;
                }
            })
        }
        else {
            subEspecialidad.Selected = true;
            this.listaSubEspe.forEach(element => {
                if (element.CodigoProgress == subEspecialidad.CodigoProgress) {
                    element.Selected = true;
                }
            })
        }
    }

    guardarListaEspecialidades() {

        this.convenio.ListaEspecialidades = undefined;

        this.listaEspe.forEach(element => {
            if (element.Selected == true) {
                if (this.convenio.ListaEspecialidades == undefined) {
                    this.convenio.ListaEspecialidades = element.CodigoProgress;
                }
                else {
                    this.convenio.ListaEspecialidades = this.convenio.ListaEspecialidades + ", " + element.CodigoProgress;
                }
            }
        });

        this.listaSubEspe.forEach(element => {
            if (element.Selected == true) {
                if (this.convenio.ListaEspecialidades == undefined) {
                    this.convenio.ListaEspecialidades = element.CodigoProgress;
                }
                else {
                    this.convenio.ListaEspecialidades = this.convenio.ListaEspecialidades + ", " + element.CodigoProgress;
                }
            }
        });

        this.salirEspecialidades();
    }



    changeTrabajoHospita() {
        if (this.convenio.TrabajoHospital.toString() == "false") {
            this.convenio.TiempoHospital = 0;
        }
    }

    changeTrabajoClinica() {
        if (this.convenio.TrabajoClinica.toString() == "false") {
            this.convenio.TiempoClinica = 0;
        }
    }

    changeConsultorio() {
        if (this.convenio.TrabajoConsultorio.toString() == "false") {
            this.convenio.TiempoConsultorio = 0;
        }
    }

    changePlanEspecial() {
        if (this.convenio.PlanEspecial.toString() == "false") {
            this.convenio.NivelEspecial = 0;
        }
    }

    changeTipoContribuyente() {
        if (this.convenio.TipoContribuyente == 3 || this.convenio.ContribuyenteEspecial == 3) {
            this.retencion = 1;
        }
        else {
            this.retencion = 2;
        }
    }

    changeStaff() {
        if (this.convenio.Staff.toString() == "false") {
            this.convenio.Receptor = undefined;
        }
    }

    changeInvestigacion() {
        if (this.investigacion == 1) {
            this.convenio.SobreQue = undefined;
        }
    }

    changePagoInteligente() {
        if (this.pagoInteligente == 1) {
            this.convenio.CodigoBanco = undefined;
            this.convenio.NumeroCuenta = undefined;
            this.convenio.TipoCuenta = undefined;
            this.convenio.IdCuenta = undefined;
            this.convenio.TipoIdCuenta = undefined;
        }
    }

    validarBuscarPersona(): boolean {
        if (this.filterPersona.Cedula == undefined || this.filterPersona.Cedula == "") {
            this.filterPersona.Cedula = undefined;
        }
        if (this.filterPersona.Apellidos == undefined || this.filterPersona.Apellidos == "") {
            this.filterPersona.Apellidos = undefined;
        }

        if (this.filterPersona.Nombres == undefined || this.filterPersona.Nombres == "") {
            this.filterPersona.Nombres = undefined;
        }

        if ((this.filterPersona.Nombres != undefined && this.filterPersona.Apellidos == undefined) || (this.filterPersona.Apellidos != undefined && this.filterPersona.Nombres == undefined)) {
            this.authService.showErrorPopup("Debe filtrar por nombres y apellidos");
            return false;
        }
        return true;
    }


    insertarConvenio() {
        if (this.retencion == 1) {
            this.convenio.Retencion = false;
        }
        else {
            this.convenio.Retencion = true;
        }

        if (this.investigacion == 1) {
            this.convenio.Investigacion = false;
        }
        else {
            this.convenio.Investigacion = true;
        }

        if (this.pagoInteligente == 1) {
            this.convenio.Deposita = false;
        }
        else {
            this.convenio.Deposita = true;
        }

        this.convenio.CiudadEntorno = this.ciudadEnt;
        if (this.validar()) {
            this.convenioService.insertarConvenio(this.convenio).subscribe(
                result => {
                    this.authService.showSuccessPopup("Se ha ingresado el convenio #" + result);
                    jQuery("#divConsultar").collapse("hide");
                    jQuery("#divPanelActualizarConvenio").collapse("hide");
                    jQuery("#divPanelInsertar").collapse("hide");
                    jQuery("#divConsultar").collapse("show");
                    this.prestadorListComponet.colapsarTab();
                },
                error => this.authService.showErrorPopup(error)
            )
        }
    }

    validar(): boolean {
        if (this.convenio.Investigacion && (this.convenio.SobreQue == undefined || this.convenio.SobreQue == null || this.convenio.SobreQue == "")) {
            this.authService.showErrorPopup("El Tema de la Investigacion no puede estar en blanco");
            return false;
        }

        if (this.convenio.Deposita && (this.convenio.NumeroCuenta == undefined || this.convenio.NumeroCuenta == null || this.convenio.NumeroCuenta == "")) {
            this.authService.showErrorPopup("Debe ingresar un número de cuenta");
            return false;
        }

        if (this.convenio.SujetoEstado == 3 && this.convenio.FechaSuspension == undefined) {
            this.authService.showErrorPopup("Fecha de Suspensión Obligatoria");
            return false;
        }

        return true;
    }

    /*FIN CONEVIO*/





}
