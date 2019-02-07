import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';


@Component({
    selector: 'menuGestionDeCobraza',
    providers: [],
    templateUrl: 'menuGestionCobranza.template.html' 
})



export class menuGestionDeCobranzaComponent implements OnInit {

    direccionamiento: boolean;

    constructor( 
        private route: ActivatedRoute, 
        private router: Router
    ) {
        
    }

    ngOnInit(){ 
        this.direccionamiento = true; 

        if(this.direccionamiento)
            this.router.navigate(['busquedaContratos'],{relativeTo: this.route});
    }
}