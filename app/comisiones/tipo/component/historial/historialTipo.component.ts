import { Component, OnInit } from '@angular/core';
import { ConsultarTipoComponent } from '../consultar/consultarTipo.component';
import { TipoService } from '../../service/tipo.service';
import { AuthService } from '../../../../seguridad/auth.service';
import { HistorialTipo } from '../../model/HistorialTipo';

@Component({
  selector: 'app-historial-tipo',
  templateUrl: './historialTipo.component.html'
})
export class HistorialTipoComponent implements OnInit {

   
  listaHistorial:HistorialTipo;
  id:number;

  constructor(private authService: AuthService,private tipoService:TipoService, private consultarTipo:ConsultarTipoComponent) { 
    this.listaHistorial = new HistorialTipo();
  }


  ngOnInit() {
    this.consultarTipo.selectTipo$.subscribe((resultado)=>{ 
      if (resultado !== undefined && resultado !== null) 
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
   this.tipoService.consultarHistorial(id).subscribe((result)=>{
      this.listaHistorial = result;
   });
  }

  salir() {
    $('#modalHistorial').modal('hide');
  }

}
