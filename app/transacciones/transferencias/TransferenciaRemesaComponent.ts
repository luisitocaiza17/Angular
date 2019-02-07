import { Component, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../seguridad/auth.service';
import { ReporteService } from '../../common/servicios/reporte.service';
import { PaginationService } from '../../utils/pagination.service';
import { RegionService } from '../../common/servicios/region.service';
import { MovimientoService } from '../../common/servicios/movimiento.service';
import { TransaccionService } from '../../common/servicios/transaccion.service';
import { DatosBancoContrato } from '../../common/model/transacciones';
import { BancoEntity } from '../../common/model/genericos';
import { RemesaEntity } from '../../common/model/remesa';
import { DetalleRemesa } from '../../common/model/detalleRemesa';
import { correctHeight } from '../../app.helpers';
import { DatePipe } from '@angular/common';
@Component({
    providers: [TransaccionService, DatePipe],
    templateUrl: 'transferenciaRemesa.template.html'
})
export class TransferenciaRemesaComponent implements OnInit {

    bancos: BancoEntity[];
    remesas: RemesaEntity[];
    remesasSeleccionada: RemesaEntity;
    detalleRemesas: DetalleRemesa[];
    isDesplegar: boolean;
    nuevaFechaCorte:Date;
    habilitarBoton: boolean;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    tableSettings = {

        columns: {

            CodigoBanco: {
                title: 'No. Banco'
            },
            NombreBanco: {
                title: 'Nombre'
            },

        },
        actions: {
            add: false,
            edit: false,
            delete: false,
            position: false
        },
        pager: {
            perPage: 22
        },
        attr: {
            class: 'table table-bordered'
        }
    };

    tableSettings1 = {
        columns: {
            NumeroLineaRemesa: {
                title: 'Numero Linea',
                compareFunction: (direction: any, a: any, b: any) => {
                    return this.ordernarNumerosEnteros(direction, a, b);
                }
            },
            Region: {
                title: 'Región'
            },
            CodigoProducto: {
                title: 'Producto'
            },
            ContratoNumero: {
                title: 'Contrato'
            },
            NumeroCuota: {
                title: 'Cuota',
                compareFunction: (direction: any, a: any, b: any) => {
                    return this.ordernarNumerosEnteros(direction, a, b);
                }
            },
            FacturadoHasta: {
                title: 'Facturado Hasta',
                valuePrepareFunction: (date) => {
                    var raw = new Date(date);

                    var formatted = this.datePipe.transform(raw, 'dd/MM/yyyy');
                    return formatted;
                }
            },
            ValorCuota: {
                title: 'Valor Cuota',
                compareFunction: (direction: any, a: any, b: any) => {
                    return this.ordernarNumerosDecimales(direction, a, b);
                }
            },
            ValorRemitido: {
                title: 'Valor Remitido',
                compareFunction: (direction: any, a: any, b: any) => {
                    return this.ordernarNumerosDecimales(direction, a, b);
                }
            },
            EstadoRemesa: {
                title: 'Estado',
                compareFunction: (direction: any, a: any, b: any) => {
                    return this.ordernarNumerosEnteros(direction, a, b);
                }
            },
            NumeroCuenta: {
                title: 'Cuenta',
                compareFunction: (direction: any, a: any, b: any) => {
                    return this.ordernarNumerosEnteros(direction, a, b);
                }
            },
            FacturadoA: {
                title: 'Facturado a'
            },
            NombreDuenioCuenta: {
                title: 'Dueño Cuenta',
                width: '500px'
            }
        },
        actions: {
            add: false,
            edit: false,
            delete: false,
            position: false
        },
        pager: {
            perPage: 20
        },
        attr: {
            class: 'table table-bordered'
        }
    };
    constructor(public reporteService: ReporteService, private transaccionService: TransaccionService, public movimientoService: MovimientoService, private elementRef: ElementRef, private regionService: RegionService, private router: Router, private chRef: ChangeDetectorRef, private authService: AuthService, private datePipe: DatePipe
    ) {
    }
    ngOnInit(): void {
        this.loadBancos();
        this.habilitarBoton = true;
    }
    pageChanged(): void {
    }

    loadBancos() {

        this.transaccionService.getBancos().subscribe(
            result => {
                this.bancos = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadRemesaByBanco(value) {
        this.transaccionService.getRemesaByBanco(value.data).subscribe(
            result => {
                this.remesas = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadDetalleRemesaByRemesa(remesaSelected: RemesaEntity) {
        this.habilitarBoton = false;
        this.remesasSeleccionada = remesaSelected;
        this.transaccionService.getDetalleRemesaByRemesa(remesaSelected).subscribe(
            result => {
                this.detalleRemesas = result;
            },
            error => this.authService.showErrorPopup(error)
        );

    }

    inicializarPanelTransferencia(value): void {
        console.log(value);
          this.router.navigate(['transferenciaYCierre', value.data.NumeroRemesa,value.data.NumeroLineaRemesa,this.remesas[0].CodigoBanco]);

    }

    colapsarTab(): void {
        this.isDesplegar = false;

    }

    ordernarNumerosEnteros(direction: any, a: any, b: any) {
        let first = typeof a === 'string' ? Number(a) : a;
        let second = typeof b === 'string' ? Number(b) : b;

        if (first < second) {
            return -1 * direction;
        }
        if (first > second) {
            return direction;
        }
        return 0;
    }

    ordernarNumerosDecimales(direction: any, a: any, b: any) {
        let first = typeof a === 'string' ? Number(a.replace(",", ".")) : a;
        let second = typeof b === 'string' ? Number(b.replace(",", ".")) : b;

        if (first < second) {
            return -1 * direction;
        }
        if (first > second) {
            return direction;
        }
        return 0;
    }

    CierreTotal(){
        console.log(this.remesasSeleccionada);
        this.remesasSeleccionada.FechaCorte=this.nuevaFechaCorte;
        console.log(this.remesasSeleccionada);

        this.transaccionService.cierreTotalRemesa(this.remesasSeleccionada).subscribe(
            result => {
                this.detalleRemesas = result;
            },
            error => this.authService.showErrorPopup(error)
        );

        

    }
}