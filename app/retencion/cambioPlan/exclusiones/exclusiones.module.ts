import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExclusionesComponent } from './exclusiones.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    declarations: [ExclusionesComponent],
    exports: [ExclusionesComponent],
    imports: [CommonModule, BrowserModule, FormsModule, NgxPaginationModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExclusionComponentModule { }