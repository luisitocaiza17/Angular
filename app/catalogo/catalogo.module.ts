import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { catalogoRouting } from './catalogo.routing';
import { CatalogoDiagnosticoListComponent } from './catalogoDiagnostico.list.component';
import { CatalogoProcedimientoListComponent } from './catalogoProcedimiento.list.component';
import { CatalogoValorPuntoListComponent } from './valorPunto/catalogoValorPunto.list.component';
import { AgregarValorPuntoFormComponent } from './valorPunto/agregarValorPunto.form.component';

import { ValorPuntoService } from '../common/servicios/valorPunto.service';
@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, catalogoRouting,
        NgxPaginationModule, NKDatetimeModule],
    declarations: [CatalogoDiagnosticoListComponent, CatalogoProcedimientoListComponent,
        CatalogoValorPuntoListComponent, AgregarValorPuntoFormComponent],
    providers: [ValorPuntoService]
})
export class CatalogoModule { }
