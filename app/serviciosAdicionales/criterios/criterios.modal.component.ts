import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {ServiciosAdicionalesAdminService} from '../../common/servicios/serviciosAdicionalesAdmin.service';
import {AuthService} from '../../seguridad/auth.service';
import {Poliza, Criterio, Catalogo, Valor} from '../models/Polizas';

@Component({
    selector: 'app-criterios-modal',
    templateUrl: 'criterios.modal.template.html',
    styleUrls: ['criterios.component.css']
})

export class CriteriosModalComponent implements OnInit {

    visible = false;
    animate = false;
    poliza: Poliza = null;
    criterio: Criterio = null;
    valor: Valor = null;

    regiones: Catalogo[];
    generos: Catalogo[];
    relaciones: Catalogo[];
    productos: Catalogo[];
    sino: Catalogo[];

    @Output() saved: EventEmitter<boolean> = new EventEmitter();

    constructor(public serviciosAdicionalesService: ServiciosAdicionalesAdminService, public authService: AuthService) {
    }

    ngOnInit(): void {
        this.valor = new Valor();
    }

    show(poliza: Poliza, criterio: Criterio, catalogo: Catalogo): void {
        this.iniciarCatalogos(catalogo);
        this.visible = true;
        this.poliza = poliza;
        this.criterio = criterio || new Criterio();
        setTimeout(() => {
            this.animate = true;
        }, 100);
    }

    hide(respuesta: boolean): void {
        this.animate = false;
        setTimeout(() => {
            this.saved.emit(respuesta);
            this.visible = false;
        }, 100);
    }

    guardarValor(): void {
        if (this.criterio.Valores === null || this.criterio.Valores === undefined) {
            this.criterio.Valores = [];
        }
        if (this.criterio.Valores.indexOf(this.valor) === -1) {
            this.criterio.Valores.push(this.valor);
        }
        this.valor = new Valor();
    }

    editarValor(valor: Valor): void {
        this.valor = valor;
    }

    eliminarValor(valor: Valor): void {
        this.criterio.Valores.splice(this.criterio.Valores.indexOf(valor), 1);
        this.valor = new Valor();
    }

    guardar(): void {
        if (this.criterio.PolizaId === undefined || this.criterio.PolizaId === null) {
            this.criterio.PolizaId = this.poliza.Id;
        }
        this.serviciosAdicionalesService.guardarCriterio(this.criterio)
            .subscribe(resp => {
                    this.hide(true);
                },
                error => this.authService.showErrorPopup(error));
    }

    private iniciarCatalogos(catalogo: Catalogo): void {
        for (const cItem of catalogo.Item) {
            switch (cItem.Descripcion) {
                case 'REGION': {
                    this.regiones = cItem.Item;
                    break;
                }
                case 'GENERO': {
                    this.generos = cItem.Item;
                    break;
                }
                case 'RELACION': {
                    this.relaciones = cItem.Item;
                    break;
                }
                case 'PRODUCTO': {
                    this.productos = cItem.Item;
                    break;
                }
                case 'SINO': {
                    this.sino = cItem.Item;
                    break;
                }
            }
        }
    }
}
