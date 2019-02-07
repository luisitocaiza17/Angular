import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { CorporativoComponent} from '../corporativo.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


import { TipoPantallaPersonaUnica } from '../../common/model/persona';
import { Catalogo } from '../../common/model/catalogo';
import { EmpresaCoorporativo, CorporativoList, CorporativoFilter, DatosCorporativo } from '../../common/model/corporativo';
import { CorporativoService } from '../../common/servicios/corporativo.service';
import { SucursalService} from '../../common/servicios/sucursal.service';
import { Sucursal, SucursalFilter, SucursarList } from '../../common/model/sucursal';
import { SucursalFormComponent } from '../sucursal.form.component';
import { CorporativoFormComponent } from '../corporativo.form.component';


@Component({
    selector: 'datossucursales',
    providers: [SucursalService],
    templateUrl: 'datossucursales.form.template.html'
})

export class DatosSucursalesFormComponent {
    suscription: any;
    sucursalfilter: Sucursal;
    sucursalkey: SucursarList;
    sucursal: Sucursal;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };



constructor (public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef, 
    private SucursalService: SucursalService, private SucursalComponent: CorporativoFormComponent) {

    this.sucursalkey = new SucursarList();
    this.sucursalfilter = new Sucursal();
    this.sucursal = new Sucursal();

    this.suscription = this.SucursalComponent.selectSucursal$.subscribe(
        (sucursalkey) => {

            if (sucursalkey != undefined && sucursalkey.Numero != undefined) {
                this.sucursalkey = sucursalkey;
                this.sucursalfilter = sucursalkey;

                //console.log(this.corporativokey.EmailBroker);

            }
        }
    );
}

        actualizarDatosSucursal(): void {
        this.sucursalkey.NombreDuenioCuenta = this.sucursalfilter.NombreDuenioCuenta;
        this.sucursalkey.Nombre = this.sucursalfilter.Nombre;
        this.sucursalkey.Estado = this.sucursalkey.Estado;
        this.sucursalkey.PresentaGarantia = this.sucursalfilter.PresentaGarantia;
        this.sucursalkey.FechaInicio = this.sucursalfilter.FechaInicio;
        this.sucursalkey.FechaFin = this.sucursalfilter.FechaFin;
        this.sucursalkey.NumeroOdas = this.sucursalfilter.NumeroOdas;
    }


    guardarCambios() {

        var filtro = new SucursarList();
        filtro = this.sucursalkey;
        filtro.NombreDuenioCuenta = this.sucursalkey.NombreDuenioCuenta;
        filtro.Nombre = this.sucursalkey.Nombre;
        filtro.Estado = this.sucursalkey.Estado;
        filtro.PresentaGarantia = this.sucursalkey.PresentaGarantia;
        filtro.FechaInicio = this.sucursalkey.FechaInicio;
        filtro.FechaFin = this.sucursalkey.FechaFin;
        filtro.NumeroOdas = this.sucursalkey.NumeroOdas;
        this.showPopupResultadoConfirm("Esta seguro de cambiar los Datos del Sucursal?", filtro);
    }




    showPopupResultadoConfirm(msg: string, filtro: Sucursal): void {
        swal({
            title: "",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
            closeOnConfirm: true
        },
            confirmed => {

                if (confirmed) {
                    this.SucursalService.actualizarDatosSucursal(filtro).subscribe(
                        result => {
                            if (result) {
                                this.authService.showSuccessPopup("Correccion Realizada. Revise por favor . . . ");
                            } else {
                                this.authService.showErrorPopup("Ha ocurrido un error");
                            }
                        },
                        error => this.authService.showErrorPopup(error));
                }

            });
    }


}
