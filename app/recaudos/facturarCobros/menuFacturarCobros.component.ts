import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'menu-cobros-pichincha',
    providers: [],
    templateUrl: 'menuFacturarCobros.component.html' 
})



export class menuFacturarCobrosCompomnent implements OnInit {

    direccionamiento: boolean;

    constructor( 
        private route: ActivatedRoute, 
        private router: Router
    ) {
        
    }

    ngOnInit(){ 
        // this.direccionamiento = true; 

        // if(this.direccionamiento)
        //     this.router.navigate(['cargaArchivosPichincha'],{relativeTo: this.route});
    }
}