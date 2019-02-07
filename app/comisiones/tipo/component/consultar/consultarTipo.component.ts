import { Component, OnInit } from '@angular/core';
import { TipoFilter } from '../../model/tipoFilter';
import { Tipo} from '../../model/Tipo';
import { SubtipoService } from '../../../subtipo/service/subtipo.service';
import { RegionService } from '../../../../common/servicios/region.service';
import { NivelesService } from '../../../niveles/service/niveles.service';
import { Region } from '../../../../common/model/region';
import { AuthService } from '../../../../seguridad/auth.service';
import { Niveles } from '../../../niveles/model/Niveles';
import { Subtipo } from '../../../subtipo/model/subtipo';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { TipoService } from '../../service/tipo.service';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AutorizacionService } from '../../../../common/servicios/autorizacion.service';


@Component({
  selector: 'app-consultar-tipo',
  templateUrl: './consultarTipo.component.html'
})
export class ConsultarTipoComponent implements OnInit {
  regiones:Region[];
  filter:TipoFilter;
  listaTipos: Tipo[];
  listaNiveles: Niveles[];
  listaEstados:object;
  nombreEstado:string;
  tempTipoEditado: Tipo;
  tipoSelectedTable: Tipo;

  private TipoKey: BehaviorSubject<Tipo> = new BehaviorSubject<Tipo>(null);
  selectTipo$: Observable<Tipo> = this.TipoKey.asObservable();

  constructor(private autorizacionService: AutorizacionService,public subtipoService:SubtipoService, public tipoService:TipoService, private regionService:RegionService, private nivelService:NivelesService,
  private authService:AuthService, private constantes:ConstantesComisiones ) { 
    this.filter = new TipoFilter();
    this.listaTipos = [];
    this.regiones = [];
    this.listaNiveles = [];
    this.nombreEstado = "";
    this.tipoSelectedTable= new Tipo();
    this.tempTipoEditado = new Tipo();  
  }

  ngOnInit() {
    this.limpiar();
    this.obtenerNiveles();
    this.loadEstados();
    console.log(this.filter);
    
  }

   
  pageChanged(): void {
    this.consultar();
  }

  consultar() {
    this.tipoService.consultarTipo(this.filter).subscribe(
      result => {
        this.listaTipos = result;
      },
      error => this.authService.showErrorPopup(error)
    );

  }

  
  loadEstados() {
    this.listaEstados = this.constantes.ESTADO_OBJETO;
  }

  limpiar(){
    this.filter = new TipoFilter();
    this.filter.CodigoNivel = 0;
    this.autorizacionService.resetDefaultPaginationConstanst();

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
  

  openModal(modalName: string) {
    $(modalName).modal();
  }


  activarEstado(ventana:string, tipo:Tipo) {
    if (this.tipoSelectedTable != undefined) {
      if (this.tipoSelectedTable.EstadoTipo) {
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
    if (this.tipoSelectedTable != null) {
      if (!this.tipoSelectedTable.EstadoTipo) {
        this.authService.showErrorPopup("Ya se encuentra Inactivo")
      } else {
        this.cargarObjecto(false);
        this.openModal(ventana);
      }  
    }else{
      this.consultar();
    }
    
  }

  
  seleccionar(tipoSelected: Tipo): void {
    if (this.listaTipos != undefined) {
      this.listaTipos.forEach(element => {
        element.Selected = false;
      });
    }
    tipoSelected.Selected = true;
    this.tipoSelectedTable = tipoSelected;
    this.tempTipoEditado.Nombre = this.tipoSelectedTable.Nombre;
  }

  cargarObjecto(accion:boolean){
    console.log(this.tipoSelectedTable);
    var key = new Tipo();
        key.Nombre = this.tipoSelectedTable.Nombre;
        key.Codigo = this.tipoSelectedTable.Codigo;
        key.EstadoTipo = accion;
        this.TipoKey.next(key);
        
  }

  cargarHistorial(ventana:string, tipoSelected:Tipo):void{
    this.seleccionar(tipoSelected);

    if(this.tipoSelectedTable != null){
      this.cargarObjecto(this.tipoSelectedTable.EstadoTipo);
      this.openModal(ventana);
    }
  }
}
