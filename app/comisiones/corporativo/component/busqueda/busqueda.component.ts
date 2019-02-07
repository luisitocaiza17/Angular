import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ListaCorporativoFilter, ListaCorporativoEntity, ListaCorporativoKey } from '../../model/listaCorporativo';
import { ConstantService } from '../../../../utils/constant.service';
import { AutorizacionService } from '../../../../common/servicios/autorizacion.service';
import { AuthService } from '../../../../seguridad/auth.service';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { CorporativoService } from '../../services/corporativo.service';
import { CorporativoReferidoEntity } from '../../model/corporativoReferidoEntity';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda.component.html'
})
export class BusquedaComponent implements OnInit {

    message:CorporativoReferidoEntity;
  
  isDesplegar: boolean;

    filter: ListaCorporativoFilter;
    listadoCorporativo: ListaCorporativoEntity[];
    empresa:CorporativoReferidoEntity;
    sucursales:string;

    private listaPlanesKey: BehaviorSubject<ListaCorporativoKey> = new BehaviorSubject<ListaCorporativoKey>(null);
    selectPlan$: Observable<ListaCorporativoKey> = this.listaPlanesKey.asObservable();

    constructor(public listaCorporativoService:CorporativoService, private authService: AuthService, 
        private chRef: ChangeDetectorRef, private constantService: ConstantService,  public autorizacionService: AutorizacionService, private corporativoService:CorporativoService)
    {
        this.filter = new ListaCorporativoFilter();
        this.listadoCorporativo = [];
        this.empresa = new CorporativoReferidoEntity();
        this.sucursales ="prueba";
        this.message = new CorporativoReferidoEntity();
    }
    
    ngOnInit(): void {
        this.filter = new ListaCorporativoFilter();
        this.listadoCorporativo = []; 
        this.isDesplegar = false;
    }

    colapsarTab(): void {
        this.isDesplegar = false;
        var key = new ListaCorporativoKey();
        this.listaPlanesKey.next(key);
    }

    inicializarPanelLista(selected: ListaCorporativoEntity): void {
        this.isDesplegar = true;
        this.chRef.detectChanges();
        jQuery("#clpListaContrato").collapse("hide");
        jQuery("#divPanelPlanes").collapse("show");
        this.crearPlanesKey(selected);
        // scroll top
        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelPlanes").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();
    }

    pageChanged(): void {
        this.filtrar();
    }

    crearPlanesKey(selected:ListaCorporativoEntity):void{
        var key = new ListaCorporativoKey();
        key.SucursalEmpresa = selected.SucursalEmpresa;
        key.EmpresaNumero = selected.EmpresaNumero;
        key.NewKey = true;
        this.empresa.SucursalEmpresa = selected.SucursalEmpresa;
        this.empresa.EmpresaNumero = selected.EmpresaNumero;
        this.corporativoService.obtenerSucursalEmpresa(this.empresa).subscribe((result)=>{
            key.VentaFamiliar = result.VentaFamiliar;
            this.message.PorcentajeDirectorReferidor = result.PorcentajeDirectorReferidor;
            this.message.PorcentajeReferidor = result.PorcentajeReferidor;
            this.message.CodigoReferidor = result.CodigoReferidor;
            key.PerteneceCompetancia = result.PerteneceCompetencia;
            key.CodigoReferidor = result.CodigoReferidor;
            key.PorcentajeDirectorReferidor = result.PorcentajeDirectorReferidor;
            key.PorcentajeReferidor = result.PorcentajeReferidor
          });
        this.listaPlanesKey.next(key);
    }

    buscar():void{
        this.autorizacionService.resetDefaultPaginationConstanst();
        this.listadoCorporativo=[];
        this.filtrar();
    }

    filtrar():void{
        this.listaCorporativoService.getByFilters(20,this.filter).subscribe(
            result => {
                this.listadoCorporativo = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    limpiar(): void {
        this.filter = new ListaCorporativoFilter();
        this.autorizacionService.resetDefaultPaginationConstanst();
        this.listadoCorporativo = [];
    }


}
