import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../seguridad/auth.service';
import { HistorialPresupuestoDirector } from '../../model/HistorialPresupuestoDirector';
import { PresupuestoDirectorService } from '../../services/presupuesto-director.service';
import { ConsultarPresupuestoDirectorComponent } from '../consultar/consultarPresupuestoDirector.component';

@Component({
  selector: 'app-historial-presupuesto',
  templateUrl: './historialPresupuestoDirector.component.html'
})
export class HistorialPresupuestoDirectorComponent implements OnInit {

 
  listaHistorial:HistorialPresupuestoDirector[];
  id:number;

  constructor(private authService: AuthService,private presupuestoDirectorService:PresupuestoDirectorService, private presupuestoDirector:ConsultarPresupuestoDirectorComponent) { 
    this.listaHistorial =[];
  }


  ngOnInit() {
    this.presupuestoDirector.selectPresupuesto$.subscribe((resultado)=>{
      if (resultado != undefined) 
      {
        this.id = resultado.Codigo;
        this.consultar(this.id);
      }
      
    });

  }

  
  openModal(modalName: string) {
    $(modalName).modal();
  }

  consultar(id:number): void {
   this.presupuestoDirectorService.consultarHistorial(id).subscribe((result)=>{
      this.listaHistorial = result;
   });
  }

  salir() {
    $('#modalHistorial').modal('hide');
  }

}
