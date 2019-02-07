import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Rangos } from '../../model/Rangos';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { ObservacionRangos } from '../../model/ObservacionRangos';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { RangosService } from '../../services/rangos.service';
import { ConsultarRangosComponent } from '../consultar/consultarRangos.component';
import { SubtipoService } from '../../../subtipo/service/subtipo.service';
import { TipoService } from '../../../tipo/service/tipo.service';
import { Tipo } from '../../../tipo/model/Tipo';
import { Subtipo } from '../../../subtipo/model/subtipo';
import { RegionService } from '../../../../common/servicios/region.service';
import { Region } from '../../../../common/model/region';
import { GenericosService } from '../../../../common/servicios/genericos.service';
import { SucursalDeRegion } from '../../../../common/model/genericos';
import { ContratoKey } from '../../../../common/model/contrato';
import { CanalesService } from '../../../canales/service/canales.service';
import { Canales } from '../../../canales/model/canales';

@Component({
  selector: 'app-ingresar-rangos',
  templateUrl: './ingresarRangos.component.html'
})
export class IngresarRangosComponent implements OnInit {

  nombre: string;
  estado: string;
  rangos: Rangos;
  listaEstados: CatalogoEstados[];
  observacion: ObservacionRangos;
  identificadorRangos: number;
  descripcionObservacion: string;
  listaNombres: String[];
  estadoNombre: boolean;
  listaTipos: Tipo[];
  listaSubtipos: Subtipo[];
  listaRegiones: Region[];
  listaCanales: Canales[];
  sucursalesDeRegion: SucursalDeRegion[]; 
  contratoKey: ContratoKey;
  idsubtipo:number;

  @Output() eventoGuardarRangos = new EventEmitter();
  seGuardo: boolean = false;

  constructor(private authService:AuthService, private constantes:ConstantesComisiones, private rangosService:RangosService, 
    private tipoService:TipoService, private subtipoService:SubtipoService,
    public consultarRangos:ConsultarRangosComponent, private canalesService:CanalesService, 
    private regionService:RegionService, private genericosService: GenericosService) { 
    this.observacion = new ObservacionRangos();
    this.rangos = new Rangos();
    this.nombre = "hola";
    this.descripcionObservacion = "";
    this.estadoNombre = false;   
    this.listaNombres = []; 
    this.contratoKey = new ContratoKey();
    this.sucursalesDeRegion=[];
    this.listaCanales = []; 

  }

  ngOnInit() {
    this.estadoNombre = false;
    this.obtenerTipos(); 
    this.loadRegiones();
    this.cargarCanales();
  }

  cargarSubtipo(event:any){
    this.idsubtipo = event.target.value;
    this.subtipoService.getSubtipoByTipos(this.idsubtipo).subscribe((result)=>{
      this.listaSubtipos = result;
    })
  }

  cargarCanales(){
    this.canalesService.getAllSubCanales().subscribe((result)=>{
      this.listaCanales = result;
    });
  }

  cargarNombres(){
    this.rangosService.consultarNombres(this.rangos.CodigoTipo, this.rangos.CodigoSubtipo, this.rangos.CodigoSucursal, this.rangos.CodigoCanal)
    .subscribe((result)=>{
      this.listaNombres =result;
    });
  }

  cargarSucursal(event:any){
 
    this.contratoKey.CodigoRegion = this.rangos.CodigoRegion;
    this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result)=>{
      this.sucursalesDeRegion = result;
    });
  }

  validacionNombre(event:any){
    this.estadoNombre =false;
    let nombre ="PERIODO: " + this.rangos.PeriodoDesde.toString() + " - "+ event.target.value.toUpperCase() + " MESES";
    if(this.listaNombres.length >0){
      let nombreIndice = this.listaNombres.indexOf(nombre);
      if (nombreIndice >= 0 ) {
        this.estadoNombre = true;
      }else{
        this.estadoNombre = false;
      } 
    }
  }

  loadRegiones(){
    this.regionService.getAll().subscribe((result)=>{
      this.listaRegiones = result;
    });
  }

  crearRangos(){
    this.rangos.Nombre = "Periodo: " + this.rangos.PeriodoDesde.toString() + " - "+this.rangos.PeriodoHasta.toString() + " meses";
    let nombreIndice;
    if(this.listaNombres!=null){
      if(this.listaNombres.length > 0){
        nombreIndice = 0;
        nombreIndice = this.listaNombres.indexOf(this.rangos.Nombre.toUpperCase());  
     }
     if (nombreIndice >= 0 ) {
     this.authService.showErrorPopup("El Nombre ya existe");
     }else {
       if(this.rangos.PeriodoDesde < this.rangos.PeriodoHasta){
         this.rangos.Estado = true;
         this.rangosService.insertarRangos(this.rangos)
           .subscribe(respuesta => {
             this.identificadorRangos = respuesta;
             this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
             this.seGuardo = true;
             this.eventoGuardarRangos.emit(this.seGuardo);
            },
             error => this.authService.showErrorPopup(error)
           );
       }else{
         this.authService.showErrorPopup("Por favor revise los rangos");
       } 
     } 
    }
    this.limpiar();
    this.salir();
  }
  
  obtenerTipos(){
    this.tipoService.getAllTipos().subscribe((result)=>{
      this.listaTipos = result;
    });
  }

  limpiar() {
    this.rangos = new Rangos();
    this.observacion = new ObservacionRangos();
    
  }

  salir() {
    this.estadoNombre = false;
    this.rangos = new Rangos();
    $('#modalCrear').modal('hide');
  }

  checkValue(event:any){
    this.rangos.AplicaTransporte = event;
  }

}
