import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'menu-movimientos-comision-manuales',
    providers: [],
    templateUrl: 'menuMovimientosManuales.component.html'
})

export class menuMovimientosManualesComponent 
{
    constructor( 
        public route: ActivatedRoute, 
        public router: Router
    ) {
        
    }

    ngOnInit(){ 
        this.router.navigate(['movimientoComisionManual'],{relativeTo: this.route});
    }
}
