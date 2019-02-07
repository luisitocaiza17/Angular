
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReportesService } from '../common/servicios/reportes.service';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { ReportesRouting } from './reportes.routing';
import { ReportesComponent } from './reportes.component';

@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        HttpClientModule,
        NKDatetimeModule,
        ReportesRouting
    ],
    exports: [],
    declarations: [
        ReportesComponent
    ],
    providers: [
        ReportesService
    ]
})

export class ReportesModule { }
