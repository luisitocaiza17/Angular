import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../seguridad/auth.service';
import { ReporteService } from '../../common/servicios/reporte.service';


import { TransaccionKey } from '../../common/model/transacciones';
import { ProductosReporteMorosoEntity, RegionEntity } from '../../common/model/genericos';

@Component({
    selector: 'repCobrarMoroso',
    providers: [ReporteService],
    templateUrl: 'repContratosCobrarMorosos.form.template.html'
})

export class RepContratosCobrarMorososFormComponent {

    filter: TransaccionKey;
    listaProductos: ProductosReporteMorosoEntity[];
    listaRegiones: RegionEntity[];

    constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef, private authService: AuthService,
        private reporteService: ReporteService) {

        this.filter = new TransaccionKey();
        this.listaProductos = [];
        this.listaRegiones = [];
        this.cargarCombos();
    }

    cargarCombos() {
        if (this.listaProductos == undefined || this.listaProductos.length == 0) {
            this.listaProductos = ProductosReporteMorosoEntity.values;
        }

        if (this.listaRegiones == undefined || this.listaRegiones.length == 0) {
            this.listaRegiones = RegionEntity.values;
        }
    }

    Generar() {

        this.reporteService.enivarReporteContratoMorosoCobrar(this.filter).subscribe(
            result => {
                this.authService.showSuccessPopup(result);
            },
            error => this.authService.showErrorPopup(error)
        );

    }
}