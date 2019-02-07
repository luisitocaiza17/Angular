import { Component, OnInit } from "@angular/core";
import { DescripcionFormComponent } from "../descripcion.form.component";
import { ListaPlanesKey } from "../../common/model/listaPlanesCorporativo";
import { AuthService } from "../../seguridad/auth.service";
import { RegionService } from "../../common/servicios/region.service";
import { Region } from "../../common/model/region";
import { InsertarPlanKey } from "../../common/model/listaCorporativo";
import { isMoment } from "moment";
import { ListaCorporativoService } from "../../common/servicios/listaCorporativo.service";
import { MovimientoListaService } from "../../common/servicios/movimientoLista.service";
import { MovimientoListaEntity } from "../../common/model/movimientoLista";
import { Router } from "@angular/router";
import { AutorizacionService } from "../../common/servicios/autorizacion.service";

@Component({
    selector:'editarplan-app',
    providers: [RegionService, MovimientoListaService],
    templateUrl: 'editar.form.template.html'
})
export class EditarFormComponent implements OnInit{
    datoInsertPlan: InsertarPlanKey;
    movimientoLista:MovimientoListaEntity;
    tempFechaInicio:Date;
    tempFechaFin:Date;
    tempFechaDigitacion:Date;
    regiones: Region[];
    suscription: any;
    editarPlanesKey:ListaPlanesKey;
    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

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
    constructor(private descripcionForm:DescripcionFormComponent, private regionService: RegionService, 
        private authService: AuthService, private listaCorporativoService:ListaCorporativoService,
        private movimientoListaService:MovimientoListaService, router: Router,public autorizacionService: AutorizacionService){
        this.editarPlanesKey=new ListaPlanesKey();
        this.movimientoLista=new MovimientoListaEntity();
        this.tempFechaInicio=new Date();
        this.tempFechaFin=new Date();
        this.tempFechaDigitacion=new Date();
        this.regiones=[];
        this.obtenerRegiones();
        this.datoInsertPlan = new InsertarPlanKey();
    }

    obtenerRegiones(): void {
        this.regionService.getAll().subscribe(
            result => {
                this.regiones = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    ngOnInit(){
        this.editarPlanesKey = new ListaPlanesKey();
        this.suscription=this.descripcionForm.editarPlan$.subscribe(
            (editarPlanesKey)=>{
                if(editarPlanesKey!=undefined){
                    if(!editarPlanesKey.unsuscribe){
                        this.editarPlanesKey=editarPlanesKey;
                        this.tempFechaInicio=new Date(this.editarPlanesKey.FechaInicio);
                        this.tempFechaFin=new Date(this.editarPlanesKey.FechaFin);
                        this.tempFechaDigitacion=new Date(this.editarPlanesKey.FechaDigitacion);
                    }else{
                        this.ngOnDestroy();
                    }
                }
            }
        );
    }

    guardar(){
        this.editarPlanesKey.FechaInicio=this.tempFechaInicio;
        this.editarPlanesKey.FechaFin=this.tempFechaFin;
        this.editarPlanesKey.FechaDigitacion=this.tempFechaDigitacion;
        this.listaCorporativoService.updatePlan(this.editarPlanesKey)
                .subscribe( result => { 
                    if (result) {
                        this.authService.showSuccessPopup(result + "Registro actualizado correctamente");this.ngOnDestroy();
                        jQuery("#divPanelPlanes").collapse("hide");
                        jQuery("#clpListaContrato").collapse("show");
                        this.datoInsertPlan = new InsertarPlanKey(); 
                        this.editarPlanesKey = new ListaPlanesKey();
                    }
                    else {
                        this.authService.showErrorPopup("Ha ocurrido un error");    
                    }
                },
                    error => this.authService.showErrorPopup(error)
                );
                this.movimientoLista.SucursalEmpresa=this.editarPlanesKey.SucursalEmpresa;
                this.movimientoLista.CodigoProducto="COR";
                this.movimientoLista.EmpresaNumero=this.editarPlanesKey.EmpresaNumero;
                this.movimientoLista.FechaEfectoMovimiento=this.editarPlanesKey.FechaInicio;
                this.movimientoLista.Region=this.editarPlanesKey.Region;
                this.movimientoLista.ReferenciaDocumento=this.editarPlanesKey.SucursalEmpresa;
                this.movimientoLista.Precio=this.editarPlanesKey.PrecioBase;
                this.movimientoLista.Servicio=this.editarPlanesKey.CodigoPlan;
                this.movimientoListaService.createMovimientoLista(this.movimientoLista).subscribe(
                result=>{

                },
                    error => this.authService.showErrorPopup(error)
                );
        
    }

    ngOnDestroy(): void {
        if (this.suscription != undefined)
            this.suscription.unsubscribe();
        
    }
   
}