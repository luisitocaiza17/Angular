import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../../../seguridad/auth.service';
import { ConstantesComisiones } from '../../../utils/ConstantesComisiones';
import { PresupuestoRangosDirectorService } from '../../services/presupuestoRangosDirector.service';
import { ContratoKey, Contrato } from '../../../../common/model/contrato';
import { GenericosService } from '../../../../common/servicios/genericos.service';
import { PresupuestoRangosDirectorEntity } from '../../model/presupuestoRangosDirector.model';
import { RegionEntity, SucursalDeRegion } from '../../../../common/model/genericos';
import { RegionService } from '../../../../common/servicios/region.service';
import { SalasService } from '../../../salas/service/salas.service';
import { Salas } from '../../../salas/model/salas';

@Component({
  selector: 'app-ingresarPresupuestoRangosDirector',
  templateUrl: './ingresarPresupuestoRangosDirector.component.html', 
  providers: [PresupuestoRangosDirectorService]
})


export class IngresarPresupuestoRangosDirectorComponent implements OnInit {

    @Output() eventoGuardarPresupuesto = new EventEmitter();
    seGuardo: boolean = false;

    contratoKey: ContratoKey; 
    presupuesto: PresupuestoRangosDirectorEntity;
    codigoRegion: string; 
    idSucursal: number; 

    listaRegiones: RegionEntity[]; 
    sucursalesDeRegion: SucursalDeRegion[]; 
    salas: Salas[]; 

    constructor(
      private authService: AuthService, 
      private constantes: ConstantesComisiones,
      private presupuestoRangosDirectorService: PresupuestoRangosDirectorService, 
      private genericosService: GenericosService, 
      private regionService: RegionService, 
      private salasService: SalasService){

    }

    ngOnInit() {
        this.contratoKey = new ContratoKey(); 
        this.presupuesto = new PresupuestoRangosDirectorEntity(); 
        this.listaRegiones = []; 
        this.sucursalesDeRegion = []; 
        this.salas = []; 

        this.loadRegiones(); 
    }

    cargarSucursal(event:any){
        this.contratoKey.CodigoRegion = this.codigoRegion;
        this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result)=>{
        this.sucursalesDeRegion = result;
        });
    } 

    loadRegiones(){
        this.regionService.getAll().subscribe((result)=>{
        this.listaRegiones = result;
        });
    }

    cargarSalas() {
        this.salasService.getSalas(this.idSucursal).subscribe(
            result => {
                this.salas = result;
            });
    }

    limpiar() {
        this.presupuesto = new PresupuestoRangosDirectorEntity();
        this.sucursalesDeRegion = [];
        this.salas = [];  
        this.codigoRegion = undefined; 
        this.idSucursal = undefined;
    }

    crearPresupuestoRangosDirector(){ 
        this.presupuestoRangosDirectorService.crearPresupuestoRangosDirector(this.presupuesto).subscribe(
            res => { 
                if(res === true )
                    this.authService.showSuccessPopup('Registro creado exitosamente');
                else
                    this.authService.showErrorPopup('Ha ocurrido un error al crear el registro');
                
                this.salir(); 
                this.limpiar(); 
            }, 
            error => { 
                this.authService.showErrorPopup('Ha ocurrido un error al crear el registro');
            }
        );
    }

    salir() {
        $('#modalCrear').modal('hide');
    }

}
