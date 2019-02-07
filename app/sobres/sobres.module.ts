
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { sobresRouting } from './sobres.routing'
import { ContratosSbListComponent } from './componentes/porContrato/contratosSb.list.component';
import { SobresFormComponent } from './componentes/porContrato/sobres.form.component';
import { IngresarSobreFormComponent } from './componentes/porContrato/ingresar/ingresarSobre.form.component';
import { ConsultarSobreFormComponent } from './componentes/porContrato/consultar/consultarSobre.form.component';
import { AsignarSobreByContratoFormComponent } from './componentes/porContrato/asignar/asignarSobreContrato.form.component';
import { AnularSobreByContratoFormComponent } from './componentes/porContrato/anular/anularSobreContrato.form.component';
import { ReportarSobreFormComponent } from './componentes/reportes/reporteSobres.form.component';
import { AsignarSobresFormComponent } from './componentes/asignar/asignarSobres.form.component';
import { ConsultorSobresFormComponent } from './componentes/consultor/consultorSobres.form.component';
import { SbConsultorListComponent } from './componentes/consultor/listadoSbConsultor.list.component';
import { EmailSobresFormComponent } from './componentes/consultor/sobresMail.form.component';
import { DevolucionSobresListComponent } from './componentes/devolucion/devolucionSobres.list.component';
import { GestionDevSobresFormComponent } from './componentes/devolucion/gestiondevSobres.form.component';
import { AdministracionFormComponent } from './componentes/autorizar/administracionSobre.form.component';
import { VerificarPendientesSobresFormComponent } from './componentes/autorizar/verificarPendientes.form.component';
import { SimuladorReporteConstitucionFormComponent } from './componentes/reportes/reporteSimuladorConstitucion.form.component';

import { SobreReembolsoService } from './service/sobreReembolso.service';
import { CatalogoSobreReembolsoService } from './service/catalogoSobreReembolso.service';
import { ConstantesSobres } from './utils/constantesSobres';

@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule, sobresRouting],
    declarations: [ContratosSbListComponent, SobresFormComponent, IngresarSobreFormComponent,
        ConsultarSobreFormComponent, AsignarSobreByContratoFormComponent, ReportarSobreFormComponent,
        AsignarSobresFormComponent, ConsultorSobresFormComponent, SbConsultorListComponent,
        EmailSobresFormComponent, AnularSobreByContratoFormComponent, DevolucionSobresListComponent,
        GestionDevSobresFormComponent, AdministracionFormComponent, VerificarPendientesSobresFormComponent,
        SimuladorReporteConstitucionFormComponent],
    exports: [ContratosSbListComponent, SobresFormComponent, IngresarSobreFormComponent,
        ConsultarSobreFormComponent, AsignarSobreByContratoFormComponent, ReportarSobreFormComponent,
        AsignarSobresFormComponent, ConsultorSobresFormComponent, SbConsultorListComponent,
        EmailSobresFormComponent, AnularSobreByContratoFormComponent, DevolucionSobresListComponent,
        GestionDevSobresFormComponent, AdministracionFormComponent, VerificarPendientesSobresFormComponent,
        SimuladorReporteConstitucionFormComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [SobreReembolsoService, CatalogoSobreReembolsoService, ConstantesSobres]
})
export class sobresModule {

}
