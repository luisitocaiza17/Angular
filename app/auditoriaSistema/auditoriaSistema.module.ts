import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { auditoriaSistemaRouting } from './auditoriaSistema.routing';
import { AuditoriaSistemaListComponent } from './auditoriaSistema.list.component';
import { AuditoriaSistemaService } from '../common/servicios/auditoriaSistema.service';
import { ReporteService } from '../common/servicios/reporte.service';
import { CatalogoService } from '../common/servicios/catalogo.service';
import { UsuarioService } from '../common/servicios/usuario.service';

@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, auditoriaSistemaRouting,
        NgxPaginationModule, NKDatetimeModule],
    declarations: [AuditoriaSistemaListComponent],
    providers: [AuditoriaSistemaService, ReporteService, CatalogoService, UsuarioService]
})
export class AuditoriaSistemaModule { }
