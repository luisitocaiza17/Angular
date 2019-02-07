
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { creditosRouting } from './creditos.routing';
import { ContratosCrListComponent } from './componentes/porContrato/contratosCrList.list.component';

import { CreditosFormComponent } from './componentes/porContrato/creditos.form.component';
import { SobreReembolsoService } from '../sobres/service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from '../sobres/service/catalogoSobreReembolso.service';
import { IngresarCreditoFormComponent } from './componentes/porContrato/ingresar/ingresarCredito.form.component';
import { ReportarCreditoFormComponent } from './componentes/reportes/reporteCredito.form.component';
import { AsignarCreditosFormComponent } from './componentes/asignar/asignarCreditos.form.component';
import { ConsultorCreditosFormComponent } from './componentes/consultor/consultorCredito.form.component';
import { CrConsultorListComponent } from './componentes/consultor/listadoCrConsultor.list.component';

import { ConstantesCreditos } from './utils/ConstantesCreditos';

import { AdministracionFormComponent } from './componentes/autorizar/administracionCredito.form.component';
import { VerificarPendientesCreditoFormComponent } from './componentes/autorizar/verificarPendientes.form.component';


@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule, creditosRouting],
    declarations: [ContratosCrListComponent, CreditosFormComponent, IngresarCreditoFormComponent,
        ReportarCreditoFormComponent, AsignarCreditosFormComponent, ConsultorCreditosFormComponent, AdministracionFormComponent,
        VerificarPendientesCreditoFormComponent, CrConsultorListComponent],
    exports: [ContratosCrListComponent, CreditosFormComponent, IngresarCreditoFormComponent, AdministracionFormComponent,
        ReportarCreditoFormComponent, AsignarCreditosFormComponent, ConsultorCreditosFormComponent,
        VerificarPendientesCreditoFormComponent, CrConsultorListComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [SobreReembolsoService, CatalogoSobreReembolsoService, ConstantesCreditos]
})
export class creditosModule {

}
