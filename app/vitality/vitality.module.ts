
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { vitalityRouting } from './vitality.routing';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SpinnerService } from '../utils/spinner.service';
import { ConsultaLogSuscripcionVitality } from './logsSuscripcionVitality/consultaLogSuscripcionVitality.component';


@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule, vitalityRouting, Ng2SmartTableModule],
    declarations: [
        ConsultaLogSuscripcionVitality
    ],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [SpinnerService]
})
export class VitalityModule { }
