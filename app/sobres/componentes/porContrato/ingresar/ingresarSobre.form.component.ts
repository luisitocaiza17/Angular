import { Component, Input, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../../../seguridad/auth.service';
import { Subscription } from '../../../../../../node_modules/rxjs';

import { SobreReembolsoService } from '../../../service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../../../service/catalogoSobreReembolso.service';
import { ServicioSMS } from '../../../../common/servicios/sms.Service';

import { MensajeSMS, TipoSMS } from '../../../../common/model/mensajesms';
import { SobreEntity } from '../../../model/SobreEntity';
import { SobreFilter } from '../../../model/SobreFilter';
import { ContratoKey } from '../../../../common/model/contrato';
import { Catalogo } from '../../../../common/model/catalogo';
import { ConstantesSobres } from '../../../utils/constantesSobres';

@Component({
    selector: 'ingresarSobre',
    providers: [ServicioSMS],
    templateUrl: 'ingresarSobre.form.template.html'
})

export class IngresarSobreFormComponent implements OnDestroy {

    _contratoKey: ContratoKey;
    mensajeSMS: MensajeSMS;
    sobreFilter: SobreFilter;
    sobre: SobreEntity;

    establecimientos: Catalogo[];
    establecimientosbyRegion: Catalogo[];
    listadoSobres: SobreEntity[];
    regiones: Catalogo[];

    numeroRegistros = 5;
    nuevo: boolean;

    subscription: Subscription;
    interval: NodeJS.Timer;

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
        public sobreReembolsoService: SobreReembolsoService, public servicioSMS: ServicioSMS, public constantesSobres: ConstantesSobres,
        public catalogoSobreReembolsoService: CatalogoSobreReembolsoService) {
        this._contratoKey = new ContratoKey();
        this.sobre = new SobreEntity();
        this.sobre.DetalleSobre = [];
        this.sobreFilter = new SobreFilter();
        this.listadoSobres = [];
        this.establecimientos = [];
        this.regiones = [];
        this.mensajeSMS = new MensajeSMS;
    }


    setear() {
        this.sobre = new SobreEntity();
        this.sobre.DetalleSobre = [];
        this.sobre.FechaRecepcion = new Date();
        this.sobre.FechaSobre = new Date();
        this.sobre.FechaDigitacion = new Date();
        this.sobre.ValorPresentado = 0;
        this.sobre.Celular = this._contratoKey.Celular;
        this.sobre.PersonaContacto = this._contratoKey.NombresApellidos;
        this.nuevo = true;
        this.loadSobres();
        this.sobreReembolsoService.resetDefaultPaginationConstanst();
    }

    pageChanged(): void {
        this.loadSobres();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
        clearInterval(this.interval);
    }

    loadEstablecimientos() {
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
                this.sobre.FechaRecepcion = new Date();
                this.sobre.FechaSobre = new Date();
                this.sobre.FechaDigitacion = new Date();
                this.sobre.ValorPresentado = 0;
                this.loadSobres();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadSobres() {
        this.sobreFilter.Estados = [];
        this.sobreFilter.Estados.push(this.constantesSobres.CODIGO_ESTADO_SOBRE_INGRESADO);

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

        this.nuevo = false;

        if (this.sobre.IdRegionEstablecimiento != undefined)
            this.establecimientosbyRegion = this.establecimientos.filter(m => parseInt(m.CodigoProgress) == this.sobre.IdRegionEstablecimiento);
    }

    guardarSobre() {
        if (this.validar()) {
            this.sobre.Accion = this.constantesSobres.ACCION_INGRESAR;
            this.sobre.NumeroSobre = this.sobre.NumeroSobre.trim();
            this.sobre.CodigoContrato = this._contratoKey.CodigoContrato;
            this.sobre.CodigoRegion = this._contratoKey.CodigoRegion;
            this.sobre.CodigoProducto = this._contratoKey.CodigoProducto;
            this.sobre.NumeroContrato = this._contratoKey.NumeroContrato;
            this.sobre.TipoDocumento = this.constantesSobres.ID_TIPO_DOCUMENTO_SOBRE;
            this.sobre.NombreEstadoSobre = this.constantesSobres.NOMBRE_ESTADO_SOBRE_INGRESADO;
            this.sobre.NombreEstablecimiento = this.establecimientos.find(x => x.Id == this.sobre.IdEstablecimiento).Valor;
            
            this.sobreReembolsoService.ingresarSobre(this.sobre).subscribe(
                result => {
                    this.sobre.NumeroSobre = result.NumeroSobre;
                    this.sobre.IdSobre = result.IdSobre;
                    this.sobre.IdEstadoSobre = result.IdEstadoSobre;
                    this.sobre.SMSDevolucion = result.SMSDevolucion;
                    this.sobre.IngresadoPor = result.IngresadoPor;
                    this.sobre.NumeroSolicitud = result.NumeroSolicitud
                    this.confirmarEnviarMensaje();
                },
                error => {
                    this.authService.showErrorPopup(error);
                }
            );

        }
    }

    validar(): boolean {
        if (this.sobre.NumeroSobre == undefined) {
            this.sobre.NumeroSobre = this.constantesSobres.NUMERO_SOBRE_VACIO;
        }

        if (this.sobre.PersonaContacto == undefined || this.sobre.PersonaContacto == "") {
            this.authService.showErrorPopup("Debe ingresar una persona de Contacto");
            return false;
        }

        if (this.sobre.Celular == undefined || this.sobre.Celular == "" || this.sobre.Celular.length != 10) {
            this.authService.showErrorPopup("El celular ingresado es incorrecto");
            return false;
        }

        if (this.sobre.ValorPresentado == undefined || this.sobre.ValorPresentado <= 0) {
            this.authService.showErrorPopup("El valor presentado no puede se menor o igual a cero");
            return false;
        }
        return true;
    }


    confirmarEnviarMensaje() {
        var title = "Se ha ingresado el sobre " + this.sobre.NumeroSobre + "¿Esta seguro(a) que desea enviar un SMS?";
        var text = "Se enviará un SMS al número:</br>" + this.sobre.Celular;
        swal({
            title: "<h3>" + title + "</h3>",
            text: "<h3>" + text + "</h3>",
            html: true,
            type: "success",
            showCancelButton: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
            closeOnConfirm: true
        },
            confirmed => {
                if (confirmed) {
                    this.enviarSMS(this.sobre);
                }
                else {
                    this.setear();
                }

            });
    }

    enviarSMS(sobre: SobreEntity) {
        this.mensajeSMS.CelularDestino = sobre.Celular;
        this.mensajeSMS.Data = [sobre.NumeroSobre];
        this.mensajeSMS.IDMensaje = TipoSMS.ASIGNACION;
        this.servicioSMS.postSendSMS(this.mensajeSMS).subscribe(
            result => {
                this.sobre.SMSIngreso = true;
                this.sobre.Accion = this.constantesSobres.ACCION_ENVIAR_MENSAJE_RECIBIDO;
                this.actualizarSMSIngreso(this.sobre)

            },
            error => this.authService.showErrorPopup(error)
        );
    }

    actualizarSMSIngreso(sobre: SobreEntity) {

        var listaSobre = [];
        listaSobre.push(sobre);

        this.sobreReembolsoService.actualizarSobre(listaSobre).subscribe(
            result => {
                if (result) {
                    this.authService.showSuccessPopup("Mensaje Enviado");
                    this.setear();
                }
                else {
                    this.authService.showErrorPopup("Mensaje No Enviado");
                }
            },
            error => this.authService.showErrorPopup(error));
    }


    actualizarSobre() {

        if (this.validar()) {
            this.sobre.CodigoContrato = this._contratoKey.CodigoContrato;
            this.sobre.CodigoRegion = this._contratoKey.CodigoRegion;
            this.sobre.CodigoProducto = this._contratoKey.CodigoProducto;
            this.sobre.NumeroContrato = this._contratoKey.NumeroContrato;
            if (this.sobre.Accion == undefined)
                this.sobre.Accion = this.constantesSobres.ACCION_EDITAR_SOBRE;
            var listaSobre = [];
            listaSobre.push(this.sobre);
            this.sobreReembolsoService.actualizarSobre(listaSobre).subscribe(
                result => {
                    if (result) {
                        this.authService.showSuccessPopup("Sobre Actualizado");
                        this.sobre = new SobreEntity();
                        this.sobre.FechaRecepcion = new Date();
                        this.sobre.FechaSobre = new Date();
                        this.sobre.FechaDigitacion = new Date();
                        this.sobre.ValorPresentado = 0;
                        this.sobre.Celular = this._contratoKey.Celular;
                        this.sobre.PersonaContacto = this._contratoKey.NombresApellidos;
                        this.nuevo = true;
                        this.loadSobres();
                    }
                    else {
                        this.authService.showErrorPopup("Sobre no Actualizado, ha ocurrido un error");
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
        this.sobre.FechaRecepcion = new Date();
        this.sobre.FechaSobre = new Date();
        this.sobre.FechaDigitacion = new Date();
        this.sobre.ValorPresentado = 0;
        this.sobre.Celular = this._contratoKey.Celular;
        this.sobre.PersonaContacto = this._contratoKey.NombresApellidos;
        this.nuevo = true;
    }

}