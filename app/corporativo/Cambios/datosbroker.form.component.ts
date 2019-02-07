import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { CorporativoComponent } from '../corporativo.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


import { TipoPantallaPersonaUnica } from '../../common/model/persona';
import { Catalogo } from '../../common/model/catalogo';
import { EmpresaCoorporativo, CorporativoList, CorporativoFilter } from '../../common/model/corporativo';
import { CorporativoService } from '../../common/servicios/corporativo.service';
import { CorporativoFormComponent } from '../corporativo.form.component';


@Component({
    selector: 'datosbroker',
    providers: [CorporativoService],
    templateUrl: 'datosbroker.form.template.html'
})

export class DatosBrokerFormComponent {
    suscription: any;
    corporativofilter: EmpresaCoorporativo;
    corporativokey: CorporativoList;
    corporativo: EmpresaCoorporativo;



constructor (public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
    private CorporativoService: CorporativoService, private CorporativoComponent: CorporativoComponent) {

    this.corporativokey = new CorporativoList();
    this.corporativofilter = new EmpresaCoorporativo();
    this.corporativo = new EmpresaCoorporativo();
    this.suscription = this.CorporativoComponent.selectCorporativo$.subscribe(
        (corporativokey) => {

            if (corporativokey != undefined && corporativokey.Numero != undefined) {
                this.corporativokey = corporativokey;
                this.corporativofilter = corporativokey;
                //console.log(this.corporativokey.EmailBroker);

            }
        }
    );
}


    actualizarDatosBroker(): void {
        this.corporativo.AgenteVenta = this.corporativofilter.AgenteVenta;
        this.corporativo.EmailBroker = this.corporativofilter.EmailBroker;
        this.corporativo.PorcentajeComisionBroker = this.corporativofilter.PorcentajeComisionBroker;

    }


    guardarCambios() {

        var filtro = new CorporativoList();
        filtro = this.corporativokey;
        filtro.AgenteVenta = this.corporativo.AgenteVenta;
        filtro.Email = this.corporativo.Email;
        filtro.PorcentajeComisionBroker = this.corporativo.PorcentajeComisionBroker;
        this.showPopupResultadoConfirm("Esta seguro de cambiar los Datos Broker del Corporativo?", filtro);
    }




    showPopupResultadoConfirm(msg: string, filtro: EmpresaCoorporativo): void {
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
                    this.CorporativoService.actualizarDatosBroker(filtro).subscribe(
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
