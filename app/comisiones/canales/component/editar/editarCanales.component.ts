import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ObservacionCanales } from '../../model/observacionCanales';
import { Canales } from '../../model/canales';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { CanalesService } from '../../service/canales.service';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConsultarCanalesComponent } from '../consultar/consultarCanales.component';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';

@Component({
  selector: 'app-editar-canales',
  templateUrl: './editarCanales.component.html'
})
export class EditarCanalesComponent implements OnInit {

  observacionCanales: ObservacionCanales;
  tempCanalesEditado: Canales;
  listaEstados:object;
  editarCanales: Canales;
  tempObservacion:ObservacionCanales;

  @Output() eventoGuardarCanales = new EventEmitter(); 
  seGuardo: boolean = false;

  ngOnInit() {

    this.consultarCanales.selectCanales$.subscribe((result)=>{
      if (result != undefined) {
        this.tempCanalesEditado.Codigo = result.Codigo;
        this.tempCanalesEditado.Nombre = result.Nombre;
        this.tempCanalesEditado.Estado = result.Estado;
        this.consultarUltimaObservacion();
      }else{
        this.tempCanalesEditado = new Canales();
      }

    });
  }
  
  constructor(private canalesService:CanalesService, private authService:AuthService, 
    private consultarCanales:ConsultarCanalesComponent, private constantes:ConstantesComisiones) { 
    this.observacionCanales = new ObservacionCanales();
    this.tempObservacion = new Canales();
    this.editarCanales = new Canales();
    this.tempObservacion = new ObservacionCanales();
    this.tempCanalesEditado =new Canales();
    
  }

  consultarUltimaObservacion() {
    if(this.tempCanalesEditado != undefined)
    {
      this.canalesService.consultarUltimaObservacion(this.tempCanalesEditado.Codigo).subscribe(
        result => {
          this.observacionCanales = result;
          this.tempCanalesEditado.Descripcion = this.observacionCanales.Descripcion;
        },
        error => this.authService.showErrorPopup(error)
      );
    }
  }


  guardarObservacion(){
    this.tempObservacion.Descripcion = this.tempCanalesEditado.Descripcion;
    this.tempObservacion.Codigo = this.tempCanalesEditado.Codigo;
    this.tempObservacion.Estado = this.tempCanalesEditado.Estado;
    this.canalesService.agregarObservacion(this.tempObservacion).subscribe(result =>{
      this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
      this.seGuardo = true; 
      this.eventoGuardarCanales.emit(this.seGuardo);

    }, error => this.authService.showErrorPopup(error));
    this.limpiar();
    this.salir();

  }

  limpiar() {
    this.observacionCanales= new ObservacionCanales();
    this.tempCanalesEditado = new Canales();
  
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
