import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Canales } from '../../model/canales';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { ObservacionCanales } from '../../model/observacionCanales';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { CanalesService } from '../../service/canales.service';
import { ConsultarCanalesComponent } from '../consultar/consultarCanales.component';

@Component({
  selector: 'app-insertar-canales',
  templateUrl: './insertarCanales.component.html'
})
export class InsertarCanalesComponent implements OnInit {

  nombre: string;
  estado: string;
  canales: Canales;
  listaEstados: CatalogoEstados[];
  observacion: ObservacionCanales;
  identificadorCanales: number;
  descripcionObservacion: string;
  listaNombres: String[];
  estadoNombre: boolean;

  
  @Output() eventoIngresarCanales = new EventEmitter();
  seGuardo: boolean = false;

  constructor(private authService:AuthService, private constantes:ConstantesComisiones, private canalesService:CanalesService, 
    public consultarCanales:ConsultarCanalesComponent) { 
    this.observacion = new ObservacionCanales();
    this.canales = new Canales();
    this.nombre = "";
    this.descripcionObservacion = "";
    this.estadoNombre = false;   
    this.listaNombres = []; 
  }

  ngOnInit() {
    this.estadoNombre = false;
    this.consultarCanales.selectListaNombres$.subscribe((result)=>{
      this.listaNombres = result;
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

  crearCanales(){
    let nombreIndice;
    if(this.listaNombres!=null){
      if(this.listaNombres.length > 0){
        nombreIndice = 0;
        nombreIndice = this.listaNombres.indexOf(this.canales.Nombre.toUpperCase());  
      }
      if (nombreIndice >= 0 ) {
        this.authService.showErrorPopup("El Nombre ya existe");
      }else {
        this.canales.Estado = true;
        this.canalesService.insertarCanales(this.canales)
          .subscribe(respuesta => {
            this.identificadorCanales = respuesta;
            this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
            this.seGuardo = true;
            this.eventoIngresarCanales.emit(this.seGuardo);
           },
            error => this.authService.showErrorPopup(error)
          );
      }  
    }  
    this.limpiar();
    this.salir();

  }

  
  limpiar() {
    this.canales = new Canales();
    this.observacion = new ObservacionCanales();
    
  }
  
  salir() {
    this.canales = new Canales();
    this.estadoNombre = false;
    $('#modalCrear').modal('hide');
  }



}
