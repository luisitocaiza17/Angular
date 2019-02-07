import { Component, OnInit } from '@angular/core';
import { PaginationService } from '../../../../utils/pagination.service';
import { RangosFilter } from '../../model/RangosFilter';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { Rangos } from '../../model/Rangos';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AutorizacionService } from '../../../../common/servicios/autorizacion.service';
import { RangosService } from '../../services/rangos.service';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { AuthService } from '../../../../seguridad/auth.service';
import { CanalesService } from '../../../canales/service/canales.service';
import { Canal } from '../../../../common/model/autorizacion.constant';
import { GenericosService } from '../../../../common/servicios/genericos.service';
import { SucursalDeRegion } from '../../../../common/model/genericos';
import { RegionService } from '../../../../common/servicios/region.service';
import { Region } from '../../../../common/model/region';
import { ContratoKey } from '../../../../common/model/contrato';

@Component({
  selector: 'app-consultar-rangos',
  templateUrl: './consultarRangos.component.html'
})
export class ConsultarRangosComponent extends PaginationService implements OnInit {

  filter: RangosFilter;
  nombreEstado:string;
  listaEstados:object;
  listaRangos: Rangos[];
  tempRangosEditado: Rangos;
  rangosSelectedTable: Rangos;
  listaCanales: Canal[];
  sucursalesDeRegion: SucursalDeRegion[]; 
  listaRegiones: Region[];
  contratoKey: ContratoKey;

  private RangosKey: BehaviorSubject<Rangos> = new BehaviorSubject<Rangos>(null);
  selectRangos$: Observable<Rangos> = this.RangosKey.asObservable();


  constructor(private autorizacionService: AutorizacionService, public rangosService: RangosService, 
    private authService: AuthService, private constantes:ConstantesComisiones,
    private canalesService:CanalesService, private genericosService:GenericosService, private regionService:RegionService ) {
    super();
    this.filter = new RangosFilter();
    this.listaRangos = [];
    this.nombreEstado = "";
    this.rangosSelectedTable = new Rangos();
    this.tempRangosEditado = new Rangos();
    this.listaCanales = [];
    this.sucursalesDeRegion = [];
    this.listaRegiones = [];

  }

  limpiar(): void {
    this.filter = new RangosFilter();
    this.autorizacionService.resetDefaultPaginationConstanst();
  }
  
  pageChanged(): void {
    this.consultar();
  }

  ngOnInit() {
    this.loadEstados();
    this.cargarCanales();
    this.loadRegiones();
    this.consultar();

  }

  loadRegiones(){
    this.regionService.getAll().subscribe((result)=>{
      this.listaRegiones = result;
    });
  }


  loadEstados() {
    this.listaEstados = this.constantes.ESTADO_OBJETO;
  }


  openModal(modalName: string) {
    $(modalName).modal();
  }


  consultar() {
    this.rangosService.consultarRangos(this.filter).subscribe(
      result => {
        this.listaRangos = result;
      },
      error => this.authService.showErrorPopup(error)
    );

  }

  activarEstado(ventana:string) {
    if (this.rangosSelectedTable.Estado != undefined) {
      if (this.rangosSelectedTable.Estado) {
        this.authService.showErrorPopup("Ya se encuentra Activo")
      } else {
        this.cargarObjecto(true);
        this.openModal(ventana);
      }
    }else{
      this.consultar();
    }
  }

  desactivarEstado(ventana:string) {
    if (this.rangosSelectedTable != null) {
      if (!this.rangosSelectedTable.Estado) {
        this.authService.showErrorPopup("Ya se encuentra Inactivo")
      } else {
        this.cargarObjecto(false);
        this.openModal(ventana);
      }  
    }else{
      this.consultar();
    }
    
  }

  cargarCanales(){
    this.canalesService.getAllSubCanales().subscribe((result)=>{
      this.listaCanales = result;
    });
  }

  seleccionar(rangosSelected: Rangos): void {
    if (this.listaRangos != undefined) {
      this.listaRangos.forEach(element => {
        element.Selected = false;
      });
    }
    rangosSelected.Selected = true;
    this.rangosSelectedTable = rangosSelected;
    this.tempRangosEditado.Nombre = this.rangosSelectedTable.Nombre;
  }


  cargarObjecto(accion:boolean){
    var key = new Rangos();
        key.Nombre = this.rangosSelectedTable.Nombre;
        key.Codigo = this.rangosSelectedTable.Codigo;
        key.Estado = accion;
        this.RangosKey.next(key);
  }

  cargarHistorial(ventana:string, selected:Rangos):void{
    this.seleccionar(selected);
    if(this.rangosSelectedTable != null){
      this.cargarObjecto(this.rangosSelectedTable.Estado);
      this.openModal(ventana);
    }
  }
  
  cargarSucursal(event:any){
    this.contratoKey.CodigoRegion = this.filter.CodigoRegion;
    this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result)=>{
      this.sucursalesDeRegion = result;
    });
  }

}
