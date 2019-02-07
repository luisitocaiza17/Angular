import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'menu-boton-pago',
    providers: [],
    templateUrl: 'menuBotonPago.component.html' 
})



export class menuBotonPagoComponent implements OnInit {

    direccionamiento: boolean;

    constructor( 
        private route: ActivatedRoute, 
        private router: Router
    ) {
        
    }

    ngOnInit(){ 
    }
}