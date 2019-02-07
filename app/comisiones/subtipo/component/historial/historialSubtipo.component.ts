import { Component, OnInit } from '@angular/core';
import { SubtipoService } from '../../service/subtipo.service';
import { HistorialSubtipo } from '../../model/HistorialSubtipo';
import { ConsultarSubtipoComponent } from '../consultar/consultarSubtipo.component';
import { AuthService } from '../../../../seguridad/auth.service';

@Component({
  selector: 'app-historial-subtipo',
  templateUrl: './historialSubtipo.component.html'
})
export class HistorialSubtipoComponent implements OnInit {
  
  listaHistorial:HistorialSubtipo;
  
  constructor(private authService: AuthService,private subtipoService:SubtipoService, private consultarSubtipo:ConsultarSubtipoComponent) { 
    this.listaHistorial = new HistorialSubtipo();
  }


  ngOnInit() {
    this.consultarSubtipo.selectSubtipo$.subscribe((resultado)=>{
      let id = 0;
      console.log(resultado); 
      if (resultado != undefined) 
      {
        id = resultado.Codigo;
        this.consultar(id);
      }
      
    });

  }

  
  openModal(modalName: string) {
    $(modalName).modal();
  }

  consultar(id:number): void {
   this.subtipoService.consultarHistorial(id).subscribe((result)=>{
      this.listaHistorial = result;
   });
  }

  salir() {
    $('#modalHistorial').modal('hide');
  }
}
