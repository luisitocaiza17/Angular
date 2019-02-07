
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { masivosRouting } from './masivos.routing';
import { ProcesoMasivoFormComponent } from './componentes/procesoMasivo.form.component';
import { CargaPrefacturaFormComponent } from './componentes/cargarPrefactura/cargaPrefactura.form.component';
import { AuditarGenerarReclamoFormComponent } from './componentes/auditarGenerarReclamos/auditarGenerarReclamo.form.component';
import { ConstantesMasivos } from './utils/constantesMasivos';
import { MasivosService } from './services/masivos.service';
import { CargarArchivosMasivosService } from './services/cargarArchivoMasivos.service';





@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule, masivosRouting],
    declarations: [CargaPrefacturaFormComponent, ProcesoMasivoFormComponent, AuditarGenerarReclamoFormComponent],
    exports: [CargaPrefacturaFormComponent, ProcesoMasivoFormComponent, AuditarGenerarReclamoFormComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [ConstantesMasivos, MasivosService, CargarArchivosMasivosService]
})
export class MasivosModule {

}
