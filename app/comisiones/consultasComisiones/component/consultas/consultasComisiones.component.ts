import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../../seguridad/auth.service';
import { PaginationService } from '../../../../utils/pagination.service';
import { ConsultasComisionesService } from '../../service/consultasComisiones.service';
import { MovimientoComisionEntity, BeneficiarioComisionEntity, ServicioAdicionalComisionEntity, FiltroMovimientoComisionEntity, FiltroBeneficiarioComisionEntity } from '../../model/consultasComisiones.model';
import { Salas } from '../../../salas/model/salas';
import { GenericosService } from '../../../../common/servicios/genericos.service';
import { RegionService } from '../../../../common/servicios/region.service';
import { Region } from '../../../../common/model/region';
import { ContratoKey } from '../../../../common/model/contrato';
import { SalasService } from '../../../salas/service/salas.service';
import { Usuario } from '../../../../seguridad/usuario';
import { MovimientoComisionService } from '../../service/movimientoComision.service';
import { BeneficiarioComisionService } from '../../service/beneficiarioComision.service';
import { ResumenSalasFilter } from '../../../salas/model/resumenSalasFilter';
import { ResumenSalas } from '../../../salas/model/resumenSalas';
import { ResumenVendedorComision } from '../../model/resumenVendedorComision';
import { ResumenVendedorComisionFilter } from '../../model/resumenVendedorComisionFilter';
import { SucursalDeRegion } from '../../../../common/model/genericos';
import { Mes } from '../../model/mes';
import { ServicioAdicionalComisionService } from '../../service/serviciosAdicionaleComision';
import { ComisionNovedadGenerico } from '../../model/comisionNovedadGenerico';
import { UtilsComponent } from '../../../utils/Utils.component';

@Component({
  selector: 'consultas-comisiones-component',
  templateUrl: './consultasComisiones.component.html',
	providers: [ConsultasComisionesService,  SalasService, MovimientoComisionService, BeneficiarioComisionService,
		ServicioAdicionalComisionService]
})

export class ConsultasComisionesComponent extends PaginationService implements OnInit {

	@ViewChild('formNovedad')
	formNovedad: any

	filtroRegion: string;
	filter: ResumenSalasFilter;

	filtroResumenVendedor: ResumenVendedorComisionFilter;
	filtroMovimientoComision: FiltroMovimientoComisionEntity;

	regiones: Region[];
	sucursalesDeRegion: SucursalDeRegion[];
	contratoKey: ContratoKey;

	salas: ResumenSalas[];
	vendedores: ResumenVendedorComision[];
	salaSelected: Salas;

	movimientos: MovimientoComisionEntity[];
	movimientoSelected: MovimientoComisionEntity;

	beneficiarios: BeneficiarioComisionEntity[];
	beneficiarioSelected: BeneficiarioComisionEntity;

	serviciosAdicionales: ServicioAdicionalComisionEntity[];
	servicioAdicionalSelected: ServicioAdicionalComisionEntity;

	isVendedor: boolean;
	isDirector: boolean;
	isAdminComisiones: boolean;

	mostrarVendedores: boolean;
	mostrarMovimientos: boolean;
	mostrarBeneficiarios: boolean;
	mostrarServicios: boolean;
	
	usuarioLogueado: Usuario;
	anios: number[];
	meses: Mes[];
	titleModal: string;
	precioCalculo: number;
	comisionaNovedad: boolean;
	observacionNovedad: string;
	comisionNovedad: ComisionNovedadGenerico;
	esBeneficiario: boolean;

	constructor(private authService: AuthService, private consultasComisionesService: ConsultasComisionesService,
		private genericosService: GenericosService, private regionService: RegionService, private salasService: SalasService, 
		private movimientoComisionService: MovimientoComisionService, private beneficiarioComisionService: BeneficiarioComisionService,
		private servicioAdicionalComisionService: ServicioAdicionalComisionService, private utils: UtilsComponent
	) {
		super();
	}

	ngOnInit() {
		this.filter = new ResumenSalasFilter();
		this.filtroResumenVendedor = new ResumenVendedorComisionFilter(); 
		this.filtroMovimientoComision = new FiltroMovimientoComisionEntity();

		this.usuarioLogueado = this.authService.getDatosUsuarioAutenticado(); 

		/*TO DO*/
		/*Validacion para mostrar las comisiones por rol*/
		//if(this.usuarioLogueado.NombreUsuario.startsWith("usrvmwork"))
			//this.filtroCodigoAgenteVenta = 58563; 

		this.contratoKey = new ContratoKey();
		this.salas = [];
		this.movimientos = [];
		this.limpiarForm();
		this.isAdminComisiones = true;
		this.loadRegiones();
		this.anios = this.utils.obtenerAnios();
		this.meses = this.utils.obtenerMeses();
		this.comisionNovedad = new ComisionNovedadGenerico();
	}

	loadRegiones(): void {
		this.regionService.getAll().subscribe(regiones => {
			this.regiones = regiones;
		}, error => this.authService.showErrorPopup(error));
	}

	cargarSucursal(event:any){
		this.contratoKey.CodigoRegion = this.filtroRegion;
		this.genericosService.getSucursalPorRegion(this.contratoKey).subscribe((result)=>{
			this.sucursalesDeRegion = result;
		});
	}

	limpiarForm(){
		this.filter = new ResumenSalasFilter();
		this.filtroRegion = undefined;
	}

	loadInitialData() :void {
		this.isVendedor = false;
		this.isDirector = false;
		this.mostrarMovimientos = false;
		this.mostrarBeneficiarios = false;
		this.mostrarServicios = false;
		this.mostrarVendedores = false;
		this.loadSalas(); 
	}

	loadSalas(){ 
		this.salasService.consultarResumenSalas(this.filter).subscribe(res => {
			this.salas = res; 
		}, error => { 
			this.authService.showErrorPopup(error);
		});
	}

	seleccionarSala(sala: ResumenSalas) {
		if (this.salas != undefined) {
			this.salas.forEach(element => {
				element.Selected = false;
			});
		}
		sala.Selected = true;

		this.filtroResumenVendedor = new ResumenVendedorComisionFilter();
		this.filtroResumenVendedor.Anio = this.filter.Anio;
		this.filtroResumenVendedor.Mes = this.filter.Mes;
		this.filtroResumenVendedor.CodigoSala = sala.Codigo;

		this.loadVendedores();     
	}

	loadVendedores(){ 
		this.consultasComisionesService.getVendoresPorSalaPaginated(this.filtroResumenVendedor).subscribe(
			res => {
				this.vendedores = res;
				this.mostrarVendedores = true;
			}, error => { 
				this.authService.showErrorPopup(error);
			}
		);
	}

	seleccionarVendedor(vendedor: ResumenVendedorComision) {
		if (this.vendedores != undefined) {
			this.vendedores.forEach(element => {
				element.Selected = false;
			});
		}
		vendedor.Selected = true;

		this.filtroMovimientoComision = new FiltroMovimientoComisionEntity();
		this.filtroMovimientoComision.Anio = this.filter.Anio;
		this.filtroMovimientoComision.Mes = this.filter.Mes;
		this.filtroMovimientoComision.CodigoAgenteVenta = vendedor.CodigoAgenteVenta;
		
		this.loadMovimientos(); 
	}

	loadMovimientos(){ 
		this.movimientoComisionService.GetMovimientosComisionByFiltersPaginated(this.filtroMovimientoComision)
		.subscribe(res => { 
			this.movimientos = res;
		}, error => { 
			this.authService.showErrorPopup(error);
		});

		this.mostrarMovimientos = true;
	}

	seleccionarMovimiento(movimiento: MovimientoComisionEntity): void {		
		this.mostrarBeneficiarios = true;
		this.movimientoSelected = new MovimientoComisionEntity();

		if (this.movimientos != undefined) {
			this.movimientos.forEach(element => {
				element.Selected = false;
			});
		}
		movimiento.Selected = true;

		this.movimientoSelected = movimiento;
		this.loadBeneficiarios();
	}

	loadBeneficiarios(){
		let filtroBen = new FiltroBeneficiarioComisionEntity();
		filtroBen.IdMovimientoComision = this.movimientoSelected.Id; 
		this.beneficiarioComisionService.GetBeneficiariosComisionByFiltersPaginated(10, filtroBen).subscribe(
			res => { 
				this.beneficiarios = res;
			}, error => { 
				this.authService.showErrorPopup(error);
			}
		); 
	}

	seleccionarBeneficiario(beneficiario: BeneficiarioComisionEntity) {
		this.mostrarServicios = true;
		this.beneficiarioSelected = new BeneficiarioComisionEntity();
		if (this.beneficiarios != undefined) {
			this.beneficiarios.forEach(b => {
				b.Selected = false;
			});
		}

		beneficiario.Selected = true;
		this.beneficiarioSelected = beneficiario;
		this.loadServiciosAdicionales();
	}

	loadServiciosAdicionales(): void {
		let servicioAdicional = new ServicioAdicionalComisionEntity();
		servicioAdicional.IdBeneficiarioComision = this.beneficiarioSelected.Id;
		this.servicioAdicionalComisionService.GetServiciosAdicionalesByFilterspaginated(10, servicioAdicional).subscribe(
			serviciosAdicionales => {
				this.serviciosAdicionales = serviciosAdicionales;
				console.log(this.serviciosAdicionales)
			}, error => {
				this.authService.showErrorPopup(error);
			}
		);
	}

	pageChangedSalas(): void {
		this.loadSalas(); 
	}

	pageChangedVendedores(): void { 
		this.loadVendedores(); 
	}

	pageChangedMovimientos(): void {
		this.loadMovimientos(); 
	}

	abrirObservacion(entidad :any, isBeneficiario: boolean): void {
		this.esBeneficiario = isBeneficiario;
		this.comisionNovedad.PrecioCalculo = null;
		this.formNovedad.reset();
		this.formNovedad._submitted = false;
		if (this.beneficiarioSelected == undefined && isBeneficiario) {
			this.seleccionarBeneficiario(entidad);
		} else {
			this.servicioAdicionalSelected = entidad;
		}

		let comision = new ComisionNovedadGenerico();
		comision.CodigoTransaccion = this.movimientoSelected.CodigoTransaccion;
		comision.CodigoProducto = this.movimientoSelected.CodigoProducto;
		comision.ContratoNumero = this.movimientoSelected.ContratoNumero;
		comision.Region = this.movimientoSelected.Region;
		comision.PersonaNumero = this.beneficiarioSelected.PersonaNumero;
		if (isBeneficiario) {
			this.titleModal = "Novedad beneficiario";
			this.loadBeneficiarioNovedad(comision)
		} else {
			this.titleModal = "Novedad servicio adicional";
			comision.CodigoServicio = this.servicioAdicionalSelected.CodigoServicio;
			this.loadServicioAdicionalNovedad(comision);
		}
		$("#modalNovedad").modal();
	}

	loadBeneficiarioNovedad(comision: ComisionNovedadGenerico): void {
		this.beneficiarioComisionService.GetBeneficiarioNovedad(comision).subscribe(comisionNovedad => {
			this.comisionNovedad = comisionNovedad;
			if (comisionNovedad.Id == 0) {
				this.setearComision();
			}
		});
	}

	loadServicioAdicionalNovedad(comision: ComisionNovedadGenerico): void {
		this.servicioAdicionalComisionService.GetServicioAdicionalNovedad(comision).subscribe(comisionNovedad => {
			this.comisionNovedad = comisionNovedad;
			if (comisionNovedad.Id == 0) {
				this.setearComision();
				this.comisionNovedad.CodigoServicio = this.servicioAdicionalSelected.CodigoServicio;
			}
		})
	}

	setearComision(): void {
		this.comisionNovedad.CodigoTransaccion = this.movimientoSelected.CodigoTransaccion;
		this.comisionNovedad.CodigoProducto = this.movimientoSelected.CodigoProducto;
		this.comisionNovedad.ContratoNumero = this.movimientoSelected.ContratoNumero;
		this.comisionNovedad.Region = this.movimientoSelected.Region;
		this.comisionNovedad.FechaMovimiento = this.movimientoSelected.FechaMovimiento;
		this.comisionNovedad.PersonaNumero = this.beneficiarioSelected.PersonaNumero;
	}

	guardarNovedad(): void {
		if (this.esBeneficiario) {
			if (this.comisionNovedad.Id == 0) {
				this.beneficiarioComisionService.CrearBeneficiarioComisionNovedad(this.comisionNovedad).subscribe(res => {
					if (res) {
						this.authService.showSuccessPopup('Se creó correctamente la novedad');
					} else {
						this.authService.showErrorPopup('Error al guardar la novedad');
					}
				});
			} else {
				this.beneficiarioComisionService.ActualizarBeneficiarioComisionNovedad(this.comisionNovedad).subscribe(res => {
					if (res) {
						this.authService.showSuccessPopup('Se actualizó correctamente la novedad');
					} else {
						this.authService.showErrorPopup('Error al guardar la novedad');
					}
				});
			}
		} else {
			if (this.comisionNovedad.Id == 0) {
				this.servicioAdicionalComisionService.CrearServicioAdicionalComisionNovedad(this.comisionNovedad).subscribe(res => {
					if (res) {
						this.authService.showSuccessPopup('Se creó correctamente la novedad');
					} else {
						this.authService.showErrorPopup('Error al guardar la novedad');
					}
				});
			} else {
				this.servicioAdicionalComisionService.ActualizarServicioAdicionalComisionNovedad(this.comisionNovedad).subscribe(res => {
					if (res) {
						this.authService.showSuccessPopup('Se actualizó correctamente la novedad');
					} else {
						this.authService.showErrorPopup('Error al guardar la novedad');
					}
				});
			}
		}
		
		this.cerrarModal('modalNovedad');
	}

	cerrarModal(modal: string): void {
		$(`#${modal}`).modal('hide');
	}
}
