import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { ContratosTxListComponent } from '../contratosTx.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { ContratoKey } from '../../common/model/contrato';
import { AutorizacionService } from '../../common/servicios/autorizacion.service';
import { DetalleRemesaService } from '../../common/servicios/detalleRemesa.service';
import { DesgravamenService } from '../../common/servicios/desgravamen.service';
import { PlanService } from '../../common/servicios/plan.service';
import { Plan } from '../../common/model/plan';
import { DesgravamenFilter } from '../../common/model/desgravamen';
import { DetalleRemesa } from '../../common/model/detalleRemesa';

@Component({
    selector: 'seguro',
    providers: [AutorizacionService, DetalleRemesaService, DesgravamenService],
    templateUrl: 'seguro.form.template.html'
})

export class SeguroFormComponent implements OnDestroy {

    suscription: any;
    contratoKey: ContratoKey;
    verMensajeValidaciones: boolean;
    mensajeValidaciones: string;
    detalleRemesaList: DetalleRemesa[];
    filter: DesgravamenFilter;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };


    constructor(public domSanitizer: DomSanitizer, public autorizacionService: AutorizacionService, private authService: AuthService,
        private contratosTxListComponent: ContratosTxListComponent,
        private elementRef: ElementRef, private chRef: ChangeDetectorRef,
        private planService: PlanService,
        public detalleRemesaService: DetalleRemesaService,
        public desgravamenService: DesgravamenService) {

        this.suscription = this.contratosTxListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined && contratoKey.CodigoContrato != undefined) {
                    this.contratoKey = contratoKey;
                    this.detalleRemesaList = [];
                    this.filter = new DesgravamenFilter();
                    this.loadForm();
                }
            }
        );

        this.verMensajeValidaciones = false;
        this.mensajeValidaciones = "";

    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    loadForm() {
        this.detalleRemesaService.getDetallesRemesas(this.contratoKey).subscribe(
            result => {
                this.detalleRemesaList = result;
            },
            error => this.authService.showErrorPopup(error));
    }

    guardarSeguro() {
        if (!this.esContratoNulo()) {
            if (this.validaFechadeSeguro()) {
                this.apliarContrato();
            }
        }
    }

    esContratoNulo(): boolean {
        if (this.contratoKey.ContratoEstado == "2") {
            this.mensajeValidaciones = "Contrato Anulado No puede Realizar Cambios";
            this.verMensajeValidaciones = true;
            this.authService.showErrorPopup(this.mensajeValidaciones);
            return true;
        } else {
            return false;
        }
    }

    apliarContrato(): void {
        this.filter.FechaFinContrato = this.filter.FechaInicioSeguro;
        this.filter.CodigoMotivoAnulacion = 0;
        this.filter.CodigoEstadoContrato = 17;
        this.filter.TitularConBeneficion = 0;
        this.filter.ContratoKey = this.contratoKey;

        this.desgravamenService.SetDesgravamen(this.filter).subscribe(
            result => {
                if (result == true) {
                    this.authService.showSuccessPopup("Proceso Terminado Satisfactoriamente");
                }
                console.log(result);
            },
            error => this.authService.showErrorPopup(error));

    }

    validaFechadeSeguro(): boolean {
        if (this.filter.FechaInicioSeguro < this.contratoKey.FechaInicio) {
            this.authService.showErrorPopup("Fecha de Efecto, no debe ser menor a la de Inicio del Contrato");
            return false;
        }

        let today = new Date();
        if (this.filter.FechaInicioSeguro > today) {
            this.authService.showErrorPopup("Fecha de Efecto, No debe ser mayor a la actual ");
            return false;
        }

        if (this.filter.FechaInicioSeguro < this.contratoKey.FechaFin) {
            this.authService.showErrorPopup("Fecha efecto MAYOR al fin de Vigencia del Contrato");
            return false;
        }

        return true;
    }
}
