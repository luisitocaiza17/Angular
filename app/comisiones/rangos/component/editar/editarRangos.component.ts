import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ObservacionRangos } from '../../model/ObservacionRangos';
import { Rangos } from '../../model/Rangos';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { RangosService } from '../../services/rangos.service';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConsultarRangosComponent } from '../consultar/consultarRangos.component';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';

@Component({
  selector: 'app-editar-rangos',
  templateUrl: './editarRangos.component.html'
})
export class EditarRangosComponent implements OnInit {

  observacionRangos: ObservacionRangos;
  tempRangosEditado: Rangos;
  listaEstados:object;
  editarRangos: Rangos;
  tempObservacion:ObservacionRangos;

  @Output() eventoGuardarRangos = new EventEmitter(); 
  seGuardo: boolean = false;

  ngOnInit() {

    this.consultarRangos.selectRangos$.subscribe((result)=>{
      if (result != undefined) {
        this.tempRangosEditado.Codigo = result.Codigo;
        this.tempRangosEditado.Nombre = result.Nombre;
        this.tempRangosEditado.Estado = result.Estado;
        this.consultarUltimaObservacion();
      }else{
        this.tempRangosEditado = new Rangos();
      }

    });
  }
  
  constructor(private rangosService:RangosService, private authService:AuthService, 
    private consultarRangos:ConsultarRangosComponent,  private constantes:ConstantesComisiones) { 
    this.observacionRangos = new ObservacionRangos();
    this.tempObservacion = new Rangos();
    this.editarRangos = new Rangos();
    this.tempObservacion = new ObservacionRangos();
    this.tempRangosEditado =new Rangos();
    
  }

  consultarUltimaObservacion() {
    if(this.tempRangosEditado != undefined)
    {
      this.rangosService.consultarUltimaObservacion(this.tempRangosEditado.Codigo).subscribe(
        result => {
          this.observacionRangos = result;
          this.tempRangosEditado.Descripcion = this.observacionRangos.Descripcion;
        },
        error => this.authService.showErrorPopup(error)
      );
    }
  }


  guardarObservacion(){
    this.tempObservacion.Descripcion = this.tempRangosEditado.Descripcion;
    this.tempObservacion.Codigo = this.tempRangosEditado.Codigo;
    this.tempObservacion.Estado = this.tempRangosEditado.Estado;
    this.rangosService.agregarObservacion(this.tempObservacion).subscribe(result =>{
      this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
      this.seGuardo = true; 
      this.eventoGuardarRangos.emit(this.seGuardo);

    }, error => this.authService.showErrorPopup(error));
    this.limpiar();
    this.salir();

  }

  limpiar() {
    this.observacionRangos= new ObservacionRangos();
    this.tempRangosEditado = new Rangos();
  
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
