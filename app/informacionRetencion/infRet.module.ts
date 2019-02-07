
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { InformacionRetencionService } from '../common/servicios/informacionRetencion.service';
import { InformacionRetencionRouting } from './infRet.routing';
import { InfRetVerComponent } from './infRet.ver.component';
import { InfRetGestionarComponent } from './infRet.gestionar.component';

@NgModule({
    imports: [
        FormsModule,
        BrowserModule,
        HttpClientModule,
        InformacionRetencionRouting
    ],
    exports: [],
    declarations: [
        InfRetVerComponent,
        InfRetGestionarComponent
    ],
    providers: [
        InformacionRetencionService
    ]
})

export class InformacionRetencionModule { }
