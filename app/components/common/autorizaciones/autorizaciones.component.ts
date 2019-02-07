import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'

import { AuthService } from '../../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Autorizacion, AutorizacionFilter } from '../../../common/model/autorizacion';
import { TipoPdf, EstadoCobertura } from '../../../common/model/autorizacion.constant';
import { AutorizacionService } from '../../../common/servicios/autorizacion.service';
import { Observable } from 'rxjs/Rx';

@Component({
    selector: 'autorizaciones',
    providers: [AutorizacionService],
    templateUrl: 'autorizaciones.template.html'
})

export class AutorizacionComponent {

    autorizaciones: Autorizacion[];
    autorizacionSelected: Autorizacion;
    width: string;
    maxWidth: string;
    tipoPdf: TipoPdf;

    _filter: AutorizacionFilter;
    @Input()
    set filter(exclusionfilter: AutorizacionFilter) {
        this._filter = exclusionfilter;
        if (this._filter != undefined)
            this.loadAutorizacionList();
        else {
            this.autorizaciones = [];
            this.autorizacionSelected = new Autorizacion();
            this.autorizacionSelected.Diagnosticos = [];
        }
    }

    get filter() {
        return this._filter;
    }

    _permitirExportar: boolean;
    @Input()
    set permitirExportar(exportar) {
        if (exportar == undefined)
            this._permitirExportar = false;
        else {
            this._permitirExportar = exportar;
            if (this._permitirExportar) {
                this.width = '1125px';
                this.maxWidth = '1125px';
            }
        }
    }

    get permitirExportar() {
        return this._permitirExportar;
    }

    @Output() onLoadAutorizaciones: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public autorizacionService: AutorizacionService, private authService: AuthService,
        private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef) {

        this.autorizacionSelected = new Autorizacion();
        this.autorizacionSelected.Diagnosticos = [];
        this.autorizaciones = [];
        this.width = '1050px';
        this.maxWidth = '1050px';
        this._permitirExportar = false;
        this.tipoPdf = new TipoPdf();
    }

    ngOnInit(): void {
        this.autorizaciones = [];
        this.autorizacionSelected = new Autorizacion();
        this.autorizacionSelected.Diagnosticos = [];
    }

    loadAutorizacionList(): void {
        if (this._filter != undefined) {
            this.autorizacionService.getAllByFilter(this._filter).subscribe(
                autorizaciones => {
                    this.loadData(autorizaciones);
                },
                error => {
                    this.onLoadAutorizaciones.emit(false);
                    this.authService.showErrorPopup(error);
                });
        }
        else {
            this.autorizaciones = [];
            this.autorizacionSelected = new Autorizacion();
        }
    }

    loadData(autorizaciones: Autorizacion[]): void {
        this.autorizaciones = autorizaciones;
        if (this._filter.NumeroAutorizacion != undefined) {
            var autorizacionDef = this.autorizaciones.find(a => a.NumeroAutorizacion == this._filter.NumeroAutorizacion);
            if (autorizacionDef != undefined)
                this.seleccionar(autorizacionDef);
            else {
                if (this.autorizaciones != undefined && autorizaciones.length > 0)
                    this.seleccionar(autorizaciones[0]);
                else
                    this.autorizacionSelected = new Autorizacion();
                this.onLoadAutorizaciones.emit(true);
            }
        } else {
            if (this.autorizaciones != undefined && autorizaciones.length > 0)
                this.seleccionar(autorizaciones[0]);
            else
                this.autorizacionSelected = new Autorizacion();
            this.onLoadAutorizaciones.emit(true);
        }
    }

    seleccionar(autorizacion: Autorizacion): void {
        if (this.autorizaciones != undefined) {
            this.autorizaciones.forEach(element => {
                element.Selected = false;
            });
        }
        if (autorizacion != undefined) {
            autorizacion.Selected = true;
            var autorizacionFilter = new AutorizacionFilter();
            autorizacionFilter.IdAutorizacion = autorizacion.Id;
            autorizacionFilter.NumeroAutorizacion = autorizacion.NumeroAutorizacion;
            this.autorizacionService.getOneByFilter(autorizacionFilter).subscribe(
                autorizacion => {
                    this.autorizacionSelected = autorizacion;
                },
                error => this.authService.showErrorPopup(error)
            );
        }
        else
            this.autorizacionSelected = new Autorizacion();
    }

    generarPdf(autorizacion: Autorizacion, event: Event): void {
        event.stopPropagation();
        if (autorizacion != undefined) {
            var autorizacionFilter = new AutorizacionFilter();
            autorizacionFilter.IdAutorizacion = autorizacion.Id;

            this.autorizacionService.getOneByFilter(autorizacionFilter).subscribe(
                result => {
                    autorizacion.Alcance = result.Alcance;
                    autorizacion.Region = result.Region;
                    autorizacion.Alcance = result.Alcance;

                    this.determinarCiudad(autorizacion);

                    this.determinarTipoCarta(autorizacion);

                    let resp = this.autorizacionService.getLetter(autorizacion)
                        .subscribe(
                        resp => {
                            var blob = new Blob([resp._body], { type: 'application/pdf' });
                            var fileURL = URL.createObjectURL(blob);
                            window.open(fileURL);
                        },
                        err => {
                            this.authService.showBlobErrorPopup(err);
                        });
                },
                err => this.authService.showErrorPopup(err)
            );
        }
    }

    determinarCiudad(autorizacion: Autorizacion): void {
        if (autorizacion.Region.toLowerCase() == 'sierra')
            autorizacion.CiudadAutorizacion = "Quito";
        else if (autorizacion.Region.toLowerCase() == 'costa')
            autorizacion.CiudadAutorizacion = "Guayaquil";
        else if (autorizacion.Region.toLowerCase() == 'austro')
            autorizacion.CiudadAutorizacion = "Cuenca";
    }

    determinarTipoCarta(autorizacion: Autorizacion) {
        if (autorizacion.Alcance != undefined && autorizacion.Alcance)
            autorizacion.TipoDocumento = this.tipoPdf.ALCANCE;
        else if (autorizacion.EstadoCobertura == EstadoCobertura.CUBIERTO)
            autorizacion.TipoDocumento = this.tipoPdf.CUBIERTO;
        else if (autorizacion.EstadoCobertura == EstadoCobertura.NO_CUBIERTO)
            autorizacion.TipoDocumento = this.tipoPdf.NO_CUBIERTO;
    }
}