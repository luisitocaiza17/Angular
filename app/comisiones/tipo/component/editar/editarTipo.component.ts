import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ObservacionTipo } from '../../model/ObservacionTipo';
import { Tipo } from '../../model/Tipo';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { ConsultarTipoComponent } from '../consultar/consultarTipo.component';
import { AuthService } from '../../../../seguridad/auth.service';
import { TipoService } from '../../service/tipo.service';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';

@Component({
  selector: 'app-editar-tipo',
  templateUrl: './editarTipo.component.html'
})
export class EditarTipoComponent implements OnInit {

  observacionTipo: ObservacionTipo;
  tempTipoEditado: Tipo;
  listaEstados:object;
  editarSubtipo: Tipo;
  tempObservacion:ObservacionTipo;

  @Output() eventoGuardarTipo = new EventEmitter(); 
  seGuardo: boolean = false;

  ngOnInit() {

    this.consultarTipo.selectTipo$.subscribe((result)=>{
      if (result != undefined) {
        this.tempTipoEditado.Codigo = result.Codigo;
        this.tempTipoEditado.Nombre = result.Nombre;
        this.tempTipoEditado.EstadoTipo = result.EstadoTipo;
        this.consultarUltimaObservacion();
      }else{
        this.tempTipoEditado = new Tipo();
      }

    });
  }
  
  constructor(private tipoService:TipoService, private authService:AuthService, 
    private consultarTipo:ConsultarTipoComponent, private constantes: ConstantesComisiones) { 
    this.observacionTipo = new ObservacionTipo();
    this.tempObservacion = new Tipo();
    this.editarSubtipo = new Tipo();
    this.tempObservacion = new ObservacionTipo();
    this.tempTipoEditado =new Tipo();
    
  }

  consultarUltimaObservacion() {
    if(this.tempTipoEditado != undefined)
    {
      this.tipoService.consultarUltimaObservacion(this.tempTipoEditado.Codigo).subscribe(
        result => {
          this.observacionTipo = result;
          this.tempTipoEditado.Descripcion = this.observacionTipo.Descripcion;
        },
        error => this.authService.showErrorPopup(error)
      );
    }
  }


  guardarObservacion(){
    this.tempObservacion.Descripcion = this.tempTipoEditado.Descripcion;
    this.tempObservacion.Codigo = this.tempTipoEditado.Codigo;
    this.tempObservacion.Estado = this.tempTipoEditado.EstadoTipo;
    this.tipoService.agregarObservacion(this.tempObservacion).subscribe(result =>{
      this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
      this.seGuardo = true; 
      this.eventoGuardarTipo.emit(this.seGuardo);

    }, error => this.authService.showErrorPopup(error));
    this.limpiar();
    this.salir();

  }

  limpiar() {
    this.observacionTipo= new ObservacionTipo();
    this.tempTipoEditado = new Tipo();
  
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
