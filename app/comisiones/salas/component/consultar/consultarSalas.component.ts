import { Component, OnInit } from '@angular/core';
import { SalasService } from '../../service/salas.service';
import { SalasFilter } from '../../model/salasFilter';
import { Region } from '../../../../common/model/region';
import { Salas} from '../../model/salas';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { RegionService } from '../../../../common/servicios/region.service';
import { AuthService } from '../../../../seguridad/auth.service';
import { AutorizacionService } from '../../../../common/servicios/autorizacion.service';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PaginationService } from 'ngx-pagination';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { ContratoKey } from '../../../../common/model/contrato';
import { SucursalDeRegion } from '../../../../common/model/genericos';
import { GenericosService } from '../../../../common/servicios/genericos.service';
@Component({
  selector: 'app-consultarSalas',
  templateUrl: './consultarSalas.component.html'
})
export class ConsultarSalasComponent extends PaginationService implements OnInit {

  tempSalaEditado: Salas;
  salasSelectedTable: Salas;
  nombre: string;
  abreviacion: string;
  regiones: Region[];
  estado: string;
  codigoRegion: number;
  salas: Salas;
  filter: SalasFilter;
  listaSalas: Salas[];
  actualizarEstadoSalas: Salas;
  accionSeleccionada:string;
  listaAbreviaciones:string[];
  listaEstados:object;
  contratoKey: ContratoKey;
  sucursalesDeRegion: SucursalDeRegion[]; 

  

  private SalasKey: BehaviorSubject<Salas> = new BehaviorSubject<Salas>(null);
  selectSala$: Observable<Salas> = this.SalasKey.asObservable();
  

  constructor(private regionService: RegionService, private authService: AuthService,
    public salasService: SalasService, private autorizacionService: AutorizacionService, 
    private constantes:ConstantesComisiones, private genericosService:GenericosService) {
    super();
    this.nombre = "",
    this.abreviacion = "";
    this.estado = "";
    this.regiones = [];
    this.listaEstados = [];
    this.salas = new Salas();
    this.filter = new SalasFilter();
    this.tempSalaEditado = new Salas();
    this.listaSalas = [];
    this.contratoKey = new ContratoKey();
    
  }

  limpiar(): void {
    this.filter = new SalasFilter();
    this.autorizacionService.resetDefaultPaginationConstanst();
  }

  cargarEstados(){
    this.listaEstados = this.constantes.ESTADO_OBJETO;
  }

  pageChanged(): void {
    this.consultar();
}

  ngOnInit() {
    this.loadRegiones();
    this.cargarEstados();
  }

  cargarSucursal(event:any){
    this.contratoKey.CodigoRegion = event.target.value;
    this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result)=>{
      this.sucursalesDeRegion = result;
    },
    error => this.authService.showErrorPopup(error));
  }


  loadRegiones(): void {
    this.regionService.getAll()
      .subscribe(regiones => {
        this.regiones = regiones;
      },
        error => this.authService.showErrorPopup(error));
  }

  cargarHistorial(ventana:string, selected:Salas):void{
    this.seleccionar(selected);
    if(this.salasSelectedTable != null){
      this.cargarObjecto(this.salasSelectedTable.Estado);
      this.openModal(ventana);
    }
  }


  openModal(modalName: string) {
    $(modalName).modal();
  }

  


  consultar(): void {
    if(this.filter.Abreviacion!=null){
      this.filter.Abreviacion = this.filter.Abreviacion.toUpperCase();
    }
    this.salasService.consultarSalas(this.filter).subscribe(
      result => {
        this.listaSalas = result;
      },
      error => this.authService.showErrorPopup(error)
    );
  }

  activarEstado(ventana:string) {
    if (this.salasSelectedTable != null) {
      if (this.salasSelectedTable.Estado === true) {
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
    if (this.salasSelectedTable != null) {
      if (this.salasSelectedTable.Estado === false) {
        this.authService.showErrorPopup("Ya se encuentra Inactivo")
      } else {
        this.cargarObjecto(false);
        this.openModal(ventana);
      }  
    }else{
      this.consultar();
    }
    
  }

  cargarObjecto(accion:boolean){
    var key = new Salas();
        key.Abreviacion = this.salasSelectedTable.Abreviacion;
        key.Nombre = this.salasSelectedTable.Nombre;
        key.Codigo = this.salasSelectedTable.Codigo;
        key.Region = this.salasSelectedTable.Region;
        key.Estado = accion;
        this.SalasKey.next(key);
        
  }

  seleccionar(salaSelected: Salas): void {
    if (this.listaSalas != undefined) {
      this.listaSalas.forEach(element => {
        element.Selected = false;
      });
    }
    salaSelected.Selected = true;
    this.salasSelectedTable = salaSelected;
    this.tempSalaEditado.Nombre = this.salasSelectedTable.Nombre;
  }

}
