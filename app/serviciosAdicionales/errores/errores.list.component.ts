import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ServiciosAdicionalesBasesService} from '../../common/servicios/serviciosAdicionalesBases.service';
import {AuthService} from '../../seguridad/auth.service';
import {Resumen} from '../models/Detalles';
import {Movimiento, Gap} from '../models/Detalles';
import * as moment from 'moment';
import {number} from 'ng2-validation/dist/number';

@Component({
    templateUrl: 'errores.list.template.html',
    styleUrls: ['errores.list.component.css']
})

export class ErroresListComponent implements OnInit {

    private sub: any;
    private id: number;

    resumen: Resumen = null;
    movimientos: Movimiento[] = null;
    gaps: Gap[] = null;

    constructor(public serviciosAdicionalesService: ServiciosAdicionalesBasesService,
                private authService: AuthService,
                private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            if (!isNaN(this.id)) {
                this.obtenerResumen(this.id);
                this.obtenerMovimientos(this.id);
                this.obtenerGaps(this.id);
            }
        });
    }

    handleSelectAll(event): void {
        if ('selectAllMovs' === event.target.id) {
            this.movimientos.forEach(mov => mov.Seleccionado = event.currentTarget.checked);
        } else {
            this.gaps.forEach(gap => gap.Seleccionado = event.currentTarget.checked);
        }
    }

    reprocesarBase(): void {

    }

    reprocesarSeleccion(): void {

    }

    private obtenerResumen(base: number): void {
        this.serviciosAdicionalesService.obtenerResumenErrores(base)
            .subscribe(
                resumen => this.resumen = resumen,
                error => this.authService.showErrorPopup(error));
    }

    private obtenerMovimientos(base: number): void {
        this.serviciosAdicionalesService.obtenerMovimientosErrores(base)
            .subscribe(
                items => this.movimientos = items,
                error => this.authService.showErrorPopup(error));
    }

    private obtenerGaps(base: number): void {
        this.serviciosAdicionalesService.obtenerGapsErrores(base)
            .subscribe(
                items => this.gaps = items,
                error => this.authService.showErrorPopup(error));
    }
}
