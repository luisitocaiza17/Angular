import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { ReporteService } from '../common/servicios/reporte.service';
import { vendedoresRouting } from './comercial.routing'
import { ReporteVendedoresFormComponent } from './componentes/reporteCartera/reporteVendedores.form.component'
import { DirectoresListComponent } from './componentes/ejecutivosComerciales/directores.list.component';
import { AgregarEditarDirectorFormComponent } from './componentes/ejecutivosComerciales/agregarEditarDirector.form.component';
import { AdminsitractionFunesFormComponent } from './componentes/administracionFunes/administracionFunes.form.component';
import { AsignaFunFormComponent } from './componentes/administracionFunes/asignarFun/asignaFun.form.component';
import { AnularFunFormComponent } from './componentes/administracionFunes/anularFun/anularFun.form.component';
import { IngresarFunFormComponent } from './componentes/administracionFunes/ingresarFun/ingresarFun.form.component';
import { ReactivarFunFormComponent } from './componentes/administracionFunes/reactivarFun/reactivarFun.form.component';
import { ConsultarFunFormComponent } from './componentes/administracionFunes/consultarFun/consultarFun.form.component';
import { CatalogoComercialService } from './service/catalogoComercial.service';
import { VendedoresComponent } from './componentes/ejecutivosComerciales/vendedores.component';
import { AgregarEditarVendedorComponent } from './componentes/ejecutivosComerciales/agregarEditarVendedor.component';
import { FacturaPreviaFunFormComponent } from './componentes/administracionFunes/activarFunFacturaPrevia/facturaPreviaFun.form.component';

@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule, vendedoresRouting],
    declarations: [
        ReporteVendedoresFormComponent, 
        DirectoresListComponent, 
        AgregarEditarDirectorFormComponent, 
        VendedoresComponent, 
        AgregarEditarVendedorComponent, 
        AdminsitractionFunesFormComponent, 
        AsignaFunFormComponent, 
        AnularFunFormComponent, 
        IngresarFunFormComponent, 
        ReactivarFunFormComponent, 
        ConsultarFunFormComponent, 
        FacturaPreviaFunFormComponent
    ],
    exports: [ReporteVendedoresFormComponent, DirectoresListComponent, AgregarEditarDirectorFormComponent, AdminsitractionFunesFormComponent, AsignaFunFormComponent, AnularFunFormComponent, IngresarFunFormComponent, ReactivarFunFormComponent, ConsultarFunFormComponent, FacturaPreviaFunFormComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [ReporteService, CatalogoComercialService]
})
export class VendedoresModule {

}
