import {Component, OnInit} from '@angular/core';
import {ServiciosAdicionalesAdminService} from '../../common/servicios/serviciosAdicionalesAdmin.service';
import {AuthService} from '../../seguridad/auth.service';
import {Proveedor} from '../models/Bases';
import {Poliza, Servicio} from '../models/Polizas';

@Component({
    templateUrl: 'polizas.list.template.html'
})

export class PolizasListComponent implements OnInit {

    servicios: Servicio[];
    proveedores: Proveedor[] = null;
    proveedor: Proveedor = null;
    polizas: Poliza[] = null;

    formularioActivo = false;

    datePickerOpts = {
        autoclose: true,
        todayBtn: 'linked',
        todayHighlight: true,
        assumeNearbyYear: true,
        format: 'dd-mm-yyyy',
        icon: 'fa fa-calendar',
        language: 'es'
    };

    constructor(public serviciosAdicionalesService: ServiciosAdicionalesAdminService, private authService: AuthService) {
    }

    ngOnInit(): void {
        this.obtenerServicios();
        this.obtenerProveedores();
    }

    seleccionarProveedor(event): void {
        this.proveedor = this.buscarProveedor(event.target.value);
        this.obtenerPolizas(this.proveedor.Id);
    }

    editarProveedor(): void {
        this.formularioActivo = true;
    }

    cancelar(): void {
        this.formularioActivo = false;
        if (this.proveedor.Id === undefined || this.proveedor.Id === null) {
            this.proveedor = null;
        } else {
            this.obtenerPolizas(this.proveedor.Id);
        }
    }

    guardar(): void {
        this.serviciosAdicionalesService.guardarProveedor(this.proveedor)
            .subscribe(result => {
                    this.proveedor = result;
                    this.proveedor.FechaConvenio = new Date(this.proveedor.FechaConvenio);
                    this.formularioActivo = false;
                    this.obtenerProveedores();
                },
                error => this.authService.showErrorPopup(error));
    }

    nuevoProveedor(): void {
        this.proveedor = new Proveedor();
        this.formularioActivo = true;
        this.polizas = null;
    }

    private buscarProveedor(id: string): Proveedor {
        let resultado = null;
        for (const _item of this.proveedores) {
            if (_item.Id.toString() === id) {
                resultado = _item;
                break;
            }
        }
        return resultado;
    }

    private buscarServicio(id: number): Servicio {
        let resultado = null;
        for (const _item of this.servicios) {
            if (_item.Id === id) {
                resultado = _item;
                break;
            }
        }
        return resultado;
    }

    private obtenerProveedores(): void {
        this.serviciosAdicionalesService.obtenerProveedores()
            .subscribe(items => {
                    this.proveedores = items;
                    for (const prv of this.proveedores) {
                        prv.FechaConvenio = new Date(prv.FechaConvenio);
                    }
                },
                error => this.authService.showErrorPopup(error));
    }

    private obtenerServicios(): void {
        this.serviciosAdicionalesService.obtenerServicios()
            .subscribe(items => this.servicios = items,
                error => this.authService.showErrorPopup(error));
    }

    private obtenerPolizas(proveedorId: number): void {
        this.polizas = null;
        this.serviciosAdicionalesService.obtenerPolizaPorProveedor(proveedorId)
            .subscribe(items => {
                    this.polizas = items;
                    for (const plz of this.polizas) {
                        plz.VersionFecha = new Date(plz.VersionFecha);
                        plz.Servicio = this.buscarServicio(plz.ServicioCatalogoId).Descripcion;
                    }
                },
                error => this.authService.showErrorPopup(error));
    }
}
