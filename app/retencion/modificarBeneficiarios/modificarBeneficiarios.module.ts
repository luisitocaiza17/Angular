import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModificarBeneficiariosComponent } from './modificarBeneficiarios.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { RouterModule } from '../../../../node_modules/@angular/router';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';
import { DatosBeneficiariosComponent } from './datosBeneficiarios/datosBeneficiarios.component';
import { RetencionService } from '../../common/servicios/retencion.service';
import { DescuentoService } from '../../common/servicios/descuento.service';
import { TransaccionesModule } from '../../transacciones/transacciones.module';
import { ServiciosAdicionalesComponent } from './serviciosAdicionales/serviciosAdicionales.component';
import { ValoresBeneficiariosComponent } from './valoresBeneficiarios/valoresBeneficiarios.component';
import { utilidadesGenericasService } from '../../utils/utilidadesGenericas';
import { AdministracionSistemaService } from '../../common/servicios/administracionSistema.service';

@NgModule({
	declarations: [ModificarBeneficiariosComponent, DatosBeneficiariosComponent,
		ServiciosAdicionalesComponent, ValoresBeneficiariosComponent
	],
	exports: [ModificarBeneficiariosComponent],
	imports: [CommonModule, BrowserModule, FormsModule, NgxPaginationModule, 
		RouterModule, NKDatetimeModule, TransaccionesModule],
	providers: [RetencionService, DescuentoService, utilidadesGenericasService, AdministracionSistemaService],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModificarBeneficiariosModule { }