import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Salas } from '../../model/salas';
import { SalasService } from '../../service/salas.service';
import { forEach } from '@angular/router/src/utils/collection';
import { ObservacionSalas } from '../../model/ObservacionSalas';
import { Region } from '../../../../common/model/region';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { RegionService } from '../../../../common/servicios/region.service';
import { AuthService } from '../../../../seguridad/auth.service';
import { ValoresBeneficiariosComponent } from '../../../../retencion/modificarBeneficiarios/valoresBeneficiarios/valoresBeneficiarios.component';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConsultarSalasComponent } from '../consultar/consultarSalas.component';
import { GenericosService } from '../../../../common/servicios/genericos.service';
import { SucursalDeRegion } from '../../../../common/model/genericos';
import { ContratoKey } from '../../../../common/model/contrato';
import { CanalesService } from '../../../canales/service/canales.service';
import { Canales } from '../../../canales/model/canales';
import { ProductoContrato } from '../../../../common/model/autorizacion.constant';
import { ProductoEntity } from '../../../../common/model/ProductoEntity';
import { SalasFilter } from '../../model/salasFilter';
import { Funcion } from '../../../../common/model/procedimiento.constant';

@Component({
  selector: 'app-salas',
  templateUrl: './salas.component.html'
})
export class SalasComponent implements OnInit {

  estadoNombre: boolean;
  estadoAbreviacion: boolean;
  nombre: string;
  abreviacion: string;
  regiones: Region[];
  estado: string;
  codigoRegion: number;
  salas: Salas;
  listaEstados: CatalogoEstados[];
  observacion: ObservacionSalas;
  listaAbreviaciones: String[];
  identificadorSalas: number;
  descripcionObservacion: string;
  listaNombres: String[];
  estadoGuardar:boolean;
  sucursalesDeRegion: SucursalDeRegion[]; 
  contratoKey: ContratoKey;
  listaCanales:Canales[];
  listaProductos:ProductoEntity[];

  hayQueja: boolean; 

  @Output() eventoGuardarSala = new EventEmitter();
  seGuardo: boolean = false;


  constructor(private regionService: RegionService, private authService: AuthService, private salasService: SalasService,
    private constantes: ConstantesComisiones, private consultarSalas: ConsultarSalasComponent, 
    private canalesService:CanalesService,
    private genericosService:GenericosService, private genericoService:GenericosService) {
    this.nombre = "",
    this.abreviacion = "";
    this.estado = "";
    this.regiones = [];
    this.salas = new Salas();
    this.observacion = new ObservacionSalas;
    this.descripcionObservacion = "";
    this.listaNombres = [] ;
    this.listaAbreviaciones = [];
    this.estadoNombre = false;
    this.estadoAbreviacion = false;
    this.estadoGuardar = true;
    this.sucursalesDeRegion=[]; 
    this.contratoKey = new ContratoKey();
    this.listaCanales = [];

  }

  limpiar() {
    this.salas = new Salas();
  }

  ngOnInit() {
    this.loadRegiones();
    this.loadEstados();
    this.cargarCanales();
    this.cargarProductos();
    this.cargarSalas();
    this.salas.CumplimientoQueja = true;
  }

  loadRegiones(): void {
    this.regionService.getAll()
      .subscribe(regiones => {
        this.regiones = regiones;
      },
        error => this.authService.showErrorPopup(error));
  }

  cargarSucursal(event:any){
    this.contratoKey.CodigoRegion = this.salas.CodigoRegion;
    this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result)=>{
      this.sucursalesDeRegion = result;
    });
  }

  cargarCanales(){
    this.canalesService.getAllSubCanales().subscribe((result)=>{
      this.listaCanales = result;
     
    });
  }

  cargarSalas(){
    let _self = this;
    this.salasService.consultarSalas(new SalasFilter()).subscribe((result)=>{
      result. forEach(function (value) {
        _self.listaNombres.push(value.Nombre);
        _self.listaAbreviaciones.push(value.Abreviacion);
      });     
    });
  }

  loadEstados() {
    this.listaEstados = this.constantes.ESTADO_OBJETO;
  }

  validacionNombre(event: any) {
    let nombre = event.target.value.toUpperCase();
    if (this.listaNombres.length > 0) {
      let nombreIndice = this.listaNombres.indexOf(nombre);
      if (nombreIndice >= 0) {
        this.estadoNombre = true;
      } else {
        this.estadoNombre = false;
      }
    }
  }

  validacionAbreviacion(event: any) {
    let abreviacion = event.target.value.toUpperCase();
    let abreviacionIndice = this.listaAbreviaciones.indexOf(abreviacion);
    if (this.listaAbreviaciones.length > 0) {
      if (abreviacionIndice >= 0) {
        this.estadoAbreviacion = true;
      } else {
        this.estadoAbreviacion = false;
      }
    }
  }

  crearSala() {
    let nombreIndice = 0;
    let validacionIndice = 0;
    if (this.listaAbreviaciones.length > 0) {
      validacionIndice = this.listaAbreviaciones.indexOf(this.salas.Abreviacion.toUpperCase());
      if (validacionIndice >= 0) {
        this.authService.showErrorPopup("La abreviación ya existe");
        this.estadoGuardar = false;
      }
      if (this.listaNombres.length > 0) {
        nombreIndice = this.listaNombres.indexOf(this.salas.Nombre.toUpperCase());
        if (nombreIndice >= 0) {
          this.authService.showErrorPopup("El Nombre ya existe");
          this.estadoGuardar = false;
        }
      }
    }
    if(this.estadoGuardar){
      this.salas.Estado = true;
    this.salasService.insertarSala(this.salas)
      .subscribe(respuesta => {
        this.cargarSalas();
        this.identificadorSalas = respuesta;
        this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
        this.seGuardo = true;
        this.eventoGuardarSala.emit(this.seGuardo);
      },
        error => this.authService.showErrorPopup(error)
      );
    }
    this.estadoGuardar = true;
    this.limpiar();
    this.salir();
  }

  salir() {
    this.salas.CumplimientoQueja = true;
    this.salas = new Salas();
    $('#modalCrear').modal('hide');
    this.estadoAbreviacion = false;
    this.estadoNombre = false;
    
  }

  cargarProductos(){
    this.genericoService.cargarProductosActivos().subscribe(
      (result)=>{
        this.listaProductos = result;
    });
  }

  guardarObservacion() {
    this.observacion.CodigoSala = this.identificadorSalas;
    this.observacion.Descripcion = this.descripcionObservacion;
  }

  toogleHayQueja(){
    this.hayQueja = this.hayQueja == true ? false : true; 
  }
}
