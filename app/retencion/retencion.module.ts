import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RetencionService } from '../common/servicios/retencion.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { RetencionRouting } from './retencion.routing';
import { CalificacionRetencionComponent } from './retencion.comentario.component';
import { ComentarioMovimientosComponent } from './comentarioMovimientos/comentario.movimientos.component';
import { DescuentoRetencionListComponent } from './retencion.desc.list.component';
import { DescuentoRetencionShowComponent } from './retencion.desc.show.component';
import { RetencionInfoComponent } from './retencion.info.component';
import { RetencionListComponent } from './retencion.list.component';
import { ReportesRetencionComponent } from './retencion.reportes.component';
import { RetencionShowComponent } from './retencion.show.component';
import { ReportesDescuentoRetencionComponent } from './retencion.desc.reportes.component';
import { RetencionCambioPlanComponent } from './cambioPlan/retencion.cambio.plan.component';
import { RetencionAnularProductoComponent } from './anularContrato/retencion.anular.producto.component';
import { RetencionParametrosComponent } from './retencion.parametros.component';
import {RetencionFormaPagoComponent} from './formaPago/formaPago.component';
import { AuthService } from '../seguridad/auth.service';
import { OnlyNumber } from './only-number.directive';

import { MovimientosComponent } from './cambioPlan/movimientos/movimientos.component';
import { ExclusionComponentModule } from './cambioPlan/exclusiones/exclusiones.module';
import { PlanTxFormComponent } from './cambioPlan/cambio/planTx.form.component';
import { ModificarBeneficiariosModule } from './modificarBeneficiarios/modificarBeneficiarios.module';
import {RetencionesState} from './services/retenciones.state'

@NgModule({
    imports: 
    [
        FormsModule,
        BrowserModule,
        HttpClientModule,
        NgxPaginationModule,
        NKDatetimeModule,
        ExclusionComponentModule,
        RetencionRouting,
        ModificarBeneficiariosModule
    ],
    exports: 
    [
        CalificacionRetencionComponent, 
        ComentarioMovimientosComponent,
        MovimientosComponent, 
        PlanTxFormComponent
    ],
    declarations: 
    [
        CalificacionRetencionComponent,
        ComentarioMovimientosComponent,
        DescuentoRetencionListComponent,
        DescuentoRetencionShowComponent,
        RetencionInfoComponent,
        RetencionListComponent,
        ReportesRetencionComponent,
        ReportesDescuentoRetencionComponent,
        RetencionCambioPlanComponent,
        RetencionAnularProductoComponent,
        RetencionShowComponent,
        OnlyNumber,
        RetencionParametrosComponent, 
        MovimientosComponent, 
        RetencionFormaPagoComponent, 
        PlanTxFormComponent
    ],
    providers: 
    [
        RetencionService,
        AuthService,
        RetencionesState
    ]
})

export class RetencionModule { }
