import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MovimientoComisionEntity, BeneficiarioComisionEntity, MovimientoYBeneficiarioComision } from '../../consultasComisiones/model/consultasComisiones.model';
import { Salas } from '../../salas/model/salas';
import { ContratoKey, Contrato, ContratoEntityList, ContratoEntityFilter } from '../../../common/model/contrato';
import { RegionEntity, SucursalDeRegion } from '../../../common/model/genericos';
import { GenericosService } from '../../../common/servicios/genericos.service';
import { RegionService } from '../../../common/servicios/region.service';
import { SalasService } from '../../salas/service/salas.service';
import { DirectorVendedorEntity } from '../../../comercial/model/DirectorVendedorEntity';
import { AuthService } from '../../../seguridad/auth.service';
import { ServicioVentasService } from '../../../comercial/service/servicioVentas.service';
import { FiltroAgenteVenta } from '../../model/agenteVenta.model';
import { ConstantesComisiones } from '../../utils/ConstantesComisiones';
import { ContratoService } from '../../../common/servicios/contrato.service';
import { ReclamoService } from '../../../common/servicios/reclamo.service';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { MovimientoComisionService } from '../../consultasComisiones/service/movimientoComision.service';

@Component({
  selector: 'app-crearMovimientoComisionManual',
  templateUrl: './crearMovimientoComisionManual.component.html',
  providers: [ServicioVentasService, ReclamoService, MovimientoComisionService]
})

export class CrearMovimientoComisionManualComponent implements OnInit {

    @Output() eventoGuardar = new EventEmitter();

    movimiento: MovimientoComisionEntity;
    beneficiarioComision: BeneficiarioComisionEntity; 
    salaSelected: Salas; 

    contratoKey: ContratoKey; 
    keyContratoValidar: ContratoEntityFilter;
    contratoAValidar: ContratoEntityList;
    contratos: ContratoEntityList[];

    listaRegiones: RegionEntity[]; 
    sucursalesDeRegion: SucursalDeRegion[]; 
    salas: Salas[]; 

    filtroAgentes: FiltroAgenteVenta;
    agentesVenta: DirectorVendedorEntity[];
    agenteVentaSelected: DirectorVendedorEntity; 

    constructor(
        public genericosService: GenericosService, 
        public regionService: RegionService,
        public salasService: SalasService,
        public authService: AuthService,
        public ventasService: ServicioVentasService,
        public constCom: ConstantesComisiones, 
        public contratoService: ContratoService,
        public reclamosService: ReclamoService,
        public utilidadesGenericas: utilidadesGenericasService,
        public movimientoComisionService: MovimientoComisionService
    ) {
    }

    ngOnInit() {
        this.movimiento = new MovimientoComisionEntity(); 
        this.beneficiarioComision = new BeneficiarioComisionEntity(); 
        this.salaSelected = new Salas(); 

        this.contratoKey = new ContratoKey();
        this.contratoAValidar = new ContratoEntityList(); 
        this.keyContratoValidar = new ContratoEntityFilter(); 
        this.listaRegiones = []; 
        this.sucursalesDeRegion = []; 
        this.salas = []; 
        this.contratos = []; 

        this.filtroAgentes = new FiltroAgenteVenta(); 
        this.agentesVenta = []; 
        this.agenteVentaSelected = new DirectorVendedorEntity(); 

        this.cargarRegiones(); 
    }
    
    openModal(modalName: string) {
        $(modalName).modal();
    }

    limpiar(){ 
        this.movimiento = new MovimientoComisionEntity();
        this.beneficiarioComision = new BeneficiarioComisionEntity(); 
        this.sucursalesDeRegion = []; 
        this.salas = []; 
        this.contratos = []; 
        this.keyContratoValidar = new ContratoKey(); 
        this.contratoAValidar = new ContratoEntityList; 
        this.agentesVenta = []; 
        this.agenteVentaSelected = new DirectorVendedorEntity(); 
    }

    salir() {
        this.eventoGuardar.emit('consulta');
    }

    cargarRegiones(){
        this.regionService.getAll().subscribe((result)=>{
        this.listaRegiones = result;
        });
    }

    cargarSucursal(event:any){
        this.contratoKey.CodigoRegion = this.movimiento.Region;
        this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result)=>{
        this.sucursalesDeRegion = result;
        });
    } 

    cargarSalas() {
        this.salasService.getSalas(this.movimiento.SucursalCodigo).subscribe(
            result => {
                this.salas = result;
            });
    }

    cargarAgentesVenta(){
        this.filtroAgentes.Tipo = 'Vendedor';
        this.filtroAgentes.CodigoSala = this.salaSelected.Codigo;
        this.filtroAgentes.Estado = 1; 

        this.ventasService.GetAgentesVentaByFiltersPaginated(this.filtroAgentes, 10).subscribe(
            res => { 
                this.agentesVenta = res;
            },
            error => { 
                this.authService.showErrorPopup(error);
            }
        );

    }

    pageChanged(): void {
        this.cargarAgentesVenta();
    }

    crearMovimientoManual(){      

        this.setearMovimientoComision(); 
        this.setearBeneficiarioComision(); 

        let movimientoYBeneficiario = new MovimientoYBeneficiarioComision(); 
        movimientoYBeneficiario.MovimientoComision = this.movimiento; 
        movimientoYBeneficiario.BeneficiarioComision = this.beneficiarioComision; 

        this.movimientoComisionService.crearMovimientoComisionManual(movimientoYBeneficiario).subscribe(
            res => { 
                if(res === true){
                    this.authService.showSuccessPopup('Registro guardado con exito');
                    this.limpiar();  
                }                    
                else
                    this.authService.showErrorPopup('Ha ocurrido un error');
            }, 
            error => { 
                this.authService.showErrorPopup('Ha ocurrido un error : ' + error);
            }
        );
    }

    setearMovimientoComision(){ 
        this.movimiento.TipoMovimiento = 'M';
        this.movimiento.NombreTransaccion = this.movimiento.CodigoTransaccion == 1 ? "SUSCRIPCION" : "TRANSACCION"; 
        this.movimiento.CodigoProducto = this.contratoAValidar.CodigoProducto; 
        this.movimiento.ContratoNumero = this.contratoAValidar.NumeroContrato; 
        this.movimiento.Region = this.contratoAValidar.CodigoRegion; 
        this.movimiento.FechaMovimiento = new Date();  
        this.movimiento.FechaEfectoMovimiento = new Date(); 
        this.movimiento.CodigoAgenteVenta = this.agenteVentaSelected.Codigo; 
        this.movimiento.NombreAgenteVenta = this.agenteVentaSelected.Nombre; 
        this.movimiento.EmpresaNumero = Number(this.contratoAValidar.NumeroEmpresa); 
        this.movimiento.EmpresaRazonSocial = this.contratoAValidar.RazonSocial; 
        this.movimiento.SucursalCodigo = this.contratoAValidar.CodigoSucursal; 
        this.movimiento.SucursalNombre = this.contratoAValidar.Sucursal;
        this.movimiento.RemesaEstadoCodigo = 26; 
        this.movimiento.RemesaEstadoNombre = 'Cobrada';
        this.movimiento.CodigoDirector = this.agenteVentaSelected.CodigoDirector; 
        this.movimiento.NombreDirector = 'Sacar de la base';
        this.movimiento.FechaInicio = this.utilidadesGenericas.GetDateTimeUTCTimeZone(this.utilidadesGenericas.convertStringToDate(this.contratoAValidar.FechaInicio));
        this.movimiento.FechaFin = this.utilidadesGenericas.GetDateTimeUTCTimeZone(this.utilidadesGenericas.convertStringToDate(this.contratoAValidar.FechaFin));
    }

    setearBeneficiarioComision(){ 
        this.beneficiarioComision.PersonaNumero = this.contratoAValidar.NumeroPersona; 
        this.beneficiarioComision.Apellidos = this.contratoAValidar.Apellidos; 
        this.beneficiarioComision.Nombres = this.contratoAValidar.Nombres; 
        this.beneficiarioComision.Discapacidad = false; 
        this.beneficiarioComision.AdultoMayor = false;
        this.beneficiarioComision.Comisiona = true; 
        this.beneficiarioComision.PorcentajeDiscapacidad = 0; 
        this.beneficiarioComision.EdadAdultoMayor = 0; 
        this.beneficiarioComision.AltoRiesgo = false;  
    }

    validarContrato(){ 

        this.reclamosService.getByFiltersPaginatedForOdas(this.keyContratoValidar).subscribe(
            res => { 
                this.contratos = res; 
                if(this.contratos != undefined && this.contratos != null && this.contratos.length > 0 ){
                    this.contratoAValidar = this.contratos[0]; 
                    this.crearMovimientoManual(); 
                }             
                else{
                    this.contratoAValidar = new ContratoEntityList(); 
                    this.authService.showErrorPopup('No existe el contrato');
                }
                   
            }, 
            error => { 
                this.authService.showErrorPopup(error); 
            }
        );
    }

    seleccionar(agenteVenta: DirectorVendedorEntity): void {
        this.agenteVentaSelected = new DirectorVendedorEntity(); 
        
        if (this.agentesVenta != undefined) {
            this.agentesVenta.forEach(element => {
                element.Selected = false;
            });
        }

        agenteVenta.Selected = true;
        this.agenteVentaSelected = agenteVenta;
    }
}
