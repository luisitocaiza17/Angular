import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Tipo } from '../../model/Tipo';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { ObservacionTipo } from '../../model/ObservacionTipo';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { TipoService } from '../../service/tipo.service';
import { ConsultarTipoComponent } from '../consultar/consultarTipo.component';
import { RegionService } from '../../../../common/servicios/region.service';
import { NivelesService } from '../../../niveles/service/niveles.service';
import { SubtipoService } from '../../../subtipo/service/subtipo.service';
import { Niveles } from '../../../niveles/model/Niveles';
import { Subtipo } from '../../../subtipo/model/subtipo';
import { Region } from '../../../../common/model/region';

@Component({
  selector: 'app-ingresar-tipo',
  templateUrl: './ingresarTipo.component.html'
})
export class IngresarTipoComponent implements OnInit {

  nombre: string;
  estado: string;
  tipo: Tipo;
  listaEstados: CatalogoEstados[];
  observacion: ObservacionTipo;
  identificadorTipo: number;
  descripcionObservacion: string;
  listaNombres: String[];
  estadoNombre: boolean;
  listaNiveles: Niveles[];
  listaSubtipos: Subtipo[];
  regiones:Region[];
  @Output() eventoGuardarTipo = new EventEmitter();
  seGuardo: boolean = false;

  constructor(private authService:AuthService, private constantes:ConstantesComisiones, private tipoService:TipoService, 
    public consultarTipo:ConsultarTipoComponent, private regionService:RegionService, private nivelService:NivelesService, private subtipoService:SubtipoService) { 
    this.observacion = new ObservacionTipo();
    this.tipo = new Tipo();
    this.nombre = "";
    this.descripcionObservacion = "";
    this.estadoNombre = false;   
    this.listaNombres = []; 
    this.listaNiveles=[];
    this.listaSubtipos=[];
    this.regiones = [];
  }

  ngOnInit() {
    this.obtenerNiveles();
    this.obtenerRegiones();
    this.obtenerSubtipos();  
    this.estadoNombre = false;
   
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

  crearTipo(){
    let nombreIndice;
    if(this.listaNombres.length > 0){
      nombreIndice = 0;
      nombreIndice = this.listaNombres.indexOf(this.tipo.Nombre.toUpperCase());  
    }
    if (nombreIndice >= 0 ) {
      this.authService.showErrorPopup("El Nombre ya existe");
    }else {
      this.tipo.EstadoTipo = true;
      this.tipoService.insertarTipo(this.tipo)
        .subscribe(respuesta => {
          this.identificadorTipo = respuesta;
          this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
          this.seGuardo = true;
          this.eventoGuardarTipo.emit(this.seGuardo);
         },
          error => this.authService.showErrorPopup(error)
        );
    }
    this.limpiar();
    this.salir();

  }

  
  obtenerRegiones(){
    this.regionService.getAll()
      .subscribe(regiones => {
        this.regiones = regiones;
      },
        error => this.authService.showErrorPopup(error));
  }

  obtenerNiveles(){
    this.nivelService.getAllNiveles().subscribe((result)=>{
      this.listaNiveles = result;
    });  
  }
  
  obtenerSubtipos(){
    this.subtipoService.getAllSubtipos().subscribe((result)=>{
      this.listaSubtipos = result;
    });  
  }
  
  limpiar() {
    this.tipo = new Tipo();
    this.estadoNombre = false;
    this.observacion = new ObservacionTipo();
    
  }

  cargarNombres(event:any){
    this.tipoService.consultarNombres(event.target.value).subscribe(
      (result)=>{
	      this.listaNombres = result;
    });
  }
  
  salir() {
    this.estadoNombre = false;
    this.tipo = new Tipo();
    $('#modalCrear').modal('hide');
  }



}
