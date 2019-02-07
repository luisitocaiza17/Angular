import { Component, OnInit } from '@angular/core';
import { Region } from '../../../../common/model/region';
import { RegionService } from '../../../../common/servicios/region.service';
import { SucursalDeRegion } from '../../../../common/model/genericos';
import { ContratoKey } from '../../../../common/model/contrato';
import { GenericosService } from '../../../../common/servicios/genericos.service';
import { PresupuestoRangosDirectorFilter, PresupuestoRangosDirectorEntity } from '../../model/presupuestoRangosDirector.model';
import { SalasService } from '../../../salas/service/salas.service';
import { Salas } from '../../../salas/model/salas';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { PresupuestoRangosDirectorService } from '../../services/presupuestoRangosDirector.service';
import { AuthService } from '../../../../seguridad/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-consultarPresupuestoRangosDirector',
  templateUrl: './consultaPresupuestoRangosDirector.component.html',
  providers: [RegionService, GenericosService, PresupuestoRangosDirectorService]
})

export class ConsultaPresupuestoRangosDirectorComponent implements OnInit {


  private PresupuestoSubject: BehaviorSubject<PresupuestoRangosDirectorEntity> = new BehaviorSubject<PresupuestoRangosDirectorEntity>(null);
  presupuestoObs$: Observable<PresupuestoRangosDirectorEntity> = this.PresupuestoSubject.asObservable();

  listaRegiones: Region[];
  sucursalesDeRegion: SucursalDeRegion[]; 
  contratoKey: ContratoKey;
  salas: Salas[]; 
  listaEstados = this.constantes.ESTADO_OBJETO;
  presupuestosRangosDirector: PresupuestoRangosDirectorEntity[]; 
  presupuestoRangosDirectorSelected: PresupuestoRangosDirectorEntity; 

  filter: PresupuestoRangosDirectorFilter;

  constructor(
    public regionService: RegionService, 
    public genericosService: GenericosService, 
    public salasService: SalasService,
    public constantes: ConstantesComisiones, 
    public presupuestoRangosDirectorService: PresupuestoRangosDirectorService,
    public authService: AuthService
    ) {
  }

  ngOnInit() {
    this.filter = new PresupuestoRangosDirectorFilter(); 
    this.contratoKey = new ContratoKey(); 
    this.sucursalesDeRegion = []; 
    this.listaRegiones = [];
    this.salas = []; 
    this.presupuestosRangosDirector = []; 
    this.presupuestoRangosDirectorSelected = new PresupuestoRangosDirectorEntity(); 
    this.loadRegiones();  
  }

  consultarPresupuestos(){ 
    this.presupuestoRangosDirectorService.consultarPresupuestos(this.filter).subscribe(
      res => { 
        this.presupuestosRangosDirector = res; 
      }, 
      error => {
        this.authService.showErrorPopup(error); 
      }
    );
  }

  activarDesactivarPresupuesto(presupuesto: PresupuestoRangosDirectorEntity){ 
    this.presupuestoRangosDirectorSelected = presupuesto; 
    this.presupuestoRangosDirectorSelected.Estado  = this.presupuestoRangosDirectorSelected.Estado === true ? false : true;
    this.ActualizarPresupuesto(); 
  }

  ActualizarPresupuesto(){ 
    this.presupuestoRangosDirectorService.actualizarPresupuestoRangosDirector(this.presupuestoRangosDirectorSelected).subscribe(
      res => { 
        if( res === true)
          this.authService.showSuccessPopup('Registro actualizado con éxito');
        else
          this.authService.showErrorPopup('Ha ocurrido un problema, por favor vuelva a intentarlo o monuníquese con el administrador del sistema');
      }, 
      error => { 
        this.authService.showErrorPopup('Ha ocurrido un problema, por favor vuelva a intentarlo o monuníquese con el administrador del sistema');
      }
    ); 
  }

  loadRegiones(){
    this.regionService.getAll().subscribe((result)=>{
      this.listaRegiones = result;
    });
  }

  cargarSucursal(event:any){
    this.contratoKey.CodigoRegion = event.target.value;
    this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result)=>{
      this.sucursalesDeRegion = result;
    });
  }

  cargarSalas() {
    this.salasService.getSalas(this.filter.CodigoSucursal).subscribe((result) => {
            this.salas = result;
        });
  }

  limpiar(){
    this.filter = new PresupuestoRangosDirectorFilter(); 
    this.presupuestosRangosDirector = []; 
  }

  cargarHistorial(){ 
    
  }

  seleccionar(presupuestoSelected: PresupuestoRangosDirectorEntity): void {
    if (this.presupuestosRangosDirector != undefined) {
      this.presupuestosRangosDirector.forEach(element => {
        element.Selected = false;
      });
    }
    presupuestoSelected.Selected = true;
    this.presupuestoRangosDirectorSelected = presupuestoSelected;

    this.PresupuestoSubject.next(this.presupuestoRangosDirectorSelected);
  }

  pageChanged(){ 
    this.consultarPresupuestos(); 
  }
  
  openModal(modalName: string) {
    $(modalName).modal();
  }

}
