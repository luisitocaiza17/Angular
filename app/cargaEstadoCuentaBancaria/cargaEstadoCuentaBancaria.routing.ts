import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivateRoutes } from '../utils/activate.routes';
import { menuCargaEstadoCuentaBancariaComponent } from './components/menuCargaEstadoCuentaBancaria/menuCargaEstadoCuentaBancaria.component';
import { cargaEstadoCuentaComponent } from './components/cargaEstadoCuentaBancaria/cargaEstadoCuenta.component';
import { configuracionCargaEstadoCuentaComponent } from './components/configuracionCargaEstadoCuenta/configuracionCargaEstadoCuenta.component';

const cargaEstadoCuentaBancariaRoutes: Routes = [
    {
        path: 'menuCargaEstadoCuentaBancaria', component: menuCargaEstadoCuentaBancariaComponent, canActivate: [ActivateRoutes], 
        children: [
            {
                path: 'carga', component: cargaEstadoCuentaComponent, canActivate: [ActivateRoutes]
            },
            {
                path: 'configuracion', component: configuracionCargaEstadoCuentaComponent, canActivate: [ActivateRoutes]
            }
        ]
    }, 
];

export const estadoCuentaBancariaRouting: ModuleWithProviders = RouterModule.forChild(cargaEstadoCuentaBancariaRoutes);
