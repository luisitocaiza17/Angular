import { Component, OnInit, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { InsertarPlanKey } from '../../common/model/listaCorporativo';
import { RegionService } from '../../common/servicios/region.service';
import { Region } from '../../common/model/region';
import { AuthService } from '../../seguridad/auth.service';
import { EmpresaDataKey, UltimoPlanCorporativoFilter, ListaPlanesCorporativoEntity, ListaPlanesKey } from '../../common/model/listaPlanesCorporativo';
import { ListaCorporativoService } from '../../common/servicios/listaCorporativo.service';
import { MovimientoListaService } from '../../common/servicios/movimientoLista.service';
import { MovimientoListaEntity } from '../../common/model/movimientoLista';
import { AutorizacionService } from '../../common/servicios/autorizacion.service';
import { PlanFormComponent } from '../plan.form.component';
import { connectableObservableDescriptor } from 'rxjs/observable/ConnectableObservable';


@Component({
    selector: 'crearplan-app',
    providers: [RegionService, MovimientoListaService],
    templateUrl: 'crearPlanComponent.html'
})

export class CrearPlanComponent implements OnInit {

    datoInsertPlan: ListaPlanesCorporativoEntity;
    ultimoPlanCorporativoDeEmpresa: ListaPlanesCorporativoEntity;
    movimientoLista:MovimientoListaEntity;
    regiones: Region[];
    PorcentajeEdadTope = 0;


    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };
    fechaInicio: Date;
    fechaFin: Date;
    fechaDigitacion: Date;
    congenitas: boolean;
    preexistencias: boolean;
    maternidad: boolean;
    respuestas: object =
        [
            {
                mensaje: 'SI',
                codigo: 1
            }, {
                mensaje: 'NO',
                codigo: 0
            }
        ];

    codigoPlan: number;



    empresaDataKey:EmpresaDataKey;
    suscription: any;
    constructor(public regionService: RegionService, private authService: AuthService, private planFormComponent: PlanFormComponent,
    private listaCorporativoService:ListaCorporativoService, private movimientoListaService:MovimientoListaService,public autorizacionService: AutorizacionService) {
        this.datoInsertPlan = new InsertarPlanKey();
        this.movimientoLista=new MovimientoListaEntity();
        this.regiones = [];
        this.obtenerRegiones();
        this.ultimoPlanCorporativoDeEmpresa = new ListaPlanesKey(); 
    }

    obtenerRegiones(): void {
        this.regionService.getAll().subscribe(
            result => {
                this.regiones = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    insertarMovimientoLista(): void {
        this.movimientoListaService.createMovimientoLista(this.movimientoLista).subscribe(
            result => {
               this.authService.showInfoPopup(result);
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    ngOnInit() {
        this.datoInsertPlan = new ListaPlanesCorporativoEntity();
        this.suscription=this.planFormComponent.selectPlan$.subscribe(
            (empresaDataKey)=>{
                if(empresaDataKey!=undefined){
                    if(!empresaDataKey.unsuscribe){
                        this.empresaDataKey=empresaDataKey;
                    }else{
                        this.ngOnDestroy();
                    }
                }
            }
        );
       this.sugerirDatosParaInsertar(); 
    }

    sugerirDatosParaInsertar(){
        this.datoInsertPlan = new ListaPlanesCorporativoEntity(); 
        var filter = new UltimoPlanCorporativoFilter(); 
        filter.SucursalEmpresa = this.empresaDataKey.SucursalEmpresa; 
        this.listaCorporativoService.getByUltimoPlan(filter)
                .subscribe( res => {
                        this.datoInsertPlan.VersionPlan = res.VersionPlan +1 ;
                        this.datoInsertPlan.NombrePlan = res.NombrePlan;  
                        this.datoInsertPlan.CodigoPlan = res.CodigoPlan;
                        this.datoInsertPlan.NombrePlan = res.NombrePlan;
                        this.datoInsertPlan.NumeroBeneficiarios = res.NumeroBeneficiarios; 
                        this.datoInsertPlan.EdadDependientes = res.EdadDependientes; 
                        this.datoInsertPlan.Region = res.Region; 
                        this.datoInsertPlan.CodigoTarifario = res.CodigoTarifario; 
                        this.datoInsertPlan.FechaInicio = new Date(res.FechaFin);
                        var year = new Date(res.FechaFin).getFullYear() + 1;
                        var month = new Date(res.FechaFin).getMonth();
                        var day = new Date(res.FechaFin).getDate();
                        this.datoInsertPlan.FechaFin = new Date(year, month, day);
                        this.datoInsertPlan.CubreCongenitas = res.CubreCongenitas; 
                        this.datoInsertPlan.CubrePreexistencias = res.CubrePreexistencias; 
                        this.datoInsertPlan.EdadTope = res.EdadTope; 
                        this.datoInsertPlan.DiasReclamo = res.DiasReclamo;
                        this.datoInsertPlan.DiasAlcance = res.DiasAlcance; 
                    }, 
                    error => this.authService.showErrorPopup(error)
                );
    }

    crear() {
        let fechaFinLimite=new Date().getDate() + 1095;
        let fechaFinDias=this.datoInsertPlan.FechaFin.getDate();
        let fechaDigitacionLimiteMax=new Date().getFullYear()+1;
        let fechaDigitacionLimiteMin=new Date().getFullYear()-1;
        let fechaDigitacionAnios=this.datoInsertPlan.FechaDigitacion.getFullYear();
        if(this.datoInsertPlan.FechaInicio<this.datoInsertPlan.FechaFin 
            && fechaFinDias< fechaFinLimite
            && fechaDigitacionAnios<fechaDigitacionLimiteMax
            && fechaDigitacionAnios>fechaDigitacionLimiteMin){
            this.datoInsertPlan.SucursalEmpresa= this.empresaDataKey.SucursalEmpresa;
            this.datoInsertPlan.EmpresaNumero=this.empresaDataKey.EmpresaNumero;
            this.datoInsertPlan.NivelReferrencia=this.datoInsertPlan.NivelReferrencia;
            this.datoInsertPlan.CodigoProducto="COR";
            this.movimientoLista.SucursalEmpresa=this.datoInsertPlan.SucursalEmpresa;
            this.movimientoLista.CodigoProducto="COR";
            this.movimientoLista.EmpresaNumero=this.datoInsertPlan.EmpresaNumero;
            this.movimientoLista.FechaEfectoMovimiento=this.datoInsertPlan.FechaInicio;
            this.movimientoLista.Region=this.datoInsertPlan.Region;
            this.movimientoLista.ReferenciaDocumento=this.datoInsertPlan.SucursalEmpresa;
            this.movimientoLista.Precio=this.datoInsertPlan.PrecioBase;
            this.movimientoLista.Servicio=this.datoInsertPlan.CodigoPlan;
            this.movimientoListaService.createMovimientoLista(this.movimientoLista).subscribe(
                result=>{
                    this.authService.showSuccessPopup('Registro creado exitosamente');
        
                },
                error => this.authService.showErrorPopup('No se pudo insertar el registro, por favor revise los datos del formulario')
            );
    
            this.listaCorporativoService.createPlan(this.datoInsertPlan).subscribe(
                result => {
                   this.authService.showInfoPopup(result);
                   jQuery("#divPanelPlanes").collapse("hide");
                   jQuery("#clpListaContrato").collapse("show");
                   this.sugerirDatosParaInsertar();
                   
                },
                error => this.authService.showErrorPopup(error)
            );

            
        }else{
            this.authService.showErrorPopup('Por favor verificar las fechas');
        }
    }

    ngOnDestroy() {
        if (this.suscription != undefined)
            this.suscription.unsubscribe();
    }

}