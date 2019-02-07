import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Archivo } from '../common/model/informacionRetencion';
import { InformacionRetencionService } from '../common/servicios/informacionRetencion.service';

@Component({
    templateUrl: 'infRet.gestionar.template.html'
})

export class InfRetGestionarComponent {
    categoria: string
    mapaCategorias: any
    archivos: Archivo[]

    constructor(
        private activatedRoute: ActivatedRoute,
        private informacionRetencionService: InformacionRetencionService
    ) {
        this.mapaCategorias = {
            scripts: "Scripts de gestión",
            faq: "Preguntas frecuentes",
            anexos: "Anexos de Producto",
            competencia: "Información de Competencia",
            infografias: "Infografías",
            coberturas: "Información de coberturas",
            cupones: "Cupones",
            ley: "Ley",
            servicios: "Servicios Adicionales",
            financiamiento: "Mecanismos de Financiamiento"
        };

        this.activatedRoute.params.subscribe(params => {
            this.categoria = params.categoria;

            this.archivos = Array(10).fill(0).map((x, i) => ({ nombre: i.toString() }));
        });
    }

    get categorias(): any {
        return Object.keys(this.mapaCategorias).map(key => ({
            key: key, value: this.mapaCategorias[key]
        }));
    }

    borrar(archivo: Archivo): void {
        
    }
}
