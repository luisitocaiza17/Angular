import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { AuthService } from '../../../seguridad/auth.service';
import { RegionService } from '../../../common/servicios/region.service';
import { ServicioVentasService } from '../../service/servicioVentas.service';
import { RegionEntity, SucursalDeRegion } from '../../../common/model/genericos';


import { ConstantService } from '../../../utils/constant.service';
import { DirectorVendedorEntity, InputCambioDirectores } from '../../model/DirectorVendedorEntity';
import { DirectorVendedorFilter } from '../../model/directorVendedorFilter';
import { ConstantesComercialService } from '../../utils/constantesComercial.service.';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { FiltroAgenteVenta } from '../../../comisiones/model/agenteVenta.model';
import { Salas } from '../../../comisiones/salas/model/salas';
import { SalasService } from '../../../comisiones/salas/service/salas.service';
import { ContratoKey } from '../../../common/model/contrato';
import { GenericosService } from '../../../common/servicios/genericos.service';
import { Region } from '../../../common/model/region';
import { SalasFilter } from '../../../comisiones/salas/model/salasFilter';


@Component({
    providers: [ServicioVentasService, ConstantesComercialService],
    templateUrl: 'directores.list.template.html'
})

export class DirectoresListComponent implements OnInit {

    isVendedor: boolean;
    isDirector: boolean;
    opcion: string;
    fechaSalida: Date;
    filter:SalasFilter;

    directorFilter: DirectorVendedorFilter;
    directorSelected: DirectorVendedorEntity;
    filtroAgenteVenta: FiltroAgenteVenta; 

    listaDirectores: DirectorVendedorEntity[];
    listaRegiones: RegionEntity[];
    regiones: Region[];

    listaSalas: Salas[] = [];

    sucursalesDeRegion: SucursalDeRegion[]; 

    contratoKey: ContratoKey;

    idSucursal:number;

    directorSiSalaLoTiene: DirectorVendedorEntity;
    
    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    public director: BehaviorSubject<DirectorVendedorEntity> = new BehaviorSubject<DirectorVendedorEntity>(null);
    selectDirector$: Observable<DirectorVendedorEntity> = this.director.asObservable();

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService, public salasService: SalasService,
        public ventasService: ServicioVentasService, public constantService: ConstantService,
        public constCom: ConstantesComercialService, public utils: utilidadesGenericasService, private genericosService:GenericosService
        ) {
        this.directorFilter = new DirectorVendedorFilter();
        this.directorSelected = new DirectorVendedorEntity();
        this.directorSiSalaLoTiene = new DirectorVendedorEntity(); 
        this.listaDirectores = [];
        this.listaSalas = [];
        this.listaRegiones = [];
        this.cargarCombos();
        this.contratoKey = new ContratoKey();
        this.regiones = [];
        this.filter = new SalasFilter();
    }

    loadSalas(event:any) {
        this.idSucursal = event.target.value;
        this.salasService.getSalas(this.idSucursal).subscribe(
          (result) => {
            this.listaSalas = result;
          });
      }

    ngOnInit(): void {
        this.opcion = "";
        
       
    }

    cargarCombos() {
        
        if (this.listaRegiones.length == 0) {
            this.listaRegiones = RegionEntity.values;
        }
    }

    loadDirectores() {
        this.listaDirectores = [];

        this.filtroAgenteVenta = new FiltroAgenteVenta(); 
        this.filtroAgenteVenta.CodigoAgenteVenta = this.directorFilter.CodigoDirector; 
        this.filtroAgenteVenta.Nombre = this.directorFilter.Apellidos; 
        this.filtroAgenteVenta.Region = this.directorFilter.Region; 
        this.filtroAgenteVenta.Estado = this.directorFilter.Estado; 
        this.filtroAgenteVenta.Tipo = 'Director'; 

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
        this.isVendedor = false;
        this.isDirector = false;
        var key = new DirectorVendedorEntity();
        //key.unsuscribe = true;
        this.director.next(key);
        this.loadDirectores(); 
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

    irAVendedores(directorSeleccionado: DirectorVendedorEntity){ 
        this.router.navigate(['vendedores', directorSeleccionado.Codigo]);
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
        this.listaDirectores = [];
        this.ventasService.resetDefaultPaginationConstanst();
    }


    /*Anular Director*/
    modalAnularDirector(director: DirectorVendedorEntity) {
        this.directorSelected = new DirectorVendedorEntity();
        this.directorSelected = director;
        this.fechaSalida = new Date();
        $('#myModalAnular').modal();
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
        this.loadRegiones();
        this.directorSelected = new DirectorVendedorEntity();
        this.directorSelected = director;
        this.fechaSalida = null; 
        $('#modalReingresar').modal();
    }

    verificarSiSalaTieneDirector(){ 

        this.ventasService.verificarSiSalaTieneDirector(this.directorSelected.CodigoSala).subscribe(
            res => { 
                this.directorSiSalaLoTiene = res; 
                if(this.directorSiSalaLoTiene.Codigo != undefined)
                {
                    this.salirModalReingresarDirector();
                    this.openDespacharDirectorModal();               
                }
                else{
                    this.reingresarDirector(); 
                }            
            }
        ); 
    }

    cargarSucursal(event:any){
        this.contratoKey.CodigoRegion = event.target.value;
        this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result)=>{
          this.sucursalesDeRegion = result;
        },
        error => this.authService.showErrorPopup(error));
      }
    
    
      loadRegiones(): void {
        this.regionService.getAll()
          .subscribe(regiones => {
            this.regiones = regiones;
          },
            error => this.authService.showErrorPopup(error));
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

    reingresarDirectorSiSalaEstaOcupada(){ 

        let directoresC = new InputCambioDirectores(); 
        directoresC.DirectorNuevo = this.directorSelected; 
        directoresC.DirectorAntiguo = this.directorSiSalaLoTiene; 

        this.ventasService.ReingresarDirectorSiSalaEstaOcupada(directoresC).subscribe(
            res => { 
                if(res.includes('ERROR'))
                    this.authService.showErrorPopup(res.replace('ERROR:',''));
                else
                    this.authService.showSuccessPopup(res);
                    
                this.salirDespacharDirectorModal(); 
            },
            error => { 
                this.authService.showErrorPopup(error);
            }
        );
    }


    salirModalReingresarDirector() {
        $('#modalReingresar').modal('hide');
    }
    /*Fin Reingresar Director */

    openDespacharDirectorModal() {
        $('#modalDespachaDirector').modal();
    }

    salirDespacharDirectorModal() {
        $('#modalDespachaDirector').modal('hide');
    }
}