import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { AuthService } from '../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { ConstantService } from '../utils/constant.service';

import { ContratoKey } from '../common/model/contrato';
import { ContratosLiquidacionListComponent } from './contratosLiquidacion.list.component';
import { Autorizacion, AutorizacionKey, AutorizacionFilter } from '../common/model/autorizacion';
import { Catalogo } from '../common/model/catalogo';


import { BeneficiarioService } from '../common/servicios/beneficiario.service';
import { Beneficiario, BeneficiarioKey } from '../common/model/beneficiario';

@Component({
    selector: 'liquidacionList',
    providers: [AutorizacionService, BeneficiarioService],
    templateUrl: 'liquidacion.list.template.html'
})

export class LiquidacionListComponent implements OnDestroy {

    autorizaciones: Autorizacion[];
    autorizacionFull: Autorizacion[];
    contratoKey: ContratoKey;
    mostrarFormIncluir: boolean;
    mostrarFormEditar: boolean;
    mostrarFormEmailFtp: boolean;
    urlPruebas: string;
    suscription: any;
    msgEstadoContato: string;
    habilitarNuevo: boolean;

    beneficiarios: Beneficiario[];
    beneficiarioSeleccionado : Beneficiario;

    private autorizacionKey: BehaviorSubject<AutorizacionKey> = new BehaviorSubject<AutorizacionKey>(null);
    autorizacionKey$: Observable<AutorizacionKey> = this.autorizacionKey.asObservable();

    private beneficiarioKey: BehaviorSubject<BeneficiarioKey> = new BehaviorSubject<BeneficiarioKey>(new BeneficiarioKey());
    beneficiarioKey$: Observable<BeneficiarioKey> = this.beneficiarioKey.asObservable();

    constructor(public autorizacionService: AutorizacionService, private authService: AuthService,
        private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private contratosLiquidacionListComponent: ContratosLiquidacionListComponent,
        private chRef: ChangeDetectorRef, private constantService: ConstantService, public beneficiarioService: BeneficiarioService) {

        this.mostrarFormIncluir = false;
        this.mostrarFormEditar = false;
        this.mostrarFormEmailFtp = false;
        this.msgEstadoContato = "";
        this.habilitarNuevo = false;
        this.beneficiarios = [];   
        this.beneficiarioSeleccionado = new Beneficiario();

        this.suscription = this.contratosLiquidacionListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined) {
                    if (!contratoKey.unsuscribe) {
                        this.contratoKey = contratoKey;
                        this.loadBeneficiarioList();
                    } else {
                        this.ngOnDestroy();
                    }
                }
            }
        );
    }

    ngOnInit(): void {
        this.autorizaciones = [];
    }

    ngOnDestroy() {
        if (this.suscription != undefined)
            this.suscription.unsubscribe();
    }
    
    loadBeneficiarioList(): void {        
        if (this.contratoKey != undefined) {
            var beneficiarioFilter = this.createBeneficiarioFilter(this.contratoKey.CodigoContrato, 0);
            this.beneficiarioService.getBeneficiarioListByContrato(beneficiarioFilter).subscribe(
                beneficiarios => {
                    this.loadDataBeneficiario(beneficiarios);                   
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    createBeneficiarioFilter(codigoContrato: number, numeroPersona: number): BeneficiarioKey {
        var beneficiarioFilter = new BeneficiarioKey();
        beneficiarioFilter.CodigoContrato = codigoContrato;
        beneficiarioFilter.NumeroPersona = numeroPersona;
        return beneficiarioFilter;
    }

    loadDataBeneficiario(beneficiarios: Beneficiario[]): void {
        this.beneficiarios = beneficiarios;
    }

    seleccionarBeneficiario(beneficiario: Beneficiario): void {
        this.limpiarSeleccion();
        if (beneficiario != undefined) {
            beneficiario.Selected = true;
            this.beneficiarioSeleccionado = beneficiario;
            this.habilitarNuevo = true;            
        }
    } 

    limpiarSeleccion(){
        //TODO: limpiar pantallas
    }


    loadData(autorizaciones: Autorizacion[]): void {
        this.autorizaciones = autorizaciones;
    }

    pageChanged(){
        
    }

    nuevo() {
        if (!this.contratoKey.SucursalBloqueada) {
            this.mostrarFormIncluir = true;
            var autorizacion = new Autorizacion();
            autorizacion = new Autorizacion();
            autorizacion.ContratoNumero = this.contratoKey.NumeroContrato;
            autorizacion.CodigoContrato = this.contratoKey.CodigoContrato;
            autorizacion.Region = this.contratoKey.CodigoRegion;
            autorizacion.CodigoProducto = this.contratoKey.CodigoProducto;
            autorizacion.NumeroEmpresa = Number.parseInt(this.contratoKey.NumeroEmpresa);
            autorizacion.NombreEmpresa = this.contratoKey.NombreEmpresa;
            autorizacion.SucursalEmpresa = Number.parseInt(this.contratoKey.NumeroSucursal);
            autorizacion.NombreSucursalEmpresa = this.contratoKey.NombreSucursalEmpresa;
            autorizacion.ContratoEstado = this.contratoKey.ContratoEstado;
            autorizacion.Garantia = this.contratoKey.Garantia;
            autorizacion.PersonaNumero = this.beneficiarioSeleccionado.NumeroPersona;

            // for ui only
            this.fillAutorizacionUIAtributes(autorizacion);

            // emitiendo evento para incluir
            this.emitirAutorizacionKey(autorizacion);

            jQuery("#divListaAutorizacion").collapse("hide");
        } else
            this.showWarnPopup("NO SE PUEDE CREAR UNA AUTORIZACION PORQUE LA LISTA CON NÚMERO " + this.contratoKey.NumeroSucursal + " ESTA BLOQUEADA");
    }

    seleccionar(autorizacionSelected: Autorizacion): void {       
        jQuery("#divListaAutorizacion").collapse("hide");
    }


    emitirAutorizacionKey(autorizacion: Autorizacion) {
        var key = new AutorizacionKey();
        key.autorizacionSeleccionado = autorizacion;
        this.autorizacionKey.next(key);
    }

    fillAutorizacionUIAtributes(autorizacion: Autorizacion) {
        autorizacion.CodigoPlan = this.contratoKey.Plan;
        autorizacion.FechaVigencia = this.contratoKey.FechaVigencia;
        autorizacion.NivelReferencia = this.contratoKey.NivelReferencia;
        autorizacion.ObservacionesContrato = this.contratoKey.Observaciones;
        autorizacion.CeroTramites = this.contratoKey.CeroTramites;
        autorizacion.ClienteImpago = this.contratoKey.EsMoroso;
        autorizacion.Transicion = this.contratoKey.Transicion;
        autorizacion.Garantia = this.contratoKey.Garantia;
        autorizacion.Deducible = this.contratoKey.Deducible;
        autorizacion.VersionPlan = this.contratoKey.VersionPlan;
    }



    showWarnPopup(msg: string): void {
        swal({
            title: "",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: 'warning',
            closeOnConfirm: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
        });
    }
}