import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PresupuestoDirector } from '../../model/presupuestoDirector';
import { Salas } from '../../../salas/model/salas';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { PresupuestoDirectorService } from '../../services/presupuesto-director.service';
import { ConsultarPresupuestoDirectorComponent } from '../consultar/consultarPresupuestoDirector.component';
import { SalasService } from '../../../salas/service/salas.service';
import { RegionService } from '../../../../common/servicios/region.service';
import { Region } from '../../../../common/model/region';
import { ContratoKey } from '../../../../common/model/contrato';
import { GenericosService } from '../../../../common/servicios/genericos.service';
import { SucursalDeRegion } from '../../../../common/model/genericos';
import { ProductoEntity } from '../../../../common/model/ProductoEntity';

@Component({
  selector: 'app-ingresarPresupuestoDirector',
  templateUrl: './ingresarPresupuestoDirector.component.html'
})
export class IngresarPresupuestoDirectorComponent implements OnInit {

  estado: string;
  presupuesto: PresupuestoDirector;
  identificadorCanales: number;
  descripcionObservacion: string;
  listaSalas: Salas[];
  isChecked: boolean;
  idRegion:string;
  idSucursal:number;
  codigoSala:number;
  regiones:Region[];
  contratoKey: ContratoKey;
  sucursalesDeRegion: SucursalDeRegion[];
  listaProductos:ProductoEntity[];
  producto:ProductoEntity;

  @Output() eventoGuardarPresupuesto = new EventEmitter();
  seGuardo: boolean = false;

  constructor(private authService: AuthService, private constantes: ConstantesComisiones,
    public presupuestoService: PresupuestoDirectorService,
    private consultaPresupuesto: ConsultarPresupuestoDirectorComponent, private salasService: SalasService,
    private regionService:RegionService, private genericosService:GenericosService) {
    this.presupuesto = new PresupuestoDirector();
    this.listaSalas = [];
    this.isChecked = false;
    this.regiones = [];
    this.contratoKey = new ContratoKey();
    this.sucursalesDeRegion= []; 
    this.listaProductos = [];
    this.producto = new ProductoEntity();
  }

  ngOnInit() {
    this.loadRegiones();
  }

  checkValue(event) {
    if (event.target.checked) {
      this.presupuesto.Comodin = true;
    } else {
      this.presupuesto.Comodin = false;
    }
  }

  loadRegiones(): void {
    this.regionService.getAll()
      .subscribe(regiones => {
        this.regiones = regiones;
      },
        error => this.authService.showErrorPopup(error));
  }

  cargarSucursal(event:any){
    this.contratoKey.CodigoRegion = this.presupuesto.CodigoRegion;
    this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result)=>{
      this.sucursalesDeRegion = result;
    });
  }


  crearPresupuestoDirector() {

    this.presupuesto.Estado = true;
    this.presupuestoService.insertarPresupuesto(this.presupuesto)
      .subscribe(respuesta => {
        this.identificadorCanales = respuesta;
        this.authService.showSuccessPopup("Registro Ingresado Exitosamente");
        this.seGuardo = true;
        this.eventoGuardarPresupuesto.emit(this.seGuardo);

      },
        error => this.authService.showErrorPopup(error)
      );
    this.limpiar();
    this.salir();

  }

  loadSalas(event:any) {
    this.idSucursal = event.target.value;
    this.salasService.getSalas(this.idSucursal).subscribe(
      (result) => {
        this.listaSalas = result;
      });
  }



  limpiar() {
    this.presupuesto = new PresupuestoDirector();
    this.listaProductos = [];

  }

  salir() {
    $('#modalCrear').modal('hide');
  }

  cargarProductos(){
    this.genericosService.cargarProductosActivos().subscribe(
      (result)=>{
        this.listaProductos = result;
    });
  }

  
}
