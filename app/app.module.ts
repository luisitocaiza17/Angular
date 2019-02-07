import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http, RequestOptions, Response, HttpModule, URLSearchParams, Headers } from '@angular/http';
import { RouterModule } from "@angular/router";
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import { LOCALE_ID } from '@angular/core';

import { routing, ROUTES, appRoutingProviders } from "./app.routes";
import { AppComponent } from './app.component';

import { LoginModule } from "./views/login/login.module";

//security components
import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth } from 'angular2-jwt';
import { AppAuthHttp } from './seguridad/appAuthHttp';
import { AuthService } from './seguridad/auth.service';
import { ActivateRoutes } from './utils/activate.routes';

//configuration components
import { AppConfig } from './app.config';
import { ConstantService } from './utils/constant.service';

// App views
import { MainViewModule } from "./views/main-view/main-view.module";
import { MinorViewModule } from "./views/minor-view/minor-view.module";

// App modules/components
import { ContratoModule } from './contrato/contrato.module';
import { AutorizacionModule } from './autorizacion/autorizacion.module';
import { AuditoriaAutorizacionModule } from './auditoriaAutorizacion/auditoriaAutorizacion.module';
import { OdasModule } from './odas/odas.module';
import { TransaccionesModule } from './transacciones/transacciones.module';
import { AuditoriaSistemaModule } from './auditoriaSistema/auditoriaSistema.module';
import { PrestadoresModule } from './prestadores/prestadores.module';
import { CatalogoModule } from './catalogo/catalogo.module';
import { AdministracionModule } from './administracion/administracion.module';
import { ConfiguracionFacturacionModule } from './facturacion/configuracionFacturacion.module';
import { sobresModule } from './sobres/sobres.module';
import { RetencionModule } from './retencion/retencion.module';
import { InformacionRetencionModule } from './informacionRetencion/infRet.module';
import { ReportesModule } from './reportes/reportes.module';
import { ReservasModule } from './reservas/reservas.module';
import { CorporativoModule } from './corporativo/corporativo.module';
import { VendedoresModule } from './comercial/comercial.module';
import { ListaCorporativoModule } from './listaCorporativo/listaCorporativo.module';
import { ServiciosAdicionalesModule } from './serviciosAdicionales/serviciosAdicionales.module';
// General modules/components
import { LayoutsModule } from "./components/common/layouts/layouts.module";
import { NavigationModule } from "./components/common/navigation/navigation.module";
import { TopnavbarModule } from "./components/common/topnavbar/topnavbar.module";
import { FooterModule } from "./components/common/footer/footer.module";
import { UnauthorizedModule } from "./components/common/unauthorized/unauthorized.module";
import { CommonModule } from "./facturacion/common/common.module";
import { SpinnerService } from './utils/spinner.service';
import { CobranzasModule } from './cobranzas/cobranzas.module';
import { utilidadesGenericasService } from './utils/utilidadesGenericas';
import { VariablesConstantService } from './utils/variableConstant.service.';

import { PortalClientesModule } from './portalClientes/portalClientes.module';
import { recaudosModule } from './recaudos/recaudos.module';
import {CorredoresModule} from './corredores/corredores.module';
import {LiquidacionModule} from './liquidacion/liquidacion.module';
import { ComisionesModule } from './comisiones/comisiones.module';
import { creditosModule } from './creditos/creditos.module';

import { MasivosModule } from './masivos/masivos.module';


import { cargaEstadoCuentaBancariaModule } from './cargaEstadoCuentaBancaria/cargaEstadoCuentaBancaria.module';
import { ContratoPCAModule } from './contratosPCA/contratoPCA.module';
import { VitalityModule } from './vitality/vitality.module';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    headerName: 'Authorization',
    headerPrefix: 'Bearer',
    tokenName: 'id_token',
    tokenGetter: (() => localStorage.getItem('id_token')),
    globalHeaders: [{ 'Content-Type': 'application/json' }],
    noJwtError: false
  }), http, options);
};

export function appConfigServiceFactory(appConfig: AppConfig) {
  return () => appConfig.load();
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // Angular modules
    BrowserModule,
    HttpModule,

    routing,
    FormsModule,

    // app modules
    ContratoModule,
    AutorizacionModule,
    AuditoriaAutorizacionModule,
    OdasModule,
    TransaccionesModule,
    AuditoriaSistemaModule,
    PrestadoresModule,
    CatalogoModule,
    AdministracionModule,
    ConfiguracionFacturacionModule,
    sobresModule,
    CobranzasModule,
    RetencionModule,
    InformacionRetencionModule,
    ReportesModule,
    CorporativoModule,
    CorredoresModule,//CORREDORES module
    ServiciosAdicionalesModule,
    LiquidacionModule,
    creditosModule,
    MasivosModule,
  //external modules

    // Views
    MainViewModule,
    MinorViewModule,
    LoginModule,

    // Modules
    NavigationModule,
    TopnavbarModule,
    FooterModule,
    LayoutsModule,
    UnauthorizedModule,
    VendedoresModule,
    ReservasModule,
    CommonModule,
    PortalClientesModule,
    ComisionesModule,
    recaudosModule,
    cargaEstadoCuentaBancariaModule,
    ContratoPCAModule,
    VitalityModule, 

    RouterModule.forRoot(ROUTES)
  ],
  providers: [appRoutingProviders, ActivateRoutes, { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: AuthHttp, useFactory: authHttpServiceFactory, deps: [Http, RequestOptions] }, AuthService,
    { provide: AppAuthHttp, useClass: AppAuthHttp }, AppConfig,
    { provide: APP_INITIALIZER, useFactory: appConfigServiceFactory, deps: [AppConfig], multi: true },
    { provide: LOCALE_ID, useValue: 'es-EC' },
    ConstantService, SpinnerService, utilidadesGenericasService, VariablesConstantService],
  bootstrap: [AppComponent]
})
export class AppModule { }