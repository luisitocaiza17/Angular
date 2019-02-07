import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { CorporativoComponent } from './corporativo.component';
import { ActivateRoutes } from '../utils/activate.routes';
import { CorporativoCreateComponent } from './corporativo.create.component';
import { GruposListComponent } from './grupos.list.component';
import {GrupoCorpListComponent} from './grupocorp.list.component';
import {EmpresaCorpComponent} from './empresacorp.component';
import {PagosConfCorpComponent} from './pagosconfcorp.component';
import {TerminosCondicionesListComponent} from './terminoscondiciones.list.component';
import {UsuarioSaludCorpComponent} from './usuariosaludcorp.component';



const corporativoRoutes: Routes = [
    {
        path: 'consultarEmpresas',
        children: [{ path: 'list', component: CorporativoComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'crearCorporativo',
        children: [{path: 'create', component: CorporativoCreateComponent, canActivate: [ActivateRoutes]}]
    },
    {
        path: 'consultarGrupos',
        children: [{ path: 'list', component: GruposListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'consultarGrupoCorp',
        children: [{ path: 'list', component: GrupoCorpListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'EmpresaCorp',
        children: [{ path: 'list', component: EmpresaCorpComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'PagosConfCorp',
        children: [{ path: 'list', component: PagosConfCorpComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'TerminosCondiciones',
        children: [{ path: 'list', component: TerminosCondicionesListComponent, canActivate: [ActivateRoutes] }]
    },
    {
        path: 'UsuarioSaludCorp',
        children: [{ path: 'list', component: UsuarioSaludCorpComponent, canActivate: [ActivateRoutes] }]
    },
];

export const CorporativoRouting: ModuleWithProviders = RouterModule.forChild(corporativoRoutes);

