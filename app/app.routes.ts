import { Routes, RouterModule } from "@angular/router";
import { mainViewComponent } from "./views/main-view/main-view.component";
import { minorViewComponent } from "./views/minor-view/minor-view.component";
import { loginComponent } from "./views/login/login.component";
import { blankComponent } from "./components/common/layouts/blank.component";
import { basicComponent } from "./components/common/layouts/basic.component";
import { UnauthorizedComponent } from "./components/common/unauthorized/unauthorized.component";
import { ModuleWithProviders } from '@angular/core';

import { ActivateRoutes } from './utils/activate.routes';

export const ROUTES: Routes = [
  // Main redirect
  { path: '', redirectTo: 'mainView', pathMatch: 'full' },

  // App views
  {
    path: '',
    children: [
      { path: 'mainView', component: mainViewComponent, canActivate: [ActivateRoutes] },
      { path: 'unauthorized', component: UnauthorizedComponent, data: { unauthorized: "unauthorized" } }
    ]
  },
  {
    path: '',
    children: [
      { path: 'login', component: loginComponent }
    ]
  },
  { path: '**', component: mainViewComponent }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(ROUTES);
