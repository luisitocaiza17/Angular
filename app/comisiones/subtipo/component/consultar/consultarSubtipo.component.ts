import { Component, OnInit } from '@angular/core';
import { SubtipoFilter } from '../../model/subtipoFilter';
import { PaginationService } from '../../../../utils/pagination.service';
import { Subtipo} from '../../model/subtipo';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AutorizacionService } from '../../../../common/servicios/autorizacion.service';
import { SubtipoService } from '../../service/subtipo.service';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { TipoService } from '../../../tipo/service/tipo.service';
import { Tipo } from '../../../tipo/model/Tipo';


@Component({
  selector: 'app-consultar-subtipo',
  templateUrl: './consultarSubtipo.component.html'
})
export class ConsultarSubtipoComponent extends PaginationService implements OnInit {

  filter: SubtipoFilter;
  nombreEstado:string;
  listaEstados:object;
  listaSubtipo: Subtipo[];
  tempSubtipoEditado: Subtipo;
  subtipoSelectedTable: Subtipo;
  listaTipos: Tipo[];

  private SubtipoKey: BehaviorSubject<Subtipo> = new BehaviorSubject<Subtipo>(null);
  selectSubtipo$: Observable<Subtipo> = this.SubtipoKey.asObservable();

  constructor(private autorizacionService: AutorizacionService, public subtipoService: SubtipoService, 
    private authService: AuthService, private constantes:ConstantesComisiones , private tipoService:TipoService) {
    super();
    this.filter = new SubtipoFilter();
    this.filter.CodigoTipo = 0;
    this.listaSubtipo = [];
    this.nombreEstado = "";
    this.subtipoSelectedTable = new Subtipo();
    this.tempSubtipoEditado = new Subtipo();
    this.listaTipos = [];
  }

  limpiar(): void {
    this.filter = new SubtipoFilter();
    this.filter.CodigoTipo = 0;
    this.autorizacionService.resetDefaultPaginationConstanst();
  }
  
  pageChanged(): void {
    this.consultar();
  }

  ngOnInit() {
    this.loadEstados();
    this.obtenerTipos();
  }

  loadEstados() {
    this.listaEstados = this.constantes.ESTADO_OBJETO;
  }

  obtenerTipos(){
    this.tipoService.getAllTipos().subscribe((result)=>{
      this.listaTipos = result;
    });  
  }

  openModal(modalName: string) {
    $(modalName).modal();
  }

  consultar() {
    this.subtipoService.consultarSubtipo(this.filter).subscribe(
      result => {
        this.listaSubtipo = result;
      },
      error => this.authService.showErrorPopup(error)
    );
  }

  activarEstado(ventana:string) {
    if (this.subtipoSelectedTable.Estado != undefined) {
      if (this.subtipoSelectedTable.Estado) {
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
    if (this.subtipoSelectedTable != null) {
      if (!this.subtipoSelectedTable.Estado) {
        this.authService.showErrorPopup("Ya se encuentra Inactivo")
      } else {
        this.cargarObjecto(false);
        this.openModal(ventana);
      }  
    }else{
      this.consultar();
    }
    
  }

  seleccionar(subtipoSelected: Subtipo): void {
    if (this.listaSubtipo != undefined) {
      this.listaSubtipo.forEach(element => {
        element.Selected = false;
      });
    }
    subtipoSelected.Selected = true;
    this.subtipoSelectedTable = subtipoSelected;
    this.tempSubtipoEditado.Nombre = this.subtipoSelectedTable.Nombre;
  }


  cargarObjecto(accion:boolean){
    var key = new Subtipo();
        key.Nombre = this.subtipoSelectedTable.Nombre;
        key.Codigo = this.subtipoSelectedTable.Codigo;
        key.Estado = accion;
        this.SubtipoKey.next(key);
        
  }

  cargarHistorial(ventana:string, selected:Subtipo):void{
    this.seleccionar(selected);
    if(this.subtipoSelectedTable != null){
      this.cargarObjecto(this.subtipoSelectedTable.Estado);
      this.openModal(ventana);
    }
  }


}


  
