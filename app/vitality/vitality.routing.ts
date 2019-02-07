import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivateRoutes } from '../utils/activate.routes';
import { ConsultaLogSuscripcionVitality } from './logsSuscripcionVitality/consultaLogSuscripcionVitality.component';


const viltalityRoutes: Routes = [
    {
        path: 'logsSuscripcionVitality', component: ConsultaLogSuscripcionVitality, canActivate: [ActivateRoutes]
    }
];

export const vitalityRouting: ModuleWithProviders = RouterModule.forChild(viltalityRoutes);
