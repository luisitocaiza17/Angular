import { Component, OnInit } from '@angular/core';

@Component({
    providers: [],
    templateUrl: 'menuReporteCobranzas.form.component.html'
})

export class MenuReporteCobranzasComponent implements OnInit {

    opcion: string;

    constructor() {

    }

    ngOnInit(): void {
        this.opcion = "";
        this.activar("CuotasPendientesPago");
    }

    isActive(divActivo: string) {
        if (this.opcion == divActivo)
            return true;
        return false;
    }

    activar(opcion: string) {
        this.opcion = opcion;
    }

}