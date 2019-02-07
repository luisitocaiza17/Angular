import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../seguridad/auth.service';
import { Cotizacion, CotizacionFilter } from '../../common/model/cotizacion';
import { AutorizacionService } from '../../common/servicios/autorizacion.service';
import { TransaccionService } from '../../common/servicios/transaccion.service';
import { CotizacionService } from '../../common/servicios/cotizacion.service';
import { ContratoKey } from '../../common/model/contrato';

@Component({
    selector: 'reactivacion',
    providers: [AutorizacionService],
    templateUrl: 'reactivacion.form.template.html'
})
export class ReactivacionFormComponent {

    cotizaciones: Cotizacion[];
    desabilitar: boolean;
    diasDesdeAnulacion?: number;
    cuotasPendientes?: number;

    _contratoKey: ContratoKey;
    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this.load();
        }

        else {
            this._contratoKey = new ContratoKey();
            this.cotizaciones = [];
        }
    }
    constructor(public domSanitizer: DomSanitizer, private authService: AuthService,
        private transaccionService: TransaccionService, public cotizacionService: CotizacionService) {
        this._contratoKey = new ContratoKey();
        this.cotizaciones = [];
    }

    load() {
        if (this._contratoKey.ContratoCodigoEstado == 2 || this._contratoKey.ContratoCodigoEstado == 27) {
            this.transaccionService.getDatosReactivacion(this._contratoKey).subscribe(
                result => {
                    if (result.DiasDesdeAnulacionContrato == undefined || result.DiasDesdeAnulacionContrato == null) {
                        this.authService.showInfoPopup("No existe Movimiento de Anulación Cambio No Procede");
                        this.desabilitar = true;
                    }
                    else {
                        this.diasDesdeAnulacion = result.DiasDesdeAnulacionContrato;
                        this.cuotasPendientes = result.NumeroCuotasPendientes;
                        this.validacionInicial();
                        this.cotizaciones = [];
                    }

                },
                error => this.authService.showErrorPopup(error)
            );
        }
        else {
            this.authService.showInfoPopup("Contrato VIGENTE no hay necesidad de Reactivar");
            this.desabilitar = true;
        }

    }


    validacionInicial(): void {
        var swPasa = 1;

        if ((this._contratoKey.CodigoMotivoAnulacion <= 10 && this.diasDesdeAnulacion > 31) ||
            (this._contratoKey.CodigoMotivoAnulacion > 10 && this.diasDesdeAnulacion > 61)) {
            swPasa = 0;
        }

        if (swPasa == 1) {
            this.Cotizaciones();
        }
        else {
            this.authService.showInfoPopup("Reactivación extemporánea Cambio No Procede");
            this.desabilitar = true;
        }
    }

    guardarReactivacion() {
        if (this.cuotasPendientes > 0) {
            this.showPopupResultadoConfirm("Contrato con " + this.cuotasPendientes + " cuotas Pendientes de Pago. Desea Proseguir ?");
        }
        else {
            this.showPopupResultadoConfirm("Contrato SIN cuotas Pendientes de Pago");
        }
    }


    pageChanged(): void {
        this.Cotizaciones();
    }

    Cotizaciones(): void {
        var filter = this.createCotizacionFilter(this._contratoKey.CodigoContrato);
        this.cotizacionService.getByFiltersPaginated(filter).subscribe(
            result => {
                this.cotizaciones = result;

                if (this.cotizaciones != undefined && this.cotizaciones.length > 0) {

                    for (let i in this.cotizaciones) {
                        if (this.cotizaciones[i].Estado != "Cobrado") {
                            this.cotizaciones[i].BancoCaja = "-";
                        }
                    }
                }
            },
            error => this.authService.showErrorPopup(error));
    }

    createCotizacionFilter(codigoContrato: number, numeroCuota?: number): CotizacionFilter {
        var filter = new CotizacionFilter();
        filter.CodigoContrato = codigoContrato;
        filter.NumeroCuota = numeroCuota;
        return filter;
    }

    view(): void {
        if (this._contratoKey != undefined) {
            let resp = this.transaccionService.getReactivacionPDF(this._contratoKey)
                .subscribe(
                    resp => {
                        var blob = new Blob([resp._body], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(blob);
                        window.open(fileURL);
                        this.viewCopia();
                    },
                    err => {
                        this.authService.showBlobErrorPopup(err);
                    });
        }
    }

    viewCopia(): void {
        if (this._contratoKey != undefined) {
            let resp = this.transaccionService.getReactivacionPDF(this._contratoKey)
                .subscribe(
                    resp => {
                        var blob = new Blob([resp._body], { type: 'application/pdf' });
                        var fileURL = URL.createObjectURL(blob);
                        window.open(fileURL);
                    },
                    err => {
                        this.authService.showBlobErrorPopup(err);
                    });
        }

    }

    showPopupResultadoConfirm(msg: string): void {
        swal({
            title: "",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
            closeOnConfirm: true
        },
            confirmed => {

                if (confirmed) {
                    this.transaccionService.reactivarContrato(this._contratoKey).subscribe(
                        result => {
                            if (result) {
                                this.authService.showSuccessPopup("Se ha reactivado el Contrato");

                                this.view();

                            }
                            else {
                                this.authService.showErrorPopup("No se ha reactivado el Contrato");
                            }
                        },
                        error => {
                            this.authService.showErrorPopup("Error no se ha reactivado el Contrato");
                            this.authService.showErrorPopup(error)
                        }
                    )
                }

            });
    }
}