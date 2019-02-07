import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { ConstantService } from '../utils/constant.service';
import {CorredoresGrupoAgenteVentaServices} from '../common/servicios/corredoresGrupoAgentes.services';
import {PC_GrupoAgentes} from '../common/model/PC_GrupoAgentes';

@Component({
    providers: [CorredoresGrupoAgenteVentaServices],
    templateUrl: 'corredoresGrupoAgentes.list.template.html'
})

export class CorredoresGrupoAgentesListComponent implements OnInit {

    // Variable para saber si se muestra el formulario o el editor
    showEditor: boolean;
    // Variable para saber si se trata de un nuevo registro
    esNuevo: boolean;
    // Variable que almacena el item en edición
    item: PC_GrupoAgentes;
    // Variable que almacena la lista de items consultados
    list: PC_GrupoAgentes[];
    // Variable que almacena los datos del criterio de b{usqueda
    searchItem: PC_GrupoAgentes;

    // Constructor, se ejecuta al inicializar el proceso, inicializa las variables
    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
                private authService: AuthService, private constantService: ConstantService,
                public grupoService: CorredoresGrupoAgenteVentaServices) {
        this.showEditor = false;
        this.item = new PC_GrupoAgentes();
        this.list = [];
        this.searchItem = new PC_GrupoAgentes();
        this.esNuevo = false;
    }

    // Corre cuando Angular está cargado y todos los componentes descargados
    // sirve para inizializar los datos
    ngOnInit(): void {
        // No muestro nada en pantalla inicialmente, hasta que ponga un criterio de búsqueda
        // Si deseo cargar de entrada, llamo a buscar simplemente
        this.traerTodos();
    }

    // Método que indica si se activa el botón buscar, cuando se quiere poner una validación para poder buscar y no traiga toda la base
    puedeBuscar(): boolean {
        let NumeroLleno = true;

        if (this.searchItem.codigo_grupo_agentes === undefined) {
            NumeroLleno = false;
        }

        if (this.searchItem.codigo_grupo_agentes !== undefined && this.searchItem.codigo_grupo_agentes <= 0) {
            NumeroLleno = false;
        }
        if (NumeroLleno ) {
            return true;
        } else {
            return false;
        }
    }

    // Método que ejecuta la búsqueda, invocado desde botón buscar
    buscar(): void {
        this.grupoService.GrupoAgentesPorCodigo(this.searchItem.codigo_grupo_agentes)
            .subscribe(result => {
                    this.list = [];
                    this.list.push(result);
                },
                error => this.authService.showErrorPopup(error));
    }

    // Mètodo que trae todos los registros que tiene esta tabla (solamente para transacciones de pocos registros)
    traerTodos(): void {
        this.grupoService.GrupoAgentesTraerTodos()
            .subscribe(result => {
                    this.list = result;
                },
                error => this.authService.showErrorPopup(error));
    }
    // Método que limpia los campos de búsqueda
    limpiarBusqueda(): void {
        this.searchItem = new PC_GrupoAgentes();
    }

    // Método que abre el formulario de edición, para crear un nuevo registro
    nuevo(): void {
        // marca como nuevo
        this.esNuevo = true;
        // Abre el panel de edición
        this.showEditor = true;
        // Por si acaso inicializa nuevamente la variable de edición
        this.item = new PC_GrupoAgentes();
    }

    // Método invocado para abrir la edición, invocado desde los items de la lista
    abrirEdicion(item: PC_GrupoAgentes): void {
        // Abre el panel de edición
        this.showEditor = true;
        // Llena la variable que administra la edición
        this.item = item;
    }

    // Método que valida si la información del formulario es completa para proceder a la grabación
    validarFormulario(): boolean {
        // Valida que esté llenos los campos
        if (this.item.nombre_grupo_agentes === undefined) {
            return false;
        }
        if (this.item.nombre_grupo_agentes === '') {
            return false;
        }
        // Si pasa todas las validaciones, se activa el botón de grabar
        return true;
    }

    // Método que graba la información del formulario, invocado desde el botón grabar
    grabar(): void {
        this.grupoService.GrupoAgentesCrearActualizar(this.item)
            .subscribe(result => {
                    if (result === true) {
                        this.authService.showSuccessPopup('Grabación Exitosa.');
                    } else {
                        this.authService.showErrorPopup('Ha ocurrido un problema en la grabación.');
                    }
                    this.cancelar();
                },
                error => this.authService.showErrorPopup(error));
    }

    // Método que limpia las variables del formulario y regresar a la búsqueda, llamado desde el botón o para limpiar la pantalla de edición
    cancelar(): void {
        this.showEditor = false;
        this.esNuevo = false;
        this.item = new PC_GrupoAgentes();
        this.buscar();
    }

    // Mëtodo que permite eliminar el registro seleccionado
    eliminar(): void {
        this.grupoService.GrupoAgentesEliminar(this.item.codigo_grupo_agentes)
            .subscribe(result => {
                    if (result === true) {
                        this.authService.showSuccessPopup('Eliminación Exitosa.');
                    } else {
                        this.authService.showErrorPopup('Ha ocurrido un problema en la grabación.');
                    }
                    this.cancelar();
                },
                error => this.authService.showErrorPopup(error));
    }
}
