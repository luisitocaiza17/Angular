import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ObservacionSubtipo } from '../../model/ObservacionSubtipo';
import { Subtipo } from '../../model/subtipo';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { SubtipoService } from '../../service/subtipo.service';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConsultarSubtipoComponent } from '../consultar/consultarSubtipo.component';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';

@Component({
  selector: 'app-editar-subtipo',
  templateUrl: './editarSubtipo.component.html'
})
export class EditarSubtipoComponent implements OnInit {
  observacionSubtipo: ObservacionSubtipo;
  tempSubtipoEditado: Subtipo;
  listaEstados:object;
  editarSubtipo: Subtipo;
  tempObservacion:ObservacionSubtipo;

  @Output() eventoGuardarSubtipo = new EventEmitter(); 
  seGuardo: boolean = false;

  ngOnInit() {

    this.consultarSubtipo.selectSubtipo$.subscribe((result)=>{
      if (result != undefined) {
        this.tempSubtipoEditado.Codigo = result.Codigo;
        this.tempSubtipoEditado.Nombre = result.Nombre;
        this.tempSubtipoEditado.Estado = result.Estado;
        this.consultarUltimaObservacion();
      }else{
        this.tempSubtipoEditado = new Subtipo();
      }

    });
  }
  
  constructor(private subtipoService:SubtipoService, private authService:AuthService, 
    private consultarSubtipo:ConsultarSubtipoComponent,  private constantes: ConstantesComisiones) { 
    this.observacionSubtipo = new ObservacionSubtipo();
    this.tempObservacion = new Subtipo();
    this.editarSubtipo = new Subtipo();
    this.tempObservacion = new ObservacionSubtipo();
    this.tempSubtipoEditado =new Subtipo();
    
  }

  consultarUltimaObservacion() {
    if(this.tempSubtipoEditado != undefined)
    {
      this.subtipoService.consultarUltimaObservacion(this.tempSubtipoEditado.Codigo).subscribe(
        result => {
          this.observacionSubtipo = result;
          this.tempSubtipoEditado.Descripcion = this.observacionSubtipo.Descripcion;
        },
        error => this.authService.showErrorPopup(error)
      );
    }
  }


  guardarObservacion(){
    this.tempObservacion.Descripcion = this.tempSubtipoEditado.Descripcion;
    this.tempObservacion.Codigo = this.tempSubtipoEditado.Codigo;
    this.tempObservacion.Estado = this.tempSubtipoEditado.Estado;
    this.subtipoService.agregarObservacion(this.tempObservacion).subscribe(result =>{
      this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
      this.seGuardo = true; 
      this.eventoGuardarSubtipo.emit(this.seGuardo);

    }, error => this.authService.showErrorPopup(error));
    this.limpiar();
    this.salir();

  }

  limpiar() {
    this.observacionSubtipo= new ObservacionSubtipo();
    this.tempSubtipoEditado = new Subtipo();
  
  }

  loadEstados(){
    this.listaEstados = this.constantes.ESTADO_OBJETO;
  }


  openModal(modalName: string) {
    $(modalName).modal();
  }

  salir() {
    $('#modalEditar').modal('hide');
  }

}
