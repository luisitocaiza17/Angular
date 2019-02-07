import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { SalasFilter } from '../../model/salasFilter';
import { Salas } from '../../model/salas';
import { AuthService } from '../../../../seguridad/auth.service';
import { AutorizacionService } from '../../../../common/servicios/autorizacion.service';
import { SalasService } from '../../service/salas.service';
import { ConsultarSalasComponent } from '../consultar/consultarSalas.component';
import { ObservacionSalas } from '../../model/ObservacionSalas';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';

@Component({
  selector: 'app-editarSalas',
  templateUrl: './editarSalas.component.html'
})
export class EditarSalasComponent implements OnInit {


  observacionSala: ObservacionSalas;
  tempSalaEditado: Salas;
  listaEstados:CatalogoEstados[];
  editarSalas: Salas;
  tempObservacion:ObservacionSalas;

  @Output() eventoGuardarSala = new EventEmitter(); 
  seGuardo: boolean = false; 
  constructor(private consultarSala: ConsultarSalasComponent, private authService: AuthService,
    private salasService: SalasService, private autorizacionService: AutorizacionService, private constantes:ConstantesComisiones) {
    this.tempSalaEditado = new Salas();
    this.tempObservacion = new ObservacionSalas();
  }


  ngOnInit() {
    this.loadEstados();
    this.consultarSala.selectSala$.subscribe(
      (result) => {
        if (result != undefined) {
          this.tempSalaEditado.Codigo = result.Codigo;
          this.tempSalaEditado.Abreviacion = result.Abreviacion;
          this.tempSalaEditado.Nombre = result.Nombre;
          this.tempSalaEditado.Region = result.Region;
          this.tempSalaEditado.Estado = result.Estado;
          this.consultarUltimaObservacion();
        }
      }
    );
  }

  guardarObservacion(){
    this.tempObservacion.Descripcion = this.tempSalaEditado.DescripcionObservacion;
    this.tempObservacion.CodigoSala = this.tempSalaEditado.Codigo;
    this.tempObservacion.EstadoSalas = this.tempSalaEditado.Estado;
    this.salasService.agregarObservacion(this.tempObservacion).subscribe(result =>{
      this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
      this.seGuardo = true; 
      this.eventoGuardarSala.emit(this.seGuardo);

    }, error => this.authService.showErrorPopup(error));
    this.limpiar();
    this.salir();

  }

  
  limpiar() {
    this.observacionSala = new ObservacionSalas();
    this.tempSalaEditado = new Salas();
  
  }


  loadEstados(){
    this.listaEstados = this.constantes.ESTADO_OBJETO;
  }

  openModal(modalName: string) {
    $(modalName).modal();
  }

  consultarUltimaObservacion() {
    this.salasService.consultarUltimaObservacion(this.tempSalaEditado.Codigo).subscribe(
      result => {
        this.observacionSala = result;
        this.tempSalaEditado.DescripcionObservacion = this.observacionSala.Descripcion;
      },
      error => this.authService.showErrorPopup(error)
    );
  }


  salir() {
    $('#modalEditar').modal('hide');
  }
}
