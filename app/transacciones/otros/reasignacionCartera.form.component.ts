import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../seguridad/auth.service';
import { ContratoKey, ClaveContratoEntity } from '../../common/model/contrato';
import { AutorizacionService } from '../../common/servicios/autorizacion.service';
import { ReasignacionCarteraService } from '../../common/servicios/reasignacionCartera.service';
import { AgenteVentaReasignacionCartera } from '../../common/model/agenteVentaReasignacionCartera';
import { DirectorVendedorEntity } from '../../comercial/model/DirectorVendedorEntity';
import { ContratoService } from '../../common/servicios/contrato.service';
import { VendedoresService } from '../../comercial/service/vendedores.service';
import { ConstantesVendedores } from '../utils/constantesVendedores';

@Component({
    selector: 'reasignacion-cartera',
    providers: [AutorizacionService, ReasignacionCarteraService, VendedoresService, ConstantesVendedores],
    templateUrl: 'reasignacionCartera.form.template.html'
})

export class ReasignacionCarteraFormComponent implements OnInit {
    filter: ClaveContratoEntity;
    _contratoKey: ContratoKey;
    resignacionCarteraEntity: AgenteVentaReasignacionCartera;
    vendedores: DirectorVendedorEntity[];
    vendedoresFiltrados: DirectorVendedorEntity[];
    vendedoresContacto: DirectorVendedorEntity[];
    vendedoresContactoFiltrado: DirectorVendedorEntity[];

    vendedor: DirectorVendedorEntity;
    vendedorContacto: DirectorVendedorEntity;
    vendedorSeleccionado: DirectorVendedorEntity;

    checked: boolean;

    viewCodVendedor: string;
    viewCodContacto: string;

    esBroker: boolean;
    hayError: boolean;

    @Input()
    set contratoKey(contratoKey: ContratoKey) {
        this._contratoKey = contratoKey;
        if (this._contratoKey != undefined && this._contratoKey.NumeroContrato != undefined && this._contratoKey.CodigoProducto != undefined && this._contratoKey.CodigoRegion != undefined) {
            this.filter.CodigoProducto = this._contratoKey.CodigoProducto;
            this.filter.Region = this._contratoKey.CodigoRegion;
            this.filter.NumeroContrato = this._contratoKey.NumeroContrato;
            this.loadDatos();
        }
        else {
            this._contratoKey = new ContratoKey();
        }
    }

    constructor(private reasignacionCarteraService: ReasignacionCarteraService, private authService: AuthService,
        private contratoSevice: ContratoService, private vendedoresService: VendedoresService,
        private constanteVendedores: ConstantesVendedores) {
        this._contratoKey = new ContratoKey();
        this.filter = new ClaveContratoEntity();
        this.resignacionCarteraEntity = new AgenteVentaReasignacionCartera();
        this.vendedores = [];
        this.vendedoresContacto = [];
        this.checked = false;
        this.esBroker = true;
        this.hayError = false;
    }

    ngOnInit() {
        this.vendedor = new DirectorVendedorEntity();
        this.vendedorContacto = new DirectorVendedorEntity();
        this.loadVendedores();
    }

    loadVendedores(): void {
        this.vendedoresService.getAllVendedores().subscribe(result => {
            if (result != null) {
                this.vendedores = result;
                this.vendedoresContacto = result;

                //para el combo de filtrado
                this.vendedoresFiltrados = result;
                this.vendedoresContactoFiltrado = result;

                this.buscarCodigosInit();
            } else {
                this.authService.showErrorPopup("No se ha podido obtener la lista de vendedores");
            }
        },
            error => this.authService.showErrorPopup(error));
    }

    loadDatos() {
        this.reasignacionCarteraService.getInformacionCarteraVendedor(this.filter).subscribe(
            result => {
                if (result != null) {
                    this.resignacionCarteraEntity = result;
                    if (result.PagaComision != undefined && result.PagaComision != null) {
                        if (result.PagaComision == 1) {
                            this.checked = true;
                        } else {
                            this.checked = false;
                        }
                        this.resignacionCarteraEntity.ComentarioNC = undefined;
                    }
                    this.resignacionCarteraEntity.auxCodigoAgenteVenta = this.resignacionCarteraEntity.CodigoAgenteVenta;
                    this.resignacionCarteraEntity.auxCodigoAgenteContacto = this.resignacionCarteraEntity.CodigoAgenteContacto;
                }
            },
            error => {
                this.authService.showErrorPopup(error);
                this.hayError = true;
            }
        );

    }

    buscarCodigosInit() {
        //vendedor
        if (this.resignacionCarteraEntity.auxCodigoAgenteVenta != undefined && this.resignacionCarteraEntity.auxCodigoAgenteVenta != null) {
            var myString = this.resignacionCarteraEntity.auxCodigoAgenteVenta;
            //var myInteger = +myString;
            this.codVendedor(this.resignacionCarteraEntity.auxCodigoAgenteVenta);
        }

        //contacto
        if (this.resignacionCarteraEntity.auxCodigoAgenteContacto != undefined && this.resignacionCarteraEntity.auxCodigoAgenteContacto != null) {
            if (this.resignacionCarteraEntity.auxCodigoAgenteContacto > 0) {
                this.codContacto(this.resignacionCarteraEntity.auxCodigoAgenteContacto);
            } else {
                this.viewCodContacto = "0";
            }
        }
    }

    codVendedor(codigoString: string) {
        let codigo = +codigoString;
        let temp = this.vendedores.find(vend => vend.Codigo == codigo);
        if (temp != undefined && temp != null) {
            this.viewCodVendedor = temp.CodigoVendedor;
            this.hayError = false;
            this.validarVendedorEsBroker();
        } else {
            this.authService.showErrorPopup("No se puede validar el c&oacute;digo de vendedor: " + codigoString);
            this.hayError = true;
        }
    }

    codVendedorModal(codigoString: string) {
        let codigo = +codigoString;
        let temp = this.vendedores.find(vend => vend.Codigo == codigo);
        if (temp != undefined && temp != null) {
            jQuery("#modalVendedorPrincipal").modal("hide");
            this.resignacionCarteraEntity.auxCodigoAgenteVenta = codigoString;
            this.viewCodVendedor = temp.CodigoVendedor;
            this.hayError = false;
            this.validarVendedorEsBroker();
        } else {
            jQuery("#modalVendedorPrincipal").modal("hide");
            this.authService.showErrorPopup("No se puede validar el codigo de vendedor: " + codigoString);
            this.hayError = true;
        }
    }

    filtrarVendedores(searchValue: string) {
        if (this.vendedoresFiltrados != undefined && this.vendedoresFiltrados.length > 0) {
            var a = this.vendedores.filter(item => item.Nombre.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.vendedoresFiltrados = a;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.vendedoresFiltrados = this.vendedores;
        }
    }

    filtrarVendedoresCodigo(searchValue: string) {
        if (this.vendedoresFiltrados != undefined && this.vendedoresFiltrados.length > 0) {
            var a = this.vendedores.filter(item => item.CodigoVendedor.includes(searchValue.toLocaleUpperCase()));
            this.vendedoresFiltrados = a;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.vendedoresFiltrados = this.vendedores;
        }
    }

    codContacto(codigo: number) {
        let temp = this.vendedoresContacto.find(cont => cont.Codigo == codigo);
        if (temp != undefined && temp != null) {
            this.viewCodContacto = temp.CodigoVendedor;
            this.hayError = false;
        } else {
            this.authService.showErrorPopup("No se puede validar el codigo de Vendedor Contacto: " + codigo);
            this.hayError = true;
        }
    }

    codContactoModal(codigoString: string) {
        let codigo = +codigoString;
        let temp = this.vendedoresContacto.find(cont => cont.Codigo == codigo);
        if (temp != undefined && temp != null) {
            jQuery("#modalContacto").modal("hide");
            this.resignacionCarteraEntity.auxCodigoAgenteContacto = codigo;
            this.viewCodContacto = temp.CodigoVendedor;
            this.hayError = false;
        } else {
            jQuery("#modalContacto").modal("hide");
            this.authService.showErrorPopup("No se puede validar el codigo de Vendedor Contacto: " + codigo);
            this.hayError = true;
        }
    }

    filtrarContactos(searchValue: string) {
        if (this.vendedoresContactoFiltrado != undefined && this.vendedoresContactoFiltrado.length > 0) {
            var a = this.vendedoresContacto.filter(item => item.Nombre.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.vendedoresContactoFiltrado = a;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.vendedoresContactoFiltrado = this.vendedoresContacto;
        }
    }

    filtrarContactosCodigo(searchValue: string) {
        if (this.vendedoresContactoFiltrado != undefined && this.vendedoresContactoFiltrado.length > 0) {
            var a = this.vendedoresContacto.filter(item => item.Nombre.includes(searchValue.toLocaleUpperCase()));
            this.vendedoresContactoFiltrado = a;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.vendedoresContactoFiltrado = this.vendedoresContacto;
        }
    }

    validarVendedorEsBroker() {
        this.resignacionCarteraEntity.EsBroker = false;

        let myString = this.resignacionCarteraEntity.auxCodigoAgenteVenta;
        var codigo = +myString;
        let temp = this.vendedoresContacto.find(cont => cont.Codigo == codigo);
        if (temp.TipoAgenteVenta.toString() == this.constanteVendedores.BROKER) {
            this.esBroker = false;
            this.resignacionCarteraEntity.EsBroker = true;
        } else {
            this.esBroker = true;
            this.resignacionCarteraEntity.EsBroker = false;
        }
    }

    oyenteRadio(opcion: number) {
        if (opcion != undefined) {
            this.resignacionCarteraEntity.PagaComision = opcion;
        }
    }

    guardarReasignacion() {
        if (this.viewCodVendedor != undefined && this.viewCodVendedor != null) {
            this.resignacionCarteraEntity.viewCodVendedor = this.viewCodVendedor;
        } else {
            this.resignacionCarteraEntity.viewCodVendedor = "";
        }
        if (this.viewCodContacto != undefined && this.viewCodContacto != undefined) {
            this.resignacionCarteraEntity.viewCodContacto = this.viewCodContacto;
        } else {
            this.resignacionCarteraEntity.viewCodContacto = "";
        }

        this.contratoSevice.updateContrato(this.resignacionCarteraEntity)
            .subscribe(result => {
                if (result == true) {
                    this.resignacionCarteraEntity = new AgenteVentaReasignacionCartera();
                    this.authService.showSuccessPopup("Registro Actualizado con éxito");
                    this.loadDatos();
                } else {
                    this.authService.showInfoPopup("No se puede actualizar, cambie el Vendedor Principal o el Vendedor Contacto");
                }
            },
                error => this.authService.showErrorPopup(error)
            );
    }

}