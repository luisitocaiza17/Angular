import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Niveles } from '../../model/Niveles';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { ObservacionNiveles } from '../../model/ObservacionNiveles';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { NivelesService } from '../../service/niveles.service';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConsultarNivelesComponent } from '../consultar/consultarNiveles.component';

@Component({
  selector: 'app-insertar-niveles',
  templateUrl: './insertarNiveles.component.html'
})
export class InsertarNivelesComponent implements OnInit {

  nombre: string;
  estado: string;
  niveles: Niveles;
  listaEstados: CatalogoEstados[];
  observacion: ObservacionNiveles;
  identificadorNiveles: number;
  listaNombres: String[];
  estadoNombre: boolean;
  nivel: Niveles[];
  
  @Output() eventoGuardarNiveles = new EventEmitter();
  @Output() eventoIngresarNombres = new EventEmitter();
  @Output() eventoIngresarNiveles = new EventEmitter();
  seGuardo: boolean = false;


  constructor(private authService: AuthService, private constantes: ConstantesComisiones, 
    private nivelesService: NivelesService, private consultaNiveles:ConsultarNivelesComponent) {
    this.observacion = new ObservacionNiveles();
    this.niveles = new Niveles();
    this.nivel= [];
    this.nombre = "";
    this.estadoNombre = false;
    this.listaNombres = [];
  }

  ngOnInit() {
    this.estadoNombre = false;
    this.consultaNiveles.selectListaNombres$.subscribe((result)=>{
      this.listaNombres = result;
    });
    this.consultaNiveles.selectListaNiveles$.subscribe((result)=>{
      this.nivel = result;
    });
  }


  validacionNombre(event: any) {
    this.estadoNombre =false;
    let nombre = event.target.value.toUpperCase();
    if (this.listaNombres.length>0) {
      let nombreIndice = this.listaNombres.indexOf(nombre);
      if (nombreIndice >= 0) {
        this.estadoNombre = true;
      } else {
        this.estadoNombre = false;
      }
    }
  }

  crearNiveles() {
    let nombreIndice;
    if(this.listaNombres!=null){
      if(this.listaNombres.length>0){
        nombreIndice = this.listaNombres.indexOf(this.niveles.Nombre.toUpperCase());
        nombreIndice = 0;  
      }
      if (nombreIndice > 0) {
        this.authService.showErrorPopup("El Nombre ya existe");
      } else {
        this.niveles.Estado = true;
        this.nivelesService.insertarNiveles(this.niveles)
          .subscribe(respuesta => {
            this.identificadorNiveles = respuesta;
            this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
            this.seGuardo = true;
            this.eventoGuardarNiveles.emit(this.seGuardo);
            this.eventoIngresarNombres.emit(this.seGuardo);
            this.eventoIngresarNiveles.emit(this.seGuardo);
            
          },
            error => this.authService.showErrorPopup(error)
          );
      }  
    }
    this.limpiar();
    this.salir();
  }

  limpiar() {
    this.niveles = new Niveles();
    this.observacion = new ObservacionNiveles();

  }

  salir() {
    this.niveles = new Niveles();
    this.estadoNombre =false;
    $('#modalCrear').modal('hide');
  }


}
