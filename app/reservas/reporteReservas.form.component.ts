import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';


import { ReservaFilter, ReservaCabeceraEntity } from '../common/model/reserva';
import { VendedoresService } from '../comercial/service/vendedores.service';
import { AuthService } from '../seguridad/auth.service';
import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { ReporteService } from '../common/servicios/reporte.service';
import { ReservasService } from '../common/servicios/reserva.service';

@Component({
    providers: [ReservasService, VendedoresService],
    templateUrl: 'reporteReservas.form.template.html'
})

export class ReporteReservasFormComponent {

    filter: ReservaFilter;
    reservas: ReservaCabeceraEntity[];

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
        private chRef: ChangeDetectorRef, private authService: AuthService, private reservaServices: ReservasService) {

        this.filter = new ReservaFilter();
        this.loadReservas();
    }



    generarReporte(): void {
        if (this.filter.FechaDesde != undefined || this.filter.FechaHasta != undefined) {
            this.reservaServices.GenerarManual(this.filter).subscribe(resp => {
            },
                error => this.authService.showErrorPopup(error));
        }
        else {
            this.showPopup('Se debe Ingresar Parametros para la Ejecucion ', 'error');
        }


    }

    

    generarReporteC(): void {
        if (this.filter.FechaDesde != undefined || this.filter.FechaHasta != undefined) {
            this.reservaServices.GenerarSimulacion(this.filter).subscribe(resp => {
            },
                error => this.authService.showErrorPopup(error));
        }
        else {
            this.showPopup('Se debe Ingresar Parametros de Fecha para la Ejecucion', 'error');
        }

    }

    colapsarTab():void{

    }

    pageChanged(): void{
        
    }

    loadReservas() {
        this.reservaServices.GetReservas().subscribe(resp => {
            this.reservas = resp;
            console.log(this.reservas);

        },
            error => this.authService.showErrorPopup(error)
        );
    }


    showPopup(msg: string, type: string): void {
        swal({
            title: "",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: type,
            closeOnConfirm: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
        });
    }

    limpiar(): void {
        this.filter = new ReservaFilter();
    }
}
