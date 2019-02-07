import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ListaCorporativoFormComponent } from './listaCorporativo.form.component';
import { ListaCorporativoService } from '../common/servicios/listaCorporativo.service';
import { AuthService } from '../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { ListaPlanesCorporativoFilter, ListaPlanesCorporativoEntity, ListaPlanesKey } from '../common/model/listaPlanesCorporativo';
import { ListaCorporativoKey } from '../common/model/listaCorporativo';
import { PaginationService } from '../utils/pagination.service';
import { Permiso } from '../seguridad/usuario';
import { CoberturaPlanService } from '../common/servicios/coberturaPlan.service';
import { Router } from '@angular/router';

@Component({
    selector: 'planList',
    providers: [ListaCorporativoService],
    templateUrl: 'plan.form.template.html'
})

export class PlanFormComponent extends PaginationService implements OnDestroy {

    filter: ListaPlanesCorporativoFilter;
    listadoPlanesCorporativo: ListaPlanesCorporativoEntity[];
    planCorporativoSelecetd: ListaPlanesCorporativoEntity
    isDesplegar: boolean;
    suscription: any;
    listaPlanesKey: ListaPlanesKey
    FechaActual: Date;
    isDesplegarCrear: boolean;
    isDesplegarCobertura: boolean;
    isDesplegarManipulacion:boolean;
    todayDate: Date = new Date();
    accessModifcarPlanesCorporativos: boolean;

    private detalleKey: BehaviorSubject<ListaPlanesKey> = new BehaviorSubject<ListaPlanesKey>(null);
    selectPlan$: Observable<ListaPlanesKey> = this.detalleKey.asObservable();

    private _coberturaKey: BehaviorSubject<ListaPlanesCorporativoEntity> = new BehaviorSubject<ListaPlanesCorporativoEntity>(null);
    selectCobertura$: Observable<ListaPlanesCorporativoEntity> = this._coberturaKey.asObservable();

    constructor(private listaCorporativoForm: ListaCorporativoFormComponent,
        private coberturaService: CoberturaPlanService, private router: Router,
        private chRef: ChangeDetectorRef,
        public listaCorporativoService: ListaCorporativoService, private authService: AuthService,
        public autorizacionService: AutorizacionService) {
        super(1, 25);
        this.listaPlanesKey = new ListaPlanesKey();
        this.listadoPlanesCorporativo = [];
        this.filter = new ListaPlanesCorporativoFilter();
    }

    armarFiltro(listaPlanesKey: ListaCorporativoKey): ListaPlanesCorporativoFilter {
        this.filter.SucursalEmpresa = listaPlanesKey.SucursalEmpresa;

        return this.filter;
    }

    filtrar(): void {
        this.listaCorporativoService.getByPlanes(5, this.filter).subscribe(
            result => {
                this.listadoPlanesCorporativo = result;
                console.log('>>>>>>>>>>>>', this.listadoPlanesCorporativo);
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    inicializarPanelLista(selected: ListaPlanesCorporativoEntity): void {
        this.isDesplegar = true;
        this.chRef.detectChanges();
        jQuery("#clpListaDetalle").collapse("hide");
        jQuery("#divPanelDescripcion").collapse("show");
        this.crearPlanesKey(selected);

        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelPlanes").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();

    }

    pageChanged(): void {
        this.filtrar();
    }

    ngOnInit() {
        this.verificarPermisos();
        this.filter = new ListaPlanesCorporativoFilter();
        this.listadoPlanesCorporativo = [];
        this.isDesplegar = false;
        this.FechaActual = new Date;
        this.suscription = this.listaCorporativoForm.selectPlan$.subscribe(
            (listaPlanesKey) => {
                if (listaPlanesKey != undefined) {
                    if (!listaPlanesKey.unsuscribe) {
                        this.listaPlanesKey = listaPlanesKey;
                        this.armarFiltro(listaPlanesKey);
                        this.filtrar();
                    } else {
                        this.ngOnDestroy();
                    }
                }
            }
        );
    }

    crearPlanesKey(selected: ListaPlanesCorporativoEntity): void {
        var key = new ListaPlanesKey();
        key.CodigoPlan = selected.CodigoPlan;
        key.PrecioBase = selected.PrecioBase;
        key.CodigoTarifario = selected.CodigoTarifario;
        key.VersionPlan = selected.VersionPlan;
        key.NumeroBeneficiarios = selected.NumeroBeneficiarios;
        key.Region = selected.Region;
        key.FechaDigitacion = selected.FechaDigitacion;
        key.FechaInicio = selected.FechaInicio;
        key.FechaFin = selected.FechaFin
        key.MontoCoaseguro = selected.MontoCoaseguro;
        key.PorcentajeCoaseguro = selected.PorcentajeCoaseguro;
        key.EdadTope = selected.EdadTope;
        key.PorcentajeEdadTope = selected.PorcentajeEdadTope;
        key.DiasCarenciaAmbulatorio = selected.DiasCarenciaAmbulatorio;
        key.DiasCarenciaHospitalario = selected.DiasCarenciaHospitalario;
        key.DiasReclamo = selected.DiasReclamo;
        key.DiasAlcance = selected.DiasAlcance;
        key.MatNuevosBeneficios = selected.MatNuevosBeneficios;
        key.EdadFacturacion = selected.EdadFacturacion;
        key.CubreCongenitas = selected.CubreCongenitas;
        key.CubrePreexistencias = selected.CubrePreexistencias;
        key.NombrePlan = selected.NombrePlan;
        key.CodigoProducto = selected.CodigoProducto;
        key.EstadoPlan = selected.EstadoPlan;
        key.DiasPreexistencia = selected.DiasPreexistencia;
        key.EdadDependientes = selected.EdadDependientes;
        key.SucursalEmpresa = selected.SucursalEmpresa;
        key.EmpresaNumero = selected.EmpresaNumero;
        key.RazonSocial = selected.RazonSocial;
        key.NivelReferrencia = selected.NivelReferrencia;
        key.NewKey = true;
        this.detalleKey.next(key);
    }

    limpiar(): void {
        this.filter = new ListaPlanesCorporativoFilter();
        this.autorizacionService.resetDefaultPaginationConstanst();
        this.listadoPlanesCorporativo = [];
    }

    pintar(planSelected: ListaPlanesCorporativoEntity) {
        if (this.listadoPlanesCorporativo != undefined) {
            this.listadoPlanesCorporativo.forEach(element => {
                element.Selected = false;
            });
        }
        planSelected.Selected = true;
    }

    seleccionar(planSelected: ListaPlanesCorporativoEntity): void {
        this.isDesplegar = true;
        this.isDesplegarCrear = false;
        this.isDesplegarCobertura = false;
        this.pintar(planSelected);
        this.planCorporativoSelecetd = planSelected;
        this.inicializarPanelLista(this.planCorporativoSelecetd);
    }

    nuevoPlan() {
        this.listadoPlanesCorporativo.forEach(element => {
            element.Selected = false;
        });
        var key = new ListaPlanesKey();
        key.SucursalEmpresa = this.listaPlanesKey.SucursalEmpresa;
        key.EmpresaNumero = this.listaPlanesKey.EmpresaNumero;
        key.NewKey = true;
        this.detalleKey.next(key);
        this.planCorporativoSelecetd = new ListaPlanesCorporativoEntity();
        this.isDesplegar = false;
        this.isDesplegarCrear = true;
    }

    coberturaPlan(planSelected: ListaPlanesCorporativoEntity) {
        this._coberturaKey.next(planSelected);//pasar a cobertura.form.html

        this.pintar(planSelected);
        var key = new ListaPlanesKey();
        key.SucursalEmpresa = this.listaPlanesKey.SucursalEmpresa;
        key.EmpresaNumero = this.listaPlanesKey.EmpresaNumero;
        key.NewKey = true;
        this.detalleKey.next(key);
        this.planCorporativoSelecetd = new ListaPlanesCorporativoEntity();
        this.isDesplegar = false;
        this.isDesplegarManipulacion = false;
        this.isDesplegarCobertura = true;
    }

    manipulacionBene(planSelected: ListaPlanesCorporativoEntity) {
        this._coberturaKey.next(planSelected);//pasar a cobertura.form.html

        this.pintar(planSelected);
        var key = new ListaPlanesKey();
        key.SucursalEmpresa = this.listaPlanesKey.SucursalEmpresa;
        key.EmpresaNumero = this.listaPlanesKey.EmpresaNumero;
        key.NewKey = true;
        this.detalleKey.next(key);
        this.planCorporativoSelecetd = new ListaPlanesCorporativoEntity();
        this.isDesplegar = false;
        this.isDesplegarCobertura = false;
        this.isDesplegarManipulacion = true;
    }

    inicializarPanelCobertura(selected: ListaPlanesCorporativoEntity): void {

        this.isDesplegar = false;
        this.chRef.detectChanges();
        jQuery("#PanelPrincipal").collapse("hide");
        jQuery("#divPanelPlanes").collapse("show");
        this.crearPlanesKey(selected);

        this.chRef.detectChanges();
        var inipos = jQuery("#divPanelPlanes").position().top;
        jQuery("html, body").animate({ scrollTop: inipos + 228 }, 300);
        this.chRef.detectChanges();

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