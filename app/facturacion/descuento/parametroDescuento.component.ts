import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParametroDescuento } from '../common/model/parametroDescuento';
import { ParametroDescuentoService } from '../service/parametroDescuento.service';
import { AuthService } from '../../seguridad/auth.service';
import { utilidadesGenericasService } from '../../utils/utilidadesGenericas';

@Component({
    selector: 'parametroDescuento',
    providers: [ParametroDescuentoService],
    templateUrl: 'parametroDescuento.template.html'
})

export class ParametroDescuentoComponent {
   
    parametrosDescuentos: ParametroDescuento[];
    subirArchivo: File;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'yyyy/mm/dd',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(
        private parametroDescuentoService: ParametroDescuentoService,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        public utils: utilidadesGenericasService
        ) {
            this.parametrosDescuentos = [];
            this.obtenerParametros();
    }

    obtenerParametros() : void{
        this.parametroDescuentoService.obtenerParametros().subscribe(prm => {
            this.parametrosDescuentos = prm.map(x => {
                
                if (x.FechaInicio != undefined && x.FechaInicio != null) {
                    x.FechaInicio = this.utils.GetDateTimeUTCTimeZone(x.FechaInicio);
                }

                if (x.FechaFin != undefined && x.FechaFin != null) {
                    x.FechaFin = this.utils.GetDateTimeUTCTimeZone(x.FechaFin);
                }

                return x;
            });
        });   
      
    }

    crearParametroDescuento():void{
        this.parametrosDescuentos.push(this.testDesc(0));
    }

    suma<T>(items: T[], f: (item: T) => number): number {
        return items.reduce((xs, x) => xs + f(x), 0);
    }

    testDesc(index: number): ParametroDescuento {
        return {
            Id: 0,
            FechaInicio: null,
            FechaFin: null,
            Porcentaje: null,
            TipoProducto: ''
        }
    }

    procesarParametroDescuento(parametro):void{       
        if(parametro.FechaInicio == undefined || parametro.FechaFin == undefined){
            this.authService.showErrorPopup("El parametro debe tener fecha de inicio y fin");
        }else if(parametro.FechaFin < parametro.FechaInicio){
            this.authService.showErrorPopup("La fecha Fin debe ser mayor a la fecha inicio");
        }else{
            this.parametroDescuentoService.crearParametro(parametro)
            .subscribe(result => {
                if(result.Estado){
                    this.authService.showSuccessPopup(result.Mensaje);
                } else {
                    this.authService.showErrorPopup(result.Mensaje);
                }
                this.obtenerParametros();
            },
            error => this.authService.showErrorPopup(error));
        }
        
    }

    eliminarParametroDescuento(parametro):void{
        if(parametro.Id && parametro.Id > 0){
            this.parametroDescuentoService
                .deleteParametro(parametro)
                    .subscribe(result => {
                        if(result.Estado){
                            this.authService.showSuccessPopup(result.Mensaje);
                        } else {
                            this.authService.showErrorPopup(result.Mensaje);
                        }
                    },
                    error => this.authService.showErrorPopup(error));
        }
        const index = this.parametrosDescuentos.indexOf(parametro);
        this.parametrosDescuentos.splice(index, 1);
    }

    uploadFileToActivity(files: FileList) {
        this.subirArchivo = null;
        this.subirArchivo = files.item(0);
    }

    llamar() {
        if (this.subirArchivo != null) {
            this.parametroDescuentoService.cargarArchivo(this.subirArchivo).subscribe(result => {
                
                console.log(result);
                
                this.authService.showSuccessPopup(result);
            },
                error => this.authService.showErrorPopup(error)
            );
        }

    }
}
