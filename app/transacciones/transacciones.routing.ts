import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContratosTxListComponent } from './contratosTx.list.component';
import { ReporteMovimientosComponent } from './reportes/reporteMovimientos.component';
import { ComentarioMovimientosComponent } from './comentarioMovimientos/comentario.movimiento.form.component';
import { ActivateRoutes } from '../utils/activate.routes';
import { TransferenciaRemesaComponent } from "./transferencias/TransferenciaRemesaComponent";
import { TransferenciaYCierreFormComponent } from './transferencias/transferenciaYCierre.form.component';

const transaccionesRoutes: Routes = [
    {
        path: 'transacciones',
        children: [
            { path: 'list', component: ContratosTxListComponent, canActivate: [ActivateRoutes] },
            { path: 'comentario/movimiento', component: ComentarioMovimientosComponent }]
    },
    {
        path: 'reporteMovimientos',
        children: [{ path: 'list', component: ReporteMovimientosComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'transferenciaYCierre/:remesa/:linea/:banco',component: TransferenciaYCierreFormComponent, canActivate: [ActivateRoutes]
    },
    {
        path: 'transferenciaRemesa',
        children: [{ path: 'list', component: TransferenciaRemesaComponent, canActivate: [ActivateRoutes] }]
    }
];

export const transaccionesRouting: ModuleWithProviders = RouterModule.forChild(transaccionesRoutes);