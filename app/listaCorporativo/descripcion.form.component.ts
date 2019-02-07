import { Component, OnInit, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {ListaCorporativoService} from '../common/servicios/listaCorporativo.service';
import { AuthService } from '../seguridad/auth.service';
import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ListaPlanesCorporativoFilter, ListaPlanesCorporativoEntity, ListaPlanesKey, EmpresaDataKey, UltimoPlanCorporativoFilter} from '../common/model/listaPlanesCorporativo';
import { PlanFormComponent } from './plan.form.component';
import { InsertarPlanKey } from '../common/model/listaCorporativo';
import { Permiso } from '../seguridad/usuario';

@Component({
    selector:'descripcion-app',
    providers: [],
    templateUrl: 'descripcion.form.template.html'
})

export class DescripcionFormComponent implements OnDestroy{
    
    private empresaKey: BehaviorSubject<EmpresaDataKey> = new BehaviorSubject<EmpresaDataKey>(null);
    selectEmpresa$: Observable<EmpresaDataKey> = this.empresaKey.asObservable();

    private editarKey: BehaviorSubject<ListaPlanesKey>=new BehaviorSubject<ListaPlanesKey>(null);
    editarPlan$:Observable<ListaPlanesKey>=this.editarKey.asObservable();

    mostrarFormNuevo:boolean;
    mostrarFormeditar:boolean;
    filter:UltimoPlanCorporativoFilter
    ultimoPlan: InsertarPlanKey;
    suscription: any;
    listaPlanesKey:ListaPlanesKey
    isDesplegarEditar:boolean;
    isDesplegarCrear:boolean;
    accessModifcarPlanesCorporativos: boolean; 


    constructor(private planFormComponent:PlanFormComponent,private chRef: ChangeDetectorRef,
        public listaCorporativoService: ListaCorporativoService,private authService: AuthService){
        this.filter = new UltimoPlanCorporativoFilter();
        this.suscription=this.planFormComponent.selectPlan$.subscribe(
            (listaPlanesKey)=>{
                if(listaPlanesKey!=undefined){
                    if(!listaPlanesKey.unsuscribe){
                        this.isDesplegarCrear = false; 
                        this.isDesplegarEditar = false; 
                        this.listaPlanesKey=listaPlanesKey;
                        
                    }else{
                        this.ngOnDestroy();
                    }
                }
            }
        );
    }



    nuevo(selected:ListaPlanesKey) {
            this.mostrarFormNuevo=false;
            this.mostrarFormeditar=false;
            this.isDesplegarCrear = true;
            this.isDesplegarEditar = false;
            jQuery("#clpListaPlanes").collapse("hide");
            jQuery("#divpanelnuevoplan").collapse("show");
            this.crearEmpresaData();
            this.chRef.detectChanges();
            var inipos = jQuery("#divpanelnuevoplan").position().top;
            jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
            this.chRef.detectChanges();
          }

    editar(selected:ListaPlanesKey) {
            this.isDesplegarEditar=true;
            this.isDesplegarCrear=false;
            this.mostrarFormNuevo=false;
            this.mostrarFormeditar=false;
            jQuery("#clpListaPlanes").collapse("hide");
            jQuery("#divpaneleditarplan").collapse("show");
            this.editarPlanes();
            this.chRef.detectChanges();
            this.chRef.detectChanges();
            
          }
    
    ngOnInit(){
        this.verificarPermisos(); 
        this.listaPlanesKey=new ListaPlanesKey();
        this.isDesplegarCrear=false;
        this.isDesplegarEditar=false;
        this.mostrarFormNuevo=false;
        this.mostrarFormeditar=false;

    }

    obtenerUltimoPlanCorporativo(): void {
        this.listaCorporativoService.getByUltimoPlan(this.filter).subscribe(
            result => {
                this.ultimoPlan = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }


    editarPlanes(){
        var key=new ListaPlanesKey();
        key=this.listaPlanesKey;
        key.NewKey=true;
        this.editarKey.next(key);
    }

    crearEmpresaData(){
        var key = new EmpresaDataKey();
        key.EmpresaNumero=this.listaPlanesKey.EmpresaNumero;
        key.SucursalNombre=this.listaPlanesKey.SucursalNombre;
        key.RazonSocial=this.listaPlanesKey.RazonSocial;
        key.SucursalEmpresa=this.listaPlanesKey.SucursalEmpresa;
        this.filter.SucursalEmpresa=this.listaPlanesKey.SucursalEmpresa;
        this.obtenerUltimoPlanCorporativo();
        key.NewKey = true;
        this.empresaKey.next(key);
    }
   
    ngOnDestroy() {
        if (this.suscription != undefined)
            this.suscription.unsubscribe();
    }

    verificarPermisos(): void {

        this.accessModifcarPlanesCorporativos = false;
        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {
            var admin = listaPermisos.find(p => p == Permiso.ADMINISTRADOR);
            if (admin != undefined) {
                this.accessModifcarPlanesCorporativos = true;
            }

            var auth = listaPermisos.find(p => p == Permiso.MODIFICAR_PLANES_COR);
            if (auth != undefined) {
                this.accessModifcarPlanesCorporativos = true;
            }
        }
    }
}