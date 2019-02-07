import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../seguridad/auth.service';
import { RegionService } from '../../../../common/servicios/region.service';
import { ServicioVentasService } from '../../../service/servicioVentas.service';
import { ServicioFunVendedorService } from '../../../service/servicioFunVendedor.service';
import { ConstantesComercialService } from '../../../utils/constantesComercial.service.';
import { VariablesConstantService } from '../../../../utils/variableConstant.service.';


import { RegionEntity } from '../../../../common/model/genericos';
import { DirectorVendedorEntity } from '../../../model/DirectorVendedorEntity';
import { DirectorVendedorFilter } from '../../../model/directorVendedorFilter';
import { FunFilter } from '../../../model/funFilter';
import { FunEntity } from '../../../model/funEntity';

import { utilidadesGenericasService } from '../../../../utils/utilidadesGenericas';

@Component({
    selector: 'asignaFunForm',
    providers: [ServicioVentasService, ServicioFunVendedorService, ConstantesComercialService],
    templateUrl: 'asignaFun.form.template.html'
})

export class AsignaFunFormComponent {

    agente: string;
    codigoAgente: number;

    vendedorFilter: DirectorVendedorFilter;
    directorSelected: DirectorVendedorEntity;
    funFilter: FunFilter;
    listaFunes: FunEntity[];
    listaFunesSeleccionados: FunEntity[];
    listaVendedores: DirectorVendedorEntity[];
    listaRegiones: RegionEntity[];

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService,
        public ventasService: ServicioVentasService, public constantService: VariablesConstantService,
        public constantesComercial: ConstantesComercialService, public utils: utilidadesGenericasService,
        public funService: ServicioFunVendedorService) {

        this.agente = undefined;
        this.codigoAgente = undefined;
        this.vendedorFilter = new DirectorVendedorFilter();
        this.directorSelected = new DirectorVendedorEntity();
        this.funFilter = new FunFilter();
        this.listaVendedores = [];
        this.listaRegiones = [];
        this.listaFunes = [];


        this.cargarCombos();
    }

    pageFunChanged() {
        this.loadFunes();
    }

    pageChanged(): void {
        this.loadVendedores();
    }

    cargarCombos() {
        if (this.listaRegiones.length == 0) {
            this.listaRegiones = RegionEntity.values;
        }
    }

    limpiar() {
        this.funFilter = new FunFilter();
        this.vendedorFilter = new DirectorVendedorFilter();
        this.listaVendedores = [];
        this.ventasService.resetDefaultPaginationConstanst();
        this.funService.resetDefaultPaginationConstanst();
    }

    /*Vendedores*/
    loadVendedores() {
        this.listaVendedores = [];
        this.ventasService.Vendedores(this.vendedorFilter).subscribe(
            result => {
                this.listaVendedores = result;
                this.listaVendedores.forEach(element => {
                    if (element.FechaIngreso != undefined && element.FechaIngreso != null) {
                        element.FechaIngreso = this.utils.GetDateTimeUTCTimeZone(element.FechaIngreso);
                    }
                    if (element.FechaSalida != undefined && element.FechaSalida != null) {
                        element.FechaSalida = this.utils.GetDateTimeUTCTimeZone(element.FechaSalida);
                    }
                });
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    modalVendedores() {
        $('#myModalVendedores').modal();
    }

    seleccionarVendedor(vendedor: DirectorVendedorEntity) {
        this.agente = vendedor.Nombre;
        this.codigoAgente = vendedor.Codigo;
        $('#myModalVendedores').modal('hide');
    }
    /*Fin Vendedores*/


    /*Funes*/
    loadFunes() {
        this.funFilter.Estado = this.constantService.CODIGO_ESTADO_PREEMITIDO;
        this.funService.Fun(this.funFilter).subscribe(
            result => {
                this.listaFunes = result;
                this.listaFunes.forEach(element => {
                    if (element.FechaEntrega != undefined && element.FechaEntrega != null) {
                        element.FechaEntrega = this.utils.GetDateTimeUTCTimeZone(element.FechaEntrega);
                    }
                    if (element.FechaCierre != undefined && element.FechaCierre != null) {
                        element.FechaCierre = this.utils.GetDateTimeUTCTimeZone(element.FechaCierre);
                    }
                    if (element.FechaCreacion != undefined && element.FechaCreacion != null) {
                        element.FechaCreacion = this.utils.GetDateTimeUTCTimeZone(element.FechaCreacion);
                    }
                });
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    seleccionarFun(fun: FunEntity): void {
        if (fun.Selected == true) {
            fun.Selected = false;
            this.listaFunes.forEach(element => {
                if (element.NumeroFun == fun.NumeroFun) {
                    element.Selected = false;
                }
            })
        }
        else {
            fun.Selected = true;
            this.listaFunes.forEach(element => {
                if (element.NumeroFun == fun.NumeroFun) {
                    element.Selected = true;
                }
            })
        }
    }

    seleccionarTodos() {
        this.listaFunesSeleccionados = [];
        if (this.listaFunes.length > 0) {
            this.listaFunes.forEach(element => {
                element.Selected = true;
                this.listaFunesSeleccionados.push(element);
            });
        }
    }

    asignar() {
        if (this.validarAsignar()) {
            this.funService.ActualizarFun(this.listaFunesSeleccionados).subscribe(
                result => {
                    this.authService.showSuccessPopup("Los Funes se han asignado correctamente");
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    validarAsignar(): boolean {
        if (this.codigoAgente == undefined || this.agente == undefined) {
            this.authService.showErrorPopup("Debe seleccionar un Vendedor");
            return false;
        }
        else {
            this.listaFunesSeleccionados = [];
            this.listaFunes.forEach(element => {
                if (element.Selected == true) {
                    element.CodigoAgenteVenta = this.codigoAgente;
                    element.Estado = this.constantService.CODIGO_ESTADO_EMITIDO;
                    this.listaFunesSeleccionados.push(element);

                }
            });

            if (this.listaFunesSeleccionados.length == 0) {
                this.authService.showErrorPopup("Debe seleccionar uno o m&aacute;s Funes");
                return false;
            }
        }
        return true;
    }
}