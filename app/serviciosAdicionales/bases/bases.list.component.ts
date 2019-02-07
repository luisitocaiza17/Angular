import {Component, OnInit} from '@angular/core';
import {ServiciosAdicionalesBasesService} from '../../common/servicios/serviciosAdicionalesBases.service';
import {AuthService} from '../../seguridad/auth.service';
import {Proveedor, Estado} from '../models/Bases';
import * as moment from 'moment';

@Component({
    templateUrl: 'bases.list.template.html',
    styleUrls: ['bases.list.component.css']
})

export class BasesListComponent implements OnInit {

    proveedores: Proveedor[];
    proveedorSeleccionado: Proveedor = null;
    estados: Estado[];
    anios: number[] = [];
    mes: number = null;
    anio: number = null;
    estadoId: string = null;
    bases: any[];

    constructor(public serviciosAdicionalesService: ServiciosAdicionalesBasesService, private authService: AuthService) {
    }

    ngOnInit(): void {
        this.obtenerProveedores();
        this.obtenerEstados();
        this.calcularAnios();
    }

    seleccionarProveedor(event): void {
        this.proveedorSeleccionado = this.buscarValor(event.target.value, this.proveedores);
    }

    obtenerProveedores(): void {
        this.serviciosAdicionalesService.obtenerProveedores()
            .subscribe(items => this.proveedores = items);
    }

    obtenerEstados(): void {
        this.serviciosAdicionalesService.obtenerEstados()
            .subscribe(items => this.estados = items);
    }

    calcularAnios(): void {
        this.serviciosAdicionalesService.obtenerConfiguracion()
            .subscribe(
                configs => {
                    const valor: any[] = configs.filter(config => config.Codigo === 'FECINICIO');
                    if (valor.length === 1) {
                        const inicio = moment(valor[0].Valor, 'DD/MM/YYYY').year();
                        const fin = moment().year();
                        for (let x = inicio; x <= fin; x++) {
                            this.anios.push(x);
                        }
                    } else {
                        this.anios.push(moment().year());
                    }
                },
                error => this.authService.showErrorPopup(error));
    }

    buscar(): void {
        if (this.proveedorSeleccionado === undefined || this.proveedorSeleccionado === null
            || this.mes === undefined || this.mes === null
            || this.anio === undefined || this.anio === null) {
            this.authService.showErrorPopup('Seleccione el proveedor, mes y a\u00F1o');
        } else {
            this.serviciosAdicionalesService.obtenerResumenes(this.proveedorSeleccionado.Id, this.mes, this.anio, this.estadoId)
                .subscribe(items => this.bases = items,
                    error => {
                        this.bases = null;
                        this.authService.showErrorPopup(error);
                    });
        }
    }

    descargarExcel(id: number): void {
        this.serviciosAdicionalesService.descargarExcelBase(id)
            .subscribe(result => {
                    const blob = new Blob([result.blob()], {type: 'application/vnd.ms-excel'});
                    const url = window.URL.createObjectURL(blob);
                    window.open(url);
                },
                error => this.authService.showErrorPopup(error));
    }

    private buscarValor(id: string, valores: any[]): any {
        let resultado = null;
        for (const _item of valores) {
            if (_item.Id.toString() === id) {
                resultado = _item;
                break;
            }
        }
        return resultado;
    }
}
