import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { } from '../common/model/informacionRetencion';
import { InformacionRetencionService } from '../common/servicios/informacionRetencion.service';

@Component({
    templateUrl: 'infRet.ver.template.html'
})

export class InfRetVerComponent {
    categoria: string

    constructor(
        private activatedRoute: ActivatedRoute,
        private informacionRetencionService: InformacionRetencionService
    ) {
        this.activatedRoute.params.subscribe(params => {
            this.categoria = params.categoria;
        });
    }
}
