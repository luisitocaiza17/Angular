import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { ConstantService } from '../utils/constant.service';
import { saveAs } from 'file-saver/FileSaver';
// import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import {CORP_TerminosCondiciones} from '../common/model/terminoscondiciones';
import {TerminosCondicionesService} from '../common/servicios/terminoscondiciones.service';
import { NgxEditorModule } from 'ngx-editor';
import { GraphicDateItem } from '../common/model/graphicItem';
import { NgModel } from '@angular/forms'
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
    providers: [TerminosCondicionesService],
    templateUrl: 'terminoscondiciones.list.template.html'
})


export class TerminosCondicionesListComponent implements OnInit {

    // Variable para saber si se muestra el formulario o el editor
    showEditor: boolean;
    // Variable para saber si se trata de un nuevo registro
    esNuevo: boolean;
    // Variable que almacena el item en edición
    item: CORP_TerminosCondiciones;
    // Variable que almacena la lista de items consultados
    list: CORP_TerminosCondiciones[];
    // Variable que almacena los datos del criterio de b{usqueda
    searchItem: number;
    editorConfig = {
        editable: true,
        spellcheck: false,
        height: '400px',
        minHeight: '400px',
        placeholder: 'intento',
        translate: 'no'
      };
    // public options: Object = {
    //     // placeholderText: 'Edit Your Content Here!',
    //     // charCounterCount: false
    //     height: 350
    // };

    // Constructor, se ejecuta al inicializar el proceso, inicializa las variables
    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
                private authService: AuthService, private constantService: ConstantService,
                public terminoscondicionesService: TerminosCondicionesService ) {
        this.showEditor = false;
        this.item = new CORP_TerminosCondiciones();
        this.list = [];
        // this.searchItem = new GrupoSearch();
        this.searchItem = 0;
        this.esNuevo = false;
    }

    // Corre cuando Angular está cargado y todos los componentes descargados
    // sirve para inizializar los datos
    ngOnInit(): void {
        // No muestro nada en pantalla inicialmente, hasta que ponga un criterio de búsqueda
        // Si deseo cargar de entrada, llamo a buscar simplemente
        this.traerTodos();
    }

    // // Método que indica si se activa el botón buscar, cuando se quiere poner una validación para poder buscar y no traiga toda la base
    // puedeBuscar(): boolean {
    //     // let NombreLleno = true;
    //     // if (this.searchItem.Nombre === undefined) {
    //     //     NombreLleno = false;
    //     // }
    //     // if (this.searchItem.Nombre === '') {
    //     //     NombreLleno = false;
    //     // }
    //     // // debe escribir por lo menos 3 letras para poder buscar
    //     // if (this.searchItem.Nombre !== undefined && this.searchItem.Nombre.length < 3) { NombreLleno = false;
    //     // }
    //     // let NumeroLleno = true;
    //     // if (this.searchItem.Numero === undefined) {
    //     //     NumeroLleno = false;
    //     // }
    //     // if (this.searchItem.Numero !== undefined && this.searchItem.Numero <= 0) {
    //     // debe escribir por lo menos 3 letras para poder buscar
    //     //     NumeroLleno = false;
    //     // }
    //     // if (NombreLleno || NumeroLleno ) {
    //     //     return true;
    //     // } else {
    //     //     return false;
    //     // }
    //     return true;
    // }

    // Método que ejecuta la búsqueda, invocado desde botón buscar
    // buscar(): void {
    //     this.grupoService.ObtenerGrupoPorCodigoGrupo(this.searchItem)
    //         .subscribe(result => {
    //                 this.list = result;
    //             },
    //             error => this.authService.showErrorPopup(error));
    // }

    // Mètodo que trae todos los registros que tiene esta tabla (solamente para transacciones de pocos registros)
    traerTodos(): void {
        this.terminoscondicionesService.TerminosCondicionesLista()
            .subscribe(result => {
                    this.list = result;
                },
                error => this.authService.showErrorPopup(error));
    }
    // Método que limpia los campos de búsqueda
    // limpiarBusqueda(): void {
    //     this.searchItem = 0;
    // }

    // Método que abre el formulario de edición, para crear un nuevo registro
    nuevo(): void {
        // marca como nuevo
        this.esNuevo = true;
        // Abre el panel de edición
        this.showEditor = true;
        // Por si acaso inicializa nuevamente la variable de edición
        this.item = new CORP_TerminosCondiciones();
    }

    // Método invocado para abrir la edición, invocado desde los items de la lista
    abrirEdicion(item: CORP_TerminosCondiciones): void {
        // Abre el panel de edición
        this.showEditor = true;
        // Llena la variable que administra la edición
        this.item = item;
    }

    // Método que valida si la información del formulario es completa para proceder a la grabación
    validarFormulario(): boolean {
        // Valida que esté llenos los campos
        if (this.item.DescripcionCorta === undefined) {
            return false;
        }
        if (this.item.DescripcionCorta === '') {
            return false;
        }
        // Valida que esté llenos los campos
        if (this.item.ResumenCambios === undefined) {
            return false;
        }
        if (this.item.ResumenCambios === '') {
            return false;
        }
        // Si pasa todas las validaciones, se activa el botón de grabar
        return true;
    }

    // Método que graba la información del formulario, invocado desde el botón grabar
    grabar(): void {
        this.terminoscondicionesService.TerminosCondicionesCrearActualizar(this.item)
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

    // Método que graba la información del formulario, invocado desde el botón grabar
    publicar(): void {
        this.terminoscondicionesService.TerminosCondicionesPublicar(this.item.TerminosCondicionesID)
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
        this.item = new CORP_TerminosCondiciones();
        this.traerTodos();
    }

    fileEvent($event) {
        const fileSelected: File = $event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(fileSelected);
        reader.onload = ((item: any) => {
            return (e: Event) => {
                // use "e" or "file"
                item.PDFContenido = reader.result.split(',')[1];
            }
        })(this.item);

        reader.onerror = function (error) {
            console.log('Error: ', error);
        }
    }

    download() {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:application/octect-stream;charset=utf-8;base64,' + encodeURIComponent(this.item.PDFContenido));
        element.setAttribute('download', 'Archivo.pdf');

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    // // Mëtodo que permite eliminar el registro seleccionado
    // eliminar(): void {
    //     // this.grupoService.DeleteGrupo(this.item)
    //     //     .subscribe(result => {
    //     //             if (result === true) {
    //     //                 this.authService.showSuccessPopup('Eliminación Exitosa.');
    //     //             } else {
    //     //                 this.authService.showErrorPopup('Ha ocurrido un problema en la grabación.');
    //     //             }
    //     //             this.cancelar();
    //     //         },
    //     //         error => this.authService.showErrorPopup(error));
    // }

    PublicadoRender(valor: boolean): string {

        if (valor === undefined) {
            return 'NO PUBLICADO';
        }
        return valor === true ? 'PUBLICADO' : 'NO PUBLICADO';
    }

  
}

