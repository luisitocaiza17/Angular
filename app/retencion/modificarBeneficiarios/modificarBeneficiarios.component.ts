import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RetencionService } from '../../common/servicios/retencion.service';
import { AuthService } from '../../seguridad/auth.service';
import { Retencion } from '../../common/model/retencion';
import { BeneficiarioList, BeneficiarioKey } from '../../common/model/beneficiario';
import { ContratoKey } from '../../common/model/contrato';
import { BeneficiarioService } from '../../common/servicios/beneficiario.service';
import { PlanService } from '../../common/servicios/plan.service';
import { FilterEmisionTarjetas, DatosMaternidad } from '../../common/model/transacciones';
import { DetalleMontoFactura } from './model/detalleMontoFactura';
import { Subscription } from 'rxjs';

@Component({
	providers: [],
	templateUrl: 'modificarBeneficiarios.template.html'
})

export class ModificarBeneficiariosComponent implements OnInit { 
	
	key: any;
	retencion: Retencion;
	showDatosBeneficiarios: boolean;
	showServiciosAdicionales: boolean;
	showValoresBeneficiarios: boolean;
	beneficiarios: BeneficiarioList[];
	contratoKey: ContratoKey;
	beneficiarioKey: BeneficiarioKey;
	detalleMontoFacturaActual: DetalleMontoFactura;
	detalleMontoFacturaNueva: DetalleMontoFactura;
	interval: any;
	subscription: Subscription;
	beneficiariosUpdate: BeneficiarioList[] = [];

	constructor(private route: ActivatedRoute, private router: Router, private retencionService: RetencionService,
	private beneficiarioService: BeneficiarioService, private planService: PlanService, private changeDetector: ChangeDetectorRef,
	private authService: AuthService) {}

	ngOnInit() :void {
		this.detalleMontoFacturaActual = new DetalleMontoFactura();
		this.detalleMontoFacturaNueva = new DetalleMontoFactura();
		this.loadDatosBeneficiarios();
		this.route.params.subscribe((params: any) => {
			this.key = params;
			this.beneficiarioKey = new BeneficiarioKey();
			this.beneficiarioKey.CodigoRegion = this.key.Region;
			this.beneficiarioKey.CodigoProducto = this.key.CodigoProducto;
			this.beneficiarioKey.NumeroContrato = this.key.NumeroContrato;

			this.subscription = this.beneficiarioService.getBeneficiariosMaternidad(this.beneficiarioKey).subscribe(beneficiarios => {
				this.beneficiarios = beneficiarios;
				this.planService.getDetalleFacturaAnterior(this.beneficiarioKey).subscribe(detalleFacturaActual => {
					this.detalleMontoFacturaActual = detalleFacturaActual;
				});
				this.retencionService.contratoKey.subscribe(contratoKey => {
					this.contratoKey = contratoKey;
					if (this.contratoKey.CodigoContrato != undefined) {
						let filter = new FilterEmisionTarjetas();
						filter.Beneficiarios = this.beneficiarios;
						filter.Contrato = this.contratoKey;
						this.calcularTotalFactura(filter);
					}
				});
			});
		});

		this.retencionService.retenciones.subscribe(retencion => {
			this.retencion = retencion;
			if (this.retencion.CodigoContrato == 0 || this.retencion.CodigoContrato == undefined) {
				this.router.navigate(['/retencion/list']);
			}
		})
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		clearInterval(this.interval);
	}

	onLoadBilling(data: any) {
		this.subscription.unsubscribe();
		clearInterval(this.interval);
		this.subscription = this.beneficiarioService.getBeneficiariosMaternidad(this.beneficiarioKey).subscribe(beneficiarios => {
			this.beneficiarios = beneficiarios;
			if (data != true) {
				this.beneficiarios.find(x => x.NumeroPersona == data.NumeroPersona).Maternidad = data.Maternidad;
				this.beneficiarios.find(x => x.NumeroPersona == data.NumeroPersona).Factor = data.Factor;
				this.beneficiarios.find(x => x.NumeroPersona == data.NumeroPersona).PrecioAnterior = data.PrecioAnterior;
				this.beneficiarios.find(x => x.NumeroPersona == data.NumeroPersona).PrecioBeneficiario = data.PrecioBeneficiario;
				this.beneficiarios.find(x => x.NumeroPersona == data.NumeroPersona).TajetaBeneficiario = data.TajetaBeneficiario;
				this.beneficiariosUpdate.push(this.beneficiarios.find(x => x.NumeroPersona == data.NumeroPersona));
			}
			let filter = new FilterEmisionTarjetas();
			filter.Beneficiarios = this.beneficiarios;
			filter.Contrato = this.contratoKey;
			this.calcularTotalFacturaNueva(filter);
		});
	}

	calcularTotalFactura(filter) {
		this.planService.getDetalleMontoFactura(filter).subscribe(detalleMontoFactura => {
			this.detalleMontoFacturaNueva = detalleMontoFactura;
		});
	}

	calcularTotalFacturaNueva(filter) {
		this.planService.getDetalleMontoFactura(filter).subscribe(detalleMontoFactura => {
			this.detalleMontoFacturaNueva = detalleMontoFactura;
			this.interval = setInterval(() => {
				this.changeDetector.detectChanges();
				this.changeDetector.detach();
			}, 100);
		});
	}

	loadDatosBeneficiarios(): void {
		this.showDatosBeneficiarios = true;
		this.showServiciosAdicionales = false;
		this.showValoresBeneficiarios = false;
	}

	loadServiciosAdicionales(): void {
		this.showDatosBeneficiarios = false;
		this.showServiciosAdicionales = true;
		this.showValoresBeneficiarios = false;
	}

	loadValoresBeneficiarios(): void {
		this.showDatosBeneficiarios = false;
		this.showServiciosAdicionales = false;
		this.showValoresBeneficiarios = true;
	}

	actualizarBeneficiarios(): void {
		if (this.beneficiariosUpdate.length > 0) {
			let datosMaternidad = [];
			this.beneficiariosUpdate.forEach(beneficiario => {
				let datos = new DatosMaternidad();
				datos.contratoKey = this.contratoKey;
				datos.beneficiario = beneficiario;
				datosMaternidad.push(datos);
			});
			
			this.beneficiarioService.actualizarBeneficiario(datosMaternidad).subscribe(result => {
				if (result) 
					this.router.navigate(['/retencion/comentario/movimiento/' + this.beneficiarioKey.CodigoRegion + '/' + this.beneficiarioKey.CodigoProducto + '/' + this.beneficiarioKey.NumeroContrato + '/MODIFICARBENEFICIARIOS/']);
				else
					this.authService.showErrorPopup('Error al actualizar los datos');
			});
		} else {
			this.router.navigate(['/retencion/comentario/movimiento/' + this.beneficiarioKey.CodigoRegion + '/' + this.beneficiarioKey.CodigoProducto + '/' + this.beneficiarioKey.NumeroContrato + '/MODIFICARBENEFICIARIOS/']);
		}
	}
}
