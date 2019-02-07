import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContratoKey } from '../../common/model/contrato';
import { AutorizacionService } from '../../common/servicios/autorizacion.service';
import { PlanService } from '../../common/servicios/plan.service';
import { Plan } from '../../common/model/plan';

@Component({
    selector: 'transicion',
    providers: [AutorizacionService],
    templateUrl: 'transicion.form.template.html'
})

export class TransicionFormComponent implements OnDestroy {

    suscription: any;
    contratoKey: ContratoKey;

    constructor(public domSanitizer: DomSanitizer, public autorizacionService: AutorizacionService, private authService: AuthService,
        private contratosTxListComponent: ContratosTxListComponent,
        private elementRef: ElementRef, private chRef: ChangeDetectorRef,
        private planService: PlanService) {

        this.suscription = this.contratosTxListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined && contratoKey.CodigoContrato != undefined) {
                    this.contratoKey = contratoKey;
                    this.loadForm();
                }
            }
        );
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    loadForm() {
    }

    guardarTransicion(){
        
    }
}