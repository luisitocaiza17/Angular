import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../seguridad/auth.service';
import { ContratoKey } from '../../common/model/contrato';
import { BeneficiarioList } from '../../common/model/beneficiario';
import { DatosMaternidad } from '../../common/model/transacciones';
import { TransaccionService } from '../../common/servicios/transaccion.service';

@Component({
    selector: 'maternidad',
    providers: [TransaccionService],
    templateUrl: 'maternidad.form.template.html'
})

export class MaternidadFormComponent {

    subscription: any;
    interval: any;

    validar: number;
    benficiarios: BeneficiarioList[];
    benficiariosSelected: BeneficiarioList;
    datosMaternidad: DatosMaternidad;

    _contratoKey: ContratoKey;
    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this.validar = 0;
            this._contratoKey.Maternidad = undefined;
            this.loadMaternidad();
        }
        else {
            this.benficiarios = [];
            this._contratoKey.Maternidad = undefined;
            this.benficiariosSelected = new BeneficiarioList();
            this.datosMaternidad = new DatosMaternidad();
        }
    }

    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private changeDetector: ChangeDetectorRef,
        public transaccionService: TransaccionService) {

        this._contratoKey = new ContratoKey();
        this._contratoKey.Maternidad = undefined;
        this.validar = 0;
        this.benficiarios = [];
        this.benficiariosSelected = new BeneficiarioList();
        this.datosMaternidad = new DatosMaternidad();
    }

    loadMaternidad(): void {
        if (this._contratoKey.EsMoroso == true) {
            this.authService.showInfoPopup("Imposible Realizar esta Modificación, Contrato Moroso");
        }
        else {
            this.loadDatos();
        }
    }

    setearChangeDetector(): void {
        this.subscription.unsubscribe();
        clearInterval(this.interval);
    }


    loadDatos() {
        this.subscription = this.transaccionService.getTableBenficiarios(this._contratoKey).subscribe(
            result => {
                this.benficiarios = result;
                this.interval = setInterval(() => {
                    this.changeDetector.detectChanges();
                    this.changeDetector.detach();
                }, 100);

                if (this.benficiarios != undefined && this.benficiarios.length > 0) {
                    this.benficiarios.forEach(element => {
                        if (element.Titular == false) {
                            element.DescripcionTitular = "NO"
                        }
                        else {
                            element.DescripcionTitular = "SI"
                        }
                    });
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

    aplicarMaternidad() {
        this.prvalidar();
        if (this._contratoKey.Maternidad != undefined) {
            if (this.validar == 0) {
                this.authService.showInfoPopup(this._contratoKey.Cerror);
            }
            else {
                if (this.validar == 1) {
                    this.datosMaternidad.beneficiario = this.benficiariosSelected;
                    this.datosMaternidad.contratoKey = this._contratoKey;
                    this.showPopupResultadoConfirm(this._contratoKey.Cerror);
                }
            }
        }
    }

    prvalidar() {
        this.validar = 0;
        if (this._contratoKey.Maternidad == undefined) {
            this.authService.showInfoPopup("Seleccione Maternidad SI/NO");
        }
        else {
            if (this.benficiariosSelected.EstadoBeneficiario != 1) {
                this._contratoKey.Cerror = "El beneficiario seleccionado no esta activo";
            }
            else {
                if (this.benficiariosSelected.DescripcionSexo != "F") {
                    this._contratoKey.Cerror = "El beneficiario no aplica maternidad";
                }
                else {
                    if (this._contratoKey.Maternidad == 1 && this.benficiariosSelected.TajetaBeneficiario == true) {
                        this._contratoKey.Cerror = "El beneficiario seleccionado ya tiene aplicado maternidad";
                    }
                    else {
                        if (this._contratoKey.Maternidad == 0 && this.benficiariosSelected.TajetaBeneficiario == false) {
                            this._contratoKey.Cerror = "El beneficiario seleccionado ya tiene desactivado maternidad";
                        }
                        else {
                            if (this.benficiariosSelected.Edad < 18) {
                                this._contratoKey.Cerror = "El beneficiario seleccionado no cumple las CONDICIONES para la maternidad";
                            }
                            else {
                                if (this.benficiariosSelected.Edad >= 18 && this.benficiariosSelected.Edad <= 23) {
                                    if (this._contratoKey.Maternidad == 1) {
                                        this._contratoKey.Cerror = "Esta seguro que desea habilitar la maternidad para el beneficiario seleccionado?";
                                    }
                                    if (this._contratoKey.Maternidad == 0) {
                                        this._contratoKey.Cerror = "Esta seguro que desea desabilitar la maternidad para el beneficiario seleccionado?";
                                    }
                                    this.validar = 1;
                                }
                                else {
                                    if (this.benficiariosSelected.Edad > 23) {
                                        if (this._contratoKey.Maternidad == 1) {
                                            this._contratoKey.Cerror = "La beneficiaria tiene una edad mayor de la permitida desea habilitar la maternidad?";
                                        }
                                        else {
                                            this._contratoKey.Cerror = "La beneficiaria tiene una edad mayor de la permitida desea desabilitar la maternidad?";
                                        }
                                        this.validar = 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
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
                    this.transaccionService.aplicarMaternidad(this.datosMaternidad).subscribe(
                        result => {
                            if (result.EstadoTransaccion == true) {
                                this.setearChangeDetector();
                                this.benficiariosSelected = new BeneficiarioList();
                                this.loadDatos();
                                this.authService.showSuccessPopup(result.Mensaje);
                            }
                            else {
                                this.authService.showErrorPopup(result.Mensaje);
                            }
                        },
                        error => this.authService.showErrorPopup(error)
                    )
                }
            });
    }

    pageChanged(): void {
        this.loadDatos();
    }

}
