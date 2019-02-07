import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BeneficiarioService } from '../../common/servicios/beneficiario.service';

import { ContratoKey } from '../../common/model/contrato';
import { AutorizacionService } from '../../common/servicios/autorizacion.service';
import { TransaccionService } from '../../common/servicios/transaccion.service';
import { BeneficiarioKey, Beneficiario, CambioTitularFilter } from '../../common/model/beneficiario';


@Component({
    selector: 'titularTx',
    providers: [AutorizacionService, BeneficiarioService],
    templateUrl: 'titularTx.form.template.html'
})

export class TitularTxFormComponent {

    suscription: any;
    beneficiarioKey: BeneficiarioKey;
    beneficiarios: Beneficiario[];
    titular: Beneficiario;
    _contratoKey: ContratoKey;
    numeroPersonaSeleccionado : number;
    beneficiarioSeleccionado : Beneficiario;
    cambioTitularFilter: CambioTitularFilter;
    modificaBeneficiarios: boolean;


    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        private transaccionService: TransaccionService, 
        private beneficiarioService: BeneficiarioService,
        private contratosTxListComponent: ContratosTxListComponent) {

        this._contratoKey = new ContratoKey();
        this.beneficiarioKey = new BeneficiarioKey();
        this.beneficiarios = [];
        this.titular = new Beneficiario();
        this.beneficiarioSeleccionado = new Beneficiario();
        this.cambioTitularFilter = new CambioTitularFilter();
        this.modificaBeneficiarios = false;

        this.suscription = this.contratosTxListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined && contratoKey.CodigoContrato != undefined) {
                    this._contratoKey = contratoKey;    
                    this.load();             
                } else {
                    this._contratoKey = new ContratoKey();          
                }
            }
        );



    }

    load(): void {
        this.beneficiarioKey.NumeroContrato = this._contratoKey.NumeroContrato;
        this.beneficiarioKey.CodigoRegion = this._contratoKey.CodigoRegion;
        this.beneficiarioKey.CodigoProducto = this._contratoKey.CodigoProducto;
        this.beneficiarioService.getBeneficiarios(this.beneficiarioKey).subscribe(
            result => {
                this.beneficiarios = result;
                for (let ben of this.beneficiarios) {
                    if (ben.EsTitular == true)
                        this.titular = ben;
                }
            },
            error => this.authService.showErrorPopup(error));
    }

    cambiarTitular(): void {
        this.cambioTitularFilter.NumeroContrato =  this._contratoKey.NumeroContrato;
        this.cambioTitularFilter.CodigoRegion =  this._contratoKey.CodigoRegion;
        this.cambioTitularFilter.CodigoProducto =  this._contratoKey.CodigoProducto;
        this.cambioTitularFilter.NumeroPersonaNueva =  this.beneficiarioSeleccionado.NumeroPersona;
        this.cambioTitularFilter.NumeroPersonaAnterior =  this.titular.NumeroPersona;
        this.cambioTitularFilter.CodigoContrato =  this._contratoKey.CodigoContrato;
        this.cambioTitularFilter.NumeroSucursal =  this._contratoKey.NumeroSucursal;
        this.cambioTitularFilter.NumeroEmpresa =  this._contratoKey.NumeroEmpresa;


        this.beneficiarioService.cambiarBeneficiarioTitular(this.cambioTitularFilter).subscribe(
            result => {
                if(result == true){
                    this.authService.showSuccessPopup("Debe realizar las relaciones de los Dependientes");
                    this.modificaBeneficiarios = true;
                }
               
            },
            error => this.authService.showErrorPopup(error));
      
    }

    loadBeneficiarioSeleccionado(): void{
        for (let ben of this.beneficiarios) {
            if(ben.NumeroPersona == this.numeroPersonaSeleccionado){
                if (ben.EsTitular == true){
                    this.authService.showErrorPopup("El beneficiario seleccionado ya es Titular");
                }else{
                    if(ben.Edad < 18){
                        this.authService.showErrorPopup("El beneficiario seleccionado es menor de edad.");
                    }else{
                        this.beneficiarioSeleccionado = ben;
                    }
                } 
            }
            
                
        }
    }


}