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

import {Grupo} from '../../common/model/grupo';
import {GrupoService} from '../../common/servicios/grupo.service';
import { ActividadService } from '../../common/servicios/actividad.service';
import { Actividad } from '../../common/model/actividad';
import { SociedadService } from '../../common/servicios/sociedad.service';
import { Sociedad } from '../../common/model/sociedad';




@Component({
    selector: 'datoscorporativo',
    providers: [CorporativoService],
    templateUrl: 'DatosCorporativo.form.template.html'
})

export class DatosCorporativoFormComponent {
    suscription: any;
    corporativofilter: EmpresaCoorporativo;
    corporativokey: CorporativoList;
    corporativo: EmpresaCoorporativo;
    grupos: Grupo[];
    actividades: Actividad[];
    sociedades: Sociedad[];



constructor (public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef, 
    private CorporativoService: CorporativoService, private CorporativoComponent: CorporativoComponent,
    private grupoService: GrupoService, private actividadService: ActividadService,
    private sociedadService: SociedadService ) {

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

loadSociedades(): void {
    this.sociedadService.getAll()
        .subscribe(sociedades => {
                console.log(sociedades)
                this.sociedades = sociedades;
            },
        error => this.authService.showErrorPopup(error));
}

loadActividades(): void {
    this.CorporativoService.getCatalogoGen("TIPACTIV")
        .subscribe(actividades => {
                console.log(actividades)
                this.actividades = actividades;
            },
        error => this.authService.showErrorPopup(error));
}

loadGrupos(): void {
    this.grupoService.GetGrupos()
        .subscribe(grupos => {
                console.log(grupos)
                this.grupos = grupos;
            },
        error => this.authService.showErrorPopup(error));
        }

        actualizarDatosCorporativo(): void {
        this.corporativokey.Ruc = this.corporativofilter.Ruc;
        this.corporativokey.RazonSocial = this.corporativofilter.RazonSocial;
        this.corporativokey.Grupo = this.corporativofilter.Grupo;
        this.corporativokey.TipoSociedad = this.corporativofilter.TipoSociedad;
    }


    guardarCambios() {

        var filtro = new CorporativoList();
        filtro = this.corporativokey;
        filtro.Ruc = this.corporativofilter.Ruc;
        filtro.RazonSocial = this.corporativofilter.RazonSocial;
        filtro.Grupo = this.corporativofilter.Grupo;
        filtro.TipoSociedad = this.corporativofilter.TipoSociedad;
        this.showPopupResultadoConfirm("Esta seguro de cambiar los Datos del Empresa?", filtro);
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
                    this.CorporativoService.actualizarDatosCorporativos(filtro).subscribe(
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


