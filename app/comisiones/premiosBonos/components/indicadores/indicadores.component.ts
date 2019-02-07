import { Component, OnInit } from "@angular/core";
import { UtilsComponent } from "../../../utils/Utils.component";
import { Mes } from "../../../consultasComisiones/model/mes";
import { RegionService } from "../../../../common/servicios/region.service";
import { Region } from "../../../../common/model/region";
import { AuthService } from "../../../../seguridad/auth.service";
import { ContratoKey } from "../../../../common/model/contrato";
import { SucursalDeRegion } from "../../../../common/model/genericos";
import { GenericosService } from "../../../../common/servicios/genericos.service";
import { SalasService } from "../../../salas/service/salas.service";
import { ResumenSalasFilter } from "../../../salas/model/resumenSalasFilter";
import { ResumenSalas } from "../../../salas/model/resumenSalas";
import { ResumenVendedorComisionFilter } from "../../../consultasComisiones/model/resumenVendedorComisionFilter";
import { ConsultasComisionesService } from "../../../consultasComisiones/service/consultasComisiones.service";
import { ResumenVendedorComision } from "../../../consultasComisiones/model/resumenVendedorComision";
import { IndicadoresService } from "../../services/indicadores.service";
import { IndicadoresVendedor } from "../../model/indicadoresVendedor";
import { IndicadorPersistencia } from "../../model/indicadorPersistencia";
import { IndicadorGestionVentas } from "../../model/IndicadorGestionVentas";
import { IndicadorCuotaUno } from "../../model/indicadorCuotaUno";

@Component({
	providers: [ConsultasComisionesService],
	templateUrl: 'indicadores.template.html'
})

export class IndicadoresComponent implements OnInit {

	anios: number[];
	meses: Mes[];
	filter: ResumenSalasFilter;
	filtroResumenVendedor: ResumenVendedorComisionFilter;
	filtroRegion: string;
	regiones: Region[];
	sucursales: SucursalDeRegion[];
	salas: ResumenSalas[];
	vendedores: ResumenVendedorComision[];
	
	isAdmin: boolean;
	isVendedor: boolean;
	mostrarVendedores: boolean;
	mostrarIndicadores: boolean;
	indicadoresVenta: IndicadoresVendedor;
	mostrarPersistencia: boolean;
	mostrarGestionVentas: boolean;
	mostrarCuotaUno: boolean;
	isDirector: boolean;
	
	constructor(private regionService: RegionService, private genericosService: GenericosService, private salasService: SalasService,
		private comisionesService: ConsultasComisionesService, private indicadoresService: IndicadoresService, private utils: UtilsComponent, 
		private authService: AuthService
	) { }

	ngOnInit(): void {
		this.filter = new ResumenSalasFilter();
		this.filtroResumenVendedor = new ResumenVendedorComisionFilter();
		this.anios = this.utils.obtenerAnios();
		this.meses = this.utils.obtenerMeses();
		this.regionService.getAll().subscribe(regiones => {
			this.regiones = regiones;
		}, error => this.authService.showErrorPopup(error));
		this.isAdmin = true;
		this.salas = [];
	}

	cargarSucursal(): void {
		let contratoKey = new ContratoKey();
		contratoKey.CodigoRegion = this.filtroRegion;
		this.genericosService.getSucursalPorRegion(contratoKey).subscribe((result)=>{
			this.sucursales = result;
		});
	}

	buscar() {
		this.isVendedor = false;
		this.mostrarVendedores = false;
		this.mostrarIndicadores = false;
		this.mostrarPersistencia = false;
		this.mostrarGestionVentas = false;
		this.mostrarCuotaUno = false;
		this.loadSalas();	
	}
	
	loadSalas(): void {
		this.salasService.consultarResumenSalas(this.filter).subscribe(salas => {
			this.salas = salas;
		}, error => {
			this.authService.showErrorPopup(error);
		});
	}

	seleccionarSala(sala: ResumenSalas): void {
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

	loadVendedores(): void {
		this.comisionesService.getVendoresPorSalaPaginated(this.filtroResumenVendedor).subscribe(
			vendedores => {
				this.vendedores = vendedores;
				this.mostrarVendedores = true;
			}, error => { 
				this.authService.showErrorPopup(error);
			}
		);
	}

	seleccionarVendedor(vendedor: ResumenVendedorComision): void {
		if (this.vendedores != undefined) {
			this.vendedores.forEach(element => {
				element.Selected = false;
			});
		}
		vendedor.Selected = true;

		this.loadIndicadores(vendedor.CodigoAgenteVenta);
	}

	loadIndicadores(codigoAgenteVenta): void {
		this.indicadoresService.GetIndicadoresVendedor(codigoAgenteVenta, this.filter.Anio, this.filter.Mes).subscribe(indicadoresVenta => {
			this.indicadoresVenta = indicadoresVenta;
			if (this.indicadoresVenta.Id != 0) {
				this.mostrarIndicadores = true;	
			} else {
				this.mostrarIndicadores = false;
				this.mostrarPersistencia = false;
				this.mostrarGestionVentas = false;
				this.mostrarCuotaUno = false;
			}
		}, error => { 
			this.authService.showErrorPopup(error);
		})
	}

	loadPersistencia(): void {
		this.mostrarPersistencia = true;
		this.mostrarGestionVentas = false;
		this.mostrarCuotaUno = false;
	}

	loadGestionVentas(): void {
		this.mostrarPersistencia = false;
		this.mostrarGestionVentas = true;
		this.mostrarCuotaUno = false;
	}

	loadCuotaUno(): void {
		this.mostrarPersistencia = false;
		this.mostrarGestionVentas = false;
		this.mostrarCuotaUno = true;
	}

	limpiar(): void {

	}
}