import {Component, Input, OnInit} from '@angular/core';
import {ServiciosAdicionalesBasesService} from '../../common/servicios/serviciosAdicionalesBases.service';
import {Detalle} from '../models/Detalles';

@Component({
    selector: 'app-detalles-table',
    templateUrl: 'detalles.table.template.html'
})

export class DetallesTableComponent<T extends Detalle> implements OnInit {

    @Input() elementId: string;
    @Input() items: T[] = null;
    @Input() columnsSet: string;
    currentPage = 1;
    pageSize = 5;

    ngOnInit(): void {
    }

    constructor(private serviciosAdicionales: ServiciosAdicionalesBasesService) {
    }

}
