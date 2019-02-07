import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BeneficiarioList, BeneficiarioKey } from '../../../common/model/beneficiario';
import { TransaccionService } from '../../../common/servicios/transaccion.service';
import { ContratoKey } from '../../../common/model/contrato';
import { VariablesConstantService } from '../../../utils/variableConstant.service.';
import { RelacionesService } from '../../../common/servicios/relaciones.service';
import { Relacion } from '../../../common/model/relacion';
import { AuthService } from '../../../seguridad/auth.service';
import { RetencionService } from '../../../common/servicios/retencion.service';
import { PlanService } from '../../../common/servicios/plan.service';
import { TipoPantallaPersonaUnica } from '../../../common/model/persona';
import { ValidacionesService } from '../../../common/servicios/validaciones.services';
import { BeneficiarioService } from '../../../common/servicios/beneficiario.service';
import { DatosMaternidad } from '../../../common/model/transacciones';

@Component({
	selector: 'datosBeneficiarios',
	providers: [RelacionesService, ValidacionesService],
	templateUrl: 'datosBeneficiarios.template.html'
})

export class DatosBeneficiariosComponent implements OnInit {

	key: any;
	beneficiarioKey: BeneficiarioKey;
	beneficiarios: BeneficiarioList[];
	beneficiario: BeneficiarioList;
	beneficiarioMaternidad: BeneficiarioList;
	beneficiarioSeleccionado: BeneficiarioList;
	habiltarExcluir: boolean;
	tipoDocumento: number;
	documento: string;
	habilitarCampos: boolean;
	relaciones: Relacion[];
	contratoKey: ContratoKey;
	precioBasePlan: number;
	valorAntesDescuento: number;
	pantallaClienteUnico: TipoPantallaPersonaUnica;
	porcentajeDescuento: number;
	esMaternidad: boolean;
	beneficiariosAux: BeneficiarioList[];
	beneficiarioTitular: BeneficiarioList;
	codigoRelacion: number;

	datepickerOpts = {
		autoclose: true,
		todayHighlight: true,
		format: 'dd/mm/yyyy',
		icon: 'fa fa-calendar',
		placeholder: 'dd/mm/yyyy',
		language: 'es'
	};

	@Input()
	set listaBeneficiarios(beneficiarios: BeneficiarioList[]) {
		this.beneficiarios = beneficiarios;
		if (this.beneficiarios != undefined) {
			this.loadBeneficiarios(this.beneficiarios);
		} else {
			this.beneficiarios = [];
		}
	}
	
	get listaBeneficiarios() {
		return this.beneficiarios;
	}

	@Output() onLoadBilling: EventEmitter<any> = new EventEmitter<any>();

	constructor(private route: ActivatedRoute, private constant: VariablesConstantService, private relacionesService: RelacionesService,
		private authService: AuthService, private retencionService: RetencionService, private transaccionService: TransaccionService,
		private planService: PlanService, private validacionesService: ValidacionesService, private beneficiarioService: BeneficiarioService
	) { }

	ngOnInit() {
		this.setBeneficiario();
		this.retencionService.contratoKey.subscribe(contratoKey => {
			this.contratoKey = contratoKey;
		});
		this.pantallaClienteUnico = new TipoPantallaPersonaUnica();
	}

	setBeneficiario(): void {
		this.beneficiario = new BeneficiarioList();
		this.tipoDocumento = null;
		this.beneficiario.CodigoRelacion = null;
		this.beneficiario.SexoPersona = null;
		this.beneficiario.Comisiona = null;
		this.beneficiario.TajetaBeneficiario = null;
		this.beneficiario.FechaInclusion = new Date();
		this.beneficiario.PrecioSugerido = 0.00;
	}

	loadBeneficiarios(beneficiarios: BeneficiarioList[]): void {
		this.beneficiarioSeleccionado = new BeneficiarioList();
		if (beneficiarios.find(x => x.EstadoBeneficiario != this.constant.CODIGO_ESTADO_ACTIVO)) {
			this.habiltarExcluir = true;
		} else {
			this.habiltarExcluir = false;
		}
		this.beneficiarioSeleccionado = this.beneficiarios[0];
	}

	seleccionarBeneficiario(beneficiario: BeneficiarioList) {
		this.beneficiarios.forEach(e => {
			e.Selected = false;
		});

		beneficiario.Selected = true;
		this.beneficiarioSeleccionado = beneficiario;
	}

	seleccionarDocumento() {
		if (this.tipoDocumento != null) {
			this.habilitarCampos = true;
		} else {
			this.habilitarCampos = false;
		}
	}

	incluir() {
		this.esMaternidad = false;
		this.setBeneficiario();
		this.beneficiario.FechaExlusion = new Date(this.beneficiarios[0].FechaExlusion);
		this.beneficiario.InclusionIntrautera = false;
		this.valorAntesDescuento = 0;
		this.habilitarCampos = false;
		this.tipoDocumento = null;
		this.documento = "0000000000";
		this.relaciones = [];
		this.cargarRelaciones();
		this.planService.getPrecioBasePlan(this.contratoKey).subscribe(precioBasePlan => {
			this.precioBasePlan = precioBasePlan;
		});
		$("#modalIncluir").modal();
	}

	cargarRelaciones(): void {
		this.relacionesService.getRelaciones().subscribe(relaciones => {
			relaciones.forEach(relacion => {
				if (relacion.CodigoRelacion != this.constant.CODIGO_RELACION_TITULAR)
					this.relaciones.push(relacion);
			})
		}), error => {
			this.authService.showErrorPopup(error);
		}
	}

	validaDocumento() {
		if (this.tipoDocumento != null) {
			if (this.tipoDocumento == 1) {
				this.validarCedula();
			} else {
				this.obtenerDatosPersona();
			}
		}
	}

	validarCedula() {
		if (this.documento.length != 10) {
			this.authService.showErrorPopup("El número de digitos debe ser 10");
		}else {
			this.validacionesService.validarCedula(this.documento).subscribe(result => {
				if (result) {
					this.obtenerDatosPersona();
				} else {
					this.authService.showErrorPopup("Cédula invalida");
				}
			});
		}
	}

	habilitarMaternidad(): void {
		if (this.beneficiario.CodigoRelacion != null && this.beneficiario.Edad != null) {
			if (this.beneficiario.Edad >= this.constant.RANGO_EDAD_MINIMO && this.beneficiario.Edad <= this.constant.RANGO_EDAD_MAXIMO
				&& this.beneficiario.CodigoRelacion == this.constant.CODIGO_RELACION_HIJO) {
				this.esMaternidad = true;
			} else {
				this.esMaternidad = false;
			}
		}
	}

	obtenerDatosPersona(): void {
		$(this).data('ActualizaPersona', null);
		this.transaccionService.validarDocumento(this.tipoDocumento, this.documento).subscribe(result => {
			if (result.Negativa == true) {
				this.authService.showInfoPopup("Existe una negativa de ingreso por lo que no se puede ingresar a esta persona, revisar esto con auditoría médica");
			} else {
				if (result.PantallaPersonaUnica == 1) {
					this.pantallaClienteUnico.NumeroPersona = this.contratoKey.NumeroPersona;
					this.pantallaClienteUnico.Desabilitar = true;
					this.pantallaClienteUnico.TipoPantalla = 1;
					$("#ActualizaPersona").modal();
				} else if (result.PantallaPersonaUnica == 2) {
					this.pantallaClienteUnico.Desabilitar = true;
					this.pantallaClienteUnico.NumeroPersona = result.Persona.NumeroPersona;
					this.pantallaClienteUnico.TipoPantalla = 2;
					$("#ActualizaPersona").modal();
				}
				
				if (this.tipoDocumento == 1) {
					this.pantallaClienteUnico.TipoDocumento = "CI";
					this.pantallaClienteUnico.Cedula = this.documento;
					this.pantallaClienteUnico.Pasaporte = "";
				} else if (this.tipoDocumento == 2) {
					this.pantallaClienteUnico.TipoDocumento = "PS";
					this.pantallaClienteUnico.Pasaporte = this.documento;
					this.pantallaClienteUnico.Cedula = "";
				} else if (this.tipoDocumento == 3) {
					this.pantallaClienteUnico.TipoDocumento = "HS";
					this.pantallaClienteUnico.Cedula = this.documento;
					this.pantallaClienteUnico.Pasaporte = "";
				}

				if (result.Persona != undefined) {
					this.beneficiario = result.Persona;
					if (this.beneficiario.FechaNacimiento != undefined) {
						this.beneficiario.FechaNacimiento = new Date(this.beneficiario.FechaNacimiento);
						this.beneficiario.Nombres = result.Persona.Nombres;
						this.beneficiario.Apellidos = result.Persona.Apellidos;
						this.beneficiario.NombresApellidos = result.Persona.Apellidos + " " + result.Persona.Nombres;
						if (this.beneficiario.FechaNacimiento != undefined) {
							this.calcularEdad();
						}
					}
					this.beneficiario.PorcentajeDescuento = 0;
					this.beneficiario.FechaInclusion = new Date();
					this.beneficiario.FechaExlusion = new Date(this.contratoKey.FechaFin);
					this.beneficiario.PrecioServicios = 0;
					this.beneficiario.EstadoBeneficiario = 1;
					if (this.beneficiario.SexoPersona) {
						this.beneficiario.TajetaBeneficiario = false;
					} else {
						this.beneficiario.TajetaBeneficiario = true;
					}
					
				}
			}
		})
	}

	calcularEdad(): void {
		if (this.beneficiario.FechaNacimiento != undefined && this.beneficiario.InclusionIntrautera != true) {
			var diaCorte = new Date().getDate();
			var mesCorte = new Date().getMonth() + 1;
			var anioCorte = new Date().getFullYear();

			var diaNacimiento = this.beneficiario.FechaNacimiento.getDate();
			var mesNacimiento = this.beneficiario.FechaNacimiento.getMonth() + 1;
			var anioNacimiento = this.beneficiario.FechaNacimiento.getFullYear();

			if (diaNacimiento > diaCorte) {
				diaCorte = diaCorte + 30 - diaNacimiento;
				mesNacimiento = mesNacimiento + 1;
			} else {
				diaCorte = diaCorte - diaNacimiento;
			}

			if (mesNacimiento > mesCorte) {
				mesCorte = mesCorte + 12 - mesNacimiento;
				anioNacimiento = anioNacimiento + 1;
			} else {
				mesCorte = mesCorte - mesNacimiento;
			}

			this.beneficiario.Edad = anioCorte - anioNacimiento;
			this.habilitarMaternidad();
			this.calcularPrecios();
		}
	}

	calcularPrecios(): void {
		if (this.contratoKey.CodigoProducto.toUpperCase() == "IND") {
			this.beneficiario.CodigoProducto = this.contratoKey.CodigoProducto;
			this.beneficiario.CodigoPlan = this.contratoKey.CodigoPlan;
			this.beneficiario.ValorDescuento = 0;
			this.transaccionService.getPrecioSugerido(this.beneficiario).subscribe(result => {
				if (result.Precio != -1) {
					this.contratoKey.PrecioBase = result.Precio;
					this.beneficiario.Factor = result.FactorHombres;
				} else {
					this.beneficiario.Factor = result.Factor;
					this.contratoKey.PrecioBase = this.beneficiario.Factor * this.precioBasePlan;
				}
				this.beneficiario.PrecioSugerido = this.contratoKey.PrecioBase;
				this.beneficiario.PrecioBeneficiario = this.beneficiario.PrecioSugerido - this.beneficiario.ValorDescuento;
				this.valorAntesDescuento = this.beneficiario.ValorDescuento + this.beneficiario.PrecioBeneficiario;
			}, error => this.authService.showErrorPopup(error));
		} else {
			let datosMaternidad = new DatosMaternidad();
			datosMaternidad.contratoKey = this.contratoKey;
			datosMaternidad.beneficiario = this.beneficiario;
			this.planService.getPrecioPlanONC(datosMaternidad).subscribe(precioONC => {
				this.beneficiario.PrecioSugerido = precioONC;
				this.beneficiario.PrecioBeneficiario = this.beneficiario.PrecioSugerido - this.beneficiario.ValorDescuento;
				this.valorAntesDescuento = this.beneficiario.ValorDescuento + this.beneficiario.PrecioBeneficiario;
			});
		}
	}

	closeModalClienteUnico(): void {
		$("#ActualizaPersona").modal('hide');
		$('#informacionPersonal').collapse('hide');
		$('#direccionDomicilio').collapse('hide');
		$('#direccionTrabajo').collapse('hide');
		$('#emergencia').collapse('hide');
		$('#correspondencia').collapse('hide');
		$('#infoOpcional').collapse('hide');
	}

	guardar() {
		let datosMaternidad = new DatosMaternidad();
		datosMaternidad.contratoKey = this.contratoKey;
		datosMaternidad.beneficiario = this.beneficiario;
		datosMaternidad.beneficiario.Region = this.contratoKey.CodigoRegion;
		datosMaternidad.beneficiario.NumeroContrato = this.contratoKey.NumeroContrato;
		this.beneficiarioService.getBeneficiario(datosMaternidad.beneficiario).subscribe(result => {
			if (result == null) {
				this.beneficiarioService.create(datosMaternidad).subscribe(result => {
					this.onLoadBilling.emit(true);
					this.authService.showSuccessPopup("Se ha creado el beneficiario correctamente.");
					this.cerrarModal('modalIncluir');
					this.mostrarPdf(result._body);
				}, error => this.authService.showErrorPopup('Ocurrió un error al guardar el beneficiario ' + error));
			} else {
				this.authService.showErrorPopup(result);
			}
		});
	}

	excluir(): void {
		if (this.beneficiarioSeleccionado.EstadoBeneficiario != this.constant.CODIGO_ESTADO_ANULADO) {
			if (this.beneficiarioSeleccionado.Titular) {
				this.excluirTitular();
			} else {
				swal({
					title: "¿Está seguro?",
					text: "Va a eliminar este beneficiario!",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#0266b1",
					confirmButtonText: "Si, elimínelo"
				}, confirmed => {
					if (confirmed) {
						let datosMaternidad = new DatosMaternidad();
						datosMaternidad.contratoKey = this.contratoKey;
						datosMaternidad.beneficiario = this.beneficiarioSeleccionado;
						datosMaternidad.TipoMovimiento = this.constant.MODULO_RETENCION;
						this.beneficiarioService.excluir(datosMaternidad).subscribe(result => {
							this.onLoadBilling.emit(true);
							this.authService.showSuccessPopup("Se ha excluido el beneficiario correctamente.");
							this.mostrarPdf(result._body);
						}, error => this.authService.showErrorPopup('Ocurrió un error al excluir el beneficiario. ' + error));
					}
				});
			}
		} else {
			this.authService.showInfoPopup("El beneficiario se encuentra excluido");
		}
	}

	excluirTitular(): void {
		this.beneficiariosAux = [];
		this.beneficiarios.forEach(b => {
			if (b.NumeroPersona != this.beneficiarioSeleccionado.NumeroPersona && b.EstadoBeneficiario == this.constant.CODIGO_ESTADO_ACTIVO && 
				b.Edad >= this.constant.RANGO_EDAD_MINIMO && b.CodigoRelacion != this.constant.CODIGO_RELACION_OTROS) {
				this.beneficiariosAux.push(b);
			}
		});

		if (this.beneficiariosAux.length > 1) {
			this.beneficiario = new BeneficiarioList();
			this.beneficiario.NumeroPersona = null;
			$("#modalTitular").modal();
		} else {
			swal({
				title: "¿Está seguro?",
				text: "Va a eliminar este beneficiario!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#0266b1",
				confirmButtonText: "Si, elimínelo"
			}, confirmed => {
				if (confirmed) {
					if (this.beneficiariosAux.length == 1) {
						let datosMaternidad = [];
						let datos = new DatosMaternidad();
						datos.contratoKey = this.contratoKey;
						datos.beneficiario = this.beneficiarioSeleccionado;
						datos.TipoMovimiento = this.constant.MODULO_RETENCION;
						datosMaternidad.push(datos);
						datos = new DatosMaternidad();
						datos.contratoKey = this.contratoKey;
						datos.beneficiario = this.beneficiariosAux[0];
						datos.TipoMovimiento = this.constant.MODULO_RETENCION;
						datosMaternidad.push(datos);
						
						this.beneficiarioService.excluirBeneficiarioTitular(datosMaternidad).subscribe(result => {
							this.onLoadBilling.emit(true);
							this.authService.showSuccessPopup("Se ha excluido el beneficiario correctamente.");
							this.mostrarPdf(result._body);
						}, error => this.authService.showErrorPopup("Ha ocurrido un error al guardar el beneficiario. " + error));
					} else {
						let datosMaternidad = new DatosMaternidad();
						datosMaternidad.contratoKey = this.contratoKey;
						datosMaternidad.beneficiario = this.beneficiarioSeleccionado;
						datosMaternidad.TipoMovimiento = this.constant.MODULO_RETENCION;
						this.beneficiarioService.excluirBeneficiarioTitularSinBeneficios(datosMaternidad).subscribe(result => {
							this.onLoadBilling.emit(true);
							this.authService.showSuccessPopup("Se ha excluido el beneficiario correctamente.");
							this.mostrarPdf(result._body);
						}, error => this.authService.showErrorPopup("Ha ocurrido un error al guardar el beneficiario. " + error));
					}
				}
			});
		}
	}

	reactivar(): void {
		if (this.beneficiarioSeleccionado.EstadoBeneficiario != this.constant.CODIGO_ESTADO_ACTIVO) {
			if (!this.beneficiarioSeleccionado.Titular && this.beneficiarioSeleccionado.CodigoRelacion == this.constant.CODIGO_RELACION_TITULAR) {
				this.codigoRelacion = null;
				this.relaciones = [];
				this.cargarRelaciones();
				$("#modalRelacion").modal();
			} else {
				swal({
					title: "¿Está seguro?",
					text: "Va a reactivar este beneficiario!",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#0266b1",
					confirmButtonText: "Si, reactivelo"
				}, confirmed => {
					if (confirmed) {
						let datosMaternidad = new DatosMaternidad();
						datosMaternidad.contratoKey = this.contratoKey;
						datosMaternidad.beneficiario = this.beneficiarioSeleccionado;

						this.beneficiarioService.getBeneficiarioSinBeneficios(this.beneficiarioSeleccionado).subscribe(result => {
							if (result) {
								this.beneficiarioService.reactivarTitularSinBeneficios(datosMaternidad).subscribe(result => {
									this.onLoadBilling.emit(true);
									this.authService.showSuccessPopup("Se ha reactivado el beneficiario correctamente.");
									this.mostrarPdf(result._body);
								}, error => {
									this.authService.showErrorPopup("Ha ocurrido un error al guardar el beneficiario. " + error);
								});
							} else {
								this.beneficiarioService.reactivar(datosMaternidad).subscribe(result => {
									this.onLoadBilling.emit(true);
									this.authService.showSuccessPopup("Se ha reactivado el beneficiario correctamente.");
									this.mostrarPdf(result._body);
								}, error => this.authService.showErrorPopup("Ha ocurrido un error al guardar el beneficiario. " + error));
							}
						});
					}
				});
			}
		} else {
			this.authService.showInfoPopup("El beneficiario se encuentra activo");
		}
	}

	modificarFactura(beneficiario): void {
		this.planService.getPrecioBasePlan(this.contratoKey).subscribe(precioBasePlan => {
			this.precioBasePlan = precioBasePlan;
			this.beneficiarioMaternidad = beneficiario;
			this.transaccionService.getPrecioSugerido(this.beneficiarioMaternidad).subscribe(result => {
				if (result.Precio != -1) {
					this.contratoKey.PrecioBase = result.Precio;
					this.beneficiarioMaternidad.Factor = result.FactorHombres;
				} else {
					this.beneficiarioMaternidad.Factor = result.Factor;
					this.contratoKey.PrecioBase = this.beneficiarioMaternidad.Factor * this.precioBasePlan;
				}
				this.beneficiarioMaternidad.PrecioAnterior = this.beneficiarioMaternidad.PrecioBeneficiario;
				this.beneficiarioMaternidad.PrecioSugerido = this.contratoKey.PrecioBase;
				this.beneficiarioMaternidad.ValorDescuento = 0;
				this.beneficiarioMaternidad.PrecioBeneficiario = beneficiario.PrecioSugerido - beneficiario.ValorDescuento;
				this.onLoadBilling.emit(this.beneficiarioMaternidad);
			}, error => this.authService.showErrorPopup(error));
		});
	}

	cambiarTitular(beneficiario): void {
		this.beneficiarioTitular = this.beneficiarios.find(x => x.NumeroPersona == beneficiario.NumeroPersona);
	}

	guardarNuevoTitular(): void {
		let datosMaternidad = [];
		let datos = new DatosMaternidad();
		datos.contratoKey = this.contratoKey;
		datos.beneficiario = this.beneficiarioSeleccionado;
		datos.TipoMovimiento = this.constant.MODULO_RETENCION;
		datosMaternidad.push(datos);
		datos = new DatosMaternidad();
		datos.contratoKey = this.contratoKey;
		datos.beneficiario = this.beneficiarioTitular;
		datos.TipoMovimiento = this.constant.MODULO_RETENCION;
		datosMaternidad.push(datos);
		
		this.beneficiarioService.excluirBeneficiarioTitular(datosMaternidad).subscribe(result => {
			if (result) {
				this.onLoadBilling.emit(true);
				this.authService.showSuccessPopup("Se ha excluido el beneficiario correctamente.");
				this.cerrarModal("modalTitular");
				this.mostrarPdf(result._body);
			} else {
				this.authService.showErrorPopup("Ha ocurrido un error al guardar el beneficiario.");
			}
		}), error => this.authService.showErrorPopup(error);
	}

	actualizarRelacion(): void {
		this.beneficiarioSeleccionado.CodigoRelacion = this.codigoRelacion;
		let datosMaternidad = new DatosMaternidad();
		datosMaternidad.contratoKey = this.contratoKey;
		datosMaternidad.beneficiario = this.beneficiarioSeleccionado;
		datosMaternidad.TipoMovimiento = this.constant.MODULO_RETENCION;
		this.beneficiarioService.actualizarRelacionBeneficiario(datosMaternidad).subscribe(response => {
			this.onLoadBilling.emit(true);
			this.authService.showSuccessPopup("Se ha reactivado el beneficiario correctamente.");
			this.cerrarModal('modalRelacion');
			this.mostrarPdf(response._body);
		}, error => {
			this.authService.showErrorPopup("Ha ocurrido un error al guardar el beneficiario. " + error);
		})
	}

	cerrarModal(modal: string): void {
		$(`#${modal}`).modal('hide');
	}

	mostrarPdf(pdf: any): void {
		var blob = new Blob([pdf], { type: 'application/pdf' });
		var fileURL = URL.createObjectURL(blob);
		window.open(fileURL);
	}
}