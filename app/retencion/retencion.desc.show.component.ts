import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratoEntityList } from '../common/model/contrato';
import { Beneficiario, Comentario, Retencion, RetencionKey, Servicio, ServiciosKey, FiltroMFiles, DescuentoCliente, ParametroRetencion, RespuestaParametroRetencion, DescuentosPendiente } from '../common/model/retencion';
import { RetencionService } from '../common/servicios/retencion.service';
import { AuthService } from '../seguridad/auth.service';
import { AdministracionSistemaService } from '../common/servicios/administracionSistema.service';
import { OnlyNumber } from '../retencion/only-number.directive';
import { RolAdmin } from '../common/model/admin';
import { RetencionesVime } from '../common/servicios/retencionesVime.service';


@Component({
    providers: [AdministracionSistemaService, RetencionesVime],
    templateUrl: 'retencion.desc.show.template.html',
    styles: ['.text-primary { color: #337ab7!important; } .btn:hover, .btn:focus, .btn.focus{ background-color:lightgrey; }']
})

export class DescuentoRetencionShowComponent {
    key: RetencionKey;
    retencion: Retencion;
    contrato: ContratoEntityList;
    beneficiarios: DescuentoCliente[] = [];
    expandidoAnterior: boolean;
    expandidoIncremento: boolean;
    servicios: Servicio[];
    total: DescuentoCliente;
    comentarios: Comentario[];
    filtroMfiles: FiltroMFiles;
    showColumns: boolean;
    columns: any;
    searchText: string = "";
    orderColumn: string = "Beneficiario";
    parametroSSC: number;
    paramMaximoDesc: ParametroRetencion;
    rolGestion: string;
    usuarioJefe: string;
    descuentoPendiente: DescuentosPendiente;
    Nivel1: string = "Ejecutivo Contact Center";
    Nivel2: string = "Jefatura SAC Sierra,Jefatura SAC Costa";
    Nivel3: string = "Subgerencia Nacional";
    TienePermisosAplicarDescuento: boolean;
    tieneDescuentoPendienteAprobacion: boolean;

    constructor(private route: ActivatedRoute, private router: Router, private retencionService: RetencionService,
        private administracionSistemaService: AdministracionSistemaService, private authService: AuthService, private retencionesVime: RetencionesVime) {

        this.contrato = new ContratoEntityList();
        this.tieneDescuentoPendienteAprobacion = false;
        this.TienePermisosAplicarDescuento = true;

        route.params.subscribe((params: RetencionKey) => {
            this.key = params;

            retencionService.retencion(this.key).subscribe(retencion => {
                this.retencion = retencion || undefined;

                if (this.retencion) {
                    this.retencion.SiniestralidadNumber = parseFloat(this.retencion.Siniestralidad);
                }

                this.getTieneDescuentoPendienteAprobacion();
            });

            retencionService.filtrarContratos(this.key, 10, 1).subscribe(paginado => {
                this.contrato = paginado.data.pop();
            });

            this.descuentoPendiente = {
                Id: 0,
                UsuarioAprobador: '',
                UsuarioGestion: this.authService.nombreUsuario,
                RolGestion: this.rolGestion,
                CodigoRegion: this.key.Region,
                CodigoProducto: this.key.CodigoProducto,
                NumeroContrato: this.key.NumeroContrato,
                Estado: 1,
                DescuentosRetencionCliente: [],
                FechaGestion: null,
                IdOficina: 0,
                NombreOficina: '',
                SSC: 0.0,
                TipoMovimiento: '',
                CambioPlanCliente : undefined 
            }
            if (params.IdDesc) {
                this.retencionService.obtenerAplicacionDescuentoPendientesByKey(params)
                    .subscribe(resp => {
                        if (resp.length > 0) {
                            this.descuentoPendiente = resp[0];
                            // this.beneficiarios = resp[0].DescuentosRetencionCliente;

                            this.beneficiarios = resp[0].DescuentosRetencionCliente.map(x => {
                                if (x.PorcentajeDescNuevo > 0) {
                                    var porDesNuevo = parseFloat(x.PorcentajeDescNuevo.toString()) - parseFloat(x.PorcentajeDesc.toString());
                                    x.PorcentajeDescNuevo = porDesNuevo;
                                }
                                return x;
                            });


                        } else {
                            this.beneficiarios = [];
                        }
                        this.validarPermisosRol();
                    });
            } else {
                retencionService.descuentoRetencionCliente(this.key).subscribe(descuentos => {
                    this.beneficiarios = descuentos.map(x => {
                        x.PorcentajeDescNuevo = 0.0;
                        return x;
                    });
                    this.validarPermisosRol();
                });

            }


            this.columns = {
                "Beneficiarios": true,
                "Edad": true,
                "PrecioBeneficiario": true,
                "Descuento 2017": true,
                "Descuento 2018": true,
                "Descuento Aplica": true,
                "Descuento disponible": true,
                "Descuento %": true,
                "Descuento $": true,
                "SubTotal 2 Última Factura": true,
                "SubTotal 2 Última Factura con Descuento": true
            };



            retencionService.obtenerParametroPorNombre('SSC')
                .subscribe(result => {
                    this.parametroSSC = Number(result.Valor);
                },
                    error => this.parametroSSC = 0.005);


        });

    }

    validarPermisosRol() {
        const usrData = this.authService.getDatosUsuarioAutenticado();
        this.administracionSistemaService.GetRolesByIdUsuario(usrData.Id)
            .subscribe(result => {
                if (result.length > 0) {
                    result.forEach(element => {
                        if (this.Nivel1.search(element.NombreRol) != -1 || this.Nivel2.search(element.NombreRol) != -1 || this.Nivel3.search(element.NombreRol) != -1) {
                            this.rolGestion = element.NombreRol;

                            if (this.suma(this.beneficiarios, b => b.DescuentoDisponible) <= 0 &&
                                this.Nivel1.search(this.rolGestion) != -1) {
                                this.router.navigate(['/retencion/show/' + this.key.Region + '/' + this.key.CodigoProducto + '/' + this.key.NumeroContrato], { queryParams: { ad: 1 } });
                            }

                            this.usuarioJefe = this.getRolSuperior();

                            this.retencionService.obtenerParametroPorNombre(this.rolGestion)
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
                            this.TienePermisosAplicarDescuento = this.validarPermisoAplicarDescuento();

                        }
                    });

                } else {
                    this.paramMaximoDesc = {
                        Id: 0,
                        Valor: 0.15,
                        Nombre: '',
                        RangoAprobacion: true
                    };
                }
            },
                error => this.paramMaximoDesc = {
                    Id: 0,
                    Valor: 0.15,
                    Nombre: '',
                    RangoAprobacion: true
                });
    }


    validarPermisoCalculo(beneficiario) {
        if (this.key.IdDesc) {
            if(this.Nivel2.search(this.rolGestion) != -1 || this.Nivel1.search(this.rolGestion) != -1){
                return false;
            }else{
                return true;
            }
            
        }

        if (beneficiario.DescuentoDisponible <= 0) {
            return true;
        } else {
            return false;
        }
    }

    validarPermisoAplicarDescuento() {
        if (this.Nivel3.search(this.rolGestion) != -1
            || this.Nivel2.search(this.rolGestion) != -1
            || this.Nivel1.search(this.rolGestion) != -1) {
            return false;
        }
        return true;

        //const descDisp = this.beneficiarios.map(r => r.DescuentoDisponible - r.PorcentajeDescNuevo);
        //console.log(descDisp);
        //if (descDisp.find(x => x < 0) &&
        //    (this.Nivel2.search(this.rolGestion) != -1 || this.Nivel1.search(this.rolGestion) != -1)) {
        //    return true;
        //}

    }

    suma<T>(items: T[], f: (item: T) => number): number {
        return items.reduce((xs, x) => xs + f(x), 0);
    }

    getTotalPorcentajeDescAnterior(): number {
        return this.suma(this.beneficiarios, x => x.PorcentajeDescAnterior);
    }

    getTotalValorDescuentoAnterior(): number {
        return this.suma(this.beneficiarios, x => x.ValorDescuentoAnterior);
    }

    getTotalPorcentajeDescuento(): number {
        return this.suma(this.beneficiarios, x => x.PorcentajeDesc);
    }

    getTotalValorDescuento(): number {
        return this.suma(this.beneficiarios, x => x.ValorDescuento);
    }

    getTotalPorcentajeDescNuevo(beneficiario): number {
        if (beneficiario) {
            let descNuevo = beneficiario.PorcentajeDescNuevo ? beneficiario.PorcentajeDescNuevo : 0.0;
            return descNuevo;
        }else{
           // return (this.getTotalValorDescuentoNuevo(null) / this.getSubTotal2ConDescuento(null)) * 100;

           return ((this.getTotalValorDescuentoNuevo(null) * 100) / this.getTotalMedicinaPrepagada());

        }
    }

    getTotalValorDescuentoNuevo(beneficiario): number {
        if (beneficiario) {
            let descNuevo = parseFloat(beneficiario.PorcentajeDescNuevo) ? (parseFloat(beneficiario.PorcentajeDescNuevo) + parseFloat(beneficiario.PorcentajeDesc)) : parseFloat(beneficiario.PorcentajeDesc);
            let descTotal = ((beneficiario.MedicinaPrepagada) * (descNuevo / 100)); // + this.getTotalValorDescuento(); --+ beneficiario.ServiciosAdicionales
            return descTotal;
        } else {
            let total = this.suma(this.beneficiarios, x => x.MedicinaPrepagada * (this.getTotalValorDescNuevo(x) / 100)) + this.getTotalValorDescuento();
            return total;
        }
    }

    getTotalMedicinaPrepagada(): number {
        return this.suma(this.beneficiarios, x => x.MedicinaPrepagada);
    }

    getTotalServiciosAdicionales(): number {
        return this.suma(this.beneficiarios, x => x.ServiciosAdicionales);
    }

    getTotalDescuentoDisponible(beneficiario): number {
        if (beneficiario) {
            return (beneficiario.DescuentoDisponible > beneficiario.PorcentajeDescNuevo ? beneficiario.DescuentoDisponible : beneficiario.PorcentajeDescNuevo) - (beneficiario.PorcentajeDescNuevo ? beneficiario.PorcentajeDescNuevo : 0.0);
        }
        return this.suma(this.beneficiarios, x => (x.DescuentoDisponible > x.PorcentajeDescNuevo ? x.DescuentoDisponible : x.PorcentajeDescNuevo) - (x.PorcentajeDescNuevo ? x.PorcentajeDescNuevo : 0.0));
    }

    getSubTotal1(beneficiario): number {
        if (beneficiario) {
            return beneficiario.MedicinaPrepagada + beneficiario.ServiciosAdicionales;
        }
        return this.suma(this.beneficiarios, x => x.MedicinaPrepagada + x.ServiciosAdicionales);
    }

    getTotalValorDescNuevo(beneficiario): number {
        if (beneficiario) {
            return beneficiario.PorcentajeDescNuevo ? beneficiario.PorcentajeDescNuevo : 0.0;
        }else{
            return this.suma(this.beneficiarios, x => (x.PorcentajeDescNuevo ? x.PorcentajeDescNuevo : 0.0));            
        }
    }

    getSubTotal2(): number {
        return this.getSubTotal1(null) - this.getTotalValorDescuento();
    }

    getSubTotal2ConDescuento(beneficiarios): number {
        return this.getSubTotal1(beneficiarios) - this.getTotalValorDescuentoNuevo(beneficiarios);
    }


    getGastoAdministrativo(): number {
        if (this.beneficiarios.length > 0) {
            return this.beneficiarios[0].GastoAdministrativo;
        }
        return 0;
    }

    getSubTotal3(): number {
        return this.getSubTotal2() + this.getGastoAdministrativo();
    }

    getSubTotal3ConDescuento(): number {
        return this.getSubTotal2ConDescuento(null) + this.getGastoAdministrativo();
    }

    getSSC(): number {
        return this.getSubTotal3() * this.parametroSSC;
    }

    getSSCConDescuento(): number {
        return this.getSubTotal3ConDescuento() * this.parametroSSC;
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

    aplicarDescuento(): void {
        if (this.tieneDescuentoPendienteAprobacion && !this.key.IdDesc) {
            this.authService.showErrorPopup("Tiene un descuento pendiente de aprobación, reviza el comentario en la pantalla de consultas.");
        } else {
            const maxDesc = Number(this.paramMaximoDesc.Valor);
            var descExedido = false;
            var contCeros = 0;

            for (var i = 0; i < this.beneficiarios.length; i++) {
                if (this.beneficiarios[i].PorcentajeDescNuevo <= 0) {
                    contCeros++;
                }
            }

            if (this.beneficiarios.length == contCeros) {
                return;
            }

            var descuentoTotal = 0;

            for (var i = 0; i < this.beneficiarios.length; i++) {
                var porDesNuevo = parseFloat(this.beneficiarios[i].PorcentajeDescNuevo.toString()) + parseFloat(this.beneficiarios[i].PorcentajeDesc.toString());
                var porcentajeDescNuevo = parseFloat(this.beneficiarios[i].PorcentajeDescNuevo.toString());
                
                descuentoTotal = descuentoTotal + porcentajeDescNuevo;      
                

                if (!this.key.IdDesc) {
                    this.beneficiarios[i].ValorDesNuevo = this.getTotalValorDescuentoNuevo(this.beneficiarios[i]);
                    if (this.beneficiarios[i].PorcentajeDescNuevo > 0) {
                        this.beneficiarios[i].PorcentajeDescNuevo = porDesNuevo;
                    }
                    this.descuentoPendiente.SSC = this.parametroSSC;
                    this.descuentoPendiente.DescuentosRetencionCliente.push(this.beneficiarios[i]);
                } else {
                    if (this.beneficiarios[i].PorcentajeDescNuevo > 0) {
                        this.beneficiarios[i].PorcentajeDescNuevo = porDesNuevo;
                    }
                }
            }

            if (descuentoTotal > maxDesc) {
                descExedido = true;
                this.descuentoPendiente.UsuarioAprobador = this.usuarioJefe;
            }

            if (descExedido) {
                this.mostrarModal('#modalEnviar');
            } else {
                this.descuentoPendiente.Estado = 2;
                this.registrarDescuento();
            }
        }
    }


    cancelaDescuento(): void {
        if (this.descuentoPendiente.Id && this.descuentoPendiente.Estado == 3) {
            this.descuentoPendiente.Estado = 4;
            this.retencionesVime.cancelarAprobacion(this.descuentoPendiente).subscribe(
                result => {
                    this.authService.showErrorPopup('Se a cancelado la aprobacion del descuento');
                }
            );
        }
    }

    getTieneDescuentoPendienteAprobacion() {
        this.retencionesVime.tieneDescuentoPendienteAprobacion(this.key.NumeroContrato, this.key.Region, this.key.CodigoProducto).subscribe(
            result => {
                if (result.toString() == "true")
                    this.tieneDescuentoPendienteAprobacion = true;
                else
                    this.tieneDescuentoPendienteAprobacion = false;
            }
        );
    }



    registrarDescuento(): void {
        this.retencionService.aplicarDescuento(this.descuentoPendiente).subscribe(resp => {
            this.router.navigate(['/retencion/comentario/' + this.key.Region + '/' + this.key.CodigoProducto + '/' + this.key.NumeroContrato + '/' + resp.IdDesc]);
        }, error => this.authService.showErrorPopup(error));
    }

    quitarVacios(obj: any): any {
        return Object.keys(obj).reduce((xs, x) => {
            const value = obj[x];
            if (value) {
                xs[x] = obj[x];
            }
            return xs;
        }, {});
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

    confirmar() {
        this.descuentoPendiente.Estado = 3;
        this.registrarDescuento();
        this.esconderModal('#modalEnviado');
        this.paddingHack();
    }

    testDesc(index: number): DescuentoCliente {
        return {
            NombreRelacion: index.toString(),
            NombrePersona: index.toString(),
            Edad: 0,
            NumeroContrato: index,
            CodigoPlan: index.toString(),
            PorcentajeDescAnterior: 0,
            ValorDescuentoAnterior: 10 - index,
            PorcentajeDesc: 0,
            ValorDescuento: 2 + index,
            DescuentoDisponible: 0,
            PorcentajeDescNuevo: index % 4,
            ValorDesNuevo: 0,
            Sexo: false,
            MedicinaPrepagada: 0,
            ServiciosAdicionales: 0,
            GastoAdministrativo: 0,
            Nivel: 0,
            NombreProducto: '',
            TipoMovimiento: ''
        }
    }

    keys(obj) {
        return Object.keys(obj);
    }

    toggleColumn(key: string) {
        this.columns[key] = !this.columns[key];
    }

    toggleShowColumns() {
        this.showColumns = !this.showColumns;
    }

    beneficiariosFiltrados() {
        if (this.searchText == "") {
            return this.beneficiarios;
        } else {
            return this.beneficiarios.filter(
                beneficiario => Object.keys(beneficiario).some(
                    key => beneficiario[key].toString().indexOf(this.searchText) != -1
                )
            );
        }
    }

    beneficiariosOrdenados() {
        return this.beneficiariosFiltrados().sort((b1, b2) =>
            b1[this.orderColumn] < b2[this.orderColumn] ? 1 : 0
        );
    }

    orderBy(column: string) {
        this.orderColumn = column;
    }


    paddingHack() {
        setTimeout(() => document.body.style.paddingRight = '0px', 500);
    }



}
