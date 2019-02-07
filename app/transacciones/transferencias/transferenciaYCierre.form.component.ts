import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';


import { TransaccionService } from '../../common/servicios/transaccion.service';
import { BancoEntity } from '../../common/model/genericos';
import { ReporteService } from '../../common/servicios/reporte.service';
import { MovimientoService } from '../../common/servicios/movimiento.service';
import { RegionService } from '../../common/servicios/region.service';
import { AuthService } from '../../seguridad/auth.service';
import { OneDetalleRemesa, DetalleRemesa } from '../../common/model/detalleRemesa';


@Component({
    selector: 'transferenciaForm',
    providers: [TransaccionService],
    templateUrl: 'transferenciaYCierre.form.template.html'
})

export class TransferenciaYCierreFormComponent {
    bancos: BancoEntity[];
    numeroRemesa: string;
    lineaRemesa: string;
    codigoBanco: number;
    detalleRemesa: DetalleRemesa;
    optionRadio: number;
    habilitarCombo: boolean;
    habilitarBoton: boolean;

    constructor(public reporteService: ReporteService, public activatedRoute: ActivatedRoute, private transaccionService: TransaccionService, public movimientoService: MovimientoService, private elementRef: ElementRef, private regionService: RegionService, private router: Router, private chRef: ChangeDetectorRef, private authService: AuthService) {
        this.detalleRemesa = new DetalleRemesa();
    }

    ngOnInit(): void {

        this.loadBancos();
        this.loadData();
        this.habilitarCombo = true;
        this.habilitarBoton = true;
    }

    loadBancos() {

        this.transaccionService.getBancos().subscribe(
            result => {
                this.bancos = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    validarSeleccion() {
        if (this.optionRadio == 1) {
            this.habilitarCombo = false;
            this.habilitarBoton = false;
        }
        else if (this.optionRadio == 2) {
            this.habilitarCombo = true;
            this.habilitarBoton = false;
        }

    }

    transferir() {
        if (this.optionRadio != undefined || this.optionRadio == 0) {
            if (this.optionRadio == 1) {
                this.transaccionService.transferenciaRemesaOtroBanco(this.detalleRemesa).subscribe(
                    result => {
                        if(result==true){
                            this.authService.showSuccessPopup("Transferecia de remesa exitosa");
                            this.router.navigate(['transferenciaRemesa/list']);

                        }
                    },
                    error => this.authService.showErrorPopup(error)
                );
            }
            else if (this.optionRadio == 2) {
                this.transaccionService.transferenciaRemesaContrato(this.detalleRemesa).subscribe(
                    result => {
                        if(result==true){
                            this.authService.showSuccessPopup("Transferecia de remesa exitosa");
                            this.router.navigate(['transferenciaRemesa/list']);

                        }
                    },
                    error => this.authService.showErrorPopup(error)
                );
            }
        }
    }

    recuperarParametros() {
        this.numeroRemesa = this.activatedRoute.snapshot.params['remesa'];
        this.lineaRemesa = this.activatedRoute.snapshot.params['linea'];
        this.codigoBanco = this.activatedRoute.snapshot.params['banco'];
    }

    loadData() {
        this.recuperarParametros();
        var datos = new OneDetalleRemesa();
        datos.NumeroLineaRemesa = this.lineaRemesa;
        datos.NumeroRemesa = this.numeroRemesa;
        datos.CodigoBanco = this.codigoBanco;

        this.transaccionService.getOneDetalleRemesa(datos).subscribe(
            result => {
                if (result != null || result != undefined) {
                    this.detalleRemesa = result;
                }
                else {

                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    verBanco(codigoBanco: number): string {
        var resultado = "";
        if (this.bancos != undefined) {
            this.bancos.forEach(resp => {
                if (resp.CodigoBanco == codigoBanco) {
                    resultado = resp.NombreBanco;
                    return resultado;
                }
            });
        }

        return resultado;
    }
}