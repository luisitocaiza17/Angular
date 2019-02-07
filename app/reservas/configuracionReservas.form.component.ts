import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';


import { ReservaFilter, ReservaCabeceraEntity, PorcentajesEntity } from '../common/model/reserva';
import { VendedoresService } from '../comercial/service/vendedores.service';
import { AuthService } from '../seguridad/auth.service';
import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { ReporteService } from '../common/servicios/reporte.service';
import { ReservasService } from '../common/servicios/reserva.service';
import { CronTabEntity } from '../facturacion/model/cronTabEntity';
import { GenericosService } from '../common/servicios/genericos.service';

@Component({
    providers: [ReservasService, VendedoresService],
    templateUrl: 'configuracionReservas.form.template.html'
})

export class ConfiguracionReservasFormComponent {
    filter: ReservaFilter;
    cronTab: CronTabEntity;
    porcentajes: PorcentajesEntity[];

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'yyyy/mm/dd',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(public reporteService: ReporteService, private autorizacionService: AutorizacionService,
        private elementRef: ElementRef, private router: Router, public vendedoresService: VendedoresService,
        private chRef: ChangeDetectorRef, private authService: AuthService, private reservaServices: ReservasService, public genericosService: GenericosService) {

        this.filter = new ReservaFilter();
        this.cronTab = new CronTabEntity;
        this.cronTab.Hora = 0;
        this.cronTab.Minutos = 0;
    }

    dias(diariamente: boolean) {

        if (!diariamente) {
            if (this.cronTab.Lunes && this.cronTab.Martes && this.cronTab.Miercoles && this.cronTab.Jueves &&
                this.cronTab.Viernes && this.cronTab.Sabado && this.cronTab.Domingo) {
                this.cronTab.Diariamente = true;
            }
            else {
                this.cronTab.Diariamente = false;
            }
        }
        else {
            if (this.cronTab.Diariamente) {
                this.cronTab.Diariamente = true;
                this.cronTab.Lunes = true;
                this.cronTab.Martes = true;
                this.cronTab.Miercoles = true;
                this.cronTab.Jueves = true;
                this.cronTab.Viernes = true;
                this.cronTab.Sabado = true;
                this.cronTab.Domingo = true;
            }
            else {
                this.cronTab.Diariamente = false;
                this.cronTab.Lunes = false;
                this.cronTab.Martes = false;
                this.cronTab.Miercoles = false;
                this.cronTab.Jueves = false;
                this.cronTab.Viernes = false;
                this.cronTab.Sabado = false;
                this.cronTab.Domingo = false;
            }
        }
    }

    emitir() {
        this.filter.CronTab = this.cronTab;

        this.reservaServices.GenerarIndividual(this.filter).subscribe(resp => {
            this.authService.showSuccessPopup(resp);

        },
            error => this.authService.showErrorPopup(error));



    }

    eliminarTarea() {
        this.genericosService.eliminarTareaProgramada("EmitirProcesoReserva")
            .subscribe(result => {
                if (result)
                    this.authService.showSuccessPopup("La tarea programada ha sido eliminada");
            },
                error => this.authService.showErrorPopup(error));
    }

    CargarPorcentajes() {
        this.reservaServices.GetPorcentajesReservas().subscribe(resp => {
            this.porcentajes = resp;
            console.log(this.porcentajes);

        },
            error => this.authService.showErrorPopup(error)
        );
    }

    UpdatePorcentajes() {
        this.reservaServices.UpdatePorcentajes(this.porcentajes).subscribe(resp => {
            if (resp==true) {
                this.authService.showSuccessPopup("LA ACTUALIZACION DE PORCENTAJES SE A REALIZADO");

            }

        },
            error => this.authService.showErrorPopup(error));
    }
}