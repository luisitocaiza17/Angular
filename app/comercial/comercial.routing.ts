import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReporteVendedoresFormComponent } from './componentes/reporteCartera/reporteVendedores.form.component';
import { DirectoresListComponent } from './componentes/ejecutivosComerciales/directores.list.component';
import { AdminsitractionFunesFormComponent } from './componentes/administracionFunes/administracionFunes.form.component';



import { ActivateRoutes } from '../utils/activate.routes';
import { VendedoresComponent } from './componentes/ejecutivosComerciales/vendedores.component';

const vendedoresRoutes: Routes = [
    {
        path: 'reporteVendedores',
        children: [{ path: 'form', component: ReporteVendedoresFormComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'ejecutivoComercial',
        children: [{ path: 'list', component: DirectoresListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'vendedores/:director',component: VendedoresComponent, canActivate: [ActivateRoutes]
    },
    {
        path: 'administracionFunes',
        children: [{ path: 'form', component: AdminsitractionFunesFormComponent, canActivate: [ActivateRoutes] }]
    }
];

export const vendedoresRouting: ModuleWithProviders = RouterModule.forChild(vendedoresRoutes);