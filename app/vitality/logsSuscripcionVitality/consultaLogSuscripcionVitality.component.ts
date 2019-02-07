import { Component, OnInit } from '@angular/core';
import { LogSuscripcionVitalityService } from '../services/logSuscripcionVitality.service';
import { LogSuscripcionVitalityEntity } from '../model/vitality.model';

@Component({
  selector: 'app-consultaLogSuscripcionVitality',
  templateUrl: './consultaLogSuscripcionVitality.component.html',
  providers: [LogSuscripcionVitalityService]
})

export class ConsultaLogSuscripcionVitality implements OnInit {

    filtro: LogSuscripcionVitalityEntity; 
    logs: LogSuscripcionVitalityEntity[]; 

    constructor(
      private logSuscripcionService: LogSuscripcionVitalityService
    ) {
    }

    ngOnInit() {
      this.filtro = new LogSuscripcionVitalityEntity(); 
      this.filtro.FechaRespuesta = new Date();
      this.logs = [];  
      this.GetLogs(); 
    }
    
    GetLogs(){ 
      this.logSuscripcionService.GetLogsSuscripcionesByFilters(this.filtro).subscribe( 
        res => { 
          this.logs = res; 
          console.log(this.logs);
        }
      ); 
    }

    Limpiar(){ 
      this.logs = []; 
    }
}
