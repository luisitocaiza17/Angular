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


@Component({
    selector: 'representantelegal',
    providers: [CorporativoService],
    templateUrl: 'representantelegal.form.template.html'
})

export class RepresentanteLegalFormComponent {
    suscription: any;
    corporativofilter: EmpresaCoorporativo;
    corporativokey: CorporativoList;
    corporativo: EmpresaCoorporativo;



    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
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



    actualizarRepresentanteLegal(): void {
        this.corporativokey.CedulaRepresentante = this.corporativofilter.CedulaRepresentante;
        this.corporativokey.NombresRepresentante = this.corporativofilter.NombresRepresentante;
        this.corporativokey.ApellidosRepresentante = this.corporativofilter.ApellidosRepresentante;
        this.corporativokey.Email = this.corporativofilter.Email;
        this.corporativokey.CargoRepresentante = this.corporativofilter.CargoRepresentante;
        this.corporativokey.Telefono = this.corporativofilter.Telefono;
    }


    guardarCambios() {

        var filtro = new CorporativoList();
        filtro = this.corporativokey;
        filtro.CedulaRepresentante = this.corporativofilter.CedulaRepresentante;
        filtro.NombresRepresentante = this.corporativofilter.NombresRepresentante;
        filtro.ApellidosRepresentante = this.corporativofilter.ApellidosRepresentante;
        filtro.Email = this.corporativofilter.Email;
        filtro.CargoRepresentante = this.corporativofilter.CargoRepresentante;
        filtro.RepresentanteCelular = this.corporativofilter.RepresentanteCelular;
        this.showPopupResultadoConfirm("Esta seguro de cambiar los datos del Representante Legal del Empresa?", filtro);
    }
    // }



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
                    this.CorporativoService.actualizarRepresentanteLegal(filtro).subscribe(
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