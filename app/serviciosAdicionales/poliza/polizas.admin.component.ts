import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ServiciosAdicionalesAdminService} from '../../common/servicios/serviciosAdicionalesAdmin.service';
import {AuthService} from '../../seguridad/auth.service';
import {Proveedor} from '../models/Bases';
import {Poliza, Servicio, Criterio, Catalogo} from '../models/Polizas';

@Component({
    templateUrl: 'polizas.admin.template.html'
})

export class PolizasAdminComponent implements OnInit {

    private sub: any;

    proveedores: Proveedor[];
    servicios: Servicio[];
    criterios: Criterio[];
    catalogo: Catalogo;
    poliza: Poliza = null;

    datePickerOpts = {
        autoclose: true,
        todayBtn: 'linked',
        todayHighlight: true,
        assumeNearbyYear: true,
        format: 'dd-mm-yyyy',
        icon: 'fa fa-calendar',
        language: 'es'
    };

    constructor(
        public serviciosAdicionalesService: ServiciosAdicionalesAdminService,
        private authService: AuthService,
        private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.obtenerCatalogos(() => {
            this.obtenerProveedores();
            this.obtenerServicios();
            this.sub = this.route.params.subscribe(params => {
                const id = +params['id'];
                if (isNaN(id)) {
                    this.poliza = new Poliza();
                    this.poliza.Id = null;
                    this.poliza.ProveedorId = null;
                    this.poliza.ServicioCatalogoId = null;
                    this.poliza.VersionFecha = new Date();
                } else {
                    this.serviciosAdicionalesService.obtenerPoliza(id)
                        .subscribe(item => this.asignarPoliza(item, false),
                            error => this.authService.showErrorPopup(error));
                }
            });
        });

    }

    obtenerCatalogos(callback: Function): void {
        this.serviciosAdicionalesService.obtenerCatalogo()
            .subscribe(item => {
                    this.catalogo = item;
                    if (callback !== null) {
                        callback();
                    }
                },
                error => this.authService.showErrorPopup(error));
    }

    obtenerProveedores(): void {
        this.serviciosAdicionalesService.obtenerProveedores()
            .subscribe(items => this.proveedores = items,
                error => this.authService.showErrorPopup(error));
    }

    obtenerServicios(): void {
        this.serviciosAdicionalesService.obtenerServicios()
            .subscribe(items => this.servicios = items,
                error => this.authService.showErrorPopup(error));
    }

    guardarPoliza(): void {
        this.serviciosAdicionalesService.guardarPoliza(this.poliza)
            .subscribe(res => {
                    this.authService.showInfoPopup('Registro guardado');
                    this.asignarPoliza(res, true);
                },
                error => this.authService.showErrorPopup(error));
    }

    actualizarCriterios(actualizar: boolean): void {
        if (actualizar) {
            this.obtenerCriterios();
        }
    }

    private obtenerCriterios(): void {
        this.serviciosAdicionalesService.obtenerCriterios(this.poliza.Id)
            .subscribe(items => {
                    this.criterios = items;
                    this.criterios.forEach(criterio => {
                        criterio.Region = this.buscarValorCatalogo(criterio.CatalogoRegionId, 'REGION');
                        criterio.Genero = this.buscarValorCatalogo(criterio.CatalogoGeneroId, 'GENERO');
                        criterio.Relacion = this.buscarValorCatalogo(criterio.CatalogoRelacionId, 'RELACION');
                        criterio.Producto = this.buscarValorCatalogo(criterio.CatalogoProductoId, 'PRODUCTO');
                        criterio.Titular = this.buscarValorCatalogo(criterio.CatalogoEsTitularId, 'SINO');
                        criterio.Tasas = [];
                        criterio.Primas = [];
                        criterio.Valores.forEach(valor => {
                            if (valor.Tipo === 1) {
                                criterio.Primas.push(valor.Valor);
                            } else {
                                criterio.Tasas.push(valor.Valor);
                            }
                        });
                    });
                },
                error => this.authService.showErrorPopup(error));
    }

    private asignarPoliza(poliza: Poliza, esNuevo: boolean): void {
        debugger;
        this.poliza = poliza;
        this.poliza.VersionFecha = new Date(poliza.VersionFecha);
        if (!esNuevo) {
            this.obtenerCriterios();
        }
    }

    private buscarValorCatalogo(id: number, tipo: string): string {
        let resultado = null;
        if (id === null) {
            resultado = 'No aplica';
        } else {
            for (const item of this.catalogo.Item) {
                if (item.Descripcion === tipo) {
                    for (const valor of item.Item) {
                        if (valor.Id === id) {
                            resultado = valor.Descripcion;
                            break;
                        }
                    }
                }
            }
        }
        return resultado;
    }
}
