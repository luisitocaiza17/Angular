
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';

import { odasRouting } from './odas.routing'

import { ContratosOdasListComponent } from './contratosOdas.list.component';
import { OdasListComponent } from './odas.list.component';
import { OdaFormComponent } from './oda.form.component';
import { EmailFormComponent } from './email.form.component';
import { ReporteOdasComponent} from './reporteOdas.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { ReclamoService } from '../common/servicios/reclamo.service';
@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, odasRouting, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule],
    declarations: [ContratosOdasListComponent, OdasListComponent, OdaFormComponent,EmailFormComponent, ReporteOdasComponent],
    exports: [OdasListComponent, OdaFormComponent,EmailFormComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [ReclamoService]
})
export class OdasModule { }
