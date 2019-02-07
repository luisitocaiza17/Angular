import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratoEntityList } from '../common/model/contrato';
import { Beneficiario, Comentario, Retencion, RetencionKey, Servicio, ServiciosKey, FiltroMFiles } from '../common/model/retencion';
import { RetencionService } from '../common/servicios/retencion.service';
import { RetencionesVime } from '../common/servicios/retencionesVime.service';
import { AuthService } from '../seguridad/auth.service';

@Component({
    providers: [RetencionesVime],
    templateUrl: 'retencion.show.template.html',
    styles: ['.text-primary { color: #337ab7!important; }']
})

export class RetencionShowComponent {
    key: RetencionKey;
    retencion: Retencion;
    beneficiarios: Beneficiario[];
    expandidoAnterior: boolean;
    expandidoIncremento: boolean;
    servicios: Servicio[];
    total: Beneficiario;
    comentarios: Comentario[];
    filtroMfiles: FiltroMFiles;
    tieneDescuento: boolean;
    parametroSSC: number;


    constructor(private route: ActivatedRoute, private router: Router, private retencionService: RetencionService, private retencionesVime: RetencionesVime,
        private authService: AuthService) {

        this.beneficiarios = [];
        this.expandidoAnterior = false;
        this.expandidoIncremento = false;
        this.servicios = [];
        this.comentarios = [];
        this.filtroMfiles = new FiltroMFiles();
        this.tieneDescuento = true;
        this.retencion = new Retencion();
        this.parametroSSC = 0.005;

        /*this.retencionService.contratoKey.subscribe((contratoKey) => {
            if (contratoKey.ContratoCodigoEstado == 2 || contratoKey.ContratoCodigoEstado == 27) {
                swal({
                    title: 'Contrato anulado',
                    text: 'El contrato se encuentra Anulado Actualmente.',
                    type: 'info',
                    confirmButtonColor: '#1a7bb9',
                    confirmButtonText: 'OK',
                }, confirmed => {
                    if (confirmed) {
                        this.router.navigate(['/retencion/list']);
                    }
                })
            }
        });*/


        retencionService.obtenerParametroPorNombre('SSC')
            .subscribe(result => {
                this.parametroSSC = Number(result.Valor);
            },
                error => this.parametroSSC = 0.005);

        route.params.subscribe((params: RetencionKey) => {
            this.key = params;

            retencionService.retencion(this.key).subscribe(retencion => {
                this.retencion = retencion || undefined;
                
                if (this.retencion) {
                    this.retencion.SiniestralidadNumber = parseFloat(this.retencion.Siniestralidad);
                }

                this.retencionService.setInformacionContacto(this.retencion);
            });

            this.getTieneDescuento();

            retencionService.beneficiarios(this.key).subscribe(beneficiarios => {
                if (beneficiarios != null) {
                    this.beneficiarios = beneficiarios.map(b => {
                        b.SubtotalPrecioAnterior = b.ValorMedicinaPrepagadaAnterior + b.PrecioServiciosAnterior - b.ValorDescuentoAnterior;
                        b.SubtotalPrecioIncremento = b.ValorMedicinaPrepagadaActual + b.PrecioServicios - b.ValorDescuento;

                        const anterior = b.ValorMedicinaPrepagadaAnterior - b.ValorDescuentoAnterior;
                        const incremento = b.ValorMedicinaPrepagadaActual - b.ValorDescuento;
                        b.IncrementoDolares = incremento - anterior;
                        b.IncrementoPorcentaje = b.IncrementoDolares / anterior * 100;

                        b.MostrarLog = false;
                        return b;
                    });
                }

                const titular = this.beneficiarios[0];

                if (titular) {
                    const suma = this.suma;
                    const total = {} as Beneficiario;

                    total.PrecioAnterior = suma(beneficiarios, x => x.PrecioAnterior);
                    total.PrecioServiciosAnterior = suma(beneficiarios, x => x.PrecioServiciosAnterior);
                    total.ValorDescuentoAnterior = suma(beneficiarios, x => x.ValorDescuentoAnterior);
                    total.SubtotalPrecioAnterior = suma(beneficiarios, x => x.SubtotalPrecioAnterior);
                    total.ValorGastoAdministrativo = titular.ValorGastoAdministrativo;
                    total.SubtotalPrecioAnterior = suma(beneficiarios, x => x.SubtotalPrecioAnterior);
                    total.PrecioBeneficiario = suma(beneficiarios, x => x.PrecioBeneficiario);
                    total.PrecioServicios = suma(beneficiarios, x => x.PrecioServicios);
                    total.ValorDescuento = suma(beneficiarios, x => x.ValorDescuento);
                    total.SubtotalPrecioIncremento = suma(beneficiarios, x => x.SubtotalPrecioIncremento);
                    total.SubtotalPrecioIncremento = suma(beneficiarios, x => x.SubtotalPrecioIncremento);
                    total.ValorMedicinaPrepagadaAnterior = suma(beneficiarios, x => x.ValorMedicinaPrepagadaAnterior);
                    total.ValorMedicinaPrepagadaActual = suma(beneficiarios, x => x.ValorMedicinaPrepagadaActual);
                    total.Siniestralidad = suma(beneficiarios, x => x.Siniestralidad);

                    const anterior = total.ValorMedicinaPrepagadaAnterior - total.ValorDescuentoAnterior;
                    const incremento = total.ValorMedicinaPrepagadaActual - total.ValorDescuento;
                    total.IncrementoDolares = incremento - anterior;
                    total.IncrementoPorcentaje = total.IncrementoDolares / anterior * 100;

                    this.total = total;
                }

                this.retencionService.setBeneficiariosContratoValores(this.beneficiarios);
            });

            retencionService.getComentarioByIdCliente(this.key).subscribe(comentarios => {
                this.comentarios = comentarios.map(x => {
                    x.FechaDeCreacion = new Date(x.FechaDeCreacion);
                    x.FechaComentarioString = this.dia(x.FechaDeCreacion.getDay()) + " " + x.FechaDeCreacion.getDate()
                        + " de " + this.mes(x.FechaDeCreacion.getMonth()) + " de " + x.FechaDeCreacion.getFullYear()
                        + " - " + x.FechaDeCreacion.getUTCHours() + ":" + x.FechaDeCreacion.getMinutes().toString();
                    return x;
                });
            });
        });
    }

    getTieneDescuento() {
        this.retencionesVime.tieneDescuento(this.key).subscribe(
            result => {
                if (result.toString() == "true") {
                    this.tieneDescuento = true;
                }
                else {
                    this.tieneDescuento = false;
                }
            }
        );
    }


    suma<T>(items: T[], f: (item: T) => number): number {
        return items.reduce((xs, x) => xs + f(x), 0);
    }

    mostrarPanelDescuentoNo() {
        if (!this.tieneDescuento) {
            this.authService.showErrorPopup("Ninguno de los beneficiarios tiene descuento disponible");
        }
    }

    alternarExpandidoAnterior() {
        this.expandidoAnterior = !this.expandidoAnterior;
    }

    alternarExpandidoIncremento() {
        this.expandidoIncremento = !this.expandidoIncremento
    }

    incremento(b: Beneficiario): number {
        return b.Incremento > 0 ? b.Incremento / b.PrecioBeneficiario * 100 : 0;
    }

    entero(numero: number): number {
        return Math.floor(numero);
    }

    decimales(numero: number): number {
        return Math.floor(numero * 100) - Math.floor(numero) * 100;
    }

    mostrarServicios(beneficiario: Beneficiario) {
        const key = this.key;
        const serviciosKey: ServiciosKey = {
            Region: key.Region,
            CodigoProducto: key.CodigoProducto,
            NumeroContrato: key.NumeroContrato,
            PersonaNumero: beneficiario.PersonaNumero,
            Secuencial: beneficiario.Secuencial
        };

        this
            .retencionService
            .servicios(serviciosKey)
            .subscribe(servicios => {
                if (servicios.length > 0) {
                    this.servicios = servicios;
                    $("#myModalServicios").modal();
                } else {
                    this.authService.showErrorPopup("El beneficiario no tiene servicios adicionales");
                }
            });
    }

    cerrarServicios() {
        this.servicios = [];
        $('#myModalServicios').modal('hide');
    }

    alternarLog(beneficiario: Beneficiario) {
        beneficiario.MostrarLog = !beneficiario.MostrarLog;
    }

    dia(numero: number): string {
        return [
            "Domingo",
            "Lunes",
            "Martes",
            "Mi�rcoles",
            "Jueves",
            "Viernes",
            "S�bado"
        ][numero];
    }

    mes(numero: number): string {
        return [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ][numero];
    }


    descargarContrato() {
        this.filtroMfiles.IdDocumento = 2;
        this.filtroMfiles.IdRegion = 1019;
        this.filtroMfiles.ValueRegion = this.key.Region.toUpperCase();
        this.filtroMfiles.IdProducto = 1027;
        this.filtroMfiles.ValueProducto = this.key.CodigoProducto.toUpperCase();
        this.filtroMfiles.IdNumeroContrato = 1020;
        this.filtroMfiles.ValueNumeroContrato = this.key.NumeroContrato.toString();
        this.retencionService.descargarMFiles(this.filtroMfiles)
            .subscribe(urlPdf => {
                window.open(urlPdf);
            });
    }

    descargarCarta() {
        this.filtroMfiles.IdDocumento = 3;
        this.filtroMfiles.IdRegion = 1019;
        this.filtroMfiles.ValueRegion = this.key.Region.toUpperCase();
        this.filtroMfiles.IdProducto = 1027;
        this.filtroMfiles.ValueProducto = this.key.CodigoProducto.toUpperCase();
        this.filtroMfiles.IdNumeroContrato = 1020;
        this.filtroMfiles.ValueNumeroContrato = this.key.NumeroContrato.toString();
        this.retencionService.descargarMFiles(this.filtroMfiles)
            .subscribe(urlPdf => {
                window.open(urlPdf);
            });
    }

    regresar() {
        this.router.navigate(['/retencion/list']);
    }
}
