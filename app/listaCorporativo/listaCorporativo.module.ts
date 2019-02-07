import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { ListaCorporativoService } from '../common/servicios/listaCorporativo.service';

import { listaCorporativoRouting } from './listaCorporativo.routing'
import { ListaCorporativoFormComponent } from './listaCorporativo.form.component';
import { PlanFormComponent } from './plan.form.component';
import { DescripcionFormComponent } from './descripcion.form.component';
import { CrearPlanComponent } from './crear/crearPlanComponent';
import { EditarFormComponent } from './editar/editar.form.component';
import { CoberturaFormComponent } from './planCobertura/cobertura.form';
import { ManipulacionFormComponent } from './manipulacionBeneficiario/manipulacionBeneficiario.form';




@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule, 
        NKDatetimeModule, CustomFormsModule, listaCorporativoRouting],
    declarations: [ListaCorporativoFormComponent, PlanFormComponent, DescripcionFormComponent, CrearPlanComponent,EditarFormComponent,CoberturaFormComponent,ManipulacionFormComponent],
    exports: [ListaCorporativoFormComponent, PlanFormComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [ListaCorporativoService]
})
export class ListaCorporativoModule { 

}