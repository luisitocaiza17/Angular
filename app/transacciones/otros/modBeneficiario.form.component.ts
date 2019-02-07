import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { BeneficiarioList, BeneficiarioKey } from '../../common/model/beneficiario';
import { ContratoKey } from '../../common/model/contrato';
import { TipoPantallaPersonaUnica } from '../../common/model/persona';
import { AuthService } from '../../seguridad/auth.service';
import { BeneficiarioService } from '../../common/servicios/beneficiario.service';
import { VariablesConstantService } from '../../utils/variableConstant.service.';
import { DatosMaternidad, DatosCreaServicioBeneficiario } from '../../common/model/transacciones';
import { Subscription, Observable } from 'rxjs';
import { Relacion } from '../../common/model/relacion';
import { RelacionesService } from '../../common/servicios/relaciones.service';
import { PlanService } from '../../common/servicios/plan.service';
import { ValidacionesService } from '../../common/servicios/validaciones.services';
import { TransaccionService } from '../../common/servicios/transaccion.service';
import { ServicioAdicionalPersonaService } from '../../common/servicios/servicioAdicionalPersona.service';
import { ServiciosContratoEntity, PrecioServicioEntity, ServiciosEntity, ValorNivelDescripcion, FilterSevicio } from '../../common/model/servicioAdicionalPersona';
import { utilidadesGenericasService } from '../../utils/utilidadesGenericas';
import { DetalleRemesaService } from '../../common/servicios/detalleRemesa.service';

@Component({
	selector: 'modBeneficiario',
	providers: [RelacionesService, ValidacionesService],
	templateUrl: 'modBeneficiario.form.template.html'
})

export class ModBeneficiarioFormComponent implements OnInit {
	@ViewChild('formBeneficiario')
	formBeneficiario: any
	@ViewChild('formServicios')
	formServicios: any

	beneficiarios: BeneficiarioList[];
	beneficiario: BeneficiarioList;
	beneficiarioSeleccionado: BeneficiarioList;
	_contratoKey: ContratoKey;
	clienteUnico: TipoPantallaPersonaUnica;
	showBeneficiarios: boolean;
	beneficiariosAux: BeneficiarioList[];
	beneficiarioKey: BeneficiarioKey;
	subscription: Subscription;
	interval: any;
	beneficiarioTitular: BeneficiarioList;
	relaciones: Relacion[];
	codigoRelacion: number;
	tipoDocumento: number;
	habilitarCampos: boolean;
	documento: string;
	esMaternidad: boolean;
	valorAntesDescuento: number;

	activateBotonS: string;
	activateBotonB: string;
	showServicios: boolean;
	serviciosAdicionales: ServiciosContratoEntity[];
	servicio: ServiciosContratoEntity;
	title: string;
	servicioAdicionalSeleccionado: ServiciosContratoEntity;
	servicios: ServiciosEntity[];
	precioVida: PrecioServicioEntity;
	precioMuerteAccidental: PrecioServicioEntity;
	precioHelpone: PrecioServicioEntity;
	error: string;
	titulo: string;
	subtitulo: string;
	serviciosEspeciales: ValorNivelDescripcion[];
	nombreNivel: string;
	listaEspecial: ValorNivelDescripcion;
	datosCrearServicio: DatosCreaServicioBeneficiario;

	buscaCodigoTyped: number;
	activaPasaporte: boolean;

	FacturadoHasta: Date;

	datepickerOpts = {
		autoclose: true,
		todayHighlight: true,
		format: 'dd/mm/yyyy',
		icon: 'fa fa-calendar',
		placeholder: 'dd/mm/yyyy',
		language: 'es'
	}

	@Input()
	set contratoKey(contratoKey: ContratoKey) {
		this._contratoKey = contratoKey;
		if (this._contratoKey != undefined) {
			this.loadBeneficiarios();
		}
	}

	constructor(private beneficiarioService: BeneficiarioService, private constants: VariablesConstantService, private authService: AuthService,
		private relacionesService: RelacionesService, private planService: PlanService, private validacionesService: ValidacionesService,
		private transaccionService: TransaccionService, private serviciosAdicionalesService: ServicioAdicionalPersonaService,
		private changeDetector: ChangeDetectorRef, public utils: utilidadesGenericasService, private detalleRemesaService: DetalleRemesaService
	) {
	}

	ngOnInit(): void {
		this.title = "Gestión de Beneficiarios";
		this.activateBotonB = "btn-primary";
		this.activateBotonS = "btn-unselected";
		this.beneficiarios = [];
		this.beneficiario = new BeneficiarioList();
		this.clienteUnico = new TipoPantallaPersonaUnica();
		this.showBeneficiarios = true;
		this.showServicios = false;
		this.serviciosAdicionales = [];
		this.beneficiarioSeleccionado = new BeneficiarioList();
		this.servicioAdicionalSeleccionado = new ServiciosContratoEntity();
		this.servicio = new ServiciosContratoEntity();
		this.serviciosEspeciales = [];
		this.activaPasaporte = false;
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
		clearInterval(this.interval);
	}

	abrirPantalla(accion: boolean): void {
		if (!accion) {
			this.title = "Gestión de Beneficiarios";
			this.activateBotonB = "btn-primary";
			this.activateBotonS = "btn-unselected";
			this.showBeneficiarios = true;
			this.showServicios = false;
		} else {
			this.title = "Gestión de Servicios Adicionales";
			this.activateBotonS = "btn-primary";
			this.activateBotonB = "btn-unselected";
			this.showServicios = true;
			this.showBeneficiarios = false;
			this._contratoKey.NumeroPersona = this.beneficiarioSeleccionado.NumeroPersona;
			this.serviciosAdicionalesService.getServiciosAdicionalesBeneficiario(this._contratoKey)
				.subscribe(serviciosAdicionales => {
					this.serviciosAdicionales = [];
					this.serviciosAdicionales = serviciosAdicionales;
					this.servicioAdicionalSeleccionado = this.serviciosAdicionales[0];
				}
				);
		}
	}

	loadBeneficiarios(): void {
		/*TO DO bloquear botones cuando sea moroso???*/
		if (this._contratoKey.EsMoroso == true) {
			this.authService.showInfoPopup("Imposible Realizar esta Modificación, Contrato Moroso");
			return;
		} else {
			this.beneficiarioKey = new BeneficiarioKey();
			this.beneficiarioKey.CodigoRegion = this._contratoKey.CodigoRegion;
			this.beneficiarioKey.CodigoProducto = this._contratoKey.CodigoProducto;
			this.beneficiarioKey.NumeroContrato = this._contratoKey.NumeroContrato;
			this.subscription = this.beneficiarioService.getBeneficiariosMaternidad(this.beneficiarioKey).subscribe(
				datosrecibidos => {
					this.beneficiarios = datosrecibidos;
					this.beneficiarios.forEach(element => {
						if (element.FechaExlusion != undefined && element.FechaExlusion != null) {
							element.FechaExlusion = this.utils.GetDateTimeUTCTimeZone(element.FechaExlusion);
						}
					});
					this.beneficiarioSeleccionado = this.beneficiarios[0];
				});
		}
	}

	seleccionarBeneficiario(beneficiario: BeneficiarioList): void {
		this.beneficiarios.forEach(e => {
			e.Selected = false;
		});

		beneficiario.Selected = true;
		this.beneficiarioSeleccionado = beneficiario;
	}

	incluirBeneficiario(): void {
		this.beneficiarioService.getDatosBeneficiarioTitular(this._contratoKey).subscribe(
			databeneficiario => {
				if (databeneficiario != null && databeneficiario != undefined) {
					this.clienteUnico.PersonaEntity = databeneficiario;
				} else {
					this.clienteUnico.PersonaEntity = null;
				}
			}, error => this.authService.showErrorPopup(error)
		);

		this.formBeneficiario.reset();
		this.formBeneficiario._submitted = false;
		this.beneficiario.PrecioSugerido = 0.00;
		this.setBeneficiario();
		this.habilitarCampos = false;
		this.documento = "0000000000";
		this.relaciones = [];
		this.cargarRelaciones();
		$("#modalIncluir").modal();
	}

	setBeneficiario(): void {
		this.beneficiario = new BeneficiarioList();
		this.tipoDocumento = null;
		this.beneficiario.CodigoRelacion = null;
		this.beneficiario.SexoPersona = null;
		this.beneficiario.Comisiona = null;
		this.beneficiario.TajetaBeneficiario = null;

		//this.beneficiario.FechaInclusion = new Date();
		this.detalleRemesaService.getUltimaFechaFacturadoHasta(this._contratoKey).subscribe(obtenFecha => {
			if (obtenFecha != undefined && obtenFecha != null) {
				this.beneficiario.FechaInclusion = this.utils.GetDateTimeUTCTimeZone(obtenFecha);
				this.FacturadoHasta = this.utils.GetDateTimeUTCTimeZone(obtenFecha);
			}
		});

		this.beneficiario.PrecioSugerido = 0.00;
		//this.beneficiario.FechaExlusion = new Date(this.beneficiarios[0].FechaExlusion);
		this.beneficiario.InclusionIntrautera = false;
	}

	seleccionarDocumento() {
		this.activaPasaporte = false;

		if (this.tipoDocumento != null) {

			this.documento = "";
			this.habilitarCampos = true;
			if (this.tipoDocumento == 2) {
				this.activaPasaporte = true;
			}

		} else {
			this.habilitarCampos = false;
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
		} else {
			this.validacionesService.validarCedula(this.documento).subscribe(result => {
				if (result) {
					this.obtenerDatosPersona();
				} else {
					this.authService.showErrorPopup("Cédula invalida");
				}
			});
		}
	}

	obtenerDatosPersona(): void {
		$(this).data('ActualizaPersona', null);
		this.transaccionService.validarDocumento(this.tipoDocumento, this.documento).subscribe(result => {
			if (result.Negativa == true) {
				this.authService.showInfoPopup("Existe una negativa de ingreso por lo que no se puede ingresar a esta persona, revisar esto con auditoría médica");
			} else {
				if (result.PantallaPersonaUnica == 1) {
					this.clienteUnico.NumeroPersona = this._contratoKey.NumeroPersona;
					this.clienteUnico.Desabilitar = true;
					this.clienteUnico.TipoPantalla = 1;
					$("#ActualizaPersona").modal();
				} else if (result.PantallaPersonaUnica == 2) {
					this.clienteUnico.Desabilitar = true;
					this.clienteUnico.NumeroPersona = result.Persona.NumeroPersona;
					this.clienteUnico.TipoPantalla = 2;
					$("#ActualizaPersona").modal();
				}

				if (this.tipoDocumento == 1) {
					this.clienteUnico.TipoDocumento = "CI";
					this.clienteUnico.Cedula = this.documento;
					this.clienteUnico.Pasaporte = "";
				} else if (this.tipoDocumento == 2) {
					this.clienteUnico.TipoDocumento = "PS";
					this.clienteUnico.Pasaporte = this.documento;
					this.clienteUnico.Cedula = "";
				} else if (this.tipoDocumento == 3) {
					this.clienteUnico.TipoDocumento = "HS";
					this.clienteUnico.Cedula = this.documento;
					this.clienteUnico.Pasaporte = "";
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

					if (result.Persona.FechaInclusion != undefined && result.Persona.FechaInclusion != null) {
						this.beneficiario.FechaInclusion = this.utils.GetDateTimeUTCTimeZone(result.Persona.FechaInclusion);
					} else {
						this.detalleRemesaService.getUltimaFechaFacturadoHasta(this._contratoKey).subscribe(obtenFecha => {
							if (obtenFecha != undefined && obtenFecha != null) {
								this.beneficiario.FechaInclusion = this.utils.GetDateTimeUTCTimeZone(obtenFecha);
							}
						});
					}

					//this.beneficiario.FechaInclusion = new Date();
					this.beneficiario.FechaExlusion = new Date(this._contratoKey.FechaFin);
					this.beneficiario.PrecioServicios = 0;
					this.beneficiario.EstadoBeneficiario = 1;
					if (this.beneficiario.SexoPersona) {
						this.beneficiario.TajetaBeneficiario = false;
					} else {
						this.beneficiario.TajetaBeneficiario = true;
					}
				}
			}
		});
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

	habilitarMaternidad(): void {
		if (this.beneficiario.CodigoRelacion != null && this.beneficiario.Edad != null) {
			if (this.beneficiario.Edad >= this.constants.RANGO_EDAD_MINIMO &&
				this.beneficiario.Edad <= this.constants.RANGO_EDAD_MAXIMO &&
				this.beneficiario.CodigoRelacion == this.constants.CODIGO_RELACION_HIJO) {
				this.esMaternidad = true;
			} else {
				this.esMaternidad = false;
			}
		}
	}

	calcularPrecios(): void {
		this.beneficiario.PorcentajeDescuento = 0;//siempre sera cero
		if (this._contratoKey.CodigoProducto.toUpperCase() == "IND") {
			this.beneficiario.CodigoProducto = this._contratoKey.CodigoProducto;
			this.beneficiario.CodigoPlan = this._contratoKey.CodigoPlan;
			this.beneficiario.ValorDescuento = 0;
			this.transaccionService.getPrecioSugerido(this.beneficiario).subscribe(result => {
				if (result.Precio != -1) {
					this._contratoKey.PrecioBase = result.Precio;
					this.beneficiario.Factor = result.FactorHombres;
				} else {
					this.beneficiario.Factor = result.Factor;
					this._contratoKey.PrecioBase = this.beneficiario.Factor * this._contratoKey.PrecioBase;
				}
				this.beneficiario.PrecioSugerido = this._contratoKey.PrecioBase;
				this.beneficiario.PrecioBeneficiario = this.beneficiario.PrecioSugerido - this.beneficiario.ValorDescuento;
				this.valorAntesDescuento = this.beneficiario.ValorDescuento + this.beneficiario.PrecioBeneficiario;
			}, error => this.authService.showErrorPopup(error));
		} else if (this._contratoKey.CodigoProducto.toUpperCase() == "ONC") {
			let datosMaternidad = new DatosMaternidad();
			datosMaternidad.contratoKey = this._contratoKey;
			datosMaternidad.beneficiario = this.beneficiario;
			this.planService.getPrecioPlanONC(datosMaternidad).subscribe(precioONC => {
				this.beneficiario.Factor = 1;
				this.beneficiario.PrecioSugerido = precioONC;
				this.beneficiario.PrecioBeneficiario = this.beneficiario.PrecioSugerido - this.beneficiario.ValorDescuento;
				this.valorAntesDescuento = this.beneficiario.ValorDescuento + this.beneficiario.PrecioBeneficiario;
			});
		} else if (this._contratoKey.CodigoProducto.toUpperCase() == "XPR") {
			this.planService.getPrecioPlanXPR(this._contratoKey).subscribe(result => {
				if (result != null && result != undefined) {
					this.beneficiario.PrecioSugerido = result;
					this.beneficiario.PrecioBeneficiario = this.beneficiario.PrecioSugerido - this.beneficiario.ValorDescuento;
				}
			}, error => this.authService.showErrorPopup(error)
			);
		} else {
			this.authService.showInfoPopup("Producto es diferente a IND ONC o XPR");
		}
	}

	guardarBeneficiario(): void {
		this.beneficiario.FechaExlusion = this.FacturadoHasta;

		if (this.beneficiario.NumeroPersona != undefined && this.beneficiario.NumeroPersona != null) {
			let datosMaternidad = new DatosMaternidad();
			datosMaternidad.contratoKey = this._contratoKey;
			datosMaternidad.beneficiario = this.beneficiario;
			datosMaternidad.beneficiario.Region = this._contratoKey.CodigoRegion;
			datosMaternidad.beneficiario.NumeroContrato = this._contratoKey.NumeroContrato;
			datosMaternidad.TipoMovimiento = this.constants.MODULO_TRANSACCION;
			this.beneficiarioService.getBeneficiario(datosMaternidad.beneficiario).subscribe(result => {
				if (result == null) {
					this.beneficiarioService.create(datosMaternidad).subscribe(result => {
						this.cargarBeneficiarios("Se ha creado el beneficiario correctamente.", "modalIncluir", result._body)
					}, error => this.authService.showErrorPopup('Ocurrió un error al guardar el beneficiario ' + error));
				} else {
					this.authService.showErrorPopup(result);
				}
			});
		} else {
			this.authService.showInfoPopup("El beneficiacio debe ser registrado antes de ser incluirlo");
		}
	}

	selectFechaExclusion(): void {
		this.beneficiarioSeleccionado.FechaExlusion = new Date();
		this.detalleRemesaService.getUltimaFechaFacturadoHasta(this._contratoKey).subscribe(obtenFecha => {
			if (obtenFecha != undefined && obtenFecha != null) {
				this.beneficiarioSeleccionado.FechaExlusion = this.utils.GetDateTimeUTCTimeZone(obtenFecha);
			}
		});
		$("#modalFechaExclusion").modal();
	}

	excluirBeneficiario(): void {
		if (this.beneficiarioSeleccionado.EstadoBeneficiario != this.constants.CODIGO_ESTADO_ANULADO) {
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
						this.cerrarModal("modalFechaExclusion");
						this.setearChangeDetector();
						let datosMaternidad = new DatosMaternidad();
						datosMaternidad.contratoKey = this._contratoKey;
						datosMaternidad.beneficiario = this.beneficiarioSeleccionado;
						datosMaternidad.TipoMovimiento = this.constants.MODULO_TRANSACCION;
						this.beneficiarioService.excluir(datosMaternidad).subscribe(result => {
							this.cargarBeneficiarios("Se ha excluido el beneficiario correctamente.", "", result._body);
						}, error => this.authService.showErrorPopup('Ocurrió un error al excluir el beneficiario. ' + error));
					}
				});
			}
		} else {
			this.authService.showErrorPopup("El beneficiario se encuentra anulado");
		}
	}

	excluirTitular(): void {
		this.beneficiariosAux = [];
		this.beneficiarios.forEach(b => {
			if (b.NumeroPersona != this.beneficiarioSeleccionado.NumeroPersona && b.EstadoBeneficiario == this.constants.CODIGO_ESTADO_ACTIVO &&
				b.Edad >= this.constants.RANGO_EDAD_MINIMO && b.CodigoRelacion != this.constants.CODIGO_RELACION_OTROS) {
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
					this.setearChangeDetector();
					if (this.beneficiariosAux.length == 1) {
						let datosMaternidad = [];
						let datos = new DatosMaternidad();
						datos.contratoKey = this._contratoKey;
						datos.beneficiario = this.beneficiarioSeleccionado;
						datos.TipoMovimiento = this.constants.MODULO_TRANSACCION;
						datosMaternidad.push(datos);
						datos = new DatosMaternidad();
						datos.contratoKey = this._contratoKey;
						datos.beneficiario = this.beneficiariosAux[0];
						datos.TipoMovimiento = this.constants.MODULO_TRANSACCION;
						datosMaternidad.push(datos);

						this.beneficiarioService.excluirBeneficiarioTitular(datosMaternidad).subscribe(result => {
							this.cargarBeneficiarios("Se ha excluido el beneficiario correctamente.", "", result._body);
						}, error => this.authService.showErrorPopup("Ha ocurrido un error al guardar el beneficiario. " + error));
					} else {
						let datosMaternidad = new DatosMaternidad();
						datosMaternidad.contratoKey = this._contratoKey;
						datosMaternidad.beneficiario = this.beneficiarioSeleccionado;
						datosMaternidad.TipoMovimiento = this.constants.MODULO_TRANSACCION;
						this.beneficiarioService.excluirBeneficiarioTitularSinBeneficios(datosMaternidad).subscribe(result => {
							this.cargarBeneficiarios("Se ha excluido el beneficiario correctamente.", "", result._body);
						}, error => this.authService.showErrorPopup("Ha ocurrido un error al guardar el beneficiario. " + error));
					}
				}
			});
		}
	}

	cambiarTitular(beneficiario): void {
		this.beneficiarioTitular = this.beneficiarios.find(x => x.NumeroPersona == beneficiario.NumeroPersona);
	}

	guardarNuevoTitular(): void {
		this.setearChangeDetector();
		let datosMaternidad = [];
		let datos = new DatosMaternidad();
		datos.contratoKey = this._contratoKey;
		datos.beneficiario = this.beneficiarioSeleccionado;
		datos.TipoMovimiento = this.constants.MODULO_TRANSACCION;
		datosMaternidad.push(datos);
		datos = new DatosMaternidad();
		datos.contratoKey = this._contratoKey;
		datos.beneficiario = this.beneficiarioTitular;
		datos.TipoMovimiento = this.constants.MODULO_TRANSACCION;
		datosMaternidad.push(datos);

		this.beneficiarioService.excluirBeneficiarioTitular(datosMaternidad).subscribe(result => {
			if (result) {
				this.cargarBeneficiarios("Se ha excluido el beneficiario correctamente.", "modalTitular", result._body);
			} else {
				this.authService.showErrorPopup("Ha ocurrido un error al guardar el beneficiario.");
			}
		}), error => this.authService.showErrorPopup(error);
	}

	reactivarBeneficiario(): void {
		if (this.beneficiarioSeleccionado.EstadoBeneficiario != this.constants.CODIGO_ESTADO_ACTIVO) {
			if (!this.beneficiarioSeleccionado.Titular && this.beneficiarioSeleccionado.CodigoRelacion == this.constants.CODIGO_RELACION_TITULAR) {
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
						this.setearChangeDetector();
						let datosMaternidad = new DatosMaternidad();
						datosMaternidad.contratoKey = this._contratoKey;
						datosMaternidad.beneficiario = this.beneficiarioSeleccionado;
						datosMaternidad.TipoMovimiento = this.constants.MODULO_TRANSACCION;

						this.beneficiarioService.getBeneficiarioSinBeneficios(this.beneficiarioSeleccionado).subscribe(result => {
							if (result) {
								this.beneficiarioService.reactivarTitularSinBeneficios(datosMaternidad).subscribe(result => {
									this.cargarBeneficiarios("Se ha reactivado el beneficiario correctamente.", "", result._body);
								}, error => {
									this.authService.showErrorPopup("Ha ocurrido un error al guardar el beneficiario. " + error);
								});
							} else {
								this.beneficiarioService.reactivar(datosMaternidad).subscribe(result => {
									this.cargarBeneficiarios("Se ha reactivado el beneficiario correctamente.", "", result._body);
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

	cargarRelaciones(): void {
		this.relacionesService.getRelaciones().subscribe(relaciones => {
			relaciones.forEach(relacion => {
				if (relacion.CodigoRelacion != this.constants.CODIGO_RELACION_TITULAR)
					this.relaciones.push(relacion);
			})
		}), error => {
			this.authService.showErrorPopup(error);
		}
	}

	actualizarRelacion(): void {
		this.setearChangeDetector();
		this.beneficiarioSeleccionado.CodigoRelacion = this.codigoRelacion;
		let datosMaternidad = new DatosMaternidad();
		datosMaternidad.contratoKey = this._contratoKey;
		datosMaternidad.beneficiario = this.beneficiarioSeleccionado;
		datosMaternidad.TipoMovimiento = this.constants.MODULO_RETENCION;
		this.beneficiarioService.actualizarRelacionBeneficiario(datosMaternidad).subscribe(response => {
			this.cargarBeneficiarios("Se ha reactivado el beneficiario correctamente.", "modalRelacion", response._body);
		}, error => {
			this.authService.showErrorPopup("Ha ocurrido un error al guardar el beneficiario. " + error);
		})
	}

	cargarBeneficiarios(mensaje: string, modal: string, body: any) {
		this.beneficiarioService.getBeneficiariosMaternidad(this.beneficiarioKey).subscribe(beneficiarios => {
			this.beneficiarios = beneficiarios;
			this.interval = setInterval(() => {
				this.changeDetector.detectChanges();
				this.changeDetector.detach();
			}, 100);
			this.authService.showSuccessPopup(mensaje);
			if (modal != "") {
				this.cerrarModal(modal);
			}
			this.mostrarPdf(body);
		});
	}

	seleccionarServicio(servicioAdicional: ServiciosContratoEntity): void {
		this.serviciosAdicionales.forEach(servicio => {
			servicio.Selected = false;
		});

		servicioAdicional.Selected = true;
		this.servicioAdicionalSeleccionado = servicioAdicional;
	}

	nuevoServicio() {
		this.formServicios.reset();
		this.formServicios._submitted = false;
		this.servicio.CodigoServicio = null;
		this.servicios = [];
		this.servicio.FechaInicio = new Date();

		this.detalleRemesaService.getUltimaFechaFacturadoHasta(this._contratoKey).subscribe(obtenFecha => {
			if (obtenFecha != undefined && obtenFecha != null) {
				this.servicio.FechaInicio = this.utils.GetDateTimeUTCTimeZone(obtenFecha);
				this.FacturadoHasta = this.utils.GetDateTimeUTCTimeZone(obtenFecha);
			}
		});

		this.serviciosAdicionalesService.getServicios().subscribe(servicios => {
			servicios.forEach(servicio => {
				if (!this.serviciosAdicionales.find(s => s.CodigoServicio == servicio.CodigoServicio)) {
					this.servicios.push(servicio);
				}
			});
		}, error => this.authService.showErrorPopup(error));

		this.cargarPrecioServicio(2, "TRA", this.beneficiarioSeleccionado.Edad).subscribe(precioVida => this.precioVida = precioVida);
		this.cargarPrecioServicio(25, "TRA", this.beneficiarioSeleccionado.Edad).subscribe(precioHelpone => this.precioHelpone = precioHelpone);
		this.cargarPrecioServicio(26, "TRA", this.beneficiarioSeleccionado.Edad).subscribe(precioMuerteAccidental => this.precioMuerteAccidental = precioMuerteAccidental);

		$("#ModalNuevoServicio").modal();
	}

	cargarPrecioServicio(codigoServicio, tipoProducto, edad): Observable<PrecioServicioEntity> {
		return this.serviciosAdicionalesService.getDetalleServicio(codigoServicio, tipoProducto, edad);
	}

	buscarCodigo(): void {
		if (this.buscaCodigoTyped != undefined && this.buscaCodigoTyped != null) {
			let existe = this.servicios.find(x => x.CodigoServicio == this.buscaCodigoTyped);
			if (existe != null && existe != undefined) {
				this.servicio.CodigoServicio = this.buscaCodigoTyped;
				this.changeServicio();
			} else {
				this.authService.showInfoPopup("No se puede obtener el c&oacute;digo que est&aacute; buscando.");
			}
		}
		this.buscaCodigoTyped = 0;
	}

	changeServicio(): void {
		if (this.servicio.CodigoServicio != null) {
			this.error = null;
			this.servicio.NivelCobertura = this.servicio.CodigoServicio > 2 ? this._contratoKey.NivelReferencia : 0;
			if (this.servicio.CodigoServicio == 2 || this.servicio.CodigoServicio == 26) {
				this.subtitulo = "Tipo";
				this.serviciosEspeciales = [];
				if (this.servicio.CodigoServicio == 2) {
					this.titulo = "Seleccione una Cobertura de Vida"
					this.subtitulo = "Nivel";
					let valorVida = this.precioVida.Valor.split(";");
					if (valorVida.length != 0) {
						this.nombreNivel = valorVida.length <= 10 ? "Nivel" : "Vida Especial";
						let level = 1;
						valorVida.forEach(element => {
							let servicioEspecial = new ValorNivelDescripcion();
							servicioEspecial.Nivel = level;
							servicioEspecial.Descripcion = this.nombreNivel + " " + level;
							servicioEspecial.Valor = parseFloat(element);
							this.serviciosEspeciales.push(servicioEspecial);
							level++;
						});

						$("#myModal").modal();
					} else {
						this.error = "No esta disponible Registro de COBERTURAS";
					}
				}

				if (this.servicio.CodigoServicio == 26) {
					this.titulo = "Seleccione una Cobertura de Muerte Accidental";
					let valorMuerte = this.precioMuerteAccidental.Valor.split(";");
					if (valorMuerte.length != 0) {
						var level = 1;
						valorMuerte.forEach(element => {
							let servicioEspecial = new ValorNivelDescripcion();
							servicioEspecial.Nivel = level;
							servicioEspecial.Descripcion = "Nivel " + level;
							servicioEspecial.Valor = parseFloat(element);
							this.serviciosEspeciales.push(servicioEspecial);
							level++;
						});
						$("#myModal").modal();
					} else {
						this.error = "No esta disponible COBERTURAS de Muerte Accidental";
					}

					return;
				}
			} else {
				this.precioServicio();
			}
		}
	}

	precioServicio() {
		let montoCobertura = 0;
		let precio = 0;
		let TipoProducto = "TRA";
		if (this.servicio.CodigoServicio == 6) {
			if (this._contratoKey.Ciudad == 2) {
				TipoProducto = "TCO";
			}
			else {
				TipoProducto = "TSI";
			}
		}

		let filterServicio = new FilterSevicio();
		filterServicio.CodigoServicio = this.servicio.CodigoServicio;
		filterServicio.Edad = this.beneficiarioSeleccionado.Edad;
		filterServicio.FechaInicioServicio = this.servicio.FechaInicio;
		filterServicio.TipoProducto = TipoProducto;
		filterServicio.Nivel = this.servicio.NivelCobertura;
		filterServicio.CodigoProducto = this._contratoKey.CodigoProducto;
		filterServicio.CodigoPlan = this._contratoKey.CodigoPlan;
		this.serviciosAdicionalesService.PrecioServicio(filterServicio).subscribe(
			result => {
				precio = result.Precio;
				montoCobertura = result.MontoCobertura;
				if (result.Estado == false) {
					this.servicio.PrecioServicios = precio;
					this.servicio.MontoCobertura = montoCobertura;
					this.servicio.EstadoServicio = 0;
				}

				this.servicio.PrecioServicios = precio;
				this.servicio.MontoCobertura = montoCobertura;
				if (this.servicio.CodigoServicio == 26) {
					this.servicio.MontoCobertura = this.listaEspecial.Valor;
				}

				this.servicios.forEach(element => {
					if (element.CodigoServicio == this.servicio.CodigoServicio) {
						this.servicio.EstadoServicio = element.CodigoEstado;
						this.servicio.NombreEstado = element.NombreEstado;
						this.servicio.DescripcionServicio = element.DescripcionServicio;
						this.servicio.Contador = 0;
					}
				});
			}, error => this.authService.showErrorPopup(error));
	}

	seleccionarNivel(servicioEspecial: ValorNivelDescripcion): void {
		this.servicio.NivelCobertura = servicioEspecial.Nivel;
		$('#myModal').modal('hide');
		this.precioServicio();
	}

	guardarServicio(): void {
		var today = new Date();
		this.beneficiarioSeleccionado.FechaExlusion = this.FacturadoHasta;

		if (this.beneficiarioSeleccionado.CodigoRelacion > 2 && this.servicio.CodigoServicio == 2) {
			this.authService.showInfoPopup("El Seguro de Vida es solo para Titular y/o Conyuge");
			return;
		}

		/* if (this.servicio.FechaInicio.getDate() < today.getDate()) {
			this.authService.showErrorPopup("La fecha de inicio no puede ser menor a la fecha actual");
			return;
		} */
		this.crearServicio();
	}

	crearServicio() {
		var filter = new ContratoKey();
		this.datosCrearServicio = new DatosCreaServicioBeneficiario();
		filter = this._contratoKey;
		filter.NumeroPersona = this.beneficiarioSeleccionado.NumeroPersona;
		filter.UsuarioMail = this.beneficiarioSeleccionado.NombresApellidos;
		filter.NombreServicio = this.servicio.DescripcionServicio;
		filter.TipoMovimiento = this.constants.MODULO_TRANSACCION;
		this.servicio.PersonaNumero = this.beneficiarioSeleccionado.NumeroPersona;
		this.servicio.FechaFin = this.beneficiarioSeleccionado.FechaExlusion;
		this.datosCrearServicio.ContratoKey = filter;
		this.datosCrearServicio.Servicio = this.servicio;

		this.serviciosAdicionalesService.crearServicioAdicionalBeneficiario(this.datosCrearServicio).subscribe(result => {
			if (result != null) {
				this.cargarServiciosSinPdf("Se ha creado el Servicio", "ModalNuevoServicio");
				//this.cargarServicios("Se ha creado el Servicio", "ModalNuevoServicio", result._body);
			}
		}, error => this.authService.showErrorPopup("Ocurrió un error al crear el servicio." + error));
	}

	excluirServicio(): void {
		if (this.beneficiarioSeleccionado.EstadoBeneficiario == this.constants.CODIGO_ESTADO_ACTIVO) {
			if (this.servicioAdicionalSeleccionado.EstadoServicio != this.constants.CODIGO_ESTADO_ANULADO) {
				swal({
					title: "¿Está seguro?",
					text: "Va a excluir este servicio!",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#0266b1",
					confirmButtonText: "Si, elimínelo"
				}, confirmed => {
					if (confirmed) {
						let contrato = new ContratoKey();
						contrato = this._contratoKey;
						contrato.CodigoServicio = this.servicioAdicionalSeleccionado.CodigoServicio;
						contrato.NombreServicio = this.servicioAdicionalSeleccionado.DescripcionServicio;
						contrato.PrecioBase = this.servicioAdicionalSeleccionado.PrecioServicios;
						contrato.UsuarioMail = this.beneficiarioSeleccionado.NombresApellidos;
						contrato.TipoMovimiento = this.constants.MODULO_TRANSACCION;

						this.serviciosAdicionalesService.anularServicioAdicionalBeneficiario(contrato).subscribe(result => {
							if (result != null) {
								this.cargarServiciosSinPdf("Se ha anulado el Servicio.", "");
								//this.cargarServicios("Se ha anulado el Servicio.", "", result._body);
							}
						}), error => this.authService.showErrorPopup('Ocurrió un error al exlcuir el servicio.' + error);
					}
				});
			} else {
				this.authService.showInfoPopup("El servicio seleccionado est&aacute; actualmente anulado");
			}
		} else {
			this.authService.showErrorPopup("El cliente se encuentra Anulado, no se puede realizar la acción");
		}
	}

	reactivarServicio(): void {
		if (this.beneficiarioSeleccionado.EstadoBeneficiario == this.constants.CODIGO_ESTADO_ACTIVO) {
			if (this.servicioAdicionalSeleccionado.EstadoServicio != this.constants.CODIGO_ESTADO_ACTIVO) {
				swal({
					title: "¿Está seguro?",
					text: "Va a reactivar este servicio adicional!",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#0266b1",
					confirmButtonText: "Si, reactivelo"
				}, confirmed => {
					if (confirmed) {
						let contrato = new ContratoKey();
						contrato = this._contratoKey;
						contrato.CodigoServicio = this.servicioAdicionalSeleccionado.CodigoServicio;
						contrato.NombreServicio = this.servicioAdicionalSeleccionado.DescripcionServicio;
						contrato.PrecioBase = this.servicioAdicionalSeleccionado.PrecioServicios;
						contrato.UsuarioMail = this.beneficiarioSeleccionado.NombresApellidos;
						contrato.TipoMovimiento = this.constants.MODULO_TRANSACCION;

						this.serviciosAdicionalesService.reactivarServicioBeneficiario(contrato).subscribe(result => {
							if (result != null) {
								this.cargarServiciosSinPdf("Se ha reactivado el servicio.", "");
								//this.cargarServicios("Se ha reactivado el servicio.", "", result._body);
							}
						}, error => this.authService.showErrorPopup('Ocurrió un error al reactivar el servicio.' + error));
					}
				});
			} else {
				this.authService.showInfoPopup("El servicio seleccionado est&aacute; actualmente activo");
			}
		} else {
			this.authService.showErrorPopup("El cliente se encuentra Anulado, no se puede realizar la acción");
		}
	}

	cargarServicios(mensaje: string, modal: string, body: any) {
		this._contratoKey.NumeroPersona = this.beneficiarioSeleccionado.NumeroPersona;
		this.serviciosAdicionalesService.getServiciosAdicionalesBeneficiario(this._contratoKey)
			.subscribe(serviciosAdicionales => {
				this.serviciosAdicionales = serviciosAdicionales;
				this.servicioAdicionalSeleccionado = this.serviciosAdicionales[0];
				this.interval = setInterval(() => {
					this.changeDetector.detectChanges();
					this.changeDetector.detach();
				}, 100);

				this.authService.showSuccessPopup(mensaje);
				if (modal != "") {
					this.cerrarModal(modal);
				}

				this.mostrarPdf(body);
			}
			);
	}

	cargarServiciosSinPdf(mensaje: string, modal: string, ) {
		this._contratoKey.NumeroPersona = this.beneficiarioSeleccionado.NumeroPersona;
		this.serviciosAdicionalesService.getServiciosAdicionalesBeneficiario(this._contratoKey)
			.subscribe(serviciosAdicionales => {
				this.serviciosAdicionales = serviciosAdicionales;
				this.servicioAdicionalSeleccionado = this.serviciosAdicionales[0];
				this.interval = setInterval(() => {
					this.changeDetector.detectChanges();
					this.changeDetector.detach();
				}, 100);

				this.authService.showSuccessPopup(mensaje);
				if (modal != "") {
					this.cerrarModal(modal);
				}
			}
			);
	}

	mostrarPdf(pdf: any): void {
		var blob = new Blob([pdf], { type: 'application/pdf' });
		var fileURL = URL.createObjectURL(blob);
		window.open(fileURL);
	}

	setearChangeDetector(): void {
		this.subscription.unsubscribe();
		clearInterval(this.interval);
	}

	cerrarModal(modal: string): void {
		$(`#${modal}`).modal('hide');
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
}