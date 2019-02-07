import { Component, OnInit } from '@angular/core';
import { CanalesFilter } from '../../model/canalesFilter';
import { CatalogoEstados } from '../../../../common/model/catalogoEstados';
import { Canales, CanalesMostrar } from '../../model/canales';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AutorizacionService } from '../../../../common/servicios/autorizacion.service';
import { CanalesService } from '../../service/canales.service';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { PaginationService } from 'ngx-pagination';

@Component({
  selector: 'app-consultar-canales',
  templateUrl: './consultarCanales.component.html'
})
export class ConsultarCanalesComponent extends PaginationService implements OnInit {

  filter: CanalesFilter;
  nombreEstado:string;
  listaEstados:object;
  listaCanales: Canales[];
  tempCanalesEditado: Canales;
  canalesSelectedTable: CanalesMostrar;
  listaNombres: string[];
  

  private CanalesKey: BehaviorSubject<Canales> = new BehaviorSubject<Canales>(null);
  selectCanales$: Observable<Canales> = this.CanalesKey.asObservable();

  private ListaNombresKey: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(null);
  selectListaNombres$: Observable<string[]> = this.ListaNombresKey.asObservable();

  constructor(private autorizacionService: AutorizacionService, public canalesService: CanalesService, 
    private authService: AuthService, private constantes:ConstantesComisiones ) {
    super();
    this.filter = new CanalesFilter();
    this.listaCanales = [];
    this.nombreEstado = "";
    this.canalesSelectedTable = new CanalesMostrar();
    this.tempCanalesEditado = new Canales();
  }

  limpiar(): void {
    this.filter = new CanalesFilter();
    this.autorizacionService.resetDefaultPaginationConstanst();
  }
  
  pageChanged(): void {
    this.consultar();
  }

  ngOnInit() {
    this.loadEstados();
    this.enviarNombres();
  }

  loadEstados() {
    this.listaEstados = this.constantes.ESTADO_OBJETO;
  }

  openModal(modalName: string) {
    this.consultarNombres();
    $(modalName).modal();
  }

  consultarNombres(): void {
    this.canalesService.consultarNombres().subscribe(
      nombres => {
        this.listaNombres = nombres;
      }, error => this.authService.showErrorPopup(error));
  }



  consultar() {
    this.canalesService.consultarCanales(this.filter).subscribe(
      result => {
        this.listaCanales = result;
      },
      error => this.authService.showErrorPopup(error)
    );

  }

  activarEstado(ventana:string) {
    if (this.canalesSelectedTable.Estado != undefined) {
      if (this.canalesSelectedTable.Estado) {
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
    if (this.canalesSelectedTable != null) {
      if (!this.canalesSelectedTable.Estado) {
        this.authService.showErrorPopup("Ya se encuentra Inactivo")
      } else {
        this.cargarObjecto(false);
        this.openModal(ventana);
      }  
    }else{
      this.consultar();
    }
    
  }

  seleccionar(canalesSelected: Canales): void {
    if (this.listaCanales != undefined) {
      this.listaCanales.forEach(element => {
        element.Selected = false;
      });
    }
    canalesSelected.Selected = true;
    this.canalesSelectedTable = canalesSelected;
    this.tempCanalesEditado.Nombre = this.canalesSelectedTable.Nombre;
  }


  cargarObjecto(accion:boolean){
    var key = new Canales();
        key.Nombre = this.canalesSelectedTable.Nombre;
        key.Codigo = this.canalesSelectedTable.Codigo;
        key.Estado = accion;
        key.nombres = this.listaNombres;
        if(key.nombres != undefined)
          this.CanalesKey.next(key);
        
  }

  enviarNombres(){
    this.canalesService.consultarNombres().subscribe((result)=>{
      this.listaNombres = result
      this.ListaNombresKey.next(this.listaNombres);
    });
  }

  cargarHistorial(ventana:string, canalesSelected: Canales):void{
    this.seleccionar(canalesSelected);

    if(this.canalesSelectedTable != null){
      this.cargarObjecto(this.canalesSelectedTable.Estado);
      this.openModal(ventana);
    }
  }



}
