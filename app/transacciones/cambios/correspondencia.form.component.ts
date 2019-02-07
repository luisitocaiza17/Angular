import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { TipoPantallaPersonaUnica } from '../../common/model/persona';
import { Catalogo } from '../../common/model/catalogo';
import { ContratoKey, CorrespondenciaEntity } from '../../common/model/contrato';
import { TransaccionService } from '../../common/servicios/transaccion.service';


@Component({
    selector: 'correspondencia',
    providers: [TransaccionService],
    templateUrl: 'correspondencia.form.template.html'
})

export class CorrespondenciaFormComponent {


    desabilitar: boolean;
    desabilitarComponentes: boolean;
    correspondencia: CorrespondenciaEntity;
    ciudades: Catalogo[];
    filterCorrespondencia: CorrespondenciaEntity;
    ciudadKeySelected: Catalogo;
    pantallaClienteUnico: TipoPantallaPersonaUnica;

    _contratoKey: ContratoKey;
    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this._contratoKey.Transaccion = "FACTURACION_MANUAL";
            this.pantallaClienteUnico.NumeroPersona = this._contratoKey.NumeroPersona;
            this.pantallaClienteUnico.TipoDocumento = "CI";
            this.pantallaClienteUnico.TipoPantalla = 2;
            this.pantallaClienteUnico.Desabilitar = true;
            this.loadValidacionInicial();
        }
        else {
            this._contratoKey = new ContratoKey();
            this.correspondencia = new CorrespondenciaEntity();
            this.filterCorrespondencia = new CorrespondenciaEntity();
            this.ciudadKeySelected = new Catalogo();
            this.pantallaClienteUnico = new TipoPantallaPersonaUnica();
            this.ciudades = [];
            this.desabilitar = false;
        }
    }

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        private transaccionService: TransaccionService) {
        this._contratoKey = new ContratoKey();
        this.correspondencia = new CorrespondenciaEntity();
        this.filterCorrespondencia = new CorrespondenciaEntity();
        this.ciudadKeySelected = new Catalogo();
        this.pantallaClienteUnico = new TipoPantallaPersonaUnica();
        this.ciudades = [];
        this.desabilitar = false;
    }

    loadValidacionInicial(): void {
        if (this._contratoKey.ContratoCodigoEstado == 2 || this._contratoKey.ContratoCodigoEstado == 27) {
            this.authService.showInfoPopup("El contrato se encuentra Anulado Actualmente");
            this.desabilitar = true;
        }
        else {
            this.desabilitarComponentes = true;
            $("#ActualizaPersona").modal();
        }
    }

    loadDatos() {

        var filter = new ContratoKey();
        filter.CodigoRegion = this._contratoKey.CodigoRegion;
        filter.CodigoProducto = this._contratoKey.CodigoProducto;
        filter.NumeroContrato = this._contratoKey.NumeroContrato;
        filter.NumeroPersona = this._contratoKey.NumeroPersona;

        this.transaccionService.gatDatosCorrespondencia(filter).subscribe(
            result => {
                this.correspondencia = result.Correspondencia;
                this.ciudades = result.Ciudades;
                this.actualizarlDomicilio();
            },
            error => this.authService.showErrorPopup(error));
    }

    actualizarlDomicilio(): void {
        this.desabilitarComponentes = true;
        this.filterCorrespondencia.EnvioCorrespondencia = 1;
        this.filterCorrespondencia.DireccionCorrespondencia = this.correspondencia.DireccionDomicilio;
        this.filterCorrespondencia.BarrioCorrespondencia = this.correspondencia.BarrioDomicilio;
        this.filterCorrespondencia.TelefonoCorrespondencia = this.correspondencia.TelefonoDomicilio;
        this.filterCorrespondencia.NombreCiudadCorrespondencia = this.correspondencia.NombreCiudadDomicilio;
        this.filterCorrespondencia.CodigoCiudadCorrespondencia = this.correspondencia.CodigoCiudadDomicilio;
    }

    actualizarTrabajo(): void {
        this.desabilitarComponentes = true;
        this.filterCorrespondencia.EnvioCorrespondencia = 2;
        this.filterCorrespondencia.DireccionCorrespondencia = this.correspondencia.DireccionTrabajo;
        this.filterCorrespondencia.BarrioCorrespondencia = this.correspondencia.BarrioTrabajo;
        this.filterCorrespondencia.TelefonoCorrespondencia = this.correspondencia.TelefonoTrabajo;
        this.filterCorrespondencia.NombreCiudadCorrespondencia = this.correspondencia.NombreCiudadTrabajo;
        this.filterCorrespondencia.CodigoCiudadCorrespondencia = this.correspondencia.CodigoCiudadTrabajo;
    }

    actualizarOtro(): void {
        this.desabilitarComponentes = false;
        this.filterCorrespondencia.EnvioCorrespondencia = 3;
        this.filterCorrespondencia.DireccionCorrespondencia = "";
        this.filterCorrespondencia.BarrioCorrespondencia = "";
        this.filterCorrespondencia.TelefonoCorrespondencia = "";
        this.filterCorrespondencia.NombreCiudadCorrespondencia = "";
        this.filterCorrespondencia.CodigoCiudadCorrespondencia = undefined;
    }

    guardarCambios() {

        /*
        if (this.filterCorrespondencia.DireccionCorrespondencia == "" || this.filterCorrespondencia.BarrioCorrespondencia == "" || this.filterCorrespondencia.TelefonoCorrespondencia == "") {
            this.authService.showInfoPopup("Complete todos los campos");
        }
        else {
            */
        var filtro = new CorrespondenciaEntity();

        filtro.EnvioCorrespondencia = this.filterCorrespondencia.EnvioCorrespondencia;
        filtro.CodigoCiudadCorrespondencia = this.filterCorrespondencia.CodigoCiudadCorrespondencia;
        filtro.BarrioCorrespondencia = this.filterCorrespondencia.BarrioCorrespondencia;
        filtro.DireccionCorrespondencia = this.filterCorrespondencia.DireccionCorrespondencia;
        filtro.TelefonoCorrespondencia = this.filterCorrespondencia.TelefonoCorrespondencia;
        filtro.CodigoContrato = this._contratoKey.CodigoContrato;
        filtro.Region = this._contratoKey.CodigoRegion;
        filtro.CodigoProducto = this._contratoKey.CodigoProducto;
        filtro.NumeroContrato = this._contratoKey.NumeroContrato;
        filtro.NumeroEmpresa = this._contratoKey.NumeroEmpresa;
        filtro.NumeroSucursal = this._contratoKey.NumeroSucursal;
        filtro.PersonaNumero = this._contratoKey.NumeroPersona;
        filtro.Anterior = this.correspondencia.DireccionCorrespondencia
            + ";Ciudad: " + this.correspondencia.CodigoCiudadCorrespondencia
            + ";Barrio: " + this.correspondencia.BarrioCorrespondencia
            + ";Telf: " + this.correspondencia.TelefonoCorrespondencia;

        this.showPopupResultadoConfirm("Esta seguro de cambiar el lugar o datos de Correspondencia del Contrato?", filtro);
    }
    // }



    showPopupResultadoConfirm(msg: string, filtro: CorrespondenciaEntity): void {
        swal({
            title: "",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
            closeOnConfirm: true
        },
            confirmed => {

                if (confirmed) {
                    this.transaccionService.actualizarCorrespondencia(filtro).subscribe(
                        result => {
                            if (result) {
                                this.authService.showSuccessPopup("Correccion Realizada. Revise por favor . . . ");
                            }
                            else {
                                this.authService.showErrorPopup("Ha ocurrido un error");
                            }
                        },
                        error => this.authService.showErrorPopup(error));
                }

            });
    }

    salir(): void {
        this.loadDatos();
        $("#ActualizaPersona").modal('hide');
        $('#informacionPersonal').collapse('hide');
        $('#direccionDomicilio').collapse('hide');
        $('#direccionTrabajo').collapse('hide');
        $('#emergencia').collapse('hide');
        $('#correspondencia').collapse('hide');
        $('#infoOpcional').collapse('hide');
    }
}