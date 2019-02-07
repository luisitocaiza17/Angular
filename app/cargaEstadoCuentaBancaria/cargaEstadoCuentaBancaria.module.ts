import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NKDatetimeModule } from 'ng2-datetime/ng2-datetime';

import { SpinnerService } from '../utils/spinner.service';
import { estadoCuentaBancariaRouting } from './cargaEstadoCuentaBancaria.routing';
import { menuCargaEstadoCuentaBancariaComponent } from './components/menuCargaEstadoCuentaBancaria/menuCargaEstadoCuentaBancaria.component';
import { configuracionCargaEstadoCuentaComponent } from './components/configuracionCargaEstadoCuenta/configuracionCargaEstadoCuenta.component';
import { cargaEstadoCuentaComponent } from './components/cargaEstadoCuentaBancaria/cargaEstadoCuenta.component';
import { CommonModule } from './components/common/common.module';


@NgModule({
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,
        NKDatetimeModule, CustomFormsModule, estadoCuentaBancariaRouting, CommonModule],
    declarations: [
        menuCargaEstadoCuentaBancariaComponent, 
        configuracionCargaEstadoCuentaComponent, 
        cargaEstadoCuentaComponent       
    ],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [SpinnerService]
})
export class cargaEstadoCuentaBancariaModule { }
