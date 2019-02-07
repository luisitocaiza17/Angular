import { Component, OnInit, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { AuthService } from '../../seguridad/auth.service';

import { ConvenioService } from '../../common/servicios/convenio.service';
import { GenericosService } from '../../common/servicios/genericos.service';
import { CatalogoService } from '../../common/servicios/catalogo.service';
import { PrestadoresListComponent } from './prestadores.list.component';


import { ConvenioFilter, Convenio, TipoPrestador, DetalleConvenioEntity } from '../../common/model/convenio';
import { DatosBancoContrato } from '../../common/model/transacciones';
import { ComboSiNoInt, TipoConvenioEntity, TipoIdCuenta, TipoIdentificacionEntity, TipoEstadoEntity, TipoContribuyenteEntity, TipoCuentaEntity, TipoContribEspecialEntity, ComboSiNo, FilterBancos } from '../../common/model/genericos';
import { Catalogo, CatalogoProgressEntity } from '../../common/model/catalogo';
import { error } from 'selenium-webdriver';

@Component({
    selector: 'actualizarConvenio',
    providers: [ConvenioService, GenericosService],
    templateUrl: 'actualizarConvenio.form.template.html'
})

export class ActualizarConvenioFormComponent implements OnInit, OnDestroy {

    suscription: any;
    numeroConvenio: number;

    convenio: DetalleConvenioEntity;

    descripcionAnulacion: string;
    desposita: number;
    investigacion: number;
    nombreEstado: string;
    pagoInteligente: number;
    retencion: number;

    bancos: DatosBancoContrato[];
    ciudades: Catalogo[];
    comboSiNo: ComboSiNo[];
    comboSiNoInt: ComboSiNoInt[];
    estados: Catalogo[];
    listaEspe: Catalogo[];
    listaSubEspe: Catalogo[];
    motivosAnulacion: CatalogoProgressEntity[];
    motivosAnulacionOriginales: CatalogoProgressEntity[];
    tipoContribuyente: TipoContribuyenteEntity[];
    tipoCuenta: TipoCuentaEntity[];
    tipoConvenio: TipoConvenioEntity[];
    tiposIdentificacion: TipoIdentificacionEntity[];
    tiposEstado: TipoEstadoEntity[];
    tipoIdCuenta: TipoIdCuenta[];
    tipoContribEspecial: TipoContribEspecialEntity[];


    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private convenioService: ConvenioService,
        private genericoService: GenericosService, private catalogoService: CatalogoService,
        private prestadorListComponet: PrestadoresListComponent) {

    }

    ngOnDestroy() {
        if (this.suscription != undefined && this.suscription != null)
            this.suscription.unsubscribe();
    }

    ngOnInit() {
        this.convenio = new DetalleConvenioEntity();

        this.descripcionAnulacion = undefined
        this.desposita = undefined
        this.investigacion = undefined
        this.nombreEstado = undefined
        this.numeroConvenio = undefined
        this.pagoInteligente = undefined
        this.retencion = undefined

        this.bancos = [];
        this.ciudades = [];
        this.comboSiNo = [];
        this.comboSiNoInt = [];
        this.estados = [];
        this.listaEspe = [];
        this.listaSubEspe = [];
        this.motivosAnulacion = [];
        this.motivosAnulacionOriginales = [];
        this.tipoContribuyente = [];
        this.tipoCuenta = [];
        this.tipoConvenio = [];
        this.tiposIdentificacion = [];
        this.tiposEstado = [];
        this.tipoIdCuenta = [];
        this.tipoContribEspecial = [];

        this.numeroConvenio = undefined;
        this.suscription = this.prestadorListComponet.numeroConvenio$.subscribe(
            (convenioSuscrito) => {

                if (convenioSuscrito != null && convenioSuscrito != undefined && convenioSuscrito.Numero != undefined && convenioSuscrito.Numero != null) {
                    this.numeroConvenio = convenioSuscrito.Numero;
                    this.detalleConvenio();
                }
                else {
                    this.ngOnDestroy();
                }
            }
        );
    }

    detalleConvenio() {
        this.convenioService.getConvenioDetalle(this.numeroConvenio).subscribe(
            result => {
                this.convenio = result;
                this.setearDatosIniciales();
                this.cargarCombos();
                this.obtenerBanco();
            }
        )
    }

    setearDatosIniciales() {

        if (this.convenio.FechaTituloGeneral != undefined || this.convenio.FechaTituloGeneral != null) {
            this.convenio.FechaTituloGeneral = new Date(this.convenio.FechaTituloGeneral);
        }
        if (this.convenio.FechaTituloEspecialidad != undefined || this.convenio.FechaTituloEspecialidad != null) {
            this.convenio.FechaTituloEspecialidad = new Date(this.convenio.FechaTituloEspecialidad);
        }
        if (this.convenio.FechaTituloSubespe != undefined || this.convenio.FechaTituloSubespe != null) {
            this.convenio.FechaTituloSubespe = new Date(this.convenio.FechaTituloSubespe);
        }
        if (this.convenio.FechaMaster != undefined || this.convenio.FechaMaster != null) {
            this.convenio.FechaMaster = new Date(this.convenio.FechaMaster);
        }
        if (this.convenio.FechaPermisoFin != undefined || this.convenio.FechaPermisoFin != null) {
            this.convenio.FechaPermisoFin = new Date(this.convenio.FechaPermisoFin);
        }

        if (this.convenio.FechaConvenio != undefined || this.convenio.FechaConvenio != null) {
            this.convenio.FechaConvenio = new Date(this.convenio.FechaConvenio);
        }
        if (this.convenio.FechaInicioConvenio != undefined || this.convenio.FechaInicioConvenio != null) {
            this.convenio.FechaInicioConvenio = new Date(this.convenio.FechaInicioConvenio);
        }
        if (this.convenio.FechaFinConvenio != undefined || this.convenio.FechaFinConvenio != null) {
            this.convenio.FechaFinConvenio = new Date(this.convenio.FechaFinConvenio);
        }

        if (this.convenio.FechaSuspension != undefined || this.convenio.FechaSuspension != null) {
            this.convenio.FechaSuspension = new Date(this.convenio.FechaSuspension);
        }

        //SETEAR COMBOS VACÍOS
        if (this.convenio.TipoCuenta == "") {
            this.convenio.TipoCuenta = undefined;
        }

        if (this.convenio.TipoIdCuenta == "") {
            this.convenio.TipoIdCuenta = undefined;
        }

        if (this.convenio.TipoIdentificacion == "") {
            this.convenio.TipoIdentificacion = undefined;
        }

        if (this.convenio.TipoConvenio == "") {
            this.convenio.TipoConvenio = undefined;
        }

        if (this.convenio.Retencion) {
            this.retencion = 2;
        }
        else {
            this.retencion = 1;
        }

        if (this.convenio.Investigacion) {
            this.investigacion = 2;
        }

        else {
            this.investigacion = 1;
        }

        if (this.convenio.Deposita) {
            this.pagoInteligente = 2;
        }
        else {
            this.pagoInteligente = 1;
        }


    }

    obtenerBanco() {
        var filtroBancos = new FilterBancos();
        this.genericoService.GetCargarBancos(filtroBancos).subscribe(
            result => {
                this.bancos = result;
                this.obtenerCiudades();//llamno al siguiente
            }
        );
    }

    obtenerCiudades() {
        this.catalogoService.getCiudadesForOdas().subscribe(
            result => {
                this.ciudades = result;
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
                this.loadMotivosAnulacion();
            }
        );
    }


    loadMotivosAnulacion() {
        this.genericoService.getMotivosAnulacion().subscribe(
            result => {
                this.motivosAnulacion = result;
                this.motivosAnulacionOriginales = result;
                this.loadEstados();
            }
        );
    }

    loadEstados() {
        this.genericoService.getEstados().subscribe(
            result => {
                this.estados = result;

                if (this.estados != undefined && this.estados.length > 0) {
                    this.estados.forEach(element => {
                        if (this.convenio.EstadoConvenio == element.Id) {
                            this.nombreEstado = element.Valor;
                        }
                    });
                }

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
    }



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

    actualizarConvenio() {
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

        if (this.validar()) {
            this.convenioService.actualizarConvenio(this.convenio).subscribe(
                result => {
                    this.authService.showSuccessPopup("Convenio Actualizado");
                    this.suscription.unsubscribe();
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

}
