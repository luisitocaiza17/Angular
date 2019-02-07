import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContratoKey } from '../../common/model/contrato';
import { Retencion } from '../../common/model/retencion';
import { RetencionService } from '../../common/servicios/retencion.service';
import { AuthService } from '../../seguridad/auth.service';
import { AdministracionSistemaService } from '../../common/servicios/administracionSistema.service';
import { BeneficiarioService } from '../../common/servicios/beneficiario.service';
import { BeneficiarioKey } from '../../common/model/beneficiario';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { TransaccionKey } from '../../common/model/transacciones';
import { CatalogoProgressEntity } from '../../common/model/catalogo';
import { TransaccionService } from '../../common/servicios/transaccion.service';
import { Guias, SubGuias } from '../../common/model/guias';
import { PdfService } from "../../common/servicios/pdf.service";
import { RetencionesState } from '../services/retenciones.state';



@Component({
    providers: [AdministracionSistemaService, BeneficiarioService, TransaccionService, PdfService],
    templateUrl: 'retencion.anular.producto.template.html',
    styles: ['.text-primary { color: #337ab7!important; } .btn:hover, .btn:focus, .btn.focus{ background-color:lightgrey; }']
})

export class RetencionAnularProductoComponent {
    fechaEfectoAnulacion: Date;

    retencion: Retencion;

    rolGestion: string;
    usuarioJefe: string;
    Nivel1: string = "Ejecutivo Contact Center";
    Nivel2: string = "Jefatura SAC Sierra,Jefatura SAC Costa";
    Nivel3: string = "Subgerencia Nacional";

    private contratoKey: BehaviorSubject<ContratoKey> = new BehaviorSubject<ContratoKey>(null);
    selectContrato$: Observable<ContratoKey> = this.contratoKey.asObservable();


    suscription: any;

    beneficiarioKey: BeneficiarioKey;

    //para anulacion
    _contratoKey: ContratoKey;
    desabilitar: boolean;
    cabeceraMotivoAnulacion: CatalogoProgressEntity[];
    motivoAnulacion: CatalogoProgressEntity[];
    listaDesplegarMotivoAnulacion: CatalogoProgressEntity[];
    codigoCabecera: number;
    codigoAnulacion: number;
    nombreMotivoAnulacion: string;
    comentario: string;
    activaBotonAnular: boolean;


    //para guias de retencion al cliente
    listaGuias: Guias[];
    listaSubGuias: SubGuias[];
    codigoGuias: number;
    leerTexto: string;
    mostrarListaSubGuias: SubGuias[];

    temaSeleccionado: boolean;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(
        private retencionService: RetencionService, private transaccionService: TransaccionService,
        private authService: AuthService, public beneficiarioService: BeneficiarioService,
        public pdfService: PdfService, private router: Router, public retencionState: RetencionesState) {

        this.beneficiarioKey = new BeneficiarioKey();
        this._contratoKey = new ContratoKey();
        this.cabeceraMotivoAnulacion = [];
        this.motivoAnulacion = [];
        this.listaDesplegarMotivoAnulacion = [];

        this.listaGuias = Guias.values;
        this.listaSubGuias = SubGuias.values;
        this.mostrarListaSubGuias = [];

        this.temaSeleccionado = true;
        this.activaBotonAnular = true;

        this.retencionService.retenciones.subscribe((res) => {
            this.retencion = res || undefined;
            if (this.retencion) {
                this.loadCargarDatosPantallaAnterior();
                /* console.log("REGION: " + this._contratoKey.CodigoRegion);
                console.log("CONTRATO: " + this._contratoKey.NumeroContrato);
                console.log("PRODUCTO: " + this._contratoKey.CodigoProducto); */
                this.retencion.SiniestralidadNumber = parseFloat(this.retencion.Siniestralidad);
            }
        });

    }

    loadCargarDatosPantallaAnterior() {
        this.retencionService.contratoKey.subscribe((res) => {
            this._contratoKey = res;
            this.loadDataAnulacion();
        });
    }

    loadDataAnulacion(): void {
        var key = new TransaccionKey();
        key.CodigoProducto = this._contratoKey.CodigoProducto;
        key.CodigoRegion = this._contratoKey.CodigoRegion;
        key.NumeroContrato = this._contratoKey.NumeroContrato;
        this.transaccionService.getDatosAnulacion(key).subscribe(
            result => {
                if (result.FacturadoHasta != undefined) {
                    this.fechaEfectoAnulacion = new Date(result.FacturadoHasta);
                }
                
                this.cabeceraMotivoAnulacion = result.CabecerasMotivoAnulacion;
                this.motivoAnulacion = result.MotivosAnulacion;
            },
            error => this.authService.showErrorPopup(error)
        );
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

            if (this.codigoAnulacion >= 301 && this.codigoAnulacion <= 320)
                this._contratoKey.ContratoCodigoEstado = 27;
            else
                this._contratoKey.ContratoCodigoEstado = 2;
            this._contratoKey.Comentario = this.comentario;//comentario obligatorio
            this.transaccionService.anularContrato(this._contratoKey).subscribe(
                result => {
                    if (result) {
                        this.authService.showSuccessPopup("Se ha anulado el Contrato");
                        this.crearComentario();//direcciono a la otra ventana
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
                    this.activaBotonAnular = false;
                    this._contratoKey.NombreMotivoAnulacion = element.Descripcion;
                    this._contratoKey.Comentario = this.comentario;
                    this.retencionService.setDataContratoKey(this._contratoKey);//alisto el _contratoKey para pasar a otra ventana
                    console.log("alistando envio datos ");
                }
            });

            this.transaccionService.GenerarPdfFormularioMovimiento(this._contratoKey, "Notificación Anular Contrato (Retención)")
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
                this.retencionState.setMotivo(element.Descripcion);
                this.retencionState.setComentarioMotivo(this.comentario);
            }
        });

    }
    crearComentario(): void {
        this.setDataContratoKey();//alisto variables para pasar a otro component
        this.router.navigate(['/retencion/comentario/movimiento/' + this._contratoKey.CodigoRegion + '/' + this._contratoKey.CodigoProducto + '/' + this._contratoKey.NumeroContrato + '/ANULARPRODUCTO/']);
    }
}
