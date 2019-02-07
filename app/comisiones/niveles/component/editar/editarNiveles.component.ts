import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ObservacionNiveles } from '../../model/ObservacionNiveles';
import { Niveles } from '../../model/Niveles';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { NivelesService } from '../../service/niveles.service';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConsultarNivelesComponent } from '../consultar/consultarNiveles.component';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';

@Component({
  selector: 'app-editar-niveles',
  templateUrl: './editarNiveles.component.html'
})
export class EditarNivelesComponent implements OnInit {

  observacionNiveles: ObservacionNiveles;
  tempNivelesEditado: Niveles;
  listaEstados:object;
  editarNiveles: Niveles;
  tempObservacion:ObservacionNiveles;

  @Output() eventoGuardarNiveles = new EventEmitter(); 
  seGuardo: boolean = false;

  constructor(public nivelesService:NivelesService, private authService:AuthService, 
    private consultarNiveles:ConsultarNivelesComponent,  private constantes: ConstantesComisiones) { 
    this.observacionNiveles = new ObservacionNiveles();
    this.tempObservacion = new Niveles();
    this.editarNiveles = new Niveles();
    this.tempObservacion = new ObservacionNiveles();
    this.tempNivelesEditado =new Niveles();
  }

  ngOnInit() {

    this.consultarNiveles.selectNiveles$.subscribe((result)=>{
      if (result != undefined) {
        this.tempNivelesEditado.Codigo = result.Codigo;
        this.tempNivelesEditado.Nombre = result.Nombre;
        this.tempNivelesEditado.Estado = result.Estado;
        this.consultarUltimaObservacion();
      }else{
        this.tempNivelesEditado = new Niveles();
      }

    });
  }

  
  consultarUltimaObservacion() {
  
    if(this.tempNivelesEditado != undefined)
    {
      this.nivelesService.consultarUltimaObservacion(this.tempNivelesEditado.Codigo).subscribe(
        result => {
          this.observacionNiveles = result;
          this.tempNivelesEditado.Descripcion = this.observacionNiveles.Descripcion;
        },
        error => this.authService.showErrorPopup(error)
      );
    }
  }


  guardarObservacion(){
    this.tempObservacion.Descripcion = this.tempNivelesEditado.Descripcion;
    this.tempObservacion.Codigo = this.tempNivelesEditado.Codigo;
    this.tempObservacion.Estado = this.tempNivelesEditado.Estado;
    this.nivelesService.agregarObservacion(this.tempObservacion).subscribe(result =>{
      this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
      this.seGuardo = true; 
      this.eventoGuardarNiveles.emit(this.seGuardo);

    }, error => this.authService.showErrorPopup(error));
    this.limpiar();
    this.salir();

  }


  limpiar() {
    this.observacionNiveles= new ObservacionNiveles();
    this.tempNivelesEditado = new Niveles();
  
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
