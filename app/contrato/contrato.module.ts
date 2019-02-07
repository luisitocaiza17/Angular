import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { contratoRouting } from './contrato.routing'
import { ContratoListComponent } from './contrato.list.component';
import { ContratoViewComponent } from './contrato.view.component';
import { DetalleContratoComponent } from './detalleContrato/detalleContrato.component';
import { BeneficiariosComponent } from './beneficiarios/beneficiarios.component';
import { ResumenBeneficiarioComponent } from './beneficiarios/resumen/resumenBeneficiario.component';
import { DetalleBeneficiarioComponent } from './beneficiarios/detalleBeneficiario/detalleBeneficiario.component';
import { ReclamoComponent } from './beneficiarios/reclamo/reclamo.component';
import { AutorizacionBeneficiarioComponent } from './beneficiarios/autorizaciones/autorizacionBeneficiario.component';
import { ServicioAdicionalPersonaComponent } from './beneficiarios/servicioAdicional/servicioAdicionalPersona.component';
import { ExclusionBeneficiarioComponent } from './beneficiarios/exclusionBeneficiario/exclusionBeneficiario.component';
import { CoberturaBeneficiarioComponent } from './beneficiarios/cobertura/coberturaBeneficiario.component';
import { CotizacionesComponent } from './cotizaciones/cotizaciones.component';
import { CobranzaComponent } from './cobranzas/cobranza.component';
import { PlanComponent } from './plan/plan.component';
import { CarenciaComponent } from './beneficiarios/carencia/carencia.component';
import { MovimientosComponent } from './movimientos/movimientos.component';
import { SobreShowComponent } from './sobre/sobre.show.component';
import { SobreComponent } from './sobre/sobre.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ContratoService } from '../common/servicios/contrato.service';
import { RegionService } from '../common/servicios/region.service';
import { PlanService } from '../common/servicios/plan.service';
import { CoberturaPlanService } from '../common/servicios/coberturaPlan.service';
import { ServicioAdicionalPersonaService } from '../common/servicios/servicioAdicionalPersona.service';
import { SobreService } from '../common/servicios/sobre.service';
import { MovimientoService } from '../common/servicios/movimiento.service';
import { SobreReembolsoService } from '../sobres/service/sobreReembolso.service';
import { CotizacionService } from '../common/servicios/cotizacion.service';
import { CobranzaService } from '../common/servicios/cobranza.service';
import { CarenciaService } from '../common/servicios/carencia.service';
import { DetalleReclamoService } from '../common/servicios/detalleReclamo.service';
import { BeneficiarioService } from '../common/servicios/beneficiario.service';
import { CondicionParticularService } from '../common/servicios/condicionParticular.service';

import { ExclusionComponentModule } from '../components/common/exclusiones/exclusiones.module';
import { AutorizacionComponentModule } from '../components/common/autorizaciones/autorizaciones.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { CustomFormsModule } from 'ng2-validation';
import { ChartsModule } from 'ng2-charts';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

@NgModule({
    declarations: [ContratoListComponent, ContratoViewComponent, DetalleContratoComponent,
        BeneficiariosComponent, ResumenBeneficiarioComponent, DetalleBeneficiarioComponent, ReclamoComponent, AutorizacionBeneficiarioComponent,
        ServicioAdicionalPersonaComponent, ExclusionBeneficiarioComponent, CoberturaBeneficiarioComponent, CotizacionesComponent,
        CobranzaComponent, PlanComponent, MovimientosComponent, CarenciaComponent, SobreComponent, DashboardComponent, SobreShowComponent],
    exports: [ContratoViewComponent, DetalleContratoComponent, BeneficiariosComponent, ResumenBeneficiarioComponent, AutorizacionBeneficiarioComponent,
        DetalleBeneficiarioComponent, ReclamoComponent, ServicioAdicionalPersonaComponent, ExclusionBeneficiarioComponent, CoberturaBeneficiarioComponent,
        CotizacionesComponent, CobranzaComponent, PlanComponent, MovimientosComponent, CarenciaComponent, SobreComponent, DashboardComponent, SobreShowComponent],
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, ExclusionComponentModule, AutorizacionComponentModule,
        contratoRouting, NgxPaginationModule, CustomFormsModule, ChartsModule, NKDatetimeModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [ContratoService, RegionService, PlanService, CoberturaPlanService, CobranzaService,
        ServicioAdicionalPersonaService, SobreService, MovimientoService, CotizacionService,
        CarenciaService, DetalleReclamoService, BeneficiarioService, CondicionParticularService, SobreReembolsoService]
})
export class ContratoModule { }
