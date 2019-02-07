import { Component, OnInit } from '@angular/core';
import { HistorialCanales } from '../../model/historialCanales';
import { AuthService } from '../../../../seguridad/auth.service';
import { CanalesService } from '../../service/canales.service';
import { ConsultarCanalesComponent } from '../consultar/consultarCanales.component';

@Component({
  selector: 'app-historial-canales',
  templateUrl: './historialCanales.component.html'
})
export class HistorialCanalesComponent implements OnInit {

  listaHistorial:HistorialCanales;
  id:number;

  constructor(private authService: AuthService,private canalesService:CanalesService, private consultarCanales:ConsultarCanalesComponent) { 
    this.listaHistorial = new HistorialCanales();
  }


  ngOnInit() {
    this.consultarCanales.selectCanales$.subscribe((resultado)=>{
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
   this.canalesService.consultarHistorial(id).subscribe((result)=>{
      this.listaHistorial = result;
   });
  }

  salir() {
    $('#modalHistorial').modal('hide');
  }
}
