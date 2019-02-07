import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { PresupuestoRangosDirectorService } from '../../services/presupuestoRangosDirector.service';
import { ContratoKey, Contrato } from '../../../../common/model/contrato';
import { GenericosService } from '../../../../common/servicios/genericos.service';
import { PresupuestoRangosDirectorEntity } from '../../model/presupuestoRangosDirector.model';
import { RegionEntity, SucursalDeRegion } from '../../../../common/model/genericos';
import { RegionService } from '../../../../common/servicios/region.service';
import { SalasService } from '../../../salas/service/salas.service';
import { Salas } from '../../../salas/model/salas';
import { ConsultaPresupuestoRangosDirectorComponent } from '../consultar/consultaPresupuestoRangosDirector.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-editarPresupuestoRangosDirector',
  templateUrl: './editarPresupuestoRangosDirector.component.html', 
  providers: [PresupuestoRangosDirectorService]
})


export class EditarPresupuestoRangosDirectorComponent implements OnInit {

    @Output() eventoGuardarPresupuesto = new EventEmitter();

    contratoKey: ContratoKey; 
    presupuesto: PresupuestoRangosDirectorEntity;

    subscription: Subscription;
    estadoNombre: boolean;

    constructor(
      public authService: AuthService, 
      public presupuestoRangosDirectorService: PresupuestoRangosDirectorService, 
      public componentePadre: ConsultaPresupuestoRangosDirectorComponent
      ){

    }

    ngOnInit() {
        this.contratoKey = new ContratoKey(); 
        this.presupuesto = new PresupuestoRangosDirectorEntity(); 

        this.getPresupuestoFromParent(); 
    }

    limpiar() {
        this.presupuesto.ValorDesde = undefined; 
        this.presupuesto.ValorHasta = undefined; 
        this.presupuesto.Porcentaje = undefined; 
    }

    actualizarPresupuestoRangosDirector(){ 
        this.presupuestoRangosDirectorService.actualizarPresupuestoRangosDirector(this.presupuesto).subscribe(
            res => { 
                if(res === true )
                    this.authService.showSuccessPopup('Registro creado exitosamente');
                else
                    this.authService.showErrorPopup('Ha ocurrido un error al crear el registro');
                
                this.eventoGuardarPresupuesto.emit(true);
                this.salir(); 
                this.limpiar(); 
            }, 
            error => { 
                this.authService.showErrorPopup('Ha ocurrido un error al crear el registro');
            }
        );
    }

    salir() {
        $('#modalCrear').modal('hide');
        $('#modalEditar').modal('hide');
    }

    getPresupuestoFromParent(){ 
        this.subscription = this.componentePadre.presupuestoObs$.subscribe(
            (res)=>{
            if (res != undefined) 
            {
              this.presupuesto = res; 
            }       
        });
    }

}
