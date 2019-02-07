import { Component, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../seguridad/auth.service';
import { ContratoKey } from '../../common/model/contrato';
import { MovimientoFilter, Movimiento } from '../../common/model/movimiento';
import { BeneficiarioList } from '../../common/model/beneficiario';
import { FilterEmisionTarjetas, ReversarTarjetaFilter } from '../../common/model/transacciones';
import { TransaccionService } from '../../common/servicios/transaccion.service';



@Component({
    selector: 'emisionTarjetas',
    providers: [TransaccionService],
    templateUrl: 'emisionTarjetas.form.template.html'
})

export class EmisionTarjetasFormComponent {

    desabilitar: boolean;
    //EMISION DE TARJETAS
    _contratoKey: ContratoKey;
    benficiarios: BeneficiarioList[];
    benficiariosSelected: BeneficiarioList;
    benficiarioTarjetaSelected: BeneficiarioList;
    beneficiariosTarjeta: BeneficiarioList[];
    beneficiariosTarjetaAux: BeneficiarioList[];
    beneficiariosHijos: number;
    habilitar: boolean;
    filter: FilterEmisionTarjetas;
    valor: number;

    //REVERSO DE TARJETAS
    movimientos: Movimiento[];
    movimientoSelected: Movimiento;
    reversarFilter: ReversarTarjetaFilter;

    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this.loadDatos();
        }
        else {
            this._contratoKey = new ContratoKey();
            this.benficiarios = [];
            this.benficiariosSelected = new BeneficiarioList();
            this.benficiarioTarjetaSelected = new BeneficiarioList();
            this.filter = new FilterEmisionTarjetas();
            this.beneficiariosTarjeta = [];

            this.movimientoSelected = new Movimiento();
            this.reversarFilter = new ReversarTarjetaFilter();
        }
    }

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, public transaccionService: TransaccionService) {
        this.desabilitar = true;
        this._contratoKey = new ContratoKey();
        this.benficiarioTarjetaSelected = new BeneficiarioList();
        this.benficiariosSelected = new BeneficiarioList();
        this.filter = new FilterEmisionTarjetas();
        this.beneficiariosTarjeta = [];

        this.movimientoSelected = new Movimiento();
        this.reversarFilter = new ReversarTarjetaFilter();

    }

    loadDatos() {
        this.transaccionService.getDatosEmisionTarjetas(this._contratoKey).subscribe(
            result => {
                this.valor = result.Valor;
                this._contratoKey.Valor = result.Valor;
                this.beneficiariosHijos = result.BeneficiariosHijos;
                this.loadTableBeneficiarios();
            },
            error => this.authService.showErrorPopup(error));
    }

    emisionTarjeta() {
        this.desabilitar = true;
        this.habilitar = true;
        this._contratoKey.FiltarTarjetas = true;
        this.loadDatos();
    }

    loadTableBeneficiarios() {
        this.transaccionService.getTableBenficiarios(this._contratoKey).subscribe(
            result => {
                this.benficiarios = result;
                if (this.benficiarios != undefined && this.benficiarios.length > 0) {
                    this.seleccionar(this.benficiarios[0]);
                }
            },
            error => this.authService.showErrorPopup(error));
    }

    seleccionar(benficiarios: BeneficiarioList): void {
        if (this.benficiarios != undefined) {
            this.benficiarios.forEach(element => {
                element.Selected = false;
            });
        }
        benficiarios.Selected = true;
        this.benficiariosSelected = benficiarios;
    }

    seleccionarBeneficiarioTarjeta(benficiarioTarjeta: BeneficiarioList): void {
        for (let beneficiario of this.benficiarios) {
            beneficiario.Selected = false;
        }
        if (this.beneficiariosTarjeta != undefined) {
            this.beneficiariosTarjeta.forEach(element => {
                element.Selected = false;
            });
        }
        benficiarioTarjeta.Selected = true;
        this.benficiarioTarjetaSelected = benficiarioTarjeta;

    }

    agregarBeneficiario() {
        var hijos = false;
        var apa = 0;
        var tt = "";

        if (this.beneficiariosHijos > 0) {
            hijos = true;
        }

        //TITULAR CON BENEFICIOS Y CON HIJOS
        if (this._contratoKey.TitularBeneficios == true && hijos == true) {
            //CHOISE 0 Y 1
            if (this.benficiariosSelected.CodigoRelacion == 1 || this.benficiariosSelected.CodigoRelacion == 2) {
                apa = 2;
                tt = "AF";
            }
            //CHOISE 2
            if (this.benficiariosSelected.CodigoRelacion == 3) {
                apa = 1;
                tt = "AT";
            }
        }

        //TITULAR CON BENEFICIOS Y SIN HIJOS
        if (this._contratoKey.TitularBeneficios == true && hijos == false) {
            //CHOISE 4
            if (this.benficiariosSelected.CodigoRelacion == 1) {
                apa = 2;
                tt = "AT";
            }
            //CHOISE 5
            if (this.benficiariosSelected.CodigoRelacion == 2) {
                apa = 1;
                tt = "AT";
            }
            //CHOISE 6
            if (this.benficiariosSelected.CodigoRelacion > 3) {
                apa = 1;
                tt = "AT";
            }
        }

        //TITULAR SIN BENEFICIOS Y CON HIJOS
        if (this._contratoKey.TitularBeneficios == false && hijos == true) {
            //CHOISE 7
            if (this.benficiariosSelected.CodigoRelacion == 2) {
                apa = 2;
                tt = "AF";
            }

            //CHOISE 10
            if (this.benficiariosSelected.CodigoRelacion >= 3) {
                apa = 1;
                tt = "AT";
            }
        }

        //TITULAR SIN BENEFICIOS Y SIN HIJOS
        if (this._contratoKey.TitularBeneficios == false && hijos == false) {
            //CHOISE 20 y CHOISE 22
            if (this.benficiariosSelected.CodigoRelacion >= 2) {
                apa = 2;
                tt = "AT";
            }
        }



        this.agregaRegistroTemp(apa, tt);
    }

    agregaRegistroTemp(apa: number, tt: string) {
        var mensaje = "";
        var mensajeControl = "";
        var control = 0;
        var tieneMovimiento = 0;
        var valorRecargo = 0;
        var valor = this._contratoKey.Valor;

        if (this._contratoKey.TipoTarjeta == 1) {
            mensaje = "L";
            mensajeControl = "Ya está solicitando la tarjeta Salud(L:Logikard) para la persona numero";
        }
        if (this._contratoKey.TipoTarjeta == 2) {
            valor = 0;
            valorRecargo = 0;
            tt = "";
            mensaje = "V";
            mensajeControl = "Ya está solicitando la tarjeta Fybeca(V: VitalCard) para la persona numero";
        }
        if (this._contratoKey.TipoTarjeta == 3) {
            mensaje = "L y V";
            mensajeControl = "Ya está solicitando las tarjetas Salud(L:Logikard) y Fybeca(V: VitalCard) para la persona numero";
        }

        for (let beneficiario of this.beneficiariosTarjeta) {
            if (beneficiario.NumeroPersona == this.benficiariosSelected.NumeroPersona
                && beneficiario.NumeroContrato == this.benficiariosSelected.NumeroContrato) {
                control = 1;
                break;
            }
        }
        switch (mensaje) {
            case "L": {
                if (this.benficiariosSelected.LogicalCard == true) {
                    tieneMovimiento = 1;
                }
                break;
            }
            case "V": {
                if (this.benficiariosSelected.VitalCard == true) {
                    tieneMovimiento = 1;
                }
                break;
            }
            case "L y V": {
                if (this.benficiariosSelected.LogicalCard == true || this.benficiariosSelected.VitalCard == true) {
                    tieneMovimiento = 1;
                }
                break;
            }
        }

        if (tieneMovimiento == 0) {
            if (control == 0) {

                this.benficiariosSelected.TarjetaSolicitada = mensaje;
                this.benficiariosSelected.ValorTarjeta = valor;
                this.benficiariosSelected.ValorRecargo = valorRecargo;
                this.benficiariosSelected.HoraCreacion = tt;
                this.benficiariosSelected.Motivo = this._contratoKey.Motivo;
                this.beneficiariosTarjeta.push(this.benficiariosSelected);
                this.benficiariosSelected.Selected = false;
            }
            else {
                this.authService.showErrorPopup(mensajeControl + " " + this.benficiariosSelected.NumeroPersona + " " + this.benficiariosSelected.NombresApellidos);
            }
        }
        else {
            this.authService.showErrorPopup("Ya existe una solicitud previa para la persona " + this.benficiariosSelected.NumeroPersona + " " + this.benficiariosSelected.NombresApellidos);
        }

    }

    quitarBeneficiario() {
        this.beneficiariosTarjetaAux = [];
        for (let beneficiario of this.beneficiariosTarjeta) {
            if (beneficiario.NumeroPersona != this.benficiarioTarjetaSelected.NumeroPersona) {
                this.beneficiariosTarjetaAux.push(beneficiario);
            }
        }
        for (let beneficiario of this.benficiarios) {
            beneficiario.Selected = false;
        }
        this.beneficiariosTarjeta = this.beneficiariosTarjetaAux;
    }

    validar() {
        if (this._contratoKey.TipoTarjeta == undefined) {
            this.habilitar = true;
        }
        else {
            this.habilitar = false;
        }
    }

    guardar() {
        this.filter.Contrato = this._contratoKey;
        this.filter.Beneficiarios = this.beneficiariosTarjeta;
        this.showPopupResultadoConfirm("Está seguro que la información de tarjetas adicionales a procesar son correctos?", 1);
    }

    pageChanged(): void {
        this.loadTableBeneficiarios();
    }

    costoTarjeta() {
        if (this._contratoKey.CostoTarjeta == 0) {
            this._contratoKey.Valor = 0;
        }
        else {
            this._contratoKey.Valor = this.valor;
        }
    }

    //REVERSO TARJETA
    reversoTarjeta() {
        this.desabilitar = false;
        var filterMovimiento = new MovimientoFilter();
        filterMovimiento.CodigoContrato = this._contratoKey.CodigoContrato;
        filterMovimiento.CodigoTransaccion = 6;

        this.transaccionService.getDatosReversoTarjeta(filterMovimiento).subscribe(
            result => {
                this.movimientos = [];
                this.movimientos = result;
            },
            error => this.authService.showErrorPopup(error));
    }

    seleccionarMovimiento(movimiento: Movimiento) {
        if (this.movimientos != undefined) {
            this.movimientos.forEach(element => {
                element.Selected = false;
            });
        }
        movimiento.Selected = true;
        this.movimientoSelected = movimiento;
    }

    pageMovimientosChanged(): void {
        this.reversoTarjeta();
    }

    reversarTarjeta(): void {

        this.movimientoSelected.FechaMovimientoDate = new Date(this.movimientoSelected.FechaMovimientoDate);

        var fechaTarjeta = this.movimientoSelected.FechaMovimientoDate.getFullYear() + "-" + (this.movimientoSelected.FechaMovimientoDate.getMonth() + 1) + "-" + this.movimientoSelected.FechaMovimientoDate.getDate();
        var fechaActual = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate();

        if (fechaTarjeta != fechaActual) {
            this.authService.showInfoPopup("Solo es posible reversar en la misma fecha");
        }
        else {
            this.reversarFilter = new ReversarTarjetaFilter();

            this.reversarFilter.DatoAnterior = this.movimientoSelected.DatoAnterior;
            this.reversarFilter.NumeroMovimiento = this.movimientoSelected.NumeroMovimiento;
            this.reversarFilter.Region = this._contratoKey.CodigoRegion;
            this.reversarFilter.CodigoProducto = this._contratoKey.CodigoProducto;
            this.reversarFilter.NumeroContrato = this._contratoKey.NumeroContrato;
            this.reversarFilter.ValorTarejetasAdicionales = this._contratoKey.ValorTarjetasAdicionales;
            this.reversarFilter.CobrandoTarjetasAdicionales = this._contratoKey.CobrandoTarjetasAdicionales;
            this.reversarFilter.TarjetasAdicionales = this._contratoKey.TarjetasAdicionales;
            this.reversarFilter.PersonaNumero = this.movimientoSelected.PersonaNumero;
            this.showPopupResultadoConfirm("Esta seguro desea reversar?", 2);
        }
    }

    showPopupResultadoConfirm(msg: string, tipo: number): void {
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
                    if (tipo == 1) {
                        this.transaccionService.emitirTarjetas(this.filter).subscribe(
                            result => {
                                if (result.EstadoTransaccion == true) {
                                    this.authService.showSuccessPopup("Tajetas Emitidas");
                                    this._contratoKey = new ContratoKey();
                                    this._contratoKey = result.ContratoKey;
                                    this.benficiarioTarjetaSelected = new BeneficiarioList();
                                    this.beneficiariosTarjeta = [];
                                    this._contratoKey.TipoTarjeta = undefined;
                                    this._contratoKey.CostoTarjeta = undefined;
                                    this._contratoKey.Motivo = undefined;
                                }
                                else {
                                    this.authService.showErrorPopup("Ha ocurrido un error");
                                }
                            },
                            error => {
                                this.authService.showErrorPopup(error);
                            }
                        )
                    }

                    if (tipo == 2) {
                        this.transaccionService.reversarTarjeta(this.reversarFilter).subscribe(
                            result => {
                                if (result.EstadoTransaccion == true) {
                                    this.authService.showSuccessPopup("Solcitud anulada correctamente");
                                    this._contratoKey = new ContratoKey();
                                    this._contratoKey = result.ContratoKey;
                                    this._contratoKey.TipoTarjeta = undefined;
                                    this._contratoKey.CostoTarjeta = undefined;
                                    this._contratoKey.Motivo = undefined;
                                    this.pageMovimientosChanged();
                                }
                                else {
                                    this.authService.showErrorPopup(result.Mensaje);
                                }
                            },
                            error => {
                                this.authService.showErrorPopup(error);
                            }
                        )
                    }

                }
            });
    }



}

