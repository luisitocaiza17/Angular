import { Component, OnInit, NgZone, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Premio } from '../model/premio';
import { PremioService } from '../service/premio.service';
import { AuthService } from '../../../seguridad/auth.service';
import { ConstantesComisiones } from '../../utils/ConstantesComisiones';
import { Subscription } from 'rxjs';
import { Region } from '../../../common/model/region';
import { RegionService } from '../../../common/servicios/region.service';
import { GenericosService } from '../../../common/servicios/genericos.service';
import { ContratoKey } from '../../../common/model/contrato';
import { SucursalDeRegion } from '../../../common/model/genericos';
import { Agencia } from '../model/Agencia';
import { AgenciaCompetenciaService } from '../service/agenciaCompetencia.service';
import { forEach } from '@angular/router/src/utils/collection';
import { CanalesService } from '../../canales/service/canales.service';
import { Canales } from '../../canales/model/canales';
import { ProductoEntity } from '../../../common/model/ProductoEntity';

@Component({
  //selector: 'app-premio',
  templateUrl: './premio.component.html'
})
export class PremioComponent implements OnInit {

  @ViewChild('crearPremioForm')
  crearPremioForm: any

  premio: Premio;
  premios: Premio[];
  tituloAccion: string;
  estadoRequerido: boolean;
  interval: any;
  subscription: Subscription;
  //regiones: Region[];
  listaRegiones: Region[];
  contratoKey: ContratoKey;
  codigoRegion: string;
  sucursalesDeRegion: SucursalDeRegion[];
  agencias: Agencia[];
  agencia: Agencia;
  nombre: string;
  idSucursal: number;
  agenciasAux: Agencia[];
  listaCanales:Canales[];
  listaProductos:ProductoEntity[];

  constructor(public premioService: PremioService, private authService: AuthService,
    private regionService: RegionService, private changeDetector: ChangeDetectorRef, private genericosService: GenericosService,
    private agenciaCompetenciaService: AgenciaCompetenciaService, private canalesService:CanalesService, private genericoService:GenericosService
  ) { }

  ngOnInit() {
    this.contratoKey = new ContratoKey();
    this.agencias = [];
    this.agencia = new Agencia();
    this.premio = new Premio();
    this.premios = [];
    this.obtenerPremios();
    this.loadRegiones();
    this.agenciasAux = new Array<Agencia>();
    this.listaCanales = [];
    this.cargarCanales();
    this.cargarProductos();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    clearInterval(this.interval);
  }

  loadRegiones() {
    this.regionService.getAll().subscribe((result) => {
      this.listaRegiones = result;
    });
  }

  obtenerPremios() {
    this.subscription = this.premioService.getAllPremio().subscribe((result) => {
      this.premios = result;
    });
  }

  crearPremio(modalName: string) {
    this.resetForm();
    this.premio = new Premio();
    this.premio.TipoPremio = null;
    this.premio.IdCanal = null;
    this.premio.TipoProducto = null;
    console.log(this.premio)
    this.tituloAccion = "Crear Premio";
    $(modalName).modal();
  }

  editarPremio(premioSelected: Premio, modalName: string) {
    this.resetForm();
    this.agenciaCompetenciaService.getAgenciasCompetencia(premioSelected.Id).subscribe((res) => {
      this.agencias = res;
      this.agenciasAux = Object.assign([], this.agencias);
      this.premio = Object.assign({}, premioSelected);
      this.premio.Agencias = this.agencias;
    });
    this.tituloAccion = "Editar Premio";
    $(modalName).modal();
  }

  eliminar(premioSelected: Premio, modalName: string) {
    $(modalName).modal();
    this.premio = premioSelected;
  }

  cargarCanales(){
    this.canalesService.getAllSubCanales().subscribe((result)=>{
      this.listaCanales = result;
     
    });
  }

  cargarProductos(){
    this.genericoService.cargarProductosActivos().subscribe(
      (result)=>{
        this.listaProductos = result;
    });
  }

  crearEditarPremio() {    
    if (this.premio.Id == undefined) {
      this.estadoRequerido = true;
      if (this.premio.Nombre != undefined) {
        this.estadoRequerido = false;
        if (this.agencias.length == 0) {
          this.authService.showInfoPopup("Debe ingresar al menos una agencia");
        } else {
          this.premio.Agencias = this.agencias;
          this.premioService.createPremio(this.premio).subscribe((result) => {
            this.obtenerPremios();
            this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
            this.salir("#modalCrear");
          }, error => {
            this.authService.showErrorPopup("Ha ocurrido un Error");
          });
        }
      }

    } else {
      if (this.agencias.find(x => x.Estado == true)) {
        this.premio.Agencias = this.agencias;
        this.premioService.updatePremio(this.premio).subscribe(() => {
          this.obtenerPremios();
          this.authService.showSuccessPopup("Registro Actualizado Exitosamente");
          this.salir("#modalCrear");
        }, error => {
          this.authService.showErrorPopup("Ha ocurrido un Error");
        });      
      } else {
        this.authService.showInfoPopup("Debe tener al menos una agencia");
      }
    }
  }

  salir(modalName: string) {
    $(modalName).modal('hide');
    this.agencias = [];
    this.agenciasAux = [];
  }

  borrarPremio(premio: Premio, modalName: string) {
    this.subscription.unsubscribe();
    clearInterval(this.interval);
    swal({
      title: "¿Está seguro?",
      text: "Va a eliminar el premio!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0266b1",
      confirmButtonText: "Si, eliminar"
    }, confirmed => {
      if (confirmed) {
        premio.Estado = false;
        premio.Agencias.forEach(agencia => {
          agencia.Estado = false;
        });
        this.premioService.updatePremio(premio).subscribe(result => {
          if (result) {
            this.obtenerPremios();
            this.interval = setInterval(() => {
              this.changeDetector.detectChanges();
              this.changeDetector.detach();
            }, 100);
            this.authService.showSuccessPopup("Registro Eliminado Exitosamente");
            this.salir(modalName);
          } else {
            this.authService.showErrorPopup("Ocurrió un error al eliminar el premio");
          }
        });
      }
    });
  }

  cargarSucursal() {
    this.idSucursal = null;
    this.contratoKey.CodigoRegion = this.codigoRegion;
    this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result) => {
      this.sucursalesDeRegion = result;
    });
  }

  cargarTablaAgencia() {
    if (this.idSucursal != null) {
      if (!this.agencias.find(x => x.IdSucursal == this.idSucursal)) {
        let sucursal = this.sucursalesDeRegion.find(x => x.CodigoSucursal == this.idSucursal);
        this.agencia = new Agencia();
        this.agencia.Estado = true;
        this.agencia.IdSucursal = sucursal.CodigoSucursal;
        this.agencia.NombreSucursal = sucursal.NombreSucursal;
        this.agencia.IdPremio = this.premio.Id;
        this.agenciasAux.push(this.agencia);
        this.agencias.push(this.agencia);

      } else {
        this.authService.showInfoPopup("La sucursal ya se encuentra ingresada");
      }
    }
  }

  borrarAgencia(agencia: Agencia) {
    agencia.Estado = false;
    let index = this.agenciasAux.indexOf(agencia);
    this.agenciasAux.splice(index, 1);
    if (this.premio.Id == undefined) {
      this.agencias.splice(index, 1);
    }
  }

  resetForm(): void {
    this.crearPremioForm.reset();
    this.crearPremioForm._submitted = false;
    this.codigoRegion = null;
    this.idSucursal = null;
  }
}
