
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { auditoriaAutorizacionRouting } from './auditoriaAutorizacion.routing';

import { AuditoriaAutorizacionListComponent } from './auditoriaAutorizacion.list.component';
import { AuditoriaAutorizacionService } from '../common/servicios/auditoriaAutorizacion.service';
import { ReporteService } from '../common/servicios/reporte.service';
import { CatalogoService } from '../common/servicios/catalogo.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, auditoriaAutorizacionRouting,
        NgxPaginationModule, NKDatetimeModule],
    declarations: [AuditoriaAutorizacionListComponent],
    providers: [AuditoriaAutorizacionService, ReporteService, CatalogoService]
})
export class AuditoriaAutorizacionModule { }
