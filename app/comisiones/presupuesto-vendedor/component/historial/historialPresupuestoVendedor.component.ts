import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../seguridad/auth.service';
import { HistorialPresupuestoVendedor } from '../../model/historialPresupuestoVendedor';
import { PresupuestoVendedorService } from '../../services/presupuesto-vendedor.service';
import { ConsultarPresupuestoVendedorComponent } from '../consultar/consultarPresupuestoVendedor.component';

@Component({
  selector: 'app-historial-presupuesto-vendedor',
  templateUrl: './historialPresupuestoVendedor.component.html'
})
export class HistorialPresupuestoVendedorComponent implements OnInit {

 
  listaHistorial:HistorialPresupuestoVendedor[];
  id:number;

  constructor(private authService: AuthService,private presupuestoVendedorService:PresupuestoVendedorService, private presupuestoVendedor:ConsultarPresupuestoVendedorComponent) { 
    this.listaHistorial =[];
  }


  ngOnInit() {
    this.presupuestoVendedor.selectPresupuesto$.subscribe((resultado)=>{
      if (resultado != undefined) 
      {
        console.log(resultado); 
        this.id = resultado.Codigo;
        this.consultar(this.id);
      }
      
    });

  }

  
  openModal(modalName: string) {
    $(modalName).modal();
  }

  consultar(id:number): void {
   this.presupuestoVendedorService.consultarHistorial(id).subscribe((result)=>{
     if(this.listaHistorial!=null){
      this.listaHistorial = result;
     }
   }, error => this.authService.showErrorPopup(error));
  }

  salir() {
    $('#modalHistorial').modal('hide');
  }

}
