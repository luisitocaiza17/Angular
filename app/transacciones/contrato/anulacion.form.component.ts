import { Component, OnDestroy, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { AuthService } from '../../seguridad/auth.service';
import { ContratoKey } from '../../common/model/contrato';
import { DetalleRemesa } from '../../common/model/detalleRemesa';
import { CatalogoProgressEntity } from '../../common/model/catalogo';
import { TransaccionKey } from '../../common/model/transacciones';
import { TransaccionService } from '../../common/servicios/transaccion.service';
import { Guias, SubGuias } from '../../common/model/guias';
import { PdfService } from "../../common/servicios/pdf.service";
import { TransaccionesState } from '../services/transacciones.state';

@Component({
    selector: 'anulacion',
    providers: [TransaccionService, PdfService],
    templateUrl: 'anulacion.form.template.html'
})

export class AnulacionFormComponent implements OnDestroy {

    suscription: any;
    fechaEfectoAnulacion: Date;
    detalleRemesa: DetalleRemesa;
    cabeceraMotivoAnulacion: CatalogoProgressEntity[];
    motivoAnulacion: CatalogoProgressEntity[];
    nombreMotivoAnulacion: string;
    listaDesplegarMotivoAnulacion: CatalogoProgressEntity[];

    //para guias de retencion al cliente
    listaGuias: Guias[];
    listaSubGuias: SubGuias[];
    codigoGuias: number;
    leerTexto: string;
    mostrarListaSubGuias: SubGuias[];

    codigoCabecera: number;
    codigoAnulacion: number;
    desabilitar: boolean;
    temaSeleccionado: boolean;

    /* comentario: string; */
    /*activaBotonAnular: boolean;*/

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    _contratoKey: ContratoKey;
    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined)
            this.loadDataAnulacion();
        else {
            this.cabeceraMotivoAnulacion = [];
            this.motivoAnulacion = [];
            this.listaDesplegarMotivoAnulacion = [];

            this.listaGuias = Guias.values;
            this.listaSubGuias = SubGuias.values;
            this.mostrarListaSubGuias = [];

            this.temaSeleccionado = true;
            /* this.activaBotonAnular = true; */

        }
    }

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService,
        private transaccionService: TransaccionService, public pdfService: PdfService,
        private router: Router, public transaccionesState: TransaccionesState) {
        this._contratoKey = new ContratoKey();
        this.detalleRemesa = new DetalleRemesa();
        this.cabeceraMotivoAnulacion = [];
        this.motivoAnulacion = [];
        this.listaDesplegarMotivoAnulacion = [];

        this.listaGuias = Guias.values;
        this.listaSubGuias = SubGuias.values;
        this.mostrarListaSubGuias = [];
        this.temaSeleccionado = true;
        /* this.activaBotonAnular = true; */
    }

    loadDataAnulacion(): void {
        if (this._contratoKey.ContratoCodigoEstado == 2 || this._contratoKey.ContratoCodigoEstado == 27) {
            this.authService.showInfoPopup("El contrato se encuentra Anulado Actualmente");
            this.desabilitar = true;

        }
        else {
            var key = new TransaccionKey();
            key.CodigoProducto = this._contratoKey.CodigoProducto;
            key.CodigoRegion = this._contratoKey.CodigoRegion;
            key.NumeroContrato = this._contratoKey.NumeroContrato;

            this.transaccionService.getDatosAnulacion(key).subscribe(
                result => {
                    if (result.FacturadoHasta == undefined) {
                        //NO ENCUENTRA REMESA     
                    }
                    else {
                        this.fechaEfectoAnulacion = new Date(result.FacturadoHasta);
                    }
                    this.cabeceraMotivoAnulacion = result.CabecerasMotivoAnulacion;
                    this.motivoAnulacion = result.MotivosAnulacion;
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    cargarSelectMotivoAnulacion() {
        this.listaDesplegarMotivoAnulacion = [];
        this.temaSeleccionado = true;
        if (this.codigoCabecera != undefined) {
            this.listaDesplegarMotivoAnulacion = this.motivoAnulacion.filter(m => m.CodigoCabecera == this.codigoCabecera);
        }
    }

    activarBotonCarta() {
        if (this.codigoAnulacion != undefined) {
            this.temaSeleccionado = false;
        } else {
            this.temaSeleccionado = true;
        }
    }

    cargarSubGuias() {
        this.listaSubGuias.forEach(element => {
            if (element.Codigo == this.codigoGuias) {
                this.leerTexto = element.Nombre;
            }
        });
    }

    guardarAnulacion() {
        if (this.validarFormulario()) {
            var motivoAnulacion = this.motivoAnulacion.find(m => m.Codigo == this.codigoAnulacion);
            this._contratoKey.FechaEfectoAnulacion = this.fechaEfectoAnulacion;
            this._contratoKey.CodigoMotivoAnulacion = this.codigoAnulacion;
            this._contratoKey.NombreMotivoAnulacion = this.nombreMotivoAnulacion;

            if (this.codigoAnulacion >= 301 && this.codigoAnulacion <= 320) {
                this._contratoKey.ContratoCodigoEstado = 27;
            } else {
                this._contratoKey.ContratoCodigoEstado = 2;
            }
            /* this._contratoKey.Comentario = this.comentario;//comentario obligatorio */
            this.transaccionService.anularContrato(this._contratoKey).subscribe(
                result => {
                    if (result) {
                        this.authService.showSuccessPopup("Se ha anulado el Contrato");
                        //this.crearComentario();//direcciono a la otra ventana
                        this.codigoCabecera = undefined;
                        this.codigoAnulacion = undefined;
                        this.loadDataAnulacion();
                    } else {
                        this.authService.showErrorPopup("No se ha anulado el Contrato");
                    }
                },
                error => this.authService.showErrorPopup(error)
            );

        }
    }

    validarFormulario(): boolean {
        var fechaf = new Date(this._contratoKey.FechaFin);
        var fechai = new Date(this._contratoKey.FechaInicio);

        if ((this.fechaEfectoAnulacion) > fechaf) {
            this.authService.showInfoPopup("La fecha efecto no debe ser mayor al fin de Vigencia del Contrato");
            return false;
        }
        if (this.fechaEfectoAnulacion < fechai) {
            this.authService.showInfoPopup("La fecha efecto no debe ser menor al inicio de Vigencia del Contrato");
            return false;
        }
        return true;
    }

    crearCartaAnulacion() {
        if (this.codigoAnulacion != undefined) {
            this.motivoAnulacion.forEach(element => {
                if (element.Codigo == this.codigoAnulacion) {
                    this._contratoKey.NombreMotivoAnulacion = element.Descripcion;
                }
            });
            this.pdfService.GenerarPdfCartaAnulacion(this._contratoKey)
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

    CrearPdfFormularioMovimiento() {
        if (this.codigoAnulacion != undefined) {
            this.motivoAnulacion.forEach(element => {
                if (element.Codigo == this.codigoAnulacion) {
                    /* this.activaBotonAnular = false; */
                    this._contratoKey.NombreMotivoAnulacion = element.Descripcion;
                    /* this._contratoKey.Comentario = this.comentario; */
                    this._contratoKey.Comentario = "";
                }
            });
            this.transaccionService.GenerarPdfFormularioMovimiento(this._contratoKey, "Notificación Anular Contrato (Transacción)")
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

    setDataContratoKey() {
        //SET Y GET
        this.motivoAnulacion.forEach(element => {
            if (element.Codigo == this.codigoAnulacion) {
                this.transaccionesState.setMotivo(element.Descripcion);
                /* this.transaccionesState.setComentarioMotivo(this.comentario); */
                this.transaccionesState.setContratoKey(this._contratoKey);
            }
        });

    }

    ngOnDestroy() {
        if (this.suscription != undefined)
            this.suscription.unsubscribe();
    }

    /*    crearComentario(): void {
           this.setDataContratoKey();//alisto el _contratoKey para pasar a otro component
           this.router.navigate(['/transacciones/comentario/movimiento/']);
       } */
}