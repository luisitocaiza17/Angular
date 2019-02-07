import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';

import { AuthService } from '../seguridad/auth.service';

import { ActivatedRoute, Router } from '@angular/router';
import { Opcion, RetencionKey, SetComentario, DescuentosPendiente, DescuentoCliente } from '../common/model/retencion';
import { RetencionService } from '../common/servicios/retencion.service';

import { Catalogo } from '../common/model/catalogo';

@Component({
    providers: [],
    templateUrl: 'retencion.comentario.template.html',
    styles: ['.text-primary { color: #337ab7!important; }']
})

export class CalificacionRetencionComponent {
    setComentario: SetComentario;
    ListaDesicionCliente: Opcion[];
    ListaContactabilidad: Opcion[];
    listaOficinas: Catalogo[];
    descuentoPendiente: DescuentoCliente[] = [];
    key: RetencionKey;
    txtComentario: string;
    Nivel2: string = "Jefatura SAC Sierra,Jefatura SAC Costa";
    Nivel3: string = "Subgerencia Nacional";

    constructor(private route: ActivatedRoute, private router: Router, private retencionService: RetencionService, private authService: AuthService) {
        this.txtComentario = "";
        route.params.subscribe((params: RetencionKey) => {
            this.key = params;
            this.setComentario = new SetComentario();
            const c = this.setComentario;

            c.Region = params.Region;
            c.CodigoProducto = params.CodigoProducto;
            c.NumeroContrato = params.NumeroContrato;
            c.NombreUsuario = authService.nombreUsuario;
            if (params.IdDesc) {
                c.IdDesc = params.IdDesc;

                this.retencionService.obtenerAplicacionDescuentoPendientesByKey(params)
                    .subscribe(resp => {

                        if (resp.length > 0) {
                            this.descuentoPendiente = resp[0].DescuentosRetencionCliente;
                            this.setComentario.DetalleExpecion = (Math.round(this.getTotalPorcentajeDescNuevo(null) * 100) / 100) + "%";
                        } else {
                            this.descuentoPendiente = [];
                        }
                    });
            }

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
            console.log(this.key.IdDesc);
            this.retencionService.obtenerAplicacionDescuentoPendientesByKey(this.key)
                .subscribe(resp => {
                    if (resp.length > 0) {
                        var descuentoPendiente = resp[0];
                        var oficinaSeleccionada = this.listaOficinas.filter(ofi => ofi.Id == this.setComentario.IdOficina)
                        descuentoPendiente.NombreOficina = oficinaSeleccionada[0].Valor;
                        descuentoPendiente.IdOficina = this.setComentario.IdOficina;


                        var rol = this.getUsuarioSuperior(descuentoPendiente.UsuarioAprobador, descuentoPendiente.NombreOficina);
                        this.retencionService.getUsuarioJefeRol(rol)
                            .subscribe(resp => {
                                descuentoPendiente.UsuarioAprobador = resp.NombreUsuario;
                                this.setComentario.Comentario = this.txtComentario;
                                descuentoPendiente.DescuentosRetencionCliente.forEach(element => {
                                    if (element.PorcentajeDescNuevo > 0) {
                                        if (descuentoPendiente.Estado == 2) {
                                            this.setComentario.Comentario += "\nSe ha agregado un descuento por un valor de " +
                                                + (Math.round(element.ValorDesNuevo * 100) / 100) + " correspondiente al "
                                                + (Math.round(element.PorcentajeDescNuevo * 100) / 100)
                                                + " % al beneficiario " + element.NombrePersona + ". ";
                                        }

                                        if (descuentoPendiente.Estado == 3) {
                                            this.setComentario.Comentario += "\nSe ha enviado una aprobación de descuento al usuario "
                                                + descuentoPendiente.UsuarioAprobador;
                                        }

                                        if (descuentoPendiente.Estado == 4) {
                                            this.setComentario.Comentario += "\nAprobación de descuento denagada. ";
                                        }
                                    }
                                });

                                this.retencionService.setComentario(this.setComentario).subscribe(res => {
                                    if (res.Estado) {
                                        this.retencionService.aplicarDescuento(descuentoPendiente).subscribe(resp => {
                                            this.retencionService.confirmarAplicarDescuento(this.key).subscribe(res2 => {
                                                const c = this.setComentario;
                                                this.router.navigate(['/retencion/show', c.Region, c.CodigoProducto, c.NumeroContrato]);
                                            });
                                        }, error => this.authService.showErrorPopup(error));

                                    } else {
                                        this.authService.showErrorPopup(res.Mensaje);
                                    }
                                });
                            });


                    } else {
                        this.authService.showErrorPopup("No se encontró el registro requerido.");
                    }
                });
        } else {
            this.setComentario.Comentario = this.txtComentario;
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


    }

    regresar() {
        this.router.navigate(['/retencion/list']);
    }

    cerrarExcepciones() {
        /* if (this.setComentario.PorcentajeDescuento == undefined) {
             this.authService.showInfoPopup("Debe seleccionar un porcentaje de Descuento");
             this.setComentario.DetalleExpecion == undefined;
         }
         else {
             */
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
        /*
                }*/
    }

    cerrarDescuento() {
        $('#myModalDescuentos').modal('hide');
    }

    onSelectionChange(valor: number) {
        this.setComentario.PorcentajeDescuento = valor;
    }

    suma<T>(items: T[], f: (item: T) => number): number {
        return items.reduce((xs, x) => xs + f(x), 0);
    }

    getTotalPorcentajeDescAnterior(): number {
        return this.suma(this.descuentoPendiente, x => x.PorcentajeDescAnterior);
    }

    getTotalValorDescuentoAnterior(): number {
        return this.suma(this.descuentoPendiente, x => x.ValorDescuentoAnterior);
    }

    getTotalPorcentajeDescuento(): number {
        return this.suma(this.descuentoPendiente, x => x.PorcentajeDesc);
    }

    getTotalValorDescuento(): number {
        return this.suma(this.descuentoPendiente, x => x.ValorDescuento);
    }

    getTotalPorcentajeDescNuevo(beneficiario): number {
        if (beneficiario) {
            let descNuevo = beneficiario.PorcentajeDescNuevo ? beneficiario.PorcentajeDescNuevo : 0.0;
            return descNuevo;
        }

        return (this.getTotalValorDescuentoNuevo(null) / this.getSubTotal2ConDescuento(null)) * 100;
    }

    getTotalValorDescuentoNuevo(beneficiario): number {
        /*if (beneficiario) {
            let descNuevo = beneficiario.PorcentajeDescNuevo ? beneficiario.PorcentajeDescNuevo : 0.0;
            return (beneficiario.MedicinaPrepagada + beneficiario.ServiciosAdicionales) * (descNuevo / 100);
        }
        return this.suma(this.descuentoPendiente, x => this.getSubTotal1(x) * (this.getTotalValorDescNuevo(x) / 100));*/


        if (beneficiario) {
            let descNuevo = parseFloat(beneficiario.PorcentajeDescNuevo) ? (parseFloat(beneficiario.PorcentajeDescNuevo) + parseFloat(beneficiario.PorcentajeDesc)) : parseFloat(beneficiario.PorcentajeDesc);
            let descTotal = ((beneficiario.MedicinaPrepagada) * (descNuevo / 100)); // + this.getTotalValorDescuento(); --+ beneficiario.ServiciosAdicionales
            return descTotal;
        } else {
            return this.suma(this.descuentoPendiente, x => x.MedicinaPrepagada * (this.getTotalValorDescNuevo(x) / 100)) + this.getTotalValorDescuento();
        }
    }

    getTotalMedicinaPrepagada(): number {
        return this.suma(this.descuentoPendiente, x => x.MedicinaPrepagada);
    }

    getTotalServiciosAdicionales(): number {
        return this.suma(this.descuentoPendiente, x => x.ServiciosAdicionales);
    }

    getTotalDescuentoDisponible(beneficiario): number {
        if (beneficiario) {
            return (beneficiario.DescuentoDisponible > beneficiario.PorcentajeDescNuevo ? beneficiario.DescuentoDisponible : beneficiario.PorcentajeDescNuevo) - (beneficiario.PorcentajeDescNuevo ? beneficiario.PorcentajeDescNuevo : 0.0);
        }
        return this.suma(this.descuentoPendiente, x => (x.DescuentoDisponible > x.PorcentajeDescNuevo ? x.DescuentoDisponible : x.PorcentajeDescNuevo) - (x.PorcentajeDescNuevo ? x.PorcentajeDescNuevo : 0.0));
    }

    getSubTotal1(beneficiario): number {
        if (beneficiario) {
            return beneficiario.MedicinaPrepagada + beneficiario.ServiciosAdicionales;
        }
        return this.suma(this.descuentoPendiente, x => x.MedicinaPrepagada + x.ServiciosAdicionales);
    }

    getTotalValorDescNuevo(beneficiario): number {
        if (beneficiario) {
            return beneficiario.PorcentajeDescNuevo ? beneficiario.PorcentajeDescNuevo : 0.0;
        }
        return this.suma(this.descuentoPendiente, x => (x.PorcentajeDescNuevo ? x.PorcentajeDescNuevo : 0.0));
    }

    getSubTotal2ConDescuento(beneficiarios): number {
        return this.getSubTotal1(beneficiarios) - this.getTotalValorDescuentoNuevo(beneficiarios);
    }

}
