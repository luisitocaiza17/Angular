
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { cobranzasRouting } from './cobranzas.routing';
import { SpinnerService } from '../utils/spinner.service';
import { impresionDeRecibosCobranzaComponent } from './impresionDeRecibos/impresionDeRecibos.component';
import { BusquedaContratosComponent } from './gestionDeLaCobranza/agendarCitas/busquedaContratos/busquedaContratos.component';
import { FormularioDatosCobranza } from './gestionDeLaCobranza/agendarCitas/FormularioDatosCobranza/formularioDatosCobranza.component';
import { menuGestionDeCobranzaComponent } from './gestionDeLaCobranza/menuGestionCobranza.component';
import { BusquedaCitasClienteComponent } from './gestionDeLaCobranza/consultasYAnadirObservacionesRutas/busquedaCitasCliente.component';
import { BusquedaContratosComponentForRecibos } from './impresionDeRecibos/busquedaContratos/busquedaContratos.component';
import { MenuReporteCobranzasComponent } from './reporteCobranzas/menuReporteCobranzas.form.component';
import { CuotasPendientesPagoComponent } from './reporteCobranzas/cuotasPendientes/cuotasPendientesPago.template';

@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule, cobranzasRouting],
    declarations: [BusquedaContratosComponent,
        impresionDeRecibosCobranzaComponent,
        FormularioDatosCobranza,
        menuGestionDeCobranzaComponent,
        BusquedaCitasClienteComponent,
        BusquedaContratosComponentForRecibos,
        MenuReporteCobranzasComponent,
        CuotasPendientesPagoComponent
    ],
    exports: [
        
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [SpinnerService]
})
export class CobranzasModule {

}
