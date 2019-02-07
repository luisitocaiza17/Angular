import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { AuthService } from '../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FiltroReportes, Opcion, Reporte, DescuentosPendiente, ParametroRetencion } from '../common/model/retencion';
import { PlanContrato } from '../common/model/plan';
import { RetencionService } from '../common/servicios/retencion.service';
import { AdministracionSistemaService } from '../common/servicios/administracionSistema.service';
import { Catalogo } from '../common/model/catalogo';
import { Router } from '@angular/router';

import { RetencionesVime } from '../common/servicios/retencionesVime.service';
import { TransaccionService } from '../common/servicios/transaccion.service';


@Component({
    providers: [AdministracionSistemaService, RetencionesVime],
    templateUrl: 'retencion.desc.reportes.template.html',
    styles: ['.text-primary { color: #337ab7!important; }']
})

export class ReportesDescuentoRetencionComponent {
    paramMaximoDesc: ParametroRetencion;
    filtro: FiltroReportes;
    reportes: any[];
    ListaDesicionCliente: Opcion[];
    ListaContactabilidad: Opcion[];
    urlExcel: string;
    listaOficinas: Catalogo[];
    descuentosPendientes: any[];
    rolGestion: string;
    descuentoPendiente: DescuentosPendiente;
    planContrato: PlanContrato;

    usuarioJefe: string;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(private retencionService: RetencionService,
        private router: Router,
        private administracionSistemaService: AdministracionSistemaService,
        private authService: AuthService,
        private retencionesVime: RetencionesVime,
        private transaccionService: TransaccionService) {
        this.filtro = new FiltroReportes();
        this.filtro.IdOficina = undefined;
        this.filtro.Region = undefined;
        this.filtro.FechaDesde = undefined;
        this.filtro.FechaHasta = undefined;
        this.reportes = [];
        this.listaOficinas = [];
        this.urlExcel = "";
        this.authService.numeroNotificaciones = 0;
        this.planContrato = new PlanContrato();


        this.usuarioJefe = "";

        this.reportes = Array(3).fill(null).map((_, i) =>
            ({ a: "Nombre", ..."bcdefghi".split("").reduce((xs, x) => ({ ...xs, [x]: 0 }), {}), m: i })
        );

        this.cargarParamMaxDescuento();
        this.loadOficinas();
    }

    cargarParamMaxDescuento() {
        const usrData = this.authService.getDatosUsuarioAutenticado();

        this.administracionSistemaService.GetRolesByIdUsuario(usrData.Id)
            .subscribe(result => {
                if (result.length > 0) {
                    this.rolGestion = result[0].NombreRol;
                    this.retencionService.obtenerParametroPorNombre(result[0].NombreRol)
                        .subscribe(result2 => {
                            if (result2) {
                                this.paramMaximoDesc = result2;
                            } else {
                                this.paramMaximoDesc = {
                                    Id: 0,
                                    Valor: 0.15,
                                    Nombre: '',
                                    RangoAprobacion: true
                                }
                            }
                        },
                            error => this.paramMaximoDesc = {
                                Id: 0,
                                Valor: 0.15,
                                Nombre: '',
                                RangoAprobacion: true
                            });
                } else {
                    this.paramMaximoDesc = {
                        Id: 0,
                        Valor: 0.15,
                        Nombre: '',
                        RangoAprobacion: true
                    };
                }

                //Cargar datos despues de obtener los permisos de aprobacion
                this.filtro.Usuario = this.authService.nombreUsuario;
                this.retencionService.obtenerAplicacionDescuentoPendientes(this.filtro)
                    .subscribe(resp => {
                        this.descuentosPendientes = resp;
                    });
            },
                error => this.paramMaximoDesc = {
                    Id: 0,
                    Valor: 0.15,
                    Nombre: '',
                    RangoAprobacion: true
                });

    }

    verCambioPlan(descuentoPendiente: DescuentosPendiente): void {
        this.planContrato = new PlanContrato();
        this.planContrato = descuentoPendiente.CambioPlanCliente;
        console.log(this.planContrato);

        this.authService.showSuccessPopup("El plan se debe cambiar de "+ this.planContrato.Contrato.Plan + "con un valor total de "+descuentoPendiente.CambioPlanCliente.DetalleRemesa.ValorRemitido + " a "+ this.planContrato.Plan.CodigoPlan + " con un valor total de "+descuentoPendiente.CambioPlanCliente.Plan.PrecioBase);
    }


    confirmarDescuento(descuentoPendiente: DescuentosPendiente): void {

        if (descuentoPendiente.TipoMovimiento == "CAMBIO_PLAN") {
            this.planContrato = new PlanContrato();
            this.planContrato = descuentoPendiente.CambioPlanCliente;
            console.log(this.planContrato);
            this.transaccionService.cambiaPlan(this.planContrato).subscribe(
                result => {
                    if (result) {
                        this.authService.showSuccessPopup("Se ha cambiado el plan");
                        this.crearComentario();
                        this.crearFormularioMovimiento();
                    }
                    else {
                        this.authService.showErrorPopup("Ha ocurrido un error");
                    }
                },
                error => this.authService.showErrorPopup(error)
            ); 

        } else {
            const maxDesc = Number(this.paramMaximoDesc.Valor);
            var descExedido = false;

            for (var i = 0; i < descuentoPendiente.DescuentosRetencionCliente.length; i++) {
                if (descuentoPendiente.DescuentosRetencionCliente[i].PorcentajeDescNuevo > maxDesc) {
                    descExedido = true;
                    descuentoPendiente.UsuarioAprobador = '';
                    descuentoPendiente.UsuarioGestion = this.authService.nombreUsuario;
                } else {

                    descuentoPendiente.UsuarioAprobador = this.authService.nombreUsuario;
                }

            }
            this.descuentoPendiente = descuentoPendiente;
            if (descExedido) {
                this.mostrarModal('#modalEnviar');
            } else {
                descuentoPendiente.Estado = 2;
                this.registrarDescuento();
            }
        }



    }


    crearComentario(): void {
        this.router.navigate(['/retencion/comentario/movimiento/' + this.planContrato.Contrato.CodigoRegion + '/' +  this.planContrato.Contrato.CodigoProducto + '/' +  this.planContrato.Contrato.NumeroContrato + '/CAMBIOPLAN/']);
    }


    crearFormularioMovimiento() {
        this.planContrato.Contrato.Plan = "Cambio de producto de " +  this.planContrato.Contrato.NombrePlan + " a " + this.planContrato.Plan.NombrePlan;
        this.planContrato.Contrato.NombreMotivoAnulacion =  this.planContrato.Contrato.Plan;
        this.transaccionService.GenerarPdfFormularioMovimientoCambioPlan( this.planContrato.Contrato, "Notificación Cambio Plan")
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


    cancelaDescuento(descuentoPendiente: DescuentosPendiente): void {
        console.log(descuentoPendiente);
        if (descuentoPendiente.Id && descuentoPendiente.Estado == 3) {
            descuentoPendiente.Estado = 4;
            this.retencionesVime.cancelarAprobacion(descuentoPendiente).subscribe(
                result => {
                    this.authService.showErrorPopup('Se a cancelado la aprobacion solicitada');
                    console.log(result);
                }
            );
        }
    }

    registrarDescuento(): void {
        this.retencionService.aplicarDescuento(this.descuentoPendiente).subscribe(resp => {

            this.retencionService.confirmarAplicarDescuento({
                CodigoProducto: this.descuentoPendiente.CodigoProducto,
                NumeroContrato: this.descuentoPendiente.NumeroContrato,
                Region: this.descuentoPendiente.CodigoRegion,
                IdDesc: this.descuentoPendiente.Id
            }).subscribe(res2 => {
                this.authService.showSuccessPopup("Descuento aplicado");
            });
        }, error => this.authService.showErrorPopup(error));
    }

    suma<T>(items: T[], f: (item: T) => number): number {
        return items.reduce((xs, x) => xs + f(x), 0);
    }

    getSubtotal(descuentosPendientes: DescuentosPendiente): number {
        return this
            .suma(descuentosPendientes.DescuentosRetencionCliente,
                x => x.MedicinaPrepagada + x.ServiciosAdicionales);
    }

    getSubtotalConDescuento(descuentosPendientes: DescuentosPendiente): number {
        return this
            .suma(descuentosPendientes.DescuentosRetencionCliente,
                x => (x.MedicinaPrepagada + x.ServiciosAdicionales)
                    - ((x.MedicinaPrepagada + x.ServiciosAdicionales)
                        * (x.PorcentajeDescNuevo / 100)));
    }

    getTotalDescuento(descuentosPendientes: DescuentosPendiente): number {
        return ((this.getSubtotal(descuentosPendientes) - this.getSubtotalConDescuento(descuentosPendientes)) / this.getSubtotal(descuentosPendientes)) * 100;
    }

    loadOficinas() {
        this.retencionService.obtenerOficinas().subscribe(result => {
            this.listaOficinas = result;
        });
    }

    generarReporte() {
        this.cargarParamMaxDescuento();
    }

    descargarReporte() {
        this
            .retencionService
            .generarReporteExcel(this.filtro)
            .subscribe(urlExcel => {

                window.open(urlExcel);
            });
    }

    decision(id: number): string {
        return this.ListaDesicionCliente.find(x => x.Id == id).Detalle;
    }

    contactabilidad(id: number): string {
        return this.ListaContactabilidad.find(x => x.Id == id).Detalle;
    }

    limpiar() {
        this.filtro.Estado = undefined;
        this.filtro.IdOficina = undefined;
        this.filtro.Region = undefined;
        this.filtro.FechaDesde = undefined;
        this.filtro.FechaHasta = undefined;
    }

    mostrarModal(selector: string) {
        $(selector).modal('show');
    }

    esconderModal(selector: string) {
        $(selector).modal('hide');
    }

    enviar() {
        this.esconderModal('#modalEnviar');
        this.mostrarModal('#modalEnviado');

    }

    paddingHack() {
        setTimeout(() => document.body.style.paddingRight = '0px', 500);
    }

    confirmar() {
        this.esconderModal('#modalEnviado');
        this.paddingHack();
        this.registrarDescuento();
    }
}
