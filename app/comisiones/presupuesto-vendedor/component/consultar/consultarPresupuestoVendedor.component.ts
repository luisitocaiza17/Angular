import { Component, OnInit } from '@angular/core';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { PresupuestoVendedorFilter } from '../../model/presupuestoVendedorFilter';
import { AutorizacionService } from '../../../../common/servicios/autorizacion.service';
import { PresupuestoVendedor } from '../../model/presupuestoVendedor';
import { AuthService } from '../../../../seguridad/auth.service';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PresupuestoVendedorService } from '../../services/presupuesto-vendedor.service';
import { SucursalDeRegion, FormatoFecha } from '../../../../common/model/genericos';
import { ContratoKey } from '../../../../common/model/contrato';
import { Region } from '../../../../common/model/region';
import { Subtipo } from '../../../subtipo/model/subtipo';
import { Tipo } from '../../../tipo/model/Tipo';
import { GenericosService } from '../../../../common/servicios/genericos.service';
import { SubtipoService } from '../../../subtipo/service/subtipo.service';
import { TipoService } from '../../../tipo/service/tipo.service';
import { RegionService } from '../../../../common/servicios/region.service';
import { Rangos } from '../../../rangos/model/Rangos';
import { RangosService } from '../../../rangos/services/rangos.service';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-consultarPresupuestoVendedor',
  templateUrl: './consultarPresupuestoVendedor.component.html'
})
export class ConsultarPresupuestoVendedorComponent implements OnInit {
  filter: PresupuestoVendedorFilter;
  listaEstados: object;
  presupuestoSelectedTable: PresupuestoVendedor;
  listaPresupuestoVendedor: PresupuestoVendedor[];
  tempPresupuestoEditado: PresupuestoVendedor;
  sucursalesDeRegion: SucursalDeRegion[]; 
  contratoKey: ContratoKey;
  listaRegiones: Region[];
  codigoRegion:string;
  listaSubtipos:Subtipo[];
  listaTipos: Tipo[];
  idsubtipo:number;
  listaRangos: Rangos[];
  idSucursal:number;


  private PresupuestoKey: BehaviorSubject<PresupuestoVendedor> = new BehaviorSubject<PresupuestoVendedor>(null);
  selectPresupuesto$: Observable<PresupuestoVendedor> = this.PresupuestoKey.asObservable();

  constructor(private constantes: ConstantesComisiones, private autorizacionService: AutorizacionService,
    private authService: AuthService, public presupuestoVendedorService: PresupuestoVendedorService,
    private tipoService:TipoService, private subtipoService:SubtipoService, private genericosService: GenericosService,
    private regionService:RegionService, private rangoService: RangosService) {
    this.presupuestoSelectedTable = new PresupuestoVendedor();
    this.filter = new PresupuestoVendedorFilter();
    this.listaPresupuestoVendedor = [];
    this.listaEstados = [];
    this.tempPresupuestoEditado = new PresupuestoVendedor();
    this.listaTipos = [];
    this.listaSubtipos = [];
    this.contratoKey = new ContratoKey();
    this.listaRangos = [];
  }

  ngOnInit() {
    this.obtenerTipos();
    this.loadEstados();
    this.loadRegiones();
  }

  loadEstados() {
    this.listaEstados = this.constantes.ESTADO_OBJETO;
  }

  obtenerTipos(){
    this.tipoService.getAllTipos().subscribe((result)=>{
      this.listaTipos = result;
    });
  }

  loadRango(event:any) {
    this.idsubtipo = event.target.value;
    if(this.idSucursal == undefined){
      this.idSucursal = 0;
    }
    this.rangoService.getRango(this.idsubtipo,this.idSucursal, 0).subscribe(
      (result) => {
        this.listaRangos = result;
      });
  }

  cargarSubtipo(event:any){
    this.idsubtipo = event.target.value;
    this.subtipoService.getSubtipoByTipos(this.idsubtipo).subscribe((result)=>{
      this.listaSubtipos = result;
    })
  }

  limpiar(): void {
    this.filter = new PresupuestoVendedorFilter();
    this.autorizacionService.resetDefaultPaginationConstanst();
  }

  openModal(modalName: string) {
    $(modalName).modal();
  }

  cargarSucursal(event:any){
    this.contratoKey.CodigoRegion = event.target.value;
    this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result)=>{
      this.sucursalesDeRegion = result;
    });
  }

  loadRegiones(){
    this.regionService.getAll().subscribe((result)=>{
      this.listaRegiones = result;
    });
  }


  activarEstado(ventana: string) {
    if (this.presupuestoSelectedTable.Estado != undefined) {
      if (this.presupuestoSelectedTable.Estado) {
        this.authService.showErrorPopup("Ya se encuentra Activo")
      } else {
        this.cargarObjecto(true);
        this.openModal(ventana);
      }
    } else {
      this.consultar();
    }
  }

  desactivarEstado(ventana: string) {
    if (this.presupuestoSelectedTable != null) {
      if (!this.presupuestoSelectedTable.Estado) {
        this.authService.showErrorPopup("Ya se encuentra Inactivo")
      } else {
        this.cargarObjecto(false);
        this.openModal(ventana);
      }
    } else {
      this.consultar();
    }

  }

  pageChanged(): void {
    this.consultar();
  }

  consultar() {
    this.presupuestoVendedorService.consultarPresupuesto(20, this.filter).subscribe(
      result => {
        this.listaPresupuestoVendedor = result;
        for (let i = 0 ; i< this.listaPresupuestoVendedor.length; i++) {
          switch(this.listaPresupuestoVendedor[i].TipoPresupuesto){
            case 1:
              this.listaPresupuestoVendedor[i].DescripcionTipoPresupuesto = "Normal";
              break;
            case 2:
              this.listaPresupuestoVendedor[i].DescripcionTipoPresupuesto = "Vacaciones hasta 7 días";
              break;
            case 3:
              this.listaPresupuestoVendedor[i].DescripcionTipoPresupuesto =  "Vacaciones más de 7 días";
              break;
            case 4:
              this.listaPresupuestoVendedor[i].DescripcionTipoPresupuesto =  "Ausentismo hasta 7 días";
              break;
            case 5:
              this.listaPresupuestoVendedor[i].DescripcionTipoPresupuesto = "Ausentismo más de 7 días";
              break;
            case 6:
              this.listaPresupuestoVendedor[i].DescripcionTipoPresupuesto = "Doble pago servicios adicionales";
              break;
          }
        }
      },
      error => this.authService.showErrorPopup(error)
    );

  }

  seleccionar(presupuestoSelected: PresupuestoVendedor): void {
    if (this.listaPresupuestoVendedor != undefined) {
      this.listaPresupuestoVendedor.forEach(element => {
        element.Selected = false;
      });
    }
    presupuestoSelected.Selected = true;
    this.presupuestoSelectedTable = presupuestoSelected;
  }

  cargarObjecto(accion: boolean) {
    var key = new PresupuestoVendedor();
        key.Codigo = this.presupuestoSelectedTable.Codigo;
        key.Desde = this.presupuestoSelectedTable.Desde;
        key.Hasta = this.presupuestoSelectedTable.Hasta;
        key.Comodin = this.presupuestoSelectedTable.Comodin;
        key.rangosEntity = this.presupuestoSelectedTable.rangosEntity;
        key.Porcentaje = this.presupuestoSelectedTable.Porcentaje;
        key.Estado = accion;
        this.PresupuestoKey.next(key);
  }

  cargarHistorial(ventana: string, listaSelected: PresupuestoVendedor): void {
    this.seleccionar(listaSelected); 
    if (this.presupuestoSelectedTable != null) {
      this.cargarObjecto(this.presupuestoSelectedTable.Estado);
      this.openModal(ventana);
    }
  }
  
}
