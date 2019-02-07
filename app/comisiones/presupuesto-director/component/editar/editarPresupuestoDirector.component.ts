import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PresupuestoDirector } from '../../model/presupuestoDirector';
import { PresupuestoDirectorService } from '../../services/presupuesto-director.service';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConsultarPresupuestoDirectorComponent } from '../consultar/consultarPresupuestoDirector.component';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { Salas } from '../../../salas/model/salas';

@Component({
  selector: 'app-editarPresupuestoDirector',
  templateUrl: './editarPresupuestoDirector.component.html'
})
export class EditarPresupuestoDirectorComponent implements OnInit {
  tempPresupuesto: PresupuestoDirector;
  editarPresupuesto:PresupuestoDirector;
  tempPresupuestoEditado:PresupuestoDirector;


  @Output() eventoGuardarPresupuesto = new EventEmitter(); 
  seGuardo: boolean = false;


  constructor(public presupuestoService:PresupuestoDirectorService, private authService:AuthService, 
    public consultarPresupuesto:ConsultarPresupuestoDirectorComponent,  private constantes:ConstantesComisiones) { 
    this.tempPresupuesto = new PresupuestoDirector();
    this.editarPresupuesto = new PresupuestoDirector();
    this.tempPresupuestoEditado =new PresupuestoDirector();
    this.tempPresupuestoEditado.salasEntity = new Salas();
    
  }


  ngOnInit() {
   this.consultarPresupuesto.selectPresupuesto$.subscribe((result)=>{
      if (result != undefined) {
        this.tempPresupuestoEditado = new PresupuestoDirector();
        this.tempPresupuestoEditado.Codigo = result.Codigo;
        this.tempPresupuestoEditado.Estado = result.Estado;
        this.tempPresupuestoEditado.Monto = result.Monto;
        this.tempPresupuestoEditado.salasEntity  = new Salas();
        this.tempPresupuestoEditado.salasEntity  = result.salasEntity;

      }else{
        this.tempPresupuestoEditado = new PresupuestoDirector();
        this.tempPresupuestoEditado.salasEntity  = new Salas();
      }

    });
    
  }



  guardarPresupuestoDirector(){
    this.tempPresupuesto.Codigo = this.tempPresupuestoEditado.Codigo;
    this.tempPresupuesto.Estado = this.tempPresupuestoEditado.Estado;
    this.tempPresupuesto.Comodin = this.tempPresupuestoEditado.Comodin;
    this.tempPresupuesto.Monto = this.tempPresupuestoEditado.Monto;
    this.tempPresupuesto.Monto = this.tempPresupuestoEditado.Monto; 
    this.tempPresupuesto.CodigoSala = this.tempPresupuestoEditado.CodigoSala
    
    
    this.presupuestoService.actualizarPresupuesto(this.tempPresupuesto).subscribe(result =>{
      this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
      this.seGuardo = true; 
      this.eventoGuardarPresupuesto.emit(this.seGuardo);

    }, error => this.authService.showErrorPopup(error));
    this.limpiar();
    this.salir();

  }

  limpiar() {
    this.tempPresupuestoEditado = new PresupuestoDirector();
  
  }



  openModal(modalName: string) {
    $(modalName).modal();
  }

  salir() {
    $('#modalEditar').modal('hide');
  }

}


