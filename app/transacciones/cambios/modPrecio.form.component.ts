import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContratoKey } from '../../common/model/contrato';
import { BeneficiarioList, Beneficiario, BeneficiarioKey, BeneficiarioPrecios } from '../../common/model/beneficiario';


import { BeneficiarioService } from '../../common/servicios/beneficiario.service';


@Component({
    selector: 'modPrecioBeneficiario',
    providers: [BeneficiarioService],
    templateUrl: 'modPrecio.form.template.html'
})

export class ModPrecioFormComponent {

    suscription: any;
    beneficiarioKey: BeneficiarioKey;
    beneficiarios: Beneficiario[];
    benficiariosSelected: Beneficiario;
    beneficiarioPrecios: BeneficiarioPrecios;
    observacion: string;
    precioAntiguo: number;
    _contratoKey: ContratoKey;

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        public beneficiarioService: BeneficiarioService, private contratosTxListComponent: ContratosTxListComponent) {

        this._contratoKey = new ContratoKey();
        this.beneficiarioKey = new BeneficiarioKey();
        this.beneficiarios = [];
        this.benficiariosSelected = new Beneficiario();
        this.observacion = ' ';
        this.beneficiarioPrecios = new BeneficiarioPrecios();
        this.suscription = this.contratosTxListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined && contratoKey.CodigoContrato != undefined) {
                    this._contratoKey = contratoKey;
                    this.loadBeneficiarios();
                } else {
                    this._contratoKey = new ContratoKey();
                }
            }
        );
    }


    loadBeneficiarios(): void {
        if (this._contratoKey.EsMoroso == true) {
            this.authService.showInfoPopup("Imposible Realizar esta Modificación, Contrato Moroso");
        }
        else {
            this.beneficiarioKey.NumeroContrato = this._contratoKey.NumeroContrato;
            this.beneficiarioKey.CodigoRegion = this._contratoKey.CodigoRegion;
            this.beneficiarioKey.CodigoProducto = this._contratoKey.CodigoProducto;
            this.beneficiarioService.getBeneficiariosForPrecios(this.beneficiarioKey).subscribe(
                result => {
                    this.beneficiarios = result;

                },
                error => this.authService.showErrorPopup(error));
        }
    }

    seleccionar(ben: Beneficiario): void {
        this.limpiar();
        this.precioAntiguo = ben.PrecioBeneficiario;
        this.benficiariosSelected.CodigoContrato = this._contratoKey.CodigoContrato;
        this.benficiariosSelected.NumeroPersona = ben.NumeroPersona;
        this.benficiariosSelected.NombreCompleto = ben.NombreCompleto;
        this.benficiariosSelected.PrecioBeneficiario = ben.PrecioBeneficiario;
        this.benficiariosSelected.EsTitular = ben.EsTitular;
    }

    limpiar(): void {
        this.benficiariosSelected = new Beneficiario();
        this.observacion = undefined;
        this.beneficiarioPrecios = new BeneficiarioPrecios();
    }

    guardarCambioPrecio(): void {
        if (this.observacion == undefined || this.observacion == ''
            || this.observacion == '.' || this.observacion == ',' || this.observacion == 'ok') {
            this.authService.showErrorPopup("Favor ingrese una observación valida");
        } else {

            if(this.precioAntiguo == this.benficiariosSelected.PrecioBeneficiario){
                this.authService.showErrorPopup("El precio del beneficiario es el mismo ya ingresado");
            }else{
                this.beneficiarioPrecios = new BeneficiarioPrecios();

                this.beneficiarioPrecios.CodigoContrato = this.benficiariosSelected.CodigoContrato ;
                this.beneficiarioPrecios.NumeroPersona = this.benficiariosSelected.NumeroPersona;
                this.beneficiarioPrecios.PrecioAnterior = this.precioAntiguo;
                this.beneficiarioPrecios.PrecioBeneficiario = this.benficiariosSelected.PrecioBeneficiario;
                this.beneficiarioPrecios.EsTitular = this.benficiariosSelected.EsTitular;
                this.beneficiarioPrecios.Observacion = this.observacion;
                this.beneficiarioPrecios.ContratoKey = this._contratoKey;
    
                this.beneficiarioService.actualizaPrecioAnteriorNuevo(this.beneficiarioPrecios).subscribe(
                    result => {
                        if (result == true) {
                            this.authService.showSuccessPopup("Se cambio el precio");
                            this.loadBeneficiarios();
                        }
    
                    },
                    error => this.authService.showErrorPopup(error));
            }

        }
    }



}
