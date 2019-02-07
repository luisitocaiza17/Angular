import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'menuCargaEstadoCuentaBancaria',
    providers: [],
    templateUrl: 'menuCargaEstadoCuentaBancaria.component.html'
})

export class menuCargaEstadoCuentaBancariaComponent 
{
    constructor( 
        public route: ActivatedRoute, 
        public router: Router
    ) {
        
    }

    ngOnInit(){ 
        this.router.navigate(['carga'],{relativeTo: this.route});
    }
}
