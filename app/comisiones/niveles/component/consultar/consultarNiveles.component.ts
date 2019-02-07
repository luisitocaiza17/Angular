import { Component, OnInit } from '@angular/core';
import { PaginationService } from 'ngx-pagination';
import { NivelesFilter } from '../../model/nivelesFilter';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { Niveles } from '../../model/Niveles';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AutorizacionService } from '../../../../common/servicios/autorizacion.service';
import { NivelesService } from '../../service/niveles.service';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { AuthService } from '../../../../seguridad/auth.service';
@Component({
  selector: 'app-consultar-niveles',
  templateUrl: './consultarNiveles.component.html'
})
export class ConsultarNivelesComponent implements OnInit {

  filter: NivelesFilter;
  nombreEstado: string;
  listaEstados:object;
  listaNiveles: Niveles[];
  listaNivelesRec: Niveles[];
  

  tempNivelesEditado: Niveles;
  nivelesSelectedTable: Niveles;
  listaNombres: string[];
  
  private NivelesKey: BehaviorSubject<Niveles> = new BehaviorSubject<Niveles>(null);
  selectNiveles$: Observable<Niveles> = this.NivelesKey.asObservable();

  private ListaNivelesKey: BehaviorSubject<Niveles[]> = new BehaviorSubject<Niveles[]>(null);
  selectListaNiveles$: Observable<Niveles[]> = this.ListaNivelesKey.asObservable();

  private ListaNombresKey: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(null);
  selectListaNombres$: Observable<string[]> = this.ListaNombresKey.asObservable();

  

  constructor(private autorizacionService: AutorizacionService, public nivelesService: NivelesService,
    private authService: AuthService, private constantes: ConstantesComisiones) {
    this.filter = new NivelesFilter();
    this.listaNiveles = [];
    this.listaNivelesRec = [];
    this.nombreEstado = "";
    this.nivelesSelectedTable = new Niveles();
    this.tempNivelesEditado = new Niveles();
    this.listaNombres = [];
  }


  limpiar(): void {
    this.filter = new NivelesFilter();
    this.autorizacionService.resetDefaultPaginationConstanst();
  }

  pageChanged(): void {
    this.consultar();
  }

  ngOnInit() {
    this.loadEstados();
    this.enviarNombres();
    this.enviarNiveles();
  }

  loadEstados() {
    this.listaEstados = this.constantes.ESTADO_OBJETO;
  }

  openModal(modalName: string) {
    $(modalName).modal();
  }

  consultarNombres(): void {
    this.nivelesService.consultarNombres().subscribe(
      nombres => {
        this.listaNombres = nombres;
      }, error => this.authService.showErrorPopup(error));
  }

  consultar() {
    this.nivelesService.consultarNiveles(this.filter).subscribe(
      result => {
        this.listaNiveles = result;
        for(let i=0;i<this.listaNiveles.length; i++){
          if(this.listaNiveles[i].NivelPadre==null){
            this.listaNiveles[i].NivelPadre = new Niveles();
          }
        }
      },
      error => this.authService.showErrorPopup(error)
    );

  }

  activarEstado(ventana: string) {
    if (this.nivelesSelectedTable.Estado != undefined) {
      if (this.nivelesSelectedTable.Estado) {
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
    if (this.nivelesSelectedTable != null) {
      if (!this.nivelesSelectedTable.Estado) {
        this.authService.showErrorPopup("Ya se encuentra Inactivo")
      } else {
        this.cargarObjecto(false);
        this.openModal(ventana);
      }
    } else {
      this.consultar();
    }

  }

    seleccionar(nivelesSelected: Niveles): void {
      if(this.listaNiveles != undefined) {
      this.listaNiveles.forEach(element => {
        element.Selected = false;
      });
    }
    nivelesSelected.Selected = true;
    this.nivelesSelectedTable = nivelesSelected;
    this.tempNivelesEditado.Nombre = this.nivelesSelectedTable.Nombre;
  }



  cargarObjecto(accion: boolean) {
    var key = new Niveles();
    key.Nombre = this.nivelesSelectedTable.Nombre;
    key.Codigo = this.nivelesSelectedTable.Codigo;
    key.Estado = accion;
    this.NivelesKey.next(key);

  }

  cargarHistorial(ventana: string, selected: Niveles): void {
    this.seleccionar(selected);
    if (this.nivelesSelectedTable != null) {
      this.cargarObjecto(this.nivelesSelectedTable.Estado);
      this.openModal(ventana);
    }
  }

  enviarNiveles(){
    this.nivelesService.getAllNiveles().subscribe(
      (result)=>{
        this.listaNivelesRec = result
        this.ListaNivelesKey.next(this.listaNivelesRec);
      }
    );
  }

  enviarNombres(){
    this.nivelesService.consultarNombres().subscribe((result)=>{
      this.listaNombres = result
      this.ListaNombresKey.next(this.listaNombres);
    });
  }

}


