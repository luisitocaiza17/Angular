import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { AuthService } from '../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { ConstantService } from '../utils/constant.service';

import { ContratoKey } from '../common/model/contrato';
import { ContratosAutorizacionListComponent } from './contratosAutorizacion.list.component';
import { Autorizacion, AutorizacionKey, AutorizacionFilter } from '../common/model/autorizacion';
import { Catalogo } from '../common/model/catalogo';

@Component({
    selector: 'autorizacionList',
    providers: [AutorizacionService],
    templateUrl: 'autorizacion.list.template.html'
})

export class AutorizacionListComponent implements OnDestroy {

    autorizaciones: Autorizacion[];
    autorizacionFull: Autorizacion[];
    contratoKey: ContratoKey;
    mostrarFormIncluir: boolean;
    mostrarFormEditar: boolean;
    mostrarFormEmailFtp: boolean;
    urlPruebas: string;
    suscription: any;
    usuarios: string[];
    msgEstadoContato: string;
    habilitarNuevo: boolean;

    private autorizacionKey: BehaviorSubject<AutorizacionKey> = new BehaviorSubject<AutorizacionKey>(null);
    autorizacionKey$: Observable<AutorizacionKey> = this.autorizacionKey.asObservable();

    constructor(public autorizacionService: AutorizacionService, private authService: AuthService,
        private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private contratosAutorizacionListComponent: ContratosAutorizacionListComponent,
        private chRef: ChangeDetectorRef, private constantService: ConstantService) {

        this.mostrarFormIncluir = false;
        this.mostrarFormEditar = false;
        this.mostrarFormEmailFtp = false;
        this.msgEstadoContato = "";
        this.habilitarNuevo = true;

        this.suscription = this.contratosAutorizacionListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined) {
                    if (!contratoKey.unsuscribe) {
                        this.contratoKey = contratoKey;
                        this.loadAutorizacionList();
                        this.validar();
                    } else {
                        this.ngOnDestroy();
                    }
                }
            }
        );
    }

    ngOnInit(): void {
        this.autorizaciones = [];
        this.fillSelectUsuarios();
    }

    ngOnDestroy() {
        if (this.suscription != undefined)
            this.suscription.unsubscribe();
    }

    loadAutorizacionList(): void {
        if (this.contratoKey != undefined) {

            var filter = new AutorizacionFilter();
            filter.CodigoContrato = this.contratoKey.CodigoContrato;

            this.autorizacionService.getAllByFilter(filter).subscribe(
                autorizaciones => {
                    this.urlPruebas = this.constantService.URL_HISTORIAL.toString();
                    this.autorizacionFull = autorizaciones;
                    this.loadData(autorizaciones);
                    this.fillSelectUsuarios();
                },
                error => this.authService.showErrorPopup(error));
        }
        else {
            this.autorizaciones = [];
        }
    }

    validar(): void {
        this.msgEstadoContato = "";
        this.habilitarNuevo = true;
        if (this.contratoKey != undefined) {

            if (this.contratoKey.CodigoProducto != undefined) {
                if (this.contratoKey.CodigoProducto.toUpperCase() == 'COR' ||
                    this.contratoKey.CodigoProducto.toUpperCase() == 'POO' ||
                    this.contratoKey.CodigoProducto.toUpperCase() == 'CPO') {
                        if(this.contratoKey.EsMoroso){
                            this.msgEstadoContato = "El contrato no admite Autorizaciones ";
                            this.habilitarNuevo = false;
                        }

                }
                
            }

        }
    }

    public fillSelectUsuarios() {
        if (this.autorizaciones == undefined || this.autorizaciones.length == 0)
            this.usuarios = [];
        else {
            this.usuarios = [];
            this.autorizaciones.forEach(element => {
                if (element.UsuarioCreacion != undefined && this.usuarios.find(u => u == element.UsuarioCreacion) == undefined)
                    this.usuarios.push(element.UsuarioCreacion);
            });
        }
    }

    public onSelectUsuario(usuario: string) {
        if (usuario != undefined && usuario != '')
            this.autorizaciones = this.autorizacionFull.filter(a => a.UsuarioCreacion == usuario);
        else
            this.autorizaciones = this.autorizacionFull;
    }

    public isEditable(a: Autorizacion): boolean {
        var result = true;
        if (a.Estado != undefined)
            result = (a.Estado != Catalogo.ESTADO_AUTORIZACION_ANULADO_TEXT && a.Estado != Catalogo.ESTADO_AUTORIZACION_PAGADO_TEXT && a.Estado != Catalogo.ESTADO_AUTORIZACION_FINALIZADO_TEXT)
        return result;
    }

    loadData(autorizaciones: Autorizacion[]): void {
        console.log('/////////////////////', autorizaciones);
        this.autorizaciones = autorizaciones;
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

            // for ui only
            this.fillAutorizacionUIAtributes(autorizacion);

            // emitiendo evento para incluir
            this.emitirAutorizacionKey(autorizacion);

            jQuery("#divListaAutorizacion").collapse("hide");
        } else
            this.showWarnPopup("NO SE PUEDE CREAR UNA AUTORIZACION PORQUE LA LISTA CON NÚMERO " + this.contratoKey.NumeroSucursal + " ESTA BLOQUEADA");
    }

    seleccionar(autorizacionSelected: Autorizacion): void {
        if (this.isEditable(autorizacionSelected) && this.contratoKey.SucursalBloqueada) {
            this.showWarnPopup("NO SE PUEDE EDITAR LA AUTORIZACION PORQUE LA LISTA CON NÚMERO " + this.contratoKey.NumeroSucursal + "ESTA BLOQUEADA");
            return;
        }

        this.mostrarFormEditar = true;
        var autorizacion = new Autorizacion();
        autorizacion.Id = autorizacionSelected.Id;
        autorizacion.NumeroAutorizacion = autorizacionSelected.NumeroAutorizacion;
        autorizacion.ContratoEstado = this.contratoKey.ContratoEstado;

        // for ui only
        this.fillAutorizacionUIAtributes(autorizacion);

        // emitiendo evento para editar
        this.emitirAutorizacionKey(autorizacion);
        jQuery("#divListaAutorizacion").collapse("hide");
    }

    sendLetter(autorizacionSelected: Autorizacion): void {
        this.mostrarFormEmailFtp = true;
        var autorizacion = new Autorizacion();
        autorizacion.Id = autorizacionSelected.Id;
        autorizacion.NumeroAutorizacion = autorizacionSelected.NumeroAutorizacion;
        autorizacion.ContratoNumero = this.contratoKey.NumeroContrato;
        autorizacion.FechaAutorizacion = new Date(autorizacionSelected.FechaAutorizacion);
        autorizacion.Canal = autorizacionSelected.Canal;
        autorizacion.EstadoCobertura = autorizacionSelected.EstadoCobertura;
        autorizacion.NombreTitular = this.contratoKey.NombreTitular;
        autorizacion.CedulaTitular = this.contratoKey.CedulaTitular;
        autorizacion.NombreBeneficiario = autorizacionSelected.NombreBeneficiario;
        autorizacion.EmailDomicilio = this.contratoKey.EmailDomicilio;
        autorizacion.EmailTrabajo = this.contratoKey.EmailTrabajo;
        autorizacion.Observaciones = autorizacionSelected.Observaciones;
        autorizacion.ContratoEstado = this.contratoKey.ContratoEstado;

        // for ui only
        this.fillAutorizacionUIAtributes(autorizacion);

        // emitiendo evento para ver pantalla mailFtp
        this.emitirAutorizacionKey(autorizacion);
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

    verListado() {
        this.mostrarFormIncluir = false;
        this.mostrarFormEditar = false;
        this.mostrarFormEmailFtp = false;
        this.loadAutorizacionList();
        jQuery("#divListaAutorizacion").collapse("show");
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