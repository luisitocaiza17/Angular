import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { CorporativoRouting } from './corporativo.routing';
import { CorporativoComponent} from './corporativo.component';
import { CorporativoCreateComponent } from './corporativo.create.component';
import { CorporativoFormComponent } from './corporativo.form.component';
import { DatosCorporativoFormComponent } from './Cambios/DatosCorporativo.form.component';
import { RepresentanteLegalFormComponent } from './Cambios/representatelegal.form.component';
import { DatosBrokerFormComponent } from './Cambios/datosbroker.form.component';
import { RegionService } from '../common/servicios/region.service';
import { GrupoService } from '../common/servicios/grupo.service';
import { ActividadService } from '../common/servicios/actividad.service';
import { SociedadService } from '../common/servicios/sociedad.service';
import { RolService } from '../common/servicios/rol.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { GruposListComponent } from './grupos.list.component';
import { SucursalFormComponent } from './sucursal.form.component';
import { DatosSucursalesFormComponent } from './Cambios/datossucursales.form.component';
import {HttpClientModule} from '@angular/common/http';
import {GrupoCorpListComponent} from './grupocorp.list.component';
import {EmpresaCorpComponent} from './empresacorp.component';
import {PagosConfCorpComponent} from './pagosconfcorp.component';
import {PrefacturaService} from '../common/servicios/prefactura.services';
import {TerminosCondicionesListComponent} from './terminoscondiciones.list.component';
import { NgxEditorModule } from 'ngx-editor';
import {UsuarioSaludCorpComponent} from './usuariosaludcorp.component';

@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CorporativoRouting, HttpClientModule, NgxEditorModule],

    declarations: [CorporativoComponent, CorporativoCreateComponent, CorporativoFormComponent,
         DatosCorporativoFormComponent, RepresentanteLegalFormComponent, DatosBrokerFormComponent, GruposListComponent,
            GrupoCorpListComponent, EmpresaCorpComponent, PagosConfCorpComponent,
        SucursalFormComponent, DatosSucursalesFormComponent, TerminosCondicionesListComponent, UsuarioSaludCorpComponent],

    exports: [CorporativoComponent, CorporativoCreateComponent, CorporativoFormComponent, DatosCorporativoFormComponent,
        RepresentanteLegalFormComponent, DatosBrokerFormComponent, SucursalFormComponent,
        DatosSucursalesFormComponent, TerminosCondicionesListComponent, UsuarioSaludCorpComponent],
    providers: [RegionService, RolService, GrupoService, ActividadService, SociedadService, PrefacturaService ]
})

export class CorporativoModule {
}
