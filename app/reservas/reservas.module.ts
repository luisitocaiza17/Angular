
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { ReporteService } from '../common/servicios/reporte.service';

import { reservasRouting } from './reservas.routing'
import { ReporteReservasFormComponent } from './reporteReservas.form.component';
import { ConfiguracionReservasFormComponent } from './configuracionReservas.form.component';



@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule, reservasRouting],
    declarations: [ReporteReservasFormComponent,ConfiguracionReservasFormComponent],
    exports: [ReporteReservasFormComponent,ConfiguracionReservasFormComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [ReporteService]
})
export class ReservasModule { 

}
