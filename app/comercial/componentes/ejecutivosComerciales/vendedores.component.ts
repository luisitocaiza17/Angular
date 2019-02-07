import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../../../seguridad/auth.service';
import { RegionService } from '../../../common/servicios/region.service';
import { ServicioVentasService } from '../../service/servicioVentas.service';
import { RegionEntity } from '../../../common/model/genericos';


import { ConstantService } from '../../../utils/constant.service';
import { DirectorVendedorEntity } from '../../model/DirectorVendedorEntity';
import { DirectorVendedorFilter } from '../../model/directorVendedorFilter';
import { ConstantesComercialService } from '../../utils/constantesComercial.service.';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { FiltroAgenteVenta } from '../../../comisiones/model/agenteVenta.model';
import { SubtipoService } from '../../../comisiones/subtipo/service/subtipo.service';


@Component({
    providers: [ServicioVentasService, ConstantesComercialService],
    templateUrl: 'vendedores.component.html'
})

export class VendedoresComponent implements OnInit {

    isVendedor: boolean;
    isDirector: boolean;
    opcion: string;
    fechaSalida: Date;

    directorFilter: DirectorVendedorFilter;
    directorSelected: DirectorVendedorEntity;
    directorFromParent: DirectorVendedorEntity;
    filtroAgenteVenta: FiltroAgenteVenta; 

    listaDirectores: DirectorVendedorEntity[];
    listaRegiones: RegionEntity[];

    codigoDirector: number; 

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    private director: BehaviorSubject<DirectorVendedorEntity> = new BehaviorSubject<DirectorVendedorEntity>(null);
    selectDirector$: Observable<DirectorVendedorEntity> = this.director.asObservable();

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService,
        public ventasService: ServicioVentasService, public constantService: ConstantService,
        public constCom: ConstantesComercialService, public utils: utilidadesGenericasService, public activatedRoute: ActivatedRoute, 
        public servicioSubtipo:SubtipoService) 
    {
        
    }

    ngOnInit(): void {
        this.directorFilter = new DirectorVendedorFilter();
        this.directorSelected = new DirectorVendedorEntity();
        this.directorFromParent = new DirectorVendedorEntity(); 
        this.listaRegiones = [];
        
        this.opcion = "";
        this.directorFilter.Estado = this.constCom.ACTIVO; 
        this.listaDirectores = [];
        this.cargarCombos();
        this.recuperarCodigoDirector();
        this.cargarDirector(); 
        this.loadDirectores(); 
    }

    recuperarCodigoDirector(){ 
        this.codigoDirector = this.activatedRoute.snapshot.params['director'];
    }

    cargarDirector(){   
        this.filtroAgenteVenta = new FiltroAgenteVenta(); 
        this.filtroAgenteVenta.CodigoAgenteVenta = this.codigoDirector;
        this.ventasService.GetAgentesVentaByFiltersPaginated(this.filtroAgenteVenta, 10).subscribe(
            result => {
                this.listaDirectores = result;
                this.servicioSubtipo.getSubtipoById(+(this.listaDirectores[0].CodigoSubtipo)).subscribe((res)=>{
                    this.listaDirectores.forEach(element => {
                        element.NombreSubtipo = res[0].Descripcion;
                        element.NombreTipo = res[0].Tipo.Nombre;
                    });
                });
                this.listaDirectores.forEach(element => {
                    if (element.FechaIngreso != undefined && element.FechaIngreso != null) {
                        element.FechaIngreso = this.utils.GetDateTimeUTCTimeZone(element.FechaIngreso);
                    }
                    if (element.FechaSalida != undefined && element.FechaSalida != null) {
                        element.FechaSalida = this.utils.GetDateTimeUTCTimeZone(element.FechaSalida);
                    }
                    if (element.FechaProduccionAgente != undefined && element.FechaProduccionAgente != null) {
                        element.FechaProduccionAgente = this.utils.GetDateTimeUTCTimeZone(element.FechaProduccionAgente);
                    }
                });
                this.directorFromParent = result[0]; 
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    cargarCombos() {
        if (this.listaRegiones.length == 0) {
            this.listaRegiones = RegionEntity.values;
        }
    }

    loadDirectores() {
        this.listaDirectores = [];

        this.filtroAgenteVenta = new FiltroAgenteVenta(); 
        this.filtroAgenteVenta.CodigoDirector = this.codigoDirector; 
        this.filtroAgenteVenta.CodigoAgenteVenta = this.directorFilter.CodigoDirector; 
        this.filtroAgenteVenta.Nombre = this.directorFilter.Apellidos; 
        this.filtroAgenteVenta.Region = this.directorFilter.Region; 
        this.filtroAgenteVenta.Estado = this.directorFilter.Estado; 
        this.filtroAgenteVenta.Tipo = 'Vendedor'; 

        this.ventasService.GetAgentesVentaByFiltersPaginated(this.filtroAgenteVenta, 10).subscribe(
            result => {
                this.listaDirectores = result;
                this.listaDirectores.forEach(element => {
                    if (element.FechaIngreso != undefined && element.FechaIngreso != null) {
                        element.FechaIngreso = this.utils.GetDateTimeUTCTimeZone(element.FechaIngreso);
                    }
                    if (element.FechaSalida != undefined && element.FechaSalida != null) {
                        element.FechaSalida = this.utils.GetDateTimeUTCTimeZone(element.FechaSalida);
                    }
                    if (element.FechaProduccionAgente != undefined && element.FechaProduccionAgente != null) {
                        element.FechaProduccionAgente = this.utils.GetDateTimeUTCTimeZone(element.FechaProduccionAgente);
                    }
                });
            },
            error => this.authService.showErrorPopup(error)
        );
    }


    colapsarTab(): void {
        this.loadDirectores(); 
        this.isVendedor = false;
        this.isDirector = false;
        var key = new DirectorVendedorEntity();
        //key.unsuscribe = true;
        this.director.next(key); 
    }

    volverADirectores(){
        this.router.navigate(['ejecutivoComercial/list']);
    }

    pageChanged(): void {
        this.loadDirectores();
    }


    inicializarPanelVendedores(selected: DirectorVendedorEntity): void {
        this.isVendedor = true;
        this.isDirector = false;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelDirectores").collapse("show");
        jQuery("#divPanelVendedores").collapse("show");

        this.crearDirectorEntity(selected);

        //correctHeight();

        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelVendedores").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
    }

    irAVendedores(){ 
        this.router.navigate(['../../vendedores']);
    }

    inicializarPanelDirectores(selected: DirectorVendedorEntity, tipoTransaccion: string): void {
        var key = new DirectorVendedorEntity();
        this.director.next(key);

        if (selected == undefined) {
            selected = new DirectorVendedorEntity();
        }
        selected.TipoTransaccion = tipoTransaccion;
        this.isVendedor = false;
        this.isDirector = true;
        this.chRef.detectChanges();
        jQuery("#divConsultar").collapse("hide");
        jQuery("#divPanelVendedores").collapse("hide");
        jQuery("#divPanelDirectores").collapse("show");

        this.crearDirectorEntity(selected);
        //correctHeight();

        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelDirectores").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
    }

    isActive(divActivo: string) {
        if (this.opcion == divActivo)
            return true;
        return false;
    }

    activar(opcion: string) {
        this.opcion = opcion;
    }

    crearDirectorEntity(selected: DirectorVendedorEntity): void {
        var key = new DirectorVendedorEntity();
        key = selected;
        this.director.next(key);
    }

    limpiar() {
        this.directorFilter = new DirectorVendedorFilter();
        this.directorFilter.Estado = this.constCom.ACTIVO;  
        this.listaDirectores = [];
        this.ventasService.resetDefaultPaginationConstanst();
    }


    /*Anular Director*/
    modalAnularDirector(director: DirectorVendedorEntity) {
        if (director.Estado == this.constCom.ACTIVO) {
            this.directorSelected = new DirectorVendedorEntity();
            this.directorSelected = director;
            this.fechaSalida = new Date();
            $('#myModalAnular').modal();
        }
        else {
            this.authService.showErrorPopup("El director " + director.Nombre + " ya está anulado");
        }
    }

    salirModalAnularDirector() {
        $('#myModalAnular').modal('hide');
    }

    anularDirector() {
        this.directorSelected.FechaSalida =  this.fechaSalida;
        this.ventasService.ActualizaVendedor(this.directorSelected).subscribe(
            result => {
                this.authService.showSuccessPopup("El director " + this.directorSelected.Nombre + " ha sido anulado");
                this.loadDirectores();
                this.salirModalAnularDirector();
            },
            error => this.authService.showErrorPopup(error)
        );

    }
    /*Fin Anular Director*/


    /*Reigresar Director*/

    modalReingresarDirector(director: DirectorVendedorEntity) {
        if (director.Estado == this.constCom.INACTIVO) {
            this.directorSelected = new DirectorVendedorEntity();
            this.directorSelected = director;
            this.fechaSalida = null; 
            $('#modalReingresar').modal();
        }
        else {
            this.authService.showErrorPopup("El director " + director.Nombre + " está activo");
        }
    }

    reingresarDirector() {
        this.directorSelected.FechaSalida = null;
        this.ventasService.ReingresarAgenteVenta(this.directorSelected).subscribe(
            result => {
                this.authService.showSuccessPopup("El director " + this.directorSelected.Nombre + " ha sido reingresado");
                this.loadDirectores();
                this.salirModalReingresarDirector();
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    salirModalReingresarDirector() {
        $('#modalReingresar').modal('hide');
    }
    /*Fin Reingresar Director */

}