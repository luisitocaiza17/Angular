import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {NKDatetimeModule} from 'ng2-datetime/ng2-datetime';
import {HttpClientModule} from '@angular/common/http';
import {NgxEditorModule} from 'ngx-editor';
import {ServiciosAdicionalesRouting} from './serviciosAdicionales.routing';
import {ServiciosAdicionalesBasesService} from '../common/servicios/serviciosAdicionalesBases.service';
import {ServiciosAdicionalesAdminService} from '../common/servicios/serviciosAdicionalesAdmin.service';
import {BasesListComponent} from './bases/bases.list.component';
import {MovimientosModalComponent} from './detalles/movimientos.modal.component';
import {GapModalComponent} from './detalles/gap.modal.component';
import {DetallesTableComponent} from './detalles/detalles.table.component';
import {ErroresListComponent} from './errores/errores.list.component';
import {PolizasListComponent} from './poliza/polizas.list.component';
import {PolizasAdminComponent} from './poliza/polizas.admin.component';
import {CriteriosModalComponent} from './criterios/criterios.modal.component';
import {LiberarBaseModalComponent} from './detalles/liberarbase.modal.component';
import {SwitchComponent} from '../components/common/toggle/switch.component';
import {ToggleComponent} from '../components/common/toggle/toggle.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        ReactiveFormsModule,
        FormsModule,
        NgxPaginationModule,
        NKDatetimeModule,
        HttpClientModule,
        NgxEditorModule,
        ServiciosAdicionalesRouting
    ],
    declarations: [
        BasesListComponent,
        MovimientosModalComponent,
        GapModalComponent,
        DetallesTableComponent,
        ErroresListComponent,
        PolizasListComponent,
        PolizasAdminComponent,
        CriteriosModalComponent,
        LiberarBaseModalComponent,
        SwitchComponent,
        ToggleComponent
    ],
    exports: [
        BasesListComponent,
        MovimientosModalComponent,
        GapModalComponent,
        DetallesTableComponent,
        ErroresListComponent,
        PolizasListComponent,
        PolizasAdminComponent,
        CriteriosModalComponent,
        LiberarBaseModalComponent
    ],
    providers: [
        ServiciosAdicionalesBasesService,
        ServiciosAdicionalesAdminService
    ]
})

export class ServiciosAdicionalesModule {
}
