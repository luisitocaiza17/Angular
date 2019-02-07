import { Component, OnInit } from '@angular/core';

@Component({
    providers: [],
    templateUrl: 'administracionCredito.form.component.html'
})

export class AdministracionFormComponent implements OnInit {

    opcion: string;

    constructor() {
    }

    ngOnInit(): void {
        this.opcion = "";
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