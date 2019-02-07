import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ContratoKey } from '../../../common/model/contrato';
import { RegionEntity, SucursalDeRegion } from '../../../common/model/genericos';
import { GenericosService } from '../../../common/servicios/genericos.service';
import { RegionService } from '../../../common/servicios/region.service';
import { AuthService } from '../../../seguridad/auth.service';
import { ConstantesComisiones } from '../../utils/ConstantesComisiones';
import { BonoEntity, BonoAgenciaCompetenciaEntity, BonoDetalleEntity } from '../../model/bonos.model';
import { BonosService } from './services/bonos.service';
import { TipoService } from '../../tipo/service/tipo.service';
import { SubtipoService } from '../../subtipo/service/subtipo.service';
import { Tipo } from '../../tipo/model/Tipo';
import { Subtipo } from '../../subtipo/model/subtipo';

@Component({
  selector: 'app-gestionBonoComision',
  templateUrl: './gestionBonoComision.component.html',
  providers: []
})

export class GestionBonoComisionComponent implements OnInit {

    @Input() operacion: string; 
    @Input() idBonoEditar: number; 
    @Output() eventoGuardar = new EventEmitter();

    bonoNuevo: BonoEntity; 

    contratoKey: ContratoKey;
    listaRegiones: RegionEntity[]; 
    sucursalesDeRegion: SucursalDeRegion[]; 

    codigoRegion: string;
    sucursalSelected: SucursalDeRegion;
    estadoAgencia: boolean;
    estadoDetalle: boolean;
    mesesDesde: number; 
    mesesHasta: number;
    valorDetalle: number; 

    listaTipos: Tipo[];
    listaSubtipos: Subtipo[];
    idtipo: number;
    idsubtipo: number;

    detalleSelected: BonoDetalleEntity; 

    constructor(
        public genericosService: GenericosService, 
        public regionService: RegionService,
        public authService: AuthService,
        public constCom: ConstantesComisiones, 
        public bonosService: BonosService, 
        public tipoService: TipoService, 
        public subtipoService: SubtipoService
    ) {
    }

    ngOnInit() {
        this.contratoKey = new ContratoKey(); 
        this.bonoNuevo = new BonoEntity(); 
        this.sucursalSelected = undefined; 
        this.bonoNuevo.Agencias = []; 
        this.bonoNuevo.Detalles = []; 
        this.detalleSelected = new BonoDetalleEntity();
        this.cargarRegiones(); 
        this.cargarTipos();

        if(this.operacion == 'EDITAR'){
            this.cargarDatosSiEsEditar();
        }
    }
    
    cargarDatosSiEsEditar(){
        this.bonosService.GetBonoCompletoById(this.idBonoEditar).subscribe(
            res => { 
                this.bonoNuevo = res; 
            }, 
            error => { 
                this.authService.showErrorPopup(error);
            }
        );
    }

    seleccionarTpoVendedor(): Tipo{ 
        let tipoVendedor: Tipo;
        this.listaTipos.forEach(x => {
            if(x.Nombre == "VENDEDOR")
                tipoVendedor = x; 
        });

        return tipoVendedor; 
    }

    limpiar(){ 
       this.bonoNuevo = new BonoEntity(); 
       this.bonoNuevo.Agencias = []; 
       this.bonoNuevo.Detalles = []; 
       this.codigoRegion = undefined;
       this.sucursalSelected = undefined;
       this.estadoAgencia = undefined; 
       this.estadoDetalle = undefined;
       this.mesesDesde = undefined;
       this.mesesHasta = undefined;
       this.valorDetalle = undefined;
       this.idsubtipo = undefined; 
       this.detalleSelected = new BonoDetalleEntity();
    }

    salir() {
        this.eventoGuardar.emit('consulta');
    }

    cargarRegiones(){
        this.regionService.getAll().subscribe((result)=>{
        this.listaRegiones = result;
        });
    }

    agregarAgencia(){
        let ageciaNueva: BonoAgenciaCompetenciaEntity = new BonoAgenciaCompetenciaEntity(
            null,null,this.sucursalSelected.CodigoSucursal, this.sucursalSelected.NombreSucursal, true);
        
        if(this.validarSiYaExisteAgencia(ageciaNueva)){
            this.authService.showErrorPopup("La agencia que intenta añadir ya está incluida");
        }
        else{
            this.bonoNuevo.Agencias.push(ageciaNueva);
        }        
    }

    agregarDetalle(){
        let detalleNuevo: BonoDetalleEntity = new BonoDetalleEntity(
            null,null,this.idsubtipo, this.mesesDesde, this.mesesHasta, this.valorDetalle, true);       
        this.bonoNuevo.Detalles.push(detalleNuevo);   
    }

    cargarSucursal(){
        this.sucursalSelected = undefined; 
        this.contratoKey.CodigoRegion = this.codigoRegion;
        this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result)=>{
        this.sucursalesDeRegion = result;
        });
    } 

    cambiarEstadoAgencia(agencia: BonoAgenciaCompetenciaEntity){ 
        agencia.Estado = agencia.Estado == true ? false : true; 
    }

    cambiarEstadoDetalle(detalle: BonoDetalleEntity){ 
        detalle.Estado = detalle.Estado == true ? false : true; 
    }

    validarSiYaExisteAgencia(agencia: BonoAgenciaCompetenciaEntity): boolean{ 
        let counter: number = 0; 
        this.bonoNuevo.Agencias.forEach(x => {
            if(x.IdSucursal == agencia.IdSucursal)
                counter++;
        });

        if(counter > 0)
            return true;
        else 
            return false; 
    }

    cargarTipos() {
        this.tipoService.getAllTipos().subscribe((result) => {
            this.listaTipos = result;
            this.idtipo = this.seleccionarTpoVendedor().Codigo; 
            this.cargarSubtipo(); 
        });
    }

    cargarSubtipo() {
        this.subtipoService.getSubtipoByTipos(this.idtipo).subscribe((result) => {
            this.listaSubtipos = result;
        })
    }

    insertarBono(){
        this.bonoNuevo.Estado = true; 
        this.bonosService.InsertarBono(this.bonoNuevo).subscribe(
            res => {
                if(res.includes('ERROR'))
                    this.authService.showErrorPopup(res.replace('ERROR:',''));
                else
                    this.authService.showSuccessPopup(res);
            }, 
            error => { 
                this.authService.showErrorPopup(error);
            }
        );
    }

    actualizarBono(){ 
        this.bonosService.Actualizar(this.bonoNuevo).subscribe(
            res => {
                if(res.includes('ERROR'))
                    this.authService.showErrorPopup(res.replace('ERROR:',''));
                else
                    this.authService.showSuccessPopup(res);
            }, 
            error => { 
                this.authService.showErrorPopup(error);
            }
        );
    }

    openModal(modalName: string, detalle: BonoDetalleEntity) {
        this.detalleSelected = detalle;
        $(modalName).modal();
    }

    salirModal(modalName: string) {
        $(modalName).modal('hide');
    }

    ObtenerNombreSutbipo(idSubtipo: number){ 
        return this.listaSubtipos.find(x => x.Codigo == idSubtipo).Nombre; 
    }
}
