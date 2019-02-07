import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { VendedorFilter } from '../../model/vendedorFilter';
import { VendedoresEntity } from '../../model/vendedoresEntity';

import { AuthService } from '../../../seguridad/auth.service';
import { AutorizacionService } from '../../../common/servicios/autorizacion.service';
import { ReporteService } from '../../../common/servicios/reporte.service';
import { CatalogoComercialService } from '../../service/catalogoComercial.service';
import { VendedoresService } from '../../service/vendedores.service';
import { ReporteComercialService } from '../../service/reporteComercial';

import { Permiso } from '../../../seguridad/usuario';
import { Catalogo } from '../../../common/model/catalogo';

@Component({
    providers: [ReporteService, VendedoresService, CatalogoComercialService, ReporteComercialService],
    templateUrl: 'reporteVendedores.form.template.html'
})

export class ReporteVendedoresFormComponent {

    filter: VendedorFilter;
    todo: boolean;
    ninguno: boolean;
    listadoVendedores: VendedoresEntity[];
    listaDirectoresTotales: Catalogo[];
    listaDirectores: Catalogo[];
    listadoVendedoresSeleccionados: number[];
    accesDirectorVendedor: boolean

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(public reporteService: ReporteService, private autorizacionService: AutorizacionService,
        private elementRef: ElementRef, private router: Router, public vendedoresService: VendedoresService,
        private chRef: ChangeDetectorRef, private authService: AuthService, public catalogoComercialService: CatalogoComercialService,
        public reporteComercialService: ReporteComercialService) {

        this.verificarPermisos();
        this.filter = new VendedorFilter();
        this.listadoVendedores = [];
        this.listadoVendedoresSeleccionados = [];
        this.listaDirectoresTotales = [];
        this.listaDirectores = [];
        this.todo = false;
        this.ninguno = false;
    }

    generarReporte(): void {

        if (this.listadoVendedoresSeleccionados.length == 0) {
            this.authService.showInfoPopup("Seleccione al menos un vendedor para obtener el reporte");
        }
        else {
            if (this.todo == true) {
                this.listadoVendedoresSeleccionados = [];
            }

            var filtro = new VendedorFilter();
            filtro.VendedoresSeleccionados = [];
            filtro.VendedoresSeleccionados = this.listadoVendedoresSeleccionados;
            filtro.UserLogin = this.filter.UserLogin;
            filtro.UsuarioAutenticado = this.authService.nombreUsuario;
            this.reporteComercialService.descargarReporteVendedores(filtro).subscribe(
                result => {
                    this.listadoVendedoresSeleccionados = [];
                    this.todo = false;
                    this.ninguno = false;
                    this.desmarcar();
                    this.authService.showSuccessPopup(result)
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    generarReporteC(): void {
        if (this.listadoVendedoresSeleccionados.length == 0) {
            this.authService.showInfoPopup("Seleccione al menos un vendedor para obtener el reporte");
        }
        else {
            if (this.todo == true) {
                this.listadoVendedoresSeleccionados = [];
            }
            var filtro = new VendedorFilter();
            filtro.VendedoresSeleccionados = [];
            filtro.VendedoresSeleccionados = this.listadoVendedoresSeleccionados;
            filtro.UserLogin = this.filter.UserLogin;
            this.reporteComercialService.descargarReporteVendedoresC(filtro).subscribe(
                result => {
                    this.listadoVendedoresSeleccionados = [];
                    this.todo = false;
                    this.ninguno = false;
                    this.desmarcar();
                    this.authService.showSuccessPopup(result)
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    seleccionarTodo() {
        this.listadoVendedoresSeleccionados = [];
        this.todo = true;

        this.listadoVendedores.forEach(element => {
            element.Selected = true;
            this.listadoVendedoresSeleccionados.push(element.CodigoAgenteVenta);
        });
    }

    desmarcar() {
        this.todo = false;
        this.listadoVendedoresSeleccionados = [];

        this.listadoVendedores.forEach(element => {
            element.Selected = false;
        });
    }

    loadDirectores() {
        this.listaDirectores = [];
        this.catalogoComercialService.obtenerDirectores().subscribe(
            result => {
                this.listaDirectoresTotales = result;

                if (this.listaDirectoresTotales != undefined) {
                    this.listaDirectoresTotales.forEach(element => {
                        if (element.CodigoProgress == null) {
                            this.listaDirectores.push(element);
                        }
                    });
                }
                if (this.accesDirectorVendedor == false) {
                    this.loadVendedores();
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadVendedores() {
        this.vendedoresService.getByFiltersVendedoresPaginated(20, this.filter).subscribe(
            result => {
                this.listadoVendedores = result;
                if (this.todo == false) {
                    this.listadoVendedores.forEach(element => {
                        this.listadoVendedoresSeleccionados.forEach(seleccionados => {
                            if (element.CodigoAgenteVenta == seleccionados) {
                                element.Selected = true;
                            }
                        });

                    });
                }
                else {
                    this.listadoVendedores.forEach(element => {

                        element.Selected = true;
                        var buscar = 0;

                        this.listadoVendedoresSeleccionados.forEach(listaSeccionados => {
                            if (listaSeccionados == element.CodigoAgenteVenta) {
                                buscar = 1;
                            }
                        });

                        if (buscar == 0) {
                            this.listadoVendedoresSeleccionados.push(element.CodigoAgenteVenta);
                        }

                    });
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    seleccionar(vendedor: VendedoresEntity): void {
        this.todo = false;
        this.ninguno = false;
        if (vendedor.Selected == true) {
            vendedor.Selected = false;
            this.listadoVendedores.forEach(element => {
                if (element.CodigoAgenteVenta == vendedor.CodigoAgenteVenta) {
                    element.Selected = false;
                    var listaAux = this.listadoVendedoresSeleccionados;
                    this.listadoVendedoresSeleccionados = [];
                    listaAux.forEach(lista => {
                        if (lista != element.CodigoAgenteVenta) {
                            this.listadoVendedoresSeleccionados.push(lista);
                        }
                    });
                }
            })
        }
        else {
            vendedor.Selected = true;
            this.listadoVendedores.forEach(element => {
                if (element.CodigoAgenteVenta == vendedor.CodigoAgenteVenta) {
                    element.Selected = true;
                    this.listadoVendedoresSeleccionados.push(element.CodigoAgenteVenta);
                }
            })
        }
    }


    colapsarTab(): void {
    }

    pageChanged(): void {
        this.loadVendedores();
    }


    verificarPermisos(): void {
        this.accesDirectorVendedor = false;
        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {
            var admin = listaPermisos.find(p => p == Permiso.ADMINISTRADOR);
            if (admin != undefined) {
                //this.accesDirectorVendedor = true;
            }

            var auth = listaPermisos.find(p => p == Permiso.GERENTE_COMERCIAL);
            if (auth != undefined) {
                this.accesDirectorVendedor = true;
            }
        }
        this.loadDirectores();
    }

    limpiar(): void {
        this.listadoVendedores = [];
        this.listadoVendedoresSeleccionados = [];
        this.filter.CodigoAgente = undefined;
        this.filter.Nombres = undefined;
        this.filter.UserLogin = undefined;
    }
}

