import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'menu-parametrizacion-comisiones',
    providers: [],
    templateUrl: 'menuParametrizacionComisiones.component.html'
})

export class menuParametrizacionComisionesComponent 
{
    constructor( 
        public route: ActivatedRoute, 
        public router: Router
    ) {
        
    }

    ngOnInit(){ 
        this.router.navigate(['niveles'],{relativeTo: this.route});
    }
}
