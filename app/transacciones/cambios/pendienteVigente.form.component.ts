import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../seguridad/auth.service';
import { ContratoKey } from '../../common/model/contrato';
import { TransaccionService } from '../../common/servicios/transaccion.service';
import { AdministracionSistemaService } from '../../common/servicios/administracionSistema.service';
import { VariablesConstantService } from '../../utils/variableConstant.service.';
import { ReciboCobranzaPdfIndividual } from "../../common/model/cobranza";
import { PdfService } from "../../common/servicios/pdf.service";

@Component({
    selector: 'pendienteVigente',
    providers: [TransaccionService, AdministracionSistemaService, PdfService],
    templateUrl: 'pendienteVigente.form.template.html'
})

export class PendienteVigenteFormComponent {
    desabilitar: boolean;
    _contratoKey: ContratoKey;
    UsuarioActual: string;
    UsuarioCorreo: string;
    reciboPdf: ReciboCobranzaPdfIndividual;

    @Input()
    set contratoKey(recibirCointratoKey: ContratoKey) {
        this._contratoKey = recibirCointratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined)
            this.loadDataAnulacion();
    }

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService,
        private transaccionService: TransaccionService, private variablesConstantService: VariablesConstantService,
        public pdfService: PdfService) {
        this._contratoKey = new ContratoKey();
        this.desabilitar = false;
        this.UsuarioActual = "";
        this.UsuarioCorreo = "";
        this.reciboPdf = new ReciboCobranzaPdfIndividual();
    }

    ngOnInit() {
        this.validarPermisosRol();
    }

    loadDataAnulacion(): void {
        if (this._contratoKey.ContratoCodigoEstado == this.variablesConstantService.CODIGO_ESTADO_ANULADO || this._contratoKey.ContratoCodigoEstado == this.variablesConstantService.CODIGO_ESTADO_TRANSFERIDO) {
            this.authService.showInfoPopup("El contrato se encuentra Anulado Actualmente");
            this.desabilitar = true;
        }
        else if (this._contratoKey.ContratoCodigoEstado == this.variablesConstantService.CODIGO_ESTADO_ACTIVO) {
            /*D E S C O M E N T A R  AL  F I N A L  DE  P R O G R A M A R */
            this.authService.showInfoPopup("El contrato se encuentra Vigente, no necesita ser reactivado, estado = " + this.variablesConstantService.CODIGO_ESTADO_ACTIVO);
            this.desabilitar = true;
        }
    }

    validarPermisosRol(): void {
        const usrData = this.authService.getDatosUsuarioAutenticado();//se obtiene datos del usuario
        this.UsuarioActual = usrData.NombreUsuario;
        this.UsuarioCorreo = usrData.Correo;
    }

    cambiarContrato() {
        this.showPopupResultadoConfirm("Está seguro de cambiar el estado a VIGENTE y generar la factura o nota de venta");
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
                    this.transaccionService.CambiarPendienteVigente(this._contratoKey).subscribe(
                        result => {
                            if (result != null) {
                                this.reciboPdf = result;
                                this.pdfService.GenerarPdfReciboCobranzaIndividual(this.reciboPdf)
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
                            else {
                                this.authService.showErrorPopup("No se a completado el proceso, revise si el recibo se ha generado");
                            }
                        },
                        error => {
                            this.authService.showErrorPopup(error);
                        }
                    )
                }
            });
    }

}