import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'menuCargaRespuestas',
    providers: [],
    templateUrl: 'menuCargaRespuestas.component.html'
})

export class menuCargaRespuestasComponent 
{
    constructor( 
        public route: ActivatedRoute, 
        public router: Router
    ) {
        
    }

    ngOnInit(){ 
        this.router.navigate(['cargaRespuestas'],{relativeTo: this.route});
    }
}
