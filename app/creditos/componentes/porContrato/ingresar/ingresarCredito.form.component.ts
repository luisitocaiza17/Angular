import { Component, Input, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../../../seguridad/auth.service';
import { Subscription } from '../../../../../../node_modules/rxjs';
import { ServicioSMS } from '../../../../common/servicios/sms.Service';

import { MensajeSMS, TipoSMS } from '../../../../common/model/mensajesms';
import { ContratoKey } from '../../../../common/model/contrato';
import { Catalogo } from '../../../../common/model/catalogo';
import { SobreReembolsoService } from '../../../../sobres/service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../../../../sobres/service/catalogoSobreReembolso.service';
import { ConstantesCreditos } from '../../../utils/ConstantesCreditos';
import { SobreFilter } from '../../../../sobres/model/SobreFilter';
import { SobreEntity } from '../../../../sobres/model/SobreEntity';
import { Convenio, ConvenioFilter } from '../../../../common/model/convenio';
import { Validacion } from '../../../../autorizacion/validacion';
import { ConvenioService } from '../../../../common/servicios/convenio.service';
import { BeneficiarioKey, Beneficiario } from '../../../../common/model/beneficiario';
import { BeneficiarioService } from '../../../../common/servicios/beneficiario.service';
import { DetalleSobreEntity } from '../../../../sobres/model/DetalleSobreEntity';
import { ContratoService } from '../../../../common/servicios/contrato.service';
import { TipoCoberturaEntity } from '../../../../sobres/model/TipoCoberturaEntity';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { utilidadesGenericasService } from '../../../../utils/utilidadesGenericas';

@Component({
    selector: 'ingresarCredito',
    providers: [ServicioSMS, ConvenioService],
    templateUrl: 'ingresarCredito.form.template.html'
})

export class IngresarCreditoFormComponent implements OnDestroy {

    _contratoKey: ContratoKey;
    mensajeSMS: MensajeSMS;
    sobreFilter: SobreFilter;
    sobre: SobreEntity;
    establecimientos: Catalogo[];
    establecimientosbyRegion: Catalogo[];
    listadoSobres: SobreEntity[];
    regiones: Catalogo[];
    convenios: Convenio[];
    medico: boolean = false;
    numeroRegistros = 5;
    nuevo: boolean;
    convenioSeleccionado: Convenio;
    filtroPrestador: string;
    numeroObservacion: number;
    validation: Validacion;
    popupTitle: string = "Listado de Clínicas y Hospitales";
    conveniosOriginales: Convenio[];
    detalleSobreTemporal: DetalleSobreEntity[];
    beneficiarios: Beneficiario[];
    tipoDoc: number;
    detalles: DetalleSobreEntity;
    tiposCobertura: TipoCoberturaEntity[];

    subscription: Subscription;
    interval: NodeJS.Timer;
    bandera: number;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };


    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this.sobreFilter.CodigoContrato = this._contratoKey.CodigoContrato;
            this.sobreFilter.NumeroContrato = this._contratoKey.NumeroContrato;
            this.sobreFilter.CodigoRegion = this._contratoKey.CodigoRegion;
            this.sobreFilter.CodigoProducto = this._contratoKey.CodigoProducto;
            this.loadEstablecimientos();
            this.loadDatosTitular();


        }
    }

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef, private changeDetector: ChangeDetectorRef,
        public sobreReembolsoService: SobreReembolsoService, public servicioSMS: ServicioSMS, public constantesCreditos: ConstantesCreditos, public contratoService: ContratoService,
        public catalogoSobreReembolsoService: CatalogoSobreReembolsoService, private convenioService: ConvenioService, public beneficiarioService: BeneficiarioService, private utilidadGenerica:utilidadesGenericasService) {
        this._contratoKey = new ContratoKey();
        this.sobre = new SobreEntity();
        this.sobre.DetalleSobre = [];

        this.sobreFilter = new SobreFilter();
        this.listadoSobres = [];
        this.establecimientos = [];
        this.regiones = [];
        this.mensajeSMS = new MensajeSMS;
        this.detalles = new DetalleSobreEntity();
        this.tiposCobertura = [];
        this.bandera = 0;

    }

    pageChanged(): void {
        this.loadSobres();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        this.changeDetector.detach();
        clearInterval(this.interval);
    }

    loadEstablecimientos() {
        this.sobre.FechaRecepcion = this.utilidadGenerica.getTodayDate();
        this.catalogoSobreReembolsoService.obtenerEstablecimientos().subscribe(
            result => {
                this.establecimientos = result;
                this.loadRegiones();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadRegiones() {
        this.catalogoSobreReembolsoService.obtenerRegiones().subscribe(
            result => {
                this.regiones = result;
                this.nuevo = true;
                this.sobre.FechaRecepcion = this.utilidadGenerica.getTodayDate();;
                this.sobre.FechaSobre = new Date();
                this.sobre.FechaDigitacion = new Date();
                this.sobre.ValorPresentado = 0;
                this.loadSobres();
                this.loadBeneficiario();
                this.loadTiposDeCobertura();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadSobres() {
        this.sobreFilter.Estados = [];
        this.sobreFilter.Estados.push(this.constantesCreditos.CODIGO_ESTADO_CREDTITO_SIN_ASIGNAR);
        this.sobreFilter.TipoDocumento = this.constantesCreditos.ID_TIPO_DOCUMENTO_CREDITO;
        clearInterval(this.interval);
        this.subscription = this.sobreReembolsoService.getSobresByFiltersPaginated(this.sobreFilter, this.numeroRegistros).subscribe(
            result => {
                this.listadoSobres = result;

                this.interval = setInterval(() => {
                    this.changeDetector.detectChanges();
                    this.changeDetector.detach();
                }, 100);

            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadDatosTitular() {
        this.sobre.Celular = this._contratoKey.Celular;
        this.sobre.PersonaContacto = this._contratoKey.NombresApellidos;

    }

    cargarEstablecimientos() {
        this.establecimientosbyRegion = [];
        this.sobre.IdEstablecimiento = undefined;
        if (this.sobre.IdRegionEstablecimiento != undefined)
            this.establecimientosbyRegion = this.establecimientos.filter(m => parseInt(m.CodigoProgress) == this.sobre.IdRegionEstablecimiento);
    }

    seleccionar(sobre: SobreEntity): void {


        if (this.listadoSobres != undefined) {
            this.listadoSobres.forEach(element => {
                element.Selected = false;
            });
        }
        sobre.Selected = true;
        this.sobre = sobre;
        this.sobre.FechaRecepcion = new Date(this.sobre.FechaRecepcion);
        this.sobre.FechaSobre = new Date(this.sobre.FechaSobre);
        this.detalles.IdTipoCobertura = this.sobre.DetalleSobre[0].IdTipoCobertura;
        this.detalles.NumeroPersona = this.sobre.DetalleSobre[0].NumeroPersona;
        this.detalles.ObservacionesConsultor = this.sobre.DetalleSobre[0].ObservacionesConsultor;

        this.nuevo = false;

        if (this.sobre.IdRegionEstablecimiento != undefined)
            this.establecimientosbyRegion = this.establecimientos.filter(m => parseInt(m.CodigoProgress) == this.sobre.IdRegionEstablecimiento);
    }

    guardarSobre() {
        
        if (this.validar()) {
            this.sobre.Accion = this.constantesCreditos.ACCION_INGRESAR;
            this.sobre.NumeroSobre = this.sobre.NumeroSobre.trim();
            this.sobre.IdRegionEstablecimiento = parseInt(this._contratoKey.CodigoRegion);
            this.sobre.CodigoContrato = this._contratoKey.CodigoContrato;
            this.sobre.CodigoRegion = this._contratoKey.CodigoRegion;
            this.sobre.CodigoProducto = this._contratoKey.CodigoProducto;
            this.sobre.NumeroContrato = this._contratoKey.NumeroContrato;
            this.sobre.TipoDocumento = this.constantesCreditos.ID_TIPO_DOCUMENTO_CREDITO;
           
            this.sobre.DetalleSobre = [];       
            this.detalles.ValorPresentadoDetalle = this.sobre.ValorPresentado;
            this.detalles.Migrado = false;
            this.detalles.Literales = [];
            this.detalles.FechaIngresoDetalle = this.utilidadGenerica.getTodayDate();
            this.sobre.DetalleSobre.push(this.detalles);
            
            console.log(this.sobre.FechaRecepcion);


            this.sobreReembolsoService.ingresarSobre(this.sobre).subscribe(
                result => {

                    this.sobre.NumeroSobre = result.NumeroSobre;
                    this.sobre.IdSobre = result.IdSobre;
                    this.sobre.IdEstadoSobre = result.IdEstadoSobre;
                    this.sobre.IngresadoPor = result.IngresadoPor;

                    this.sobre.DetalleSobre[0].IdDetalleSobre = result.DetalleSobre[0].IdDetalleSobre;
                    this.sobre.DetalleSobre[0].IdEstado = result.IdEstadoSobre;
                    this.sobre.DetalleSobre[0].NumeroSolicitudDetalle = result.DetalleSobre[0].NumeroSolicitudDetalle;

                    this.authService.showSuccessPopup("Se ha ingresado el credito " + this.sobre.NumeroSobre + " con numero de Solicitud " + this.sobre.DetalleSobre[0].NumeroSolicitudDetalle);

                    this.loadSobres();
                },
                error => {
                    this.authService.showErrorPopup(error);
                }
            );

        }
    }

    validar(): boolean {
        if (this.sobre.NumeroSobre == undefined) {
            this.sobre.NumeroSobre = this.constantesCreditos.NUMERO_SOBRE_VACIO;
        }

        if (this.sobre.PersonaContacto == undefined || this.sobre.PersonaContacto == "") {
            this.authService.showErrorPopup("Debe ingresar una persona de Contacto");
            return false;
        }

        if (this.sobre.ValorPresentado == undefined || this.sobre.ValorPresentado <= 0) {
            this.authService.showErrorPopup("El valor presentado no puede se menor o igual a cero");
            return false;
        }
        if(this.sobre.IdClinica == undefined || this.sobre.IdClinica == null){
            this.sobre.Clinica = undefined;
            this.authService.showErrorPopup("Debe Seleccionar una Clinica");
            return false;
        }

        return true;
    }

    actualizarSobre() {
        if (this.validar()) {
            this.sobre.Accion = this.constantesCreditos.ACCION_ACTUALIZAR;
            this.sobre.CodigoContrato = this._contratoKey.CodigoContrato;
            this.sobre.CodigoRegion = this._contratoKey.CodigoRegion;
            this.sobre.CodigoProducto = this._contratoKey.CodigoProducto;
            this.sobre.NumeroContrato = this._contratoKey.NumeroContrato;
            this.sobre.DetalleSobre[0].NumeroPersona = this.detalles.NumeroPersona;
            this.sobre.DetalleSobre[0].ObservacionesConsultor = this.detalles.ObservacionesConsultor;
            this.sobre.DetalleSobre[0].ValorPresentadoDetalle = this.sobre.ValorPresentado;
            var listaSobre = [];

            listaSobre.push(this.sobre);
            this.sobreReembolsoService.actualizarSobre(listaSobre).subscribe(
                result => {
                    if (result) {
                        this.authService.showSuccessPopup("Credito Actualizado");
                        this.sobre = new SobreEntity();
                        this.sobre.FechaRecepcion = this.utilidadGenerica.getTodayDate();
                        this.sobre.FechaSobre = new Date();
                        this.sobre.FechaDigitacion = new Date();
                        this.sobre.ValorPresentado = 0;
                        this.sobre.Celular = this._contratoKey.Celular;
                        this.sobre.PersonaContacto = this._contratoKey.NombresApellidos;
                        this.detalles.ObservacionesConsultor = undefined;
                        this.nuevo = true;
                        this.loadSobres();
                    }
                    else {
                        this.authService.showErrorPopup("Credito no Actualizado, ha ocurrido un error");
                    }
                },
                error => this.authService.showErrorPopup(error));
        }
        else {
            this.authService.showInfoPopup("Verifique que los campos esten correctos");
        }

    }

    cancelar() {
        this.listadoSobres.forEach(element => {
            element.Selected = false;
        });
        this.sobre = new SobreEntity();
        this.detalles = new DetalleSobreEntity();
        this.sobre.FechaRecepcion = this.utilidadGenerica.getTodayDate();
        this.sobre.FechaSobre = new Date();
        this.sobre.FechaDigitacion = new Date();
        this.sobre.ValorPresentado = 0;
        this.sobre.Celular = this._contratoKey.Celular;
        this.sobre.PersonaContacto = this._contratoKey.NombresApellidos;
        this.nuevo = true;
        this.sobre.NumeroSobre = "";
        this.sobre.Clinica = "";
    }

    seleccionarConvenio(convenioSeleccionado: Convenio): void {

        this.sobre.Clinica = convenioSeleccionado.Nombre;
        this.sobre.IdClinica = convenioSeleccionado.Numero;
        jQuery("#prestadorViewModal").modal("hide");
    }


    listarConvenios() {
        var filtro = new ConvenioFilter();
        filtro.Nombre = "*"+this.sobre.Clinica+"*";
        this.convenioService.getMedicosForAutorizacionByFilter(filtro).subscribe(
            convenios => {
                this.convenios = convenios;
                this.conveniosOriginales = convenios;
                this.pintarConvenio();
            },
            error => this.authService.showErrorPopup(error));
    }

    pintarConvenio() {
        //selecciona el prestador o medico escogido anteriormente
        if (this.convenios != undefined && this.sobre.Clinica != undefined) {

            this.convenios.forEach(element => {
                if (element.Numero == this.sobre.IdClinica)
                    element.Selected = true;
                else
                    element.Selected = false;
            });
        }
    }

    loadBeneficiario() {

        var filterBenediciario = new BeneficiarioKey();
        filterBenediciario.CodigoContrato = this._contratoKey.CodigoContrato;
        filterBenediciario.NumeroContrato = this._contratoKey.NumeroContrato;

        this.beneficiarioService.getBeneficiarioAutorizacion(filterBenediciario).subscribe(
            beneficiarios => {
                this.beneficiarios = beneficiarios;

                //this.migrarBeneficiarios();

            },
            error => this.authService.showErrorPopup(error)
        );
    }
    loadTiposDeCobertura() {

        this.catalogoSobreReembolsoService.obtenerTiposDeCobertura().subscribe(
            result => {
                this.tiposCobertura = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }






}