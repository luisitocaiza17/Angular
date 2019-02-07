import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';


@Component({
    selector: 'menuPrincipalFacturacion',
    providers: [],
    templateUrl: 'menuPrincipal.component.html'
})

export class menuPrincipalFacturacionComponent implements OnDestroy {

    suscription: any;
    consultaFull: boolean;
    consultaExterna: boolean;

    constructor( ) {
    }

    ngOnDestroy() {
      
    }
}