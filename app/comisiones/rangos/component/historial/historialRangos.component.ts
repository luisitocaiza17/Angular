import { Component, OnInit } from '@angular/core';
import { HistorialRangos } from '../../model/HistorialRangos';
import { AuthService } from '../../../../seguridad/auth.service';
import { RangosService } from '../../services/rangos.service';
import { ConsultarRangosComponent } from '../consultar/consultarRangos.component';

@Component({
  selector: 'app-historial-rangos',
  templateUrl: './historialRangos.component.html'
})
export class HistorialRangosComponent implements OnInit {

 
  listaHistorial:HistorialRangos;
  id:number;

  constructor(private authService: AuthService,private rangosService:RangosService, private consultarRangos:ConsultarRangosComponent) { 
    this.listaHistorial = new HistorialRangos();
  }


  ngOnInit() {
    this.consultarRangos.selectRangos$.subscribe((resultado)=>{
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
   this.rangosService.consultarHistorial(id).subscribe((result)=>{
      this.listaHistorial = result;
   });
  }

  salir() {
    $('#modalHistorial').modal('hide');
  }
}
