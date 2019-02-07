import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivateRoutes } from '../utils/activate.routes';
import { BusquedaContratosComponent } from './gestionDeLaCobranza/agendarCitas/busquedaContratos/busquedaContratos.component';
import { menuGestionDeCobranzaComponent } from './gestionDeLaCobranza/menuGestionCobranza.component';
import { BusquedaCitasClienteComponent } from './gestionDeLaCobranza/consultasYAnadirObservacionesRutas/busquedaCitasCliente.component';
import { BusquedaContratosComponentForRecibos } from './impresionDeRecibos/busquedaContratos/busquedaContratos.component';
import { MenuReporteCobranzasComponent } from './reporteCobranzas/menuReporteCobranzas.form.component';
import { CuotasPendientesPagoComponent } from './reporteCobranzas/cuotasPendientes/cuotasPendientesPago.template';


const cobranzasRoutes: Routes = [
    {
        path: 'gestionDeCobranzas',
        children: [
            {
                path: 'menuGestionDeCobranza', component: menuGestionDeCobranzaComponent, canActivate: [ActivateRoutes],
                children: [
                    { path: 'busquedaContratos', component: BusquedaContratosComponent, canActivate: [ActivateRoutes] },
                    { path: 'busquedaCitasClientes', component: BusquedaCitasClienteComponent, canActivate: [ActivateRoutes] }
                ]
            },
            {
                path: 'impresionRecibos', component: BusquedaContratosComponentForRecibos, canActivate: [ActivateRoutes]
            }
        ],
    },
    {
        path: 'menuReporteCobranzas',
        children: [
            {
                path: 'form', component: MenuReporteCobranzasComponent, canActivate: [ActivateRoutes],
                children: [
                    { path: 'cuotasPendientesPago', component: CuotasPendientesPagoComponent, canActivate: [ActivateRoutes] }
                ]
            },
        ]
    },
];

export const cobranzasRouting: ModuleWithProviders = RouterModule.forChild(cobranzasRoutes);