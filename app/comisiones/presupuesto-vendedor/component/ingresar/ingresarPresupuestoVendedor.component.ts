import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PresupuestoVendedor } from '../../model/presupuestoVendedor';
import { Rangos } from '../../../rangos/model/Rangos';
import { Tipo } from '../../../tipo/model/Tipo';
import { Subtipo } from '../../../subtipo/model/subtipo';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { PresupuestoVendedorService } from '../../services/presupuesto-vendedor.service';
import { RangosService } from '../../../rangos/services/rangos.service';
import { ConsultarPresupuestoVendedorComponent } from '../consultar/consultarPresupuestoVendedor.component';
import { SubtipoService } from '../../../subtipo/service/subtipo.service';
import { TipoService } from '../../../tipo/service/tipo.service';
import { Region } from '../../../../common/model/region';
import { SucursalDeRegion } from '../../../../common/model/genericos';
import { GenericosService } from '../../../../common/servicios/genericos.service';
import { ContratoKey } from '../../../../common/model/contrato';
import { CanalesService } from '../../../canales/service/canales.service';
import { Canales } from '../../../canales/model/canales';
import { RegionService } from '../../../../common/servicios/region.service';

@Component({
  selector: 'app-ingresarPresupuestoVendedor',
  templateUrl: './ingresarPresupuestoVendedor.component.html'
})
export class IngresarPresupuestoVendedorComponent implements OnInit {

  nombre: string;
  estado: string;
  presupuesto: PresupuestoVendedor;
  identificadorCanales: number;
  descripcionObservacion: string;
  estadoNombre: boolean;
  listaRangos: Rangos[];
  isChecked: boolean;
  listaTipos: Tipo[];
  idsubtipo:number;
  idtipo:number;
  idSucursal:number;
  idCanal:number;
  codigoRegion:string;
  listaSubtipos:Subtipo[];
  listaTipoPresupuesto:object[];
  regiones: Region[];
  sucursalesDeRegion: SucursalDeRegion[]; 
  contratoKey: ContratoKey;
  listaCanales: Canales[];
  listaRegiones: Region[];

  @Output() eventoGuardarPresupuesto = new EventEmitter();
  seGuardo: boolean = false;

  constructor(private authService: AuthService, private constantes: ConstantesComisiones, private presupuestoService: PresupuestoVendedorService,
    private consultaPresupuesto: ConsultarPresupuestoVendedorComponent, private rangoService: RangosService,
    private tipoService:TipoService, private subtipoService:SubtipoService, private genericosService: GenericosService,
    private canalesService:CanalesService, private regionService:RegionService) {
    this.presupuesto = new PresupuestoVendedor();
    this.listaRangos = [];
    this.isChecked = false;
    this.listaTipos = [];
    this.listaSubtipos = [];
    this.listaTipoPresupuesto = [];
    this.contratoKey = new ContratoKey();
  }

  ngOnInit() {
    this.estadoNombre = false;
    this.obtenerTipos();
    this.loadTipoPresupuesto();
    this.cargarCanales();
    this.loadRegiones();
    this.idsubtipo = 0;
    this.idCanal = 0;
    this.idSucursal = 0;
  }

  validacionNombre(event: any) {
    this.estadoNombre = false;
    let nombre = event.target.value.toUpperCase();
  }

  checkValue(event) {
    if (event.target.checked) {
      this.presupuesto.Comodin = true;
    } else {
      this.presupuesto.Comodin = false;
    }
  }

  cargarSucursal(event:any){
 
    this.contratoKey.CodigoRegion = this.codigoRegion;
    this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result)=>{
      this.sucursalesDeRegion = result;
    });
  }

  cargarCanales(){
    this.canalesService.getAllSubCanales().subscribe((result)=>{
      this.listaCanales = result;
    });
  }

  loadRegiones(){
    this.regionService.getAll().subscribe((result)=>{
      this.listaRegiones = result;
    });
  }

  crearPresupuestoVendedor() {
    let nombreIndice;

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

  
  cargarSubtipo(event:any){
    this.idtipo = event.target.value;
    this.subtipoService.getSubtipoByTipos(this.idtipo).subscribe((result)=>{
      this.listaSubtipos = result;
    })
  }


   
  obtenerTipos(){
    this.tipoService.getAllTipos().subscribe((result)=>{
      for(let element of result){
        if(element.Nombre.toUpperCase()==this.constantes.TIPO_VENDEDOR){
          this.listaTipos.push(element);
        }
      }
      
    });
  }

  loadRango(event:any) {
    this.idsubtipo = event.target.value;
    this.rangoService.getRango(this.idsubtipo, this.idSucursal, this.idCanal).subscribe(
      (result) => {
        this.listaRangos = result;
      });
  }

  loadTipoPresupuesto(){
    this.listaTipoPresupuesto=this.constantes.TIPO_PRESUPUESTO_VENDEDOR
  }

  limpiar() {
    this.presupuesto = new PresupuestoVendedor();
  }

  salir() {
    $('#modalCrear').modal('hide');
  }

}
