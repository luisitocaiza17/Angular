import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute } from '@angular/router';
import { ActivateRoutes } from '../utils/activate.routes';
import { SalasComponent } from './salas/component/ingresar/salas.component';
import { ConsultarSalasComponent } from './salas/component/consultar/consultarSalas.component';
import { ConsultarTipoComponent } from './tipo/component/consultar/consultarTipo.component';
import { ConsultarSubtipoComponent } from './subtipo/component/consultar/consultarSubtipo.component';
import { ConsultarNivelesComponent } from './niveles/component/consultar/consultarNiveles.component';
import { ConsultarCanalesComponent } from './canales/component/consultar/consultarCanales.component';
import { ConsultarRangosComponent } from './rangos/component/consultar/consultarRangos.component';
import { ConsultarPresupuestoVendedorComponent } from './presupuesto-vendedor/component/consultar/consultarPresupuestoVendedor.component';
import { ConsultarPresupuestoDirectorComponent } from './presupuesto-director/component/consultar/consultarPresupuestoDirector.component';
import { BusquedaComponent } from './corporativo/component/busqueda/busqueda.component';
import { ConsultasComisionesComponent } from './consultasComisiones/component/consultas/consultasComisiones.component';
import { menuParametrizacionComisionesComponent } from './menuParametrizacion/menuParametrizacionComisiones.component';
import { ConsultaPresupuestoRangosDirectorComponent } from './presupuestoRangosDirector/component/consultar/consultaPresupuestoRangosDirector.component';
import { SemaforoComponent } from './semaforo/component/semaforo.component';
import { PremiosBonosComponent } from './premiosBonos/components/premiosBonos.component';
import { IndicadoresComponent } from './premiosBonos/components/indicadores/indicadores.component';
import { PremioComponent } from './premios/component/premio.component';
import { MovimientoComisionManualComponent } from './movimientoComisionManual/gestionSimpleMovimientosManuales/movimientoComisionManual.component';
import { menuMovimientosManualesComponent } from './movimientoComisionManual/menuMovimientosManuales/menuMovimientosManuales.component';
import { CargaLoteMovimientosManualesComponent } from './movimientoComisionManual/gestionLoteMovimientosManuales/cargaLoteMovimientosManuales.component';
import { DetallePremioComponent } from './premios/component/detallePremio.component';
import { ValorPremioComponent } from './premios/component/valorPremio.component';
import { BonosComisionesComponent } from './menuParametrizacion/bonos/bonosComisiones.component';


const comisionesRoutes: Routes = [
    
    {
        path: 'menuParametrizacionComisiones', component: menuParametrizacionComisionesComponent, canActivate: [ActivateRoutes], 
        children: [
            { path: 'salas', component: ConsultarSalasComponent, canActivate: [ActivateRoutes] }, 
            { path: 'tipos', component: ConsultarTipoComponent, canActivate: [ActivateRoutes] }, 
            { path: 'subtipos', component: ConsultarSubtipoComponent, canActivate: [ActivateRoutes] }, 
            { path: 'niveles', component: ConsultarNivelesComponent, canActivate: [ActivateRoutes] }, 
            { path: 'canales', component: ConsultarCanalesComponent, canActivate: [ActivateRoutes] }, 
            { path: 'rangos', component: ConsultarRangosComponent, canActivate: [ActivateRoutes] }, 
            { path: 'bonos', component: BonosComisionesComponent, canActivate: [ActivateRoutes] }
        ]
    },
    {
        path: 'presupuestoVendedor',
        children: [{ path: 'form', component: ConsultarPresupuestoVendedorComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'presupuestoDirector',
        children: [{ path: 'form', component: ConsultarPresupuestoDirectorComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'presupuestoRangosDirector',
        children: [{ path: 'form', component: ConsultaPresupuestoRangosDirectorComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'comisionCorporativo',
        children: [{ path: 'form', component: BusquedaComponent, canActivate: [ActivateRoutes] }]
    }, 
    {
        path: 'consultasComisiones',  component: ConsultasComisionesComponent, canActivate: [ActivateRoutes]

    }, 
    {
        path: 'menuMovimientosManuales',  component: menuMovimientosManualesComponent, canActivate: [ActivateRoutes], 
        children: [
            {path: 'movimientoComisionManual',  component: MovimientoComisionManualComponent, canActivate: [ActivateRoutes] }, 
            {path: 'cargaMovimientosManualesEnLote',  component: CargaLoteMovimientosManualesComponent, canActivate: [ActivateRoutes] }
        ]      
    }, 
    {
        path: 'semaforoComisiones',  component: SemaforoComponent, canActivate: [ActivateRoutes]
    },
    {
        path: 'premiosBonos', component: PremiosBonosComponent, canActivate: [ActivateRoutes],
        children: [
            { path: 'indicadores', component: IndicadoresComponent, canActivate: [ActivateRoutes] }
        ]
    }, 
    {
        path: 'parametrizacionPremios',
        children: [
            { path: 'premios', component: PremioComponent, canActivate: [ActivateRoutes] },
            { path: 'premios/:idPremio/detallePremios', component: DetallePremioComponent, canActivate: [ActivateRoutes] },
            { path: 'premios/:idPremio/detallePremios/:idDetalle/valorPremios', component: ValorPremioComponent, canActivate: [ActivateRoutes] }
        ]
    }
];
export const comisionesRouting: ModuleWithProviders = RouterModule.forChild(comisionesRoutes);
