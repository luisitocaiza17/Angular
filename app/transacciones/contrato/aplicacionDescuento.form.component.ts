import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { Router } from '@angular/router';
import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { ContratoKey } from '../../common/model/contrato';
import { DatosContratoTransaccionBeneficiarioEntity, DatosAplicarDescuentoBeneficiarioEntity } from '../../common/model/transacciones';
import { TransaccionService } from '../../common/servicios/transaccion.service';
import { BeneficiarioDescuentoTransaccionEntity } from '../../common/model/beneficiario';
import { AdministracionSistemaService } from '../../common/servicios/administracionSistema.service';
import { RetencionService } from '../../common/servicios/retencion.service';
import { DescuentoService } from '../../common/servicios/descuento.service';
import { ParametroRetencion } from '../../common/model/retencion';


@Component({
    selector: 'aplicacionDescuento',
    providers: [TransaccionService, AdministracionSistemaService, DescuentoService],
    templateUrl: 'aplicacionDescuento.form.template.html'
})

export class AplicacionDescuentoFormComponent implements OnInit {

    msgValidacionDescuento: string;
    msgValidacionSolicita: string;
    desabilitar: boolean;
    datosContratoTransaccionBeneficiarioEntity: DatosContratoTransaccionBeneficiarioEntity;//datos del contrato
    beneficiarioDescuento: BeneficiarioDescuentoTransaccionEntity[];//datos que se obtiene del servicio
    datosAplicaDescuentoBeneficiario: DatosAplicarDescuentoBeneficiarioEntity[];
    _contratoKey: ContratoKey;

    //para validar si puede o no aplicar un X valor de descuento
    Nivel1: string = "Ejecutivo Contact Center";
    //Nivel2: string = "Jefatura SAC Sierra,Jefatura SAC Costa";
    Nivel2: string = "Jefatura SAC Costa";
    Nivel3: string = "Subgerencia Nacional";
    rolGestion: string;
    usuarioJefe: string;
    paramMaximoDesc: ParametroRetencion;
    valorDelRol: number = 0;
    usuarioMail: string = "";//usuario aprobador
    valorGastoAdministrativo: number = 0.0;
    parametroSSC: number;
    comentario: string;

    //para las columnas
    columns: any;
    showColumns: boolean;



    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined)
            this.loadDataAnulacion();
    }

    constructor(public domSanitizer: DomSanitizer, private router: Router, private authService: AuthService, private elementRef: ElementRef,
        private transaccionService: TransaccionService, private contratoTxList: ContratosTxListComponent, private descuentoService: DescuentoService,
        private administracionSistemaService: AdministracionSistemaService, private retencionService: RetencionService) {
        this._contratoKey = new ContratoKey();
        this.datosContratoTransaccionBeneficiarioEntity = new DatosContratoTransaccionBeneficiarioEntity();
        this.desabilitar = false;
        this.beneficiarioDescuento = [];
        this.datosAplicaDescuentoBeneficiario = [];

        this.usuarioMail = "";

        this.columns = {
            "Beneficiarios": true,
            "PrecioBeneficiario": true,
            "Descuento Vigente": true,
            "Descuento Disponible": true,
            "Aplicar Descuento %": true,
            "Descuento Nuevo %": true,
            "Total Descuento Nuevo $": true
        };
    }

    ngOnInit() {
        this.validarPermisosRol();//llamo al metodo la inicio para obtener los datos del usuario, necesito el rol, y saber el valor del descuento

        this.retencionService.obtenerParametroPorNombre('SSC').subscribe(
            result => {
                if (result != null) {
                    this.parametroSSC = Number(result.Valor);
                } else {
                    this.parametroSSC = 0.005
                }
            },
            error => this.parametroSSC = 0.005
        );

        this.beneficiarioDescuento = [];
        this.datosContratoTransaccionBeneficiarioEntity.CodigoContrato = this._contratoKey.CodigoContrato;
        this.datosContratoTransaccionBeneficiarioEntity.CodigoProducto = this._contratoKey.CodigoProducto;
        this.datosContratoTransaccionBeneficiarioEntity.NumeroContrato = this._contratoKey.NumeroContrato;
        this.datosContratoTransaccionBeneficiarioEntity.NumeroPersona = this._contratoKey.NumeroPersona;
        this.datosContratoTransaccionBeneficiarioEntity.CodigoRegion = this._contratoKey.CodigoRegion;
        this.valorGastoAdministrativo = this._contratoKey.MontoGastosAdministrativos;
        this.transaccionService.obtenerBeneficiarios(this.datosContratoTransaccionBeneficiarioEntity).subscribe(
            result => {
                this.beneficiarioDescuento = result;
                this.beneficiarioDescuento.forEach(element => {
                    if (element.PorcentajeDescNuevo == undefined) {
                        element.PorcentajeDescNuevo = 0;
                    }
                    if (element.VistaValorDescNuevo == undefined) {
                        element.VistaValorDescNuevo = 0;
                    }
                });
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    ArmarDescuentoPorBeneficiarios(): void {
        this.datosAplicaDescuentoBeneficiario = [];
        for (let i = 0; i < this.beneficiarioDescuento.length; i++) {
            var aux = new DatosAplicarDescuentoBeneficiarioEntity();
            aux.CodigoContrato = this._contratoKey.CodigoContrato;
            aux.CodigoProducto = this._contratoKey.CodigoProducto;
            aux.NumeroContrato = this._contratoKey.NumeroContrato;
            aux.CodigoRegion = this._contratoKey.CodigoRegion;
            aux.NumeroEmpresa = this._contratoKey.NumeroEmpresa;
            aux.NombreSolicitante = this.authService.nombreUsuario;//nombre del usuario
            aux.NombreSucursalEmpresa = this._contratoKey.NombreSucursalEmpresa;
            aux.CodigoSucursal = this._contratoKey.CodigoSucursal;
            aux.NumeroSucursal = this._contratoKey.NumeroSucursal;
            aux.PrecioBeneficiario = this.beneficiarioDescuento[i].PrecioBeneficiario;
            aux.PorcentajeDescuento = this.beneficiarioDescuento[i].PorcentajeDescuento;//%

            //precibeneficio * (PorcentajeDescuento+PorcentajeDescNuevo)/100
            aux.ValorDescuento = this.beneficiarioDescuento[i].ValorDescuento;
            aux.PrecioServicio = this.beneficiarioDescuento[i].PrecioServicios;
            aux.PersonaNumero = this.beneficiarioDescuento[i].PersonaNumero;

            aux.AppDescuentoNuevo = this.beneficiarioDescuento[i].PorcentajeDescNuevo;//%
            aux.AppValorDescuentoNuevo = this.beneficiarioDescuento[i].ValorDescuentoNuevo;//$
            aux.VistaPorcentajeDescNuevo = this.beneficiarioDescuento[i].VistaPorcentajeDescNuevo;//%indica el porcentaje nuevo sin sumar el % anterior
            aux.VistaValorDescNuevo = this.beneficiarioDescuento[i].VistaValorDescNuevo;

            this.datosAplicaDescuentoBeneficiario.push(aux);
        }
    }

    loadDataAnulacion(): void {
        if (this._contratoKey.ContratoCodigoEstado == 2 || this._contratoKey.ContratoCodigoEstado == 27) {
            this.authService.showInfoPopup("El contrato se encuentra Anulado Actualmente");
            this.desabilitar = true;
        }
        if (this._contratoKey.CodigoProducto.toUpperCase() == 'IND' || this._contratoKey.CodigoProducto.toUpperCase() == 'ONC' || this._contratoKey.CodigoProducto.toUpperCase() == 'XPR') {
        }
        else {
            this.authService.showInfoPopup("No se puede acceder a esta opción");
            this.desabilitar = true;
        }
    }



    guardarDescuento(beneficiario: BeneficiarioDescuentoTransaccionEntity) {
        this.ArmarDescuentoPorBeneficiarios();
        this.msgValidacionDescuento = "";
        this.msgValidacionSolicita = "";
        //console.log('xxxxxxxx', this._contratoKey, ' ', this._contratoKey.NumeroContrato, ' ',this._contratoKey.CodigoProducto, ' ', this._contratoKey.CodigoRegion);
        this.showPopupResultadoConfirm("¿Esta seguro que desea aplicar el / los descuentos?");
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
                    this.transaccionService.aplicarDescuentoPorBeneficiario(this.datosAplicaDescuentoBeneficiario).subscribe(
                        result => {
                            if (result.EstadoTransaccion) {
                                // this.authService.showSuccessPopup(result.Mensaje);
                                this.authService.showSuccessPopup("Datos actualizados");
                                jQuery("#divConsultar").collapse("show");
                                jQuery("#divPanelTransacciones").collapse("hide");
                                jQuery("#divResultadoBusquedaContratos").collapse("hide");
                                this.contratoTxList.limpiar();//para limpiar los datos ingresados
                                this.router.navigate(['/transacciones']);
                            }
                            else {
                                this.authService.showErrorPopup("No se ha podido actualizar el descuento");
                                /* this.authService.showErrorPopup(result.Mensaje); */
                            }
                        },
                        error => {
                            this.authService.showErrorPopup(error);
                        }
                    )
                }

            });
    }

    getTotalValorDescuentoNuevo(beneficiario: BeneficiarioDescuentoTransaccionEntity): void {
        if (this.beneficiarioDescuento != undefined && this.beneficiarioDescuento.length != 0) {
            if (beneficiario.PorcentajeDescNuevo != 0 && beneficiario.PorcentajeDescNuevo != undefined && beneficiario.PorcentajeDescNuevo >= 0) {
                var descNuevo = 0;
                var valorAplicadoNegado = beneficiario.PorcentajeDescNuevo;

                if (this.valorDelRol >= beneficiario.PorcentajeDescNuevo) {
                    if (beneficiario.DescuentoDisponible >= (beneficiario.PorcentajeDescNuevo + beneficiario.PorcentajeDescuento)) {
                        descNuevo = beneficiario.PorcentajeDescNuevo + beneficiario.PorcentajeDescuento;
                        var descTotal = ((beneficiario.PrecioBeneficiario + beneficiario.ValorDescuento) * (descNuevo / 100));
                        beneficiario.ValorDescuentoNuevo = descTotal;//$
                        beneficiario.VistaPorcentajeDescNuevo = descNuevo;//%
                        beneficiario.VistaValorDescNuevo = descTotal - beneficiario.ValorDescuento;
                        //return descTotal;
                    } else {
                        this.authService.showErrorPopup('El descuento no puede ser mayor a: ' + beneficiario.DescuentoDisponible);
                        beneficiario.ValorDescuentoNuevo = 0;//$
                        beneficiario.VistaPorcentajeDescNuevo = 0;//%
                        beneficiario.VistaValorDescNuevo = 0;
                        beneficiario.PorcentajeDescNuevo = 0;
                        descNuevo = 0;
                    }
                } else {
                    descNuevo = 0;
                    beneficiario.ValorDescuentoNuevo = 0;//$
                    beneficiario.VistaPorcentajeDescNuevo = 0;//%
                    beneficiario.VistaValorDescNuevo = 0;
                    beneficiario.PorcentajeDescNuevo = 0;
                    this.showPopupConfirm('El descuento máximo que usted puede aplicar es: ' + this.valorDelRol + '% y usted está aplicando: ' + valorAplicadoNegado + '%.', beneficiario);
                }
            } else {
                beneficiario.ValorDescuentoNuevo = 0;//$
                beneficiario.VistaPorcentajeDescNuevo = 0;//%
                beneficiario.PorcentajeDescNuevo = 0;
                beneficiario.VistaValorDescNuevo = 0;
                descNuevo = 0;
            }
        }
    }

    validarPermisosRol(): void {
        const usrData = this.authService.getDatosUsuarioAutenticado();//se obtiene datos del usuario
        this.administracionSistemaService.GetRolesByIdUsuario(usrData.Id).subscribe(result => {//obtiene el rol del usuario

            if (result.length > 0) {//si se obtiene algun dato, será mayor que 0
                result.forEach(element => {
                    if (this.Nivel1.search(element.NombreRol) != -1 || this.Nivel2.search(element.NombreRol) != -1 || this.Nivel3.search(element.NombreRol) != -1) {
                        this.rolGestion = element.NombreRol;
                        // console.log('NOmbre rol ' + this.rolGestion);
                        // console.log('Id usuario ' + usrData.Id);
                        this.usuarioJefe = this.getRolSuperior();//este es el usuario final que aprobaria un descuento
                        this.retencionService.obtenerParametroPorNombre(this.rolGestion).subscribe(result2 => {
                            if (result2) {
                                this.paramMaximoDesc = result2;
                                this.valorDelRol = this.paramMaximoDesc.Valor;//obtengo el valor maximo de descuento que el usuairo puede aplicar       
                            } else {
                                this.authService.showErrorPopup('No se ha podido validar el valor de descuento para su rol.');
                                this.desabilitar = true;
                            }
                        },
                        );
                    }//if nivel 1 2 3
                });
            } else {
                this.authService.showErrorPopup('No se ha podido validar el rol de su usuario.');
                this.desabilitar = true;
            }

        },
        );
    }


    getRolSuperior() {
        if (this.Nivel1.search(this.rolGestion) != -1) {
            return "Nivel2";
        } else {
            if (this.Nivel2.search(this.rolGestion) != -1) {
                return "Nivel3";
            }
        }
        return "Nivel3";
    }

    validarPermisoAplicarDescuento() {
        if (this.Nivel3.search(this.rolGestion) != -1
            || this.Nivel2.search(this.rolGestion) != -1
            || this.Nivel1.search(this.rolGestion) != -1) {
            return false;
        }
        return true;

    }

    verificarUsuarioByRol(): string {
        if (this.usuarioJefe == "Nivel2") {
            return this.Nivel2;
        } else {
            return this.Nivel3;
        }
    }

    //PARA VISTA VALORES ANTERIORES DE FACTURA
    getTotalMedicinaPrepagada(): number {
        return this.suma(this.beneficiarioDescuento, x => x.PrecioBeneficiario);
    }

    getTotalServiciosAdicionales(): number {
        return this.suma(this.beneficiarioDescuento, x => x.PrecioServicios);
    }

    getSubTotal1(beneficiario): number {
        if (beneficiario) {
            return beneficiario.MedicinaPrepagada + beneficiario.ServiciosAdicionales;
        } else {
            return this.suma(this.beneficiarioDescuento, x => x.PrecioBeneficiario + x.PrecioServicios);
        }
    }

    getTotalValorDescuento(): number {
        return this.suma(this.beneficiarioDescuento, x => x.PorcentajeDescuento);
    }

    getTotalValorDescuentoAnterior(): number {
        return this.suma(this.beneficiarioDescuento, x => x.ValorDescuento);
    }

    getSubTotal2(): number {
        return this.getSubTotal1(null) - this.getTotalValorDescuento();
    }

    getGastoAdministrativo(): number {
        return this.valorGastoAdministrativo;
    }

    getSubTotal3(): number {
        return this.getSubTotal2() + this.getGastoAdministrativo();
    }

    getSSC(): number {
        return this.getSubTotal3() * this.parametroSSC;
    }

    //PARA VISTA DE NUEVOS VALORES EN FACTURA
    getDescuentoNuevo(): number {
        return this.suma(this.beneficiarioDescuento, x => x.PorcentajeDescuento);
    }

    getDescuentoDisponible(): number {
        return this.suma(this.beneficiarioDescuento, x => x.DescuentoDisponible);
    }

    getIngresoPorcentajeDescNuevo(): number {
        return this.suma(this.beneficiarioDescuento, x => x.PorcentajeDescNuevo);
    }

    getSumaDescVigenteDescNuevo(): number {
        return this.getTotalValorDescuento() + this.getIngresoPorcentajeDescNuevo();
    }

    getSubTotal2ConDescuento(beneficiarios): number {
        return this.getSubTotal1(beneficiarios) - this.getSumaDescVigenteDescNuevo();
    }

    getSubTotal3ConDescuento(): number {
        return this.getSubTotal2ConDescuento(null) + this.getGastoAdministrativo();
    }

    getSSCConDescuento(): number {
        return this.getSubTotal3ConDescuento() * this.parametroSSC;
    }

    //presenta el valor en el campo Descuento Total $ de la tabla
    getPresentacionValorDescNuevo(): number {
        return this.suma(this.beneficiarioDescuento, x => x.VistaValorDescNuevo);
    }

    suma<T>(items: T[], f: (item: T) => number): number {
        return items.reduce((xs, x) => xs + f(x), 0);
    }

    //para la seleccion de columnas
    toggleColumn(key: string) {
        this.columns[key] = !this.columns[key];
    }

    toggleShowColumns() {
        this.showColumns = !this.showColumns;
    }

    keys(obj) {
        return Object.keys(obj);
    }

    //confirmaion de POP-UP
    showPopupConfirm(msg: string, beneficiario: BeneficiarioDescuentoTransaccionEntity): void {
        swal({
            title: "",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "Notificar",
            closeOnConfirm: true
        },
            confirmed => {
                if (confirmed) {
                    let datoNombreRol = this.verificarUsuarioByRol();
                    if (datoNombreRol != undefined) {
                        this.administracionSistemaService.GetUsuarioByNombreRol(datoNombreRol).subscribe(
                            result => {
                                if (result != undefined && result != null) {
                                    this.usuarioMail = result;
                                    console.log("mail mail mail " + this.usuarioMail);

                                    jQuery("#modalEnviado").collapse("show");

                                    /*
                                           var inipos = jQuery("#resultadosBusqAuditorias").position().top;
                    jQuery("html, body").animate({ scrollTop: inipos + 190 }, 300);
                                    */
                                } else {
                                    this.desabilitar = true;
                                    this.authService.showInfoPopup("No se puede obtener el correo del usuario al que se va a notificar");
                                }
                            }, error => {
                                this.authService.showErrorPopup(error);
                            }
                        );
                    } else {
                        this.authService.showInfoPopup("No se puede obtener el nombre del rol del usuario Superior");
                        beneficiario.ValorDescuentoNuevo = 0;//$
                        beneficiario.VistaPorcentajeDescNuevo = 0;//%
                        beneficiario.PorcentajeDescNuevo = 0;
                        beneficiario.VistaValorDescNuevo = 0;
                        this.desabilitar = true;
                    }
                } else {
                    beneficiario.ValorDescuentoNuevo = 0;//$
                    beneficiario.VistaPorcentajeDescNuevo = 0;//%
                    beneficiario.PorcentajeDescNuevo = 0;
                    beneficiario.VistaValorDescNuevo = 0;
                }

            });
    }

    notificar() {
        this._contratoKey.UsuarioMail = this.usuarioMail;//usuario aprobador
        this._contratoKey.Comentario = this.comentario;
        this.descuentoService.sendNotificarTransaccionDescuento(this._contratoKey).subscribe(
            result => {
                if (result) {
                    jQuery("#modalEnviado").collapse("hide");
                    this.authService.showSuccessPopup("Notificación enviada");
                    this.contratoTxList.limpiar();//para limpiar los datos ingresados
                    this.router.navigate(['/transacciones']);
                }
            },
            error => {
                this.authService.showErrorPopup(error);
            }
        );
    }

}