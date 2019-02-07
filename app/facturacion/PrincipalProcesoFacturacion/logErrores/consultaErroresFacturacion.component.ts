import { Component, OnInit } from '@angular/core';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { LogErroresService } from '../../../common/servicios/logErrores.service';
import { AuthService } from '../../../seguridad/auth.service';
import { LogError, LogErrorDetalle } from '../../../common/model/LogError';
import { ModeloTablaErrores } from './modeloTablaErrores';

@Component({
  selector: 'app-consultaErroresFacturacion',
  templateUrl: './consultaErroresFacturacion.component.html',
  styleUrls: ['consultaErroresFacturacion.component.css'],
  providers: [LogErroresService, ModeloTablaErrores]
})

export class ConsultaErroresFacturacion implements OnInit {

    fechaProceso: string;
    today: Date = new Date();

    cabeceras: LogError[]; 
    cabeceraSelected: LogError;

    detalleErrores: LogErrorDetalle[]; 
    errorSelected: LogErrorDetalle; 

    tableSettings: object; 

    constructor(
        public utilidades: utilidadesGenericasService,
        public logErroresService: LogErroresService,
        public authService: AuthService,
        public modeloTablaErrores: ModeloTablaErrores
    ) {
    }

    ngOnInit(){
        this.fechaProceso = this.utilidades.convertDateToFormattedString(this.today, "dd-MM-yy"); 
        this.cabeceras = []; 
        this.cabeceraSelected = new LogError(); 
        this.detalleErrores = []; 
        this.errorSelected = new LogErrorDetalle(); 
        this.tableSettings = this.modeloTablaErrores.tableSettings;
        console.log(this.tableSettings); 
    }

    consultarCabecera(){
        this.logErroresService.getCabeceraLogErrores(this.fechaProceso).subscribe(
            res =>{
                this.cabeceras = res; 
            },
            error => { 
                this.authService.showErrorPopup(error);
            }
        );
    }

    consultarDetalleErrores(){
        this.logErroresService.getDetalleErrores(this.cabeceraSelected.NumeroProceso).subscribe(
            res =>{
                this.detalleErrores = res; 
            },
            error => { 
                this.authService.showErrorPopup(error);
            }
        );
    }

    limpiar(){
        this.fechaProceso = this.utilidades.convertDateToFormattedString(this.today, "dd-MM-yy"); 
        this.cabeceras = [];
        this.detalleErrores = []; 
    }

    setearComponenteActivo(componenteActivo: string){ 

    }

    seleccionarCabecera(cabecera: LogError): void {
        if (this.cabeceras != undefined) {
          this.cabeceras.forEach(element => {
            element.Selected = false;
          });
        }

        cabecera.Selected = true;
        this.cabeceraSelected = cabecera;

        this.consultarDetalleErrores(); 
    }
    
}
