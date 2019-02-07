import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Subtipo } from '../../model/subtipo';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { ObservacionSubtipo } from '../../model/ObservacionSubtipo';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { SubtipoService } from '../../service/subtipo.service';
import { ConsultarSubtipoComponent } from '../consultar/consultarSubtipo.component';
import { TipoService } from '../../../tipo/service/tipo.service';
import { Tipo } from '../../../tipo/model/Tipo';

@Component({
  selector: 'app-ingresar-subtipo',
  templateUrl: './ingresarSubtipo.component.html'
})
export class IngresarSubtipoComponent implements OnInit {
  nombre: string;
  estado: string;
  subtipo: Subtipo;
  listaEstados: CatalogoEstados[];
  listaTipos: Tipo[];
  observacion: ObservacionSubtipo;
  identificadorSubtipo: number;
  descripcionObservacion: string;
  listaNombres: String[];
  estadoNombre: boolean;

  
  @Output() eventoIngresarSubtipo = new EventEmitter();
  seGuardo: boolean = false;

  constructor(private authService:AuthService, private constantes:ConstantesComisiones, private subtipoService:SubtipoService, 
    public consultarSubtipo:ConsultarSubtipoComponent, private tipoService:TipoService) { 
    this.observacion = new ObservacionSubtipo();
    this.subtipo = new Subtipo();
    this.nombre = "";
    this.descripcionObservacion = "";
    this.estadoNombre = false;   
    this.listaNombres = [];
    this.listaTipos = []; 
  }

  ngOnInit() {
    this.obtenerTipos();
    this.estadoNombre = false;
  }

  
  obtenerTipos(){
    this.tipoService.getAllTipos().subscribe((result)=>{
      this.listaTipos = result;
    });  
  }

  validacionNombre(event:any){
    this.estadoNombre =false;
    let nombre = event.target.value.toUpperCase();
    if(this.listaNombres.length >0){
      let nombreIndice = this.listaNombres.indexOf(nombre);
      if (nombreIndice >= 0 ) {
        this.estadoNombre = true;
      }else{
        this.estadoNombre = false;
      } 
    }
  }

  cargarNombres(event:any){
    this.subtipoService.consultarNombres(event.target.value).subscribe(
      (result)=>{
        this.listaNombres = result;
      });
  }

  crearSubtipo(){
    let nombreIndice;
    if(this.listaNombres.length > 0){
      nombreIndice = 0;
      nombreIndice = this.listaNombres.indexOf(this.subtipo.Nombre.toUpperCase());  
    }
    if (nombreIndice >= 0 ) {
      this.authService.showErrorPopup("El Nombre ya existe");
    }else {
      this.subtipo.Estado = true;
      this.subtipoService.insertarSubtipo(this.subtipo)
        .subscribe(respuesta => {
          this.identificadorSubtipo = respuesta;
          this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
          this.seGuardo = true;
          this.eventoIngresarSubtipo.emit(this.seGuardo);
         },
          error => this.authService.showErrorPopup(error)
        );
    }
    this.limpiar();
    this.salir();

  }

  
  limpiar() {
    this.subtipo = new Subtipo();
    this.estadoNombre = false;
    this.observacion = new ObservacionSubtipo();
    
  }
  
  salir() {
    this.estadoNombre = false;
    this.subtipo = new Subtipo();
    $('#modalCrear').modal('hide');
  }



}
