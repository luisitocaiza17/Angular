import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../seguridad/auth.service';


@Component({
    providers: [],
    templateUrl: 'cotizacionesPrincipal.form.component.html'
})

export class CotizacionesPrincipalComponent implements OnInit {

    opcion: string;

    constructor(private authService: AuthService) {

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