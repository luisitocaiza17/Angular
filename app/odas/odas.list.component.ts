import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthService } from '../seguridad/auth.service';
import { ReclamoService } from '../common/servicios/reclamo.service';
import { BeneficiarioService } from '../common/servicios/beneficiario.service';
import { ContratoKey } from '../common/model/contrato';
import { BeneficiarioKey, Beneficiario } from '../common/model/beneficiario';
import { Reclamo, ReclamoKey, EstadoReclamo } from '../common/model/reclamo';
import { ContratosOdasListComponent } from './contratosOdas.list.component';

@Component({
    selector: 'odasList',
    providers: [ReclamoService],
    templateUrl: 'odas.list.template.html'
})

export class OdasListComponent implements OnDestroy {
    reclamos: Reclamo[];
    contratoKey: ContratoKey;
    mostrarFormIncluir: boolean;
    mostrarFormEditar: boolean;
    mostrarFormEmail: boolean;
    urlPruebas: string;
    suscription: any;
    filter: BeneficiarioKey;
    beneficiarios: Beneficiario[];
    estadosReclamo: EstadoReclamo[];
    msgEstadoContato: string;
    habilitarNuevo: boolean;

    private reclamoKey: BehaviorSubject<ReclamoKey> = new BehaviorSubject<ReclamoKey>(null);
    selectReclamo$: Observable<ReclamoKey> = this.reclamoKey.asObservable();

    constructor(public reclamoService: ReclamoService, private authService: AuthService,
        private contratosOdasListComponent: ContratosOdasListComponent,
        private beneficiarioService: BeneficiarioService) {

        this.mostrarFormIncluir = false;
        this.mostrarFormEditar = false;
        this.mostrarFormEmail = false;

        this.suscription = this.contratosOdasListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined) {
                    if (!contratoKey.unsuscribe) {
                        this.contratoKey = contratoKey;
                        this.createFilter();
                        this.loadOdasList();
                        this.loadBeneficiario();
                        this.loadEstados();
                    } else {
                        this.ngOnDestroy();
                    }
                }
            }
        );
    }

    ngOnInit(): void {
        this.reclamos = [];
        this.beneficiarios = [];
        this.filter = new BeneficiarioKey();
        this.contratoKey = new ContratoKey();
        this.estadosReclamo = [];
        this.msgEstadoContato = "";
        this.habilitarNuevo = true;
    }

    loadEstados() {
        if (this.filter != undefined) {
            this.reclamoService.obtenerEstadosReclamo(this.filter).subscribe(
                estados => {
                    this.estadosReclamo = estados;
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }
    loadBeneficiario() {
        if (this.filter != undefined) {
            this.beneficiarioService.getBeneficiarioAutorizacion(this.filter).subscribe(
                beneficiarios => {
                    this.beneficiarios = beneficiarios;
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    limpiar() {
        this.createFilter();
        this.loadOdasList();
    }

    createFilter() {
        this.filter = new BeneficiarioKey();
        this.filter.CodigoContrato = this.contratoKey.CodigoContrato;
        this.filter.NumeroContrato = this.contratoKey.NumeroContrato;
        this.filter.OdasMasivas = true;
    }

    ngOnDestroy() {
        if (this.suscription != undefined)
            this.suscription.unsubscribe();
    }

    loadOdasList(): void {
        if (this.contratoKey != undefined) {
            this.reclamoService.getReclamoOdaList(this.filter).subscribe(
                reclamos => {
                    this.loadData(reclamos);
                },
                error => this.authService.showErrorPopup(error));
        }
        else {
            this.reclamos = [];
        }
    }

    pageChanged(): void {
        this.loadOdasList();
    }

    loadData(reclamos: Reclamo[]): void {
        this.reclamos = reclamos;
        this.msgEstadoContato = "";
        this.habilitarNuevo = true;
        if (this.contratoKey != undefined) {
            if ((this.contratoKey.ContratoEstado.toLocaleUpperCase() != 'ACTIVO' && this.contratoKey.ContratoEstado.toLocaleUpperCase() != 'DONACION(ASUME SALUD)' && this.contratoKey.ContratoEstado.toLocaleUpperCase() != 'DESGRAVAMEN')
                || this.contratoKey.EsMoroso) {
                this.msgEstadoContato = "El contrato no se encuentra activo o está moroso ";
                this.habilitarNuevo = false;
            }

            if ((this.contratoKey.CodigoProducto != undefined && this.contratoKey.CodigoProducto.toLowerCase() == 'onc'
                && this.contratoKey.Plan != undefined && this.contratoKey.Plan.toLowerCase().startsWith('pre'))
                || (this.contratoKey.OdasDisponibles == undefined || this.contratoKey.OdasDisponibles == 0)) {
                this.msgEstadoContato = "El contrato no admite odas ";
                this.habilitarNuevo = false;
            } else if (this.contratoKey.CodigoProducto != 'IND' && this.contratoKey.CodigoProducto != 'ONC'&& this.contratoKey.CodigoProducto != 'XPR') {
                if (this.contratoKey.OdasConsumidas >= this.contratoKey.OdasDisponibles) {
                    this.msgEstadoContato = "El contrato no posee odas disponibles. (" + this.contratoKey.OdasConsumidas + " / " + this.contratoKey.OdasDisponibles + ")";
                    this.habilitarNuevo = false;
                }
            }

            if (this.contratoKey.CodigoProducto.toLowerCase() == 'pca') {
                this.msgEstadoContato = "El contrato no admite odas ";
                this.habilitarNuevo = false;
            }

            if (this.contratoKey.Plan.substring(0, 4) == "75-m"
                || this.contratoKey.Plan.toLocaleUpperCase().substring(0, 3) == "HOS"
                || this.contratoKey.Plan.substring(0, 4) == "75-M"
                || this.contratoKey.Plan.toLocaleUpperCase().substring(0, 3) == "MAS"
                || this.contratoKey.Plan.toLocaleUpperCase().substring(0, 2) == "MV"
                || this.contratoKey.Plan.toLocaleUpperCase().substring(0, 2) == "OV"
                || this.contratoKey.Plan.toLocaleUpperCase().substring(0, 3) == "PRG"
                || this.contratoKey.Plan.toLocaleUpperCase().substring(0, 3) == "SVL") {
                this.msgEstadoContato = "El contrato no admite odas ";
                this.habilitarNuevo = false;
            }
        }
    }


    nuevo() {
        this.mostrarFormIncluir = true;
        var key = new ReclamoKey();
        key.ReclamoSeleccionado = new Reclamo();
        key.ContratoKey = this.contratoKey;
        this.reclamoKey.next(key);

        jQuery("#divListaOdas").collapse("hide");
    }

    anular() {
        if (this.filter != undefined) {
            if (this.filter.EstadoOrdenPago != 10) {
                this.reclamoService.anularReclamo(this.filter).subscribe(
                    respuesta => {
                        var anulado = respuesta;
                        if (anulado == true) {
                            this.showPopup("info", "La ODA ha sido anulada");
                            this.loadOdasList();
                        } else {
                            this.showPopup("info", "La ODA no ha sido anulada. Problemas con el SW");
                        }
                        jQuery("#anularViewModal").modal("hide");
                    },
                    error => this.authService.showErrorPopup(error)
                );
            } else {
                this.showPopup("info", "La ODA no se puede anulada");
            }
        }
    }

    seleccionar(reclamo: Reclamo) {
        if (reclamo != undefined) {
            this.filter.NumeroAutorizacion = reclamo.NumeroReclamo;
            this.filter.EstadoOrdenPago = reclamo.EstadoOrdenPago;
        }
    }

    sendLetter(reclamoSelected: Reclamo): void {
        this.mostrarFormEmail = true;
        // emitiendo evento para ver pantalla mailFtp
        this.emitirReclamoKey(reclamoSelected);
    }

    emitirReclamoKey(reclamo: Reclamo) {
        var key = new ReclamoKey();
        key.ReclamoSeleccionado = reclamo;
        key.ContratoKey = this.contratoKey;
        this.reclamoKey.next(key);
    }

    verListado() {
        this.mostrarFormIncluir = false;
        this.mostrarFormEditar = false;
        this.mostrarFormEmail = false;
        this.loadOdasList();
        jQuery("#divListaOdas").collapse("show");
    }

    showPopup(tipo: string, msg: string): void {
        swal({
            title: "",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: tipo,
            closeOnConfirm: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
        });
    }
}