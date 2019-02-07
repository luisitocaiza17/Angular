import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { AbstractClassPart } from '@angular/compiler/src/output/output_ast';
import { ANALYZE_FOR_ENTRY_COMPONENTS } from '@angular/core/src/metadata/di';

import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { ConstantService } from '../utils/constant.service';
import { ConfiguracionFacturacionService } from '../common/servicios/configuracionFacturacion.service';
import { ConfiguracionFacturacion } from '../common/model/configuracionFacturacion';

import { Ambientes } from '../common/model/ambientes';



@Component({
    providers: [ConfiguracionFacturacionService],
    templateUrl: 'configuracionFacturacion.form.template.html'
})

export class ConfiguracionFacturacionFormComponent implements OnInit {

    configuracionFacturacion: ConfiguracionFacturacion;

    ambientes: Ambientes[];

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private constantService: ConstantService,
        public configuracionFacturacionService: ConfiguracionFacturacionService) {

        this.configuracionFacturacion = new ConfiguracionFacturacion();

    }

    ngOnInit(): void {

        this.loadAmbientes();

        this.getConfiguracion();
    }

    getConfiguracion(): void {
        this.configuracionFacturacionService.GetConfiguracion()
            .subscribe(result => {
                this.configuracionFacturacion = result;
            },
            error => this.authService.showErrorPopup(error));
    }

    guardar(): void {
        this.configuracionFacturacionService.guardar(this.configuracionFacturacion)
            .subscribe(result => {
                if(result == true){
                    this.authService.showInfoPopup("Se guardo los cambios correctamente.");
                }else{
                    this.authService.showErrorPopup("Se presento un error.");
                }
            },
            error => this.authService.showErrorPopup(error));
    }

    colapsarTab(): void {

    }


    loadAmbientes(): void {
        if (this.ambientes == undefined) {
            this.ambientes = Ambientes.values;
        }
    }



}
