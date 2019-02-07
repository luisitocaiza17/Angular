import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContratoKey } from '../../common/model/contrato';
import { DatosBancoContrato } from '../../common/model/transacciones';

import { AutorizacionService } from '../../common/servicios/autorizacion.service';
import { PlanService } from '../../common/servicios/plan.service';
import { TransaccionService } from '../../common/servicios/transaccion.service';



@Component({
    selector: 'pagoInteligente',
    providers: [AutorizacionService],
    templateUrl: 'pagoInteligente.form.template.html'
})

export class PagoInteligenteFormComponent {

    suscription: any;
    filtroRUC: string;
    desabilitar: boolean;
    validarPI: boolean;
    continuar : boolean;
    estado: string;
    bancos: DatosBancoContrato[];
    datosConfirmados: boolean;

    _contratoKey: ContratoKey;
    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this.desabilitar = true;
            this.datosConfirmados = false;
            this.loadDatos();
        }

        else {
            this._contratoKey = new ContratoKey();
            this.bancos = [];
        }
    }

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        private transaccionService: TransaccionService) {
        this._contratoKey = new ContratoKey();
        this.bancos = [];
        this.datosConfirmados = false;
    }

    loadDatos(): void {

        this.transaccionService.getDatosPI(this._contratoKey).subscribe(
            result => {
                this.bancos = result.Bancos;

                this._contratoKey.AuxCodigoBanco = this._contratoKey.CodigoBancoCredito;
                this._contratoKey.AuxNumeroCuentaCredito = this._contratoKey.NumeroCuentaCredito;
                this._contratoKey.AuxTipoCuentaCredito = this._contratoKey.TipoCuentaCredito;
                this._contratoKey.AuxEmailTrabajo = this._contratoKey.EmailTrabajo;
                this._contratoKey.AuxEmailDomicilio = this._contratoKey.EmailDomicilio;
                this._contratoKey.AuxDireccionPe = this._contratoKey.DireccionPe;
                this._contratoKey.AuxCelular = this._contratoKey.Celular;
                this._contratoKey.AuxPagoInteligente = this._contratoKey.PagoInteligente;
            },
            error => this.authService.showErrorPopup(error)
        );
        
        if (this._contratoKey.EnvioPi == 0) {
            this.desabilitar = false;
            this.continuar = true;
            this.estado = "Toma Servicio";
        }
        else {
            if (this._contratoKey.EnvioPi == 1) {
                this.estado = "Datos por Confirmar";
                this.desabilitar = false;
                this.continuar = true;
            }
            if (this._contratoKey.EnvioPi == 2) {
                this.validarPI = false;
                this.estado = "Datos Confirmados";
                this.desabilitar = false;
                this.continuar = false;
                this.datosConfirmados = true;
            }            
        }

        if(this._contratoKey.PagoInteligente == false){
            this._contratoKey.CodigoBanco=0;
            this.desabilitar=true;
        }
    }

    guardarPI(): void {
        if (this._contratoKey.Celular == "") {
            this._contratoKey.Celular = "(000) 000-0000";
        }

        this.transaccionService.modificarPagoInteligente(this._contratoKey).subscribe(
            result => {
                if (result)
                    this.authService.showSuccessPopup("Se ha modificado el Pago Inteligente");
                else
                    this.authService.showErrorPopup("No se ha modificado el Pago Inteligente");
            },
            error => this.authService.showErrorPopup(error)
        );

    }

    modificarDatos(){
        this.datosConfirmados = false;
        this.continuar = true;
    }

    noModificarDatos(){
        this.datosConfirmados = false;
    }

    validacionPI(value){
        if(value=='false'){
            this._contratoKey.NumeroCuentaCredito="";
            this._contratoKey.CodigoBanco=0;
            this.desabilitar=true;
        }
        else{
            this.desabilitar=false;
        }
    }








}