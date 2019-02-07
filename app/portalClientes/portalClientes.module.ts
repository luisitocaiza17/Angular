
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { portalClientesRouting } from './portalClientes.routing';
import { PortalClientesFormComponent } from './portalClientes.form.component';




@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule, portalClientesRouting],
    declarations: [PortalClientesFormComponent],
    exports: [PortalClientesFormComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: []
})
export class PortalClientesModule { 

}
