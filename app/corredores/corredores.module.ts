import {CorredoresCondicionesListComponent} from './corredoresCondiciones.list.component';
import {CorredoresProcessListComponent} from './corredoresProcess.list.component';
import {HttpModule} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CustomFormsModule } from 'ng2-validation';

import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import {HttpClientModule} from '@angular/common/http';
import {CorredoresRouting} from './corredores.routing';
import {CorredoresAdministracionListComponent} from './corredoresAdministracion.list.component';
import { NgxEditorModule } from 'ngx-editor';
import {CorredoresGrupoAgentesListComponent} from './corredoresGrupoAgentes.list.component';
import {CorredoresReasignacionListComponent} from './corredoresReasignacion.list.component';
import {CorredoresReporteReasignacionListComponent} from './corredoresReporteReasignacion.list.component';

@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CorredoresRouting, HttpClientModule, NgxEditorModule
    ],

    declarations: [CorredoresCondicionesListComponent, CorredoresAdministracionListComponent,
        CorredoresProcessListComponent, CorredoresGrupoAgentesListComponent, CorredoresReasignacionListComponent,
        CorredoresReporteReasignacionListComponent],

    exports: [ CorredoresCondicionesListComponent, CorredoresAdministracionListComponent,
        CorredoresProcessListComponent, CorredoresGrupoAgentesListComponent, CorredoresReasignacionListComponent,
        CorredoresReporteReasignacionListComponent],

    providers: [ ]
})

export class CorredoresModule {

}
