import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Archivo, Categoria, Descarga } from '../common/model/retencion';
import { RetencionService } from '../common/servicios/retencion.service';

@Component({
    templateUrl: 'retencion.info.template.html'
})

export class RetencionInfoComponent {
    id: number
    busqueda: string
    categorias: Categoria[]
    archivos: Archivo[]

    constructor(
        private activatedRoute: ActivatedRoute,
        private retencionService: RetencionService
    ) {
        this.id = 0;
        this.busqueda = "";

        this.activatedRoute.queryParams.subscribe(params => {
            this.id = params.id;

            this
                .retencionService
                .obtenerCategorias()
                .subscribe(categorias => {

                this.categorias = categorias;
            });

            if (this.id) {
                this
                    .retencionService
                    .lista(this.id)
                    .subscribe(archivos => {
                    
                    this.archivos = archivos;
                });
            }
        });
    }

    descargar(archivo: Archivo) {
        const descarga: Descarga = {
            nombreBuscado: archivo.NombreOriginal,
            idCategoria: archivo.idCategoria
        }

        this
            .retencionService
            .descargar(descarga)
            .subscribe(url => {
            
            window.open(url);
        });
    }

    get archivosFiltrados() {
        if (this.busqueda) {
            const busquedaMinusculas = this.busqueda.toLowerCase();
            return this.archivos.filter(archivo =>
                archivo
                    .NombreOriginal
                    .toLowerCase()
                    .indexOf(busquedaMinusculas) != -1
            );
        } else {
            return this.archivos;
        }
    }
}
