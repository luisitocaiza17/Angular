import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PresupuestoVendedor } from '../../model/presupuestoVendedor';
import { PresupuestoVendedorService } from '../../services/presupuesto-vendedor.service';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConsultarPresupuestoVendedorComponent } from '../consultar/consultarPresupuestoVendedor.component';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { Rangos } from '../../../rangos/model/Rangos';

@Component({
  selector: 'app-editarPresupuestoVendedor',
  templateUrl: './editarPresupuestoVendedor.component.html'
})
export class EditarPresupuestoVendedorComponent implements OnInit {
  tempPresupuesto: PresupuestoVendedor;
  editarPresupuesto:PresupuestoVendedor;
  tempPresupuestoEditado:PresupuestoVendedor;


  @Output() eventoGuardarPresupuesto = new EventEmitter(); 
  seGuardo: boolean = false;


  constructor(private presupuestoService:PresupuestoVendedorService, private authService:AuthService, 
    private consultarPresupuesto:ConsultarPresupuestoVendedorComponent,  private constantes:ConstantesComisiones) { 
    this.tempPresupuesto = new PresupuestoVendedor();
    this.editarPresupuesto = new PresupuestoVendedor();
    this.tempPresupuestoEditado =new PresupuestoVendedor();
    this.tempPresupuestoEditado.rangosEntity = new Rangos();
    
  }


  ngOnInit() {
    this.consultarPresupuesto.selectPresupuesto$.subscribe((result)=>{
      if (result != undefined) {
        this.tempPresupuestoEditado.Codigo = result.Codigo;
        this.tempPresupuestoEditado.Estado = result.Estado;
        this.tempPresupuestoEditado.Desde = result.Desde;
        this.tempPresupuestoEditado.Hasta = result.Hasta;
        this.tempPresupuestoEditado.Comodin = result.Comodin;
        this.tempPresupuestoEditado.Porcentaje = result.Porcentaje;
        this.tempPresupuestoEditado.rangosEntity = result.rangosEntity;
        
        
      }else{
        this.tempPresupuestoEditado = new PresupuestoVendedor();
      }

    });
  }

  guardarPresupuestoVendedor(){
    this.tempPresupuesto.Codigo = this.tempPresupuestoEditado.Codigo;
    this.tempPresupuesto.Estado = this.tempPresupuestoEditado.Estado;
    this.tempPresupuesto.Desde = this.tempPresupuestoEditado.Desde;
    this.tempPresupuesto.Hasta = this.tempPresupuestoEditado.Hasta;
    this.tempPresupuesto.Comodin = this.tempPresupuestoEditado.Comodin;
    
    
    this.presupuestoService.actualizarPresupuesto(this.tempPresupuesto).subscribe(result =>{
      this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
      this.seGuardo = true; 
      this.eventoGuardarPresupuesto.emit(this.seGuardo);

    }, error => this.authService.showErrorPopup(error));
    this.limpiar();
    this.salir();

  }

  limpiar() {
    this.tempPresupuestoEditado = new PresupuestoVendedor();
  
  }

  openModal(modalName: string) {
    $(modalName).modal();
  }

  salir() {
    $('#modalEditar').modal('hide');
  }

}


