import { Component } from '@angular/core';
import { AuthService } from '../../seguridad/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Opcion, RetencionMovimientosKey, SetComentario, DescuentoCliente } from '../../common/model/retencion';
import { RetencionService } from '../../common/servicios/retencion.service';
import { RetencionesVime } from '../../common/servicios/retencionesVime.service';
import { GestionRetencionCliente } from '../../common/model/retencion';
import { Catalogo } from '../../common/model/catalogo';
import { RetencionesState } from '../services/retenciones.state';

@Component({
    providers: [RetencionesVime],
    templateUrl: 'comentario.movimientos.template.html',
    styles: ['.text-primary { color: #337ab7!important; }']
})

export class ComentarioMovimientosComponent {
    setComentario: SetComentario;
    ListaDesicionCliente: Opcion[];
    ListaContactabilidad: Opcion[];
    listaOficinas: Catalogo[];
    descuentoPendiente: DescuentoCliente[] = [];
    key: RetencionMovimientosKey;
    txtComentario: string;
    aplicaAprobacion: GestionRetencionCliente;
    Nivel2: string = "Jefatura SAC Sierra,Jefatura SAC Costa";
    Nivel3: string = "Subgerencia Nacional";

    constructor(private route: ActivatedRoute,
        private router: Router, private retencionService: RetencionService,
        private retencionVimeService: RetencionesVime, public retencionState: RetencionesState, 
        private authService: AuthService) {
        this.txtComentario = "";
        route.params.subscribe((params: RetencionMovimientosKey) => {
            this.key = params;
            this.setComentario = new SetComentario();
            this.listaOficinas = [];
            this.retencionService.obtenerOpciones().subscribe(opciones => {
                this.ListaDesicionCliente = opciones.ListaDesicionCliente;
                this.ListaContactabilidad = opciones.ListaContactabilidad;
                this.ListaDesicionCliente.push
                if (this.ListaDesicionCliente != undefined) {
                    this.ListaDesicionCliente.filter(x => x.Estado == true);
                }
                if (this.ListaContactabilidad != undefined) {
                    this.ListaContactabilidad.filter(x => x.Estado == true);
                }
                this.loadOficinas();
            });
        });
    }

    loadOficinas() {
        this.retencionService.obtenerOficinas().subscribe(result => {
            this.listaOficinas = result;
        });
    }

    getUsuarioSuperior(nivel: string, oficina: string): string {
        var respuesta = this.Nivel3;
        if (nivel.trim().toString() == 'Nivel2') {
            var niveles = this.Nivel2.split(',');
            niveles.forEach(element => {
                if (element.toUpperCase().search(oficina.toUpperCase()) != -1) {
                    respuesta = element;
                }
            });
        }
        if (nivel.trim().toString() == 'Nivel3') {
            respuesta = this.Nivel3;
        }
        return respuesta;
    }


    enviar() {
        if (this.key.IdDesc) {

            if (this.key.identificador == "CAMBIOPLAN") {

                this.aplicaAprobacion = new GestionRetencionCliente();
                this.retencionVimeService.getAprobacion(this.key.IdDesc).subscribe(resp => {
                    this.aplicaAprobacion = resp;

                    var oficinaSeleccionada = this.listaOficinas.filter(ofi => ofi.Id == this.setComentario.IdOficina)

                    this.aplicaAprobacion.NombreOficina = oficinaSeleccionada[0].Valor;
                    this.aplicaAprobacion.IdOficina = this.setComentario.IdOficina;

                    var rol = this.getUsuarioSuperior(this.aplicaAprobacion.UsuarioAprobador, oficinaSeleccionada[0].Valor);
                    this.retencionService.getUsuarioJefeRol(rol)
                        .subscribe(resp => {
                            this.aplicaAprobacion.UsuarioAprobador = resp.NombreUsuario;
                            this.setComentario.Comentario = this.txtComentario;

                            if (this.aplicaAprobacion.EstadoId == 2) {
                            }

                            if (this.aplicaAprobacion.EstadoId == 3) {

                                var DatosGestionJson = JSON.parse(this.aplicaAprobacion.DatosGestion);
                                console.log(DatosGestionJson);

                                this.setComentario.Comentario += "\nSe ha enviado una aprobación de Cambio de Plan al usuario "
                                    + this.aplicaAprobacion.UsuarioAprobador + "\n El Plan anterior es "+ DatosGestionJson.Contrato.CodigoPlan + ", el plan nuevo es "+ DatosGestionJson.Plan.CodigoPlan;
                            }

                            if (this.aplicaAprobacion.EstadoId == 4) {
                                this.setComentario.Comentario += "\nCambio de Plan denagado. ";
                            }

                            this.setComentario.NombreUsuario = this.aplicaAprobacion.UsuarioGestion;
                            this.setComentario.Region = this.aplicaAprobacion.Region;
                            this.setComentario.CodigoProducto = this.aplicaAprobacion.CodigoProducto;
                            this.setComentario.NumeroContrato = this.aplicaAprobacion.NumeroContrato;

                            this.retencionService.setComentario(this.setComentario).subscribe(res => {
                                if (res.Estado) {
                                    this.retencionVimeService.AplicaAprobacion(this.aplicaAprobacion).subscribe(resp => {
                                        console.log(resp);
                                        this.retencionService.setComentario(this.setComentario)
                                            .subscribe(res => {
                                                if (res.Estado) {
                                                    const c = this.setComentario;
                                                    this.router.navigate(['/retencion/show', c.Region, c.CodigoProducto, c.NumeroContrato]);
                                                } else {
                                                    this.authService.showErrorPopup(res.Mensaje);
                                                }
                                            });
                                    }, error => this.authService.showErrorPopup(error));

                                } else {
                                    this.authService.showErrorPopup(res.Mensaje);
                                }
                            });
                        });


                }, error => this.authService.showErrorPopup(error));
            }


        } else {
            let usrData = this.authService.getDatosUsuarioAutenticado();
            this.setComentario.NombreUsuario = usrData.NombreUsuario;
            this.setComentario.Region = this.key.Region;
            this.setComentario.CodigoProducto = this.key.CodigoProducto;
            this.setComentario.NumeroContrato = this.key.NumeroContrato;
            /* PARA RETENCION-ANULA CONTRATO */
            if (this.key.identificador == "ANULARPRODUCTO") {
                this.setComentario.Comentario = "ANULADO: " + this.retencionState.getMotivo() + " DETALLE MOTIVO: " +this.retencionState.getComentarioMotivo()+ " DETALLE GESTION: "+ this.txtComentario;
                this.retencionService.setComentario(this.setComentario)
                    .subscribe(res => {
                        if (res.Estado) {
                            const c = this.setComentario;
                            this.router.navigate(['/retencion/show', c.Region, c.CodigoProducto, c.NumeroContrato]);
                        } else {
                            this.authService.showErrorPopup(res.Mensaje);
                        }
                    });
            }

             /* PARA RETENCION-FORMA PAGO */
            if (this.key.identificador == "FORMAPAGO") {
                var ValoresActuales = this.retencionState.getContratoKey().Anterior.split(";");
                var formaPagoActual = ValoresActuales[0];
                var periodoPagoActual = ValoresActuales[1];
                var tipoCuentaActual = ValoresActuales[2];
                var codifoBancoActual = ValoresActuales[3];

                this.setComentario.Comentario = "FORMA DE PAGO - DETALLE GESTION: " + this.txtComentario 
                    + " FORMA PAGO ANTERIOR : " +this.verFormaPago( this.retencionState.getContratoKey().FormaPago) + "   FORMA PAGO NUEVA : " + formaPagoActual 
                    + " PERIODO PAGO ANTERIOR : " + this.verPeriodoPago(this.retencionState.getContratoKey().PeriodoPago )+ " PERIODO PAGO NUEVA : " + periodoPagoActual 
                    + " TIPO CUENTA ANTERIOR : " + this.verTipoCuenta(this.retencionState.getContratoKey().TipoCuenta )+ "  TIPO CUENTA NUEVA : " + tipoCuentaActual ;

                this.retencionService.setComentario(this.setComentario)
                    .subscribe(res => {
                        if (res.Estado) {
                            const c = this.setComentario;
                            this.router.navigate(['/retencion/show', c.Region, c.CodigoProducto, c.NumeroContrato]);
                        } else {
                            this.authService.showErrorPopup(res.Mensaje);
                        }
                    });


            }

            /* PARA RETENCION-CAMBIO DE PLAN */
            if (this.key.identificador == "CAMBIOPLAN") {                
                this.setComentario.Comentario += "\nEl contrato " + this.key.NumeroContrato + " realizo un cambio en su plan, para informacion del cambio verificar en el modulo de movimientos"
                this.retencionService.setComentario(this.setComentario)
                    .subscribe(res => {
                        if (res.Estado) {
                            const c = this.setComentario;
                            this.router.navigate(['/retencion/show', c.Region, c.CodigoProducto, c.NumeroContrato]);
                        } else {
                            this.authService.showErrorPopup(res.Mensaje);
                        }
                    });
            }

            if (this.key.identificador == "MODIFICARBENEFICIARIOS") {
                this.setComentario.Comentario = this.txtComentario;
                this.retencionService.setComentario(this.setComentario).subscribe(res => {
                    if (res.Estado) {
                        this.router.navigate(['/retencion/show', this.key.Region, this.key.CodigoProducto, this.key.NumeroContrato]);
                    } else {
                        this.authService.showErrorPopup(res.Mensaje);
                    }
                });
            }
        }
    }

    regresar() {
        this.router.navigate(['/retencion/list']);
    }

    cerrarExcepciones() {
        this.setComentario.DetalleExpecion = this.setComentario.PorcentajeDescuento + "% de Descuento";
        if (this.setComentario.Expecion1 == true) {
            this.setComentario.DetalleExpecion += ", Exoneración Diferencial Cuotas";
        }
        if (this.setComentario.Expecion2 == true) {
            this.setComentario.DetalleExpecion += ", Mantener Precio";
        }
        if (this.setComentario.Expecion3 == true) {
            this.setComentario.DetalleExpecion += ", Increnento Odas ";
        }
        $('#myModalExcepciones').modal('hide');
    }

    cerrarDescuento() {
        $('#myModalDescuentos').modal('hide');
    }

    onSelectionChange(valor: number) {
        this.setComentario.PorcentajeDescuento = valor;
    }

    verFormaPago(formaPago: number): string {
        var resultado = "";

        switch (formaPago) {
            case 1:
                resultado = "Débito"
                break;

            case 2:
                resultado = "Pago Directo"
                break;

            default:
                break;
        }

        return resultado;
    }

    verPeriodoPago(periodoPago: number): string {
        var resultado = "";
        switch (periodoPago) {
            case 1:
                resultado = "Mensual"
                break;

            case 2:
                resultado = "Bimestral"
                break;

            case 3:
                resultado = "Trimestral"
                break;
            case 4:
                resultado = "Semestral"
                break;
            case 5:
                resultado = "Anual"
                break;
            case 6:
                resultado = "Cuatrimestral"
                break;

            default:
                break;
        }

        return resultado;
    }

    verTipoCuenta(tipoCuenta: number): string {
        var resultado = "";
        switch (tipoCuenta) {
            case 1:
                resultado = "Cuenta Corriente"
                break;

            case 2:
                resultado = "Cuenta Ahorro"
                break;
            case 3:
                resultado = "Tarjeta"
                break;
            case 4:
                resultado = "Pago Directo"
                break;


            default:
                break;
        }
        return resultado;
    }

}
