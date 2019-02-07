import { Component, OnInit } from '@angular/core';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { AutorizacionService } from '../../../../common/servicios/autorizacion.service';
import { AuthService } from '../../../../seguridad/auth.service';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PresupuestoDirectorFilter } from '../../model/presupuestoDirectorFilter';
import { PresupuestoDirector } from '../../model/presupuestoDirector';
import { PresupuestoDirectorService } from '../../services/presupuesto-director.service';
import { Salas } from '../../../salas/model/salas';

@Component({
  selector: 'app-consultarPresupuestoDirector',
  templateUrl: './consultarPresupuestoDirector.component.html'
})
export class ConsultarPresupuestoDirectorComponent implements OnInit {
  filter:PresupuestoDirectorFilter;
  listaEstados:object;
  presupuestoSelectedTable: PresupuestoDirector;
  listaPresupuestoDirector: PresupuestoDirector[];
  tempPresupuestoEditado: PresupuestoDirector;
  listaNombres: string[];
  

  private PresupuestoKey: BehaviorSubject<PresupuestoDirector> = new BehaviorSubject<PresupuestoDirector>(null);
  selectPresupuesto$: Observable<PresupuestoDirector> = this.PresupuestoKey.asObservable();

  constructor(private constantes:ConstantesComisiones, private autorizacionService: AutorizacionService,
    private authService: AuthService, public presupuestoDirectorService:PresupuestoDirectorService) { 
      this.presupuestoSelectedTable= new PresupuestoDirector();
      this.filter = new PresupuestoDirectorFilter();
      this.listaPresupuestoDirector = [];
      this.listaEstados = [];
      this.tempPresupuestoEditado = new PresupuestoDirector();
      this.presupuestoSelectedTable.salasEntity = new Salas();
    
    }

  ngOnInit() {
    this.loadEstados();
  }

  loadEstados() {
    this.listaEstados = this.constantes.ESTADO_OBJETO;
  }

  limpiar(): void {
    this.filter = new PresupuestoDirectorFilter();
    this.autorizacionService.resetDefaultPaginationConstanst();
  }

  openModal(modalName: string) {
    $(modalName).modal();
  }

  activarEstado(ventana:string) {
    if (this.presupuestoSelectedTable.Estado != undefined) {
      if (this.presupuestoSelectedTable.Estado) {
        this.authService.showErrorPopup("Ya se encuentra Activo")
      } else {
        this.cargarObjecto(true);
        this.openModal(ventana);
      }
    }else{
      this.consultar();
    }
  }

  cargarHistorial(ventana: string,  listaSelected: PresupuestoDirector): void {
    this.seleccionar(listaSelected); 
    if (this.presupuestoSelectedTable != null) {
      this.cargarObjecto(this.presupuestoSelectedTable.Estado);
      this.openModal(ventana);
    }
  }


  desactivarEstado(ventana:string) {
    if (this.presupuestoSelectedTable != null) {
      if (!this.presupuestoSelectedTable.Estado) {
        this.authService.showErrorPopup("Ya se encuentra Inactivo")
      } else {
        this.cargarObjecto(false);
        this.openModal(ventana);
      }  
    }else{
      this.consultar();
    }
    
  }

  consultar(){
    this.presupuestoDirectorService.consultarPresupuesto(20, this.filter).subscribe(
      result => {
        this.listaPresupuestoDirector = result;
      },
      error => this.authService.showErrorPopup(error)
    );

  }

  seleccionar(presupuestoSelected: PresupuestoDirector): void {
    if (this.listaPresupuestoDirector != undefined) {
      this.listaPresupuestoDirector.forEach(element => {
        element.Selected = false;
      });
    }
    presupuestoSelected.Selected = true;
    this.presupuestoSelectedTable = presupuestoSelected;
  }

  cargarObjecto(accion:boolean){
    var key = new PresupuestoDirector();
        key.salasEntity = new Salas();
        key.Codigo = this.presupuestoSelectedTable.Codigo;
        key.Comodin = this.presupuestoSelectedTable.Comodin;
        key.Monto = this.presupuestoSelectedTable.Monto;
        key.salasEntity = this.presupuestoSelectedTable.salasEntity;
        key.Estado = accion;
        this.PresupuestoKey.next(key);
  }

  pageChanged(): void {
    this.consultar();
  }

  
}
