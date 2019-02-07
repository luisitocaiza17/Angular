import { Component, OnInit } from '@angular/core';
import { HistorialNiveles } from '../../model/HistorialNiveles';
import { AuthService } from '../../../../seguridad/auth.service';
import { NivelesService } from '../../service/niveles.service';
import { ConsultarNivelesComponent } from '../consultar/consultarNiveles.component';

@Component({
  selector: 'app-historial-niveles',
  templateUrl: './historialNiveles.component.html'
})
export class HistorialNivelesComponent implements OnInit {

 
  listaHistorial:HistorialNiveles;
  

  constructor(private authService: AuthService,private nivelesService:NivelesService, private consultarNiveles:ConsultarNivelesComponent) { 
    this.listaHistorial = new HistorialNiveles();
  }


  ngOnInit() {
    let id = 0;
    this.consultarNiveles.selectNiveles$.subscribe((resultado)=>{
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
   this.nivelesService.consultarHistorial(id).subscribe((result)=>{
      this.listaHistorial = result;
   });
  }

  salir() {
    $('#modalHistorial').modal('hide');
  }

}
