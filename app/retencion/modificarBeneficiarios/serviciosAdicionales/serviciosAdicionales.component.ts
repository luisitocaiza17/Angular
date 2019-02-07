import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { BeneficiarioList } from "../../../common/model/beneficiario";
import { ContratoKey } from "../../../common/model/contrato";
import { ServiciosContratoEntity, ServiciosEntity, PrecioServicioEntity, ValorNivelDescripcion, FilterSevicio } from "../../../common/model/servicioAdicionalPersona";
import { ServicioAdicionalPersonaService } from "../../../common/servicios/servicioAdicionalPersona.service";
import { AuthService } from "../../../seguridad/auth.service";
import { RetencionService } from "../../../common/servicios/retencion.service";
import { Observable } from "rxjs";
import { DatosCreaServicioBeneficiario } from '../../../common/model/transacciones';
import { Relacion } from '../../../common/model/relacion';
import { TransaccionService } from "../../../common/servicios/transaccion.service";
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';

import { AdministracionSistemaService } from '../../../common/servicios/administracionSistema.service';
import { VariablesConstantService } from "../../../utils/variableConstant.service.";



@Component({
	selector: 'serviciosAdicionales',
	providers: [AdministracionSistemaService],
	templateUrl: 'serviciosAdicionales.template.html'
})

export class ServiciosAdicionalesComponent implements OnInit {

	_beneficiarios: BeneficiarioList[];
	contratoKey: ContratoKey;
	beneficiario: BeneficiarioList;
	beneficiarioAux: BeneficiarioList;
	serviciosAdicionales: ServiciosContratoEntity[] = [];
	servicioAdicionalSeleccionado: ServiciosContratoEntity = new ServiciosContratoEntity();
	servicio: ServiciosContratoEntity;
	servicios: ServiciosEntity[];
	habilitar: boolean;
	nombrePersona: string;
	error: string;
	precioHelpone: PrecioServicioEntity;
	precioVida: PrecioServicioEntity;
	precioMuerteAccidental: PrecioServicioEntity;
	titulo: string;
	subtitulo: string;
	serviciosEspeciales: ValorNivelDescripcion[];
	listaEspecial: ValorNivelDescripcion;
	nombreNivel: string;
	swCrea1: number;
	controlCrear: number;
	wfecha: Date;
	datosCrearServicio: DatosCreaServicioBeneficiario;
	relaciones: Relacion[];
	tipoDocumento: number;

	usuarioMailPara: string = "";
	usuarioJefe: string;
	rolGestion: string;
	emailDesde: string;
	habiltarReactivar: boolean;


	datepickerOpts = {
		autoclose: true,
		todayHighlight: true,
		format: 'dd/mm/yyyy',
		icon: 'fa fa-calendar',
		placeholder: 'dd/mm/yyyy',
		language: 'es'
	};

	@Input()
	set beneficiarios(beneficiarios: BeneficiarioList[]) {
		if (beneficiarios != undefined) {
			this._beneficiarios = beneficiarios;
		} else {
			this._beneficiarios = [];
		}
	}

	get beneficiarios() {
		return this._beneficiarios;
	}

	@Output() onLoadBilling: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(private authService: AuthService, private serviciosAdicionalesService: ServicioAdicionalPersonaService,
		private retencionService: RetencionService, private transaccionService: TransaccionService, public utilidadGenerica: utilidadesGenericasService,
		private constants: VariablesConstantService
	) { }

	ngOnInit(): void {
		this.retencionService.contratoKey.subscribe(contratoKey => {
			this.contratoKey = contratoKey;
		});
		this.beneficiarioAux = new BeneficiarioList();
		this.beneficiarioAux.NumeroPersona = null;
		this.beneficiario = new BeneficiarioList();
		this.beneficiario.NumeroPersona = null;
		this.habilitar = false;
		this.habiltarReactivar = false;
		this.servicio = new ServiciosContratoEntity();
		this.servicio.CodigoServicio = null;
		this.servicio.FechaInicio = new Date();
		this.serviciosEspeciales = [];
	}

	cargarServiciosBeneficiario(): void {
		if (this.beneficiarioAux.NumeroPersona != null) {
			this.habilitar = true;
			this.nombrePersona = this._beneficiarios.find(x => x.NumeroPersona == this.beneficiarioAux.NumeroPersona).NombresApellidos;
			this.beneficiario = this._beneficiarios.find(x => x.NumeroPersona == this.beneficiarioAux.NumeroPersona);
			this.contratoKey.NumeroPersona = this.beneficiario.NumeroPersona;
			this.serviciosAdicionalesService.getServiciosAdicionalesBeneficiario(this.contratoKey).subscribe(serviciosAdicionales => {
				this.serviciosAdicionales = serviciosAdicionales;
				this.activarExcluir(this.serviciosAdicionales);
				this.servicioAdicionalSeleccionado = this.serviciosAdicionales[0];
			});
			
		} else {
			this.habilitar = false;
			this.nombrePersona = '';
			this.serviciosAdicionales = [];
			this.habiltarReactivar = false;
		}
	}

	activarExcluir(serviciosAdicionales) {
		if (serviciosAdicionales.find(x => x.EstadoServicio != this.constants.CODIGO_ESTADO_ACTIVO)) {
			this.habiltarReactivar = true;
		} else {
			this.habiltarReactivar = false;
		}
	}

	seleccionarServicioAdicional(servicioAdicional: ServiciosContratoEntity): void {
		this.serviciosAdicionales.forEach(servicio => {
			servicio.Selected = false;
		});

		servicioAdicional.Selected = true;
		this.servicioAdicionalSeleccionado = servicioAdicional;
	}

	incluir(): void {
		if (this.beneficiario.EstadoBeneficiario == this.constants.CODIGO_ESTADO_ACTIVO) {
			this.controlCrear = 1;
			this.servicios = [];
			this.serviciosAdicionalesService.getServicios().subscribe(servicios => {
				servicios.forEach(servicio => {
					if (!this.serviciosAdicionales.find(s => s.CodigoServicio == servicio.CodigoServicio)) {
						this.servicios.push(servicio);
					}
				});
			}, error => this.authService.showErrorPopup(error));

			this.cargarPrecioServicio(2, "TRA", this.beneficiario.Edad).subscribe(precioVida => this.precioVida = precioVida);
			this.cargarPrecioServicio(25, "TRA", this.beneficiario.Edad).subscribe(precioHelpone => this.precioHelpone = precioHelpone);
			this.cargarPrecioServicio(26, "TRA", this.beneficiario.Edad).subscribe(precioMuerteAccidental => this.precioMuerteAccidental = precioMuerteAccidental);

			$("#modalIncluir").modal();
		} else {
			this.authService.showErrorPopup("El usuario se encuentra Anulado, no se puede realizar la acción");
		}
	}

	cargarPrecioServicio(codigoServicio, tipoProducto, edad): Observable<PrecioServicioEntity> {
		return this.serviciosAdicionalesService.getDetalleServicio(codigoServicio, tipoProducto, edad);
	}

	validarServicio(): void {
		if (this.servicio.CodigoServicio != null) {
			this.error = null;
			this.servicio.NivelCobertura = this.servicio.CodigoServicio > 2 ? this.contratoKey.NivelReferencia : 0;
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
		} else {
			this.error = null;
		}


	}

	guardar() {
		var today = new Date();
		if (this.beneficiario.CodigoRelacion > 2 && this.servicio.CodigoServicio == 2) {
			this.authService.showInfoPopup("El Seguro de Vida es solo para Titular y/o Conyuge");
			return;
		}

		if (this.servicio.FechaInicio.getDate() < today.getDate()) {
			this.authService.showErrorPopup("La fecha de inicio no puede ser menor a la fecha actual");
			return;
		}

		this.crearServicio();
	}

	crearServicio() {
		var filter = new ContratoKey();
		this.datosCrearServicio = new DatosCreaServicioBeneficiario();
		filter = this.contratoKey;
		filter.NumeroPersona = this.beneficiario.NumeroPersona;
		filter.UsuarioMail = this.beneficiario.NombresApellidos;
		filter.NombreServicio = this.servicio.DescripcionServicio;
		this.servicio.PersonaNumero = this.beneficiario.NumeroPersona;
		this.servicio.FechaFin = this.beneficiario.FechaExlusion;

		this.datosCrearServicio.ContratoKey = filter;
		this.datosCrearServicio.Servicio = this.servicio;

		this.serviciosAdicionalesService.crearServicioAdicionalBeneficiario(this.datosCrearServicio).subscribe(result => {
			this.serviciosAdicionalesService.getServiciosAdicionalesBeneficiario(this.contratoKey).subscribe(serviciosAdicionales => {
				this.serviciosAdicionales = serviciosAdicionales;
				this.onLoadBilling.emit(true);
				this.authService.showSuccessPopup("Se ha creado el Servicio");
				this.cerrarIncluir();
				this.mostrarPdf(result._body);
			});
		}, error => this.authService.showErrorPopup("Ocurrió un error al crear el servicio." + error));
	}

	precioServicio() {
		let montoCobertura = 0;
		let precio = 0;
		let TipoProducto = "TRA";
		if (this.servicio.CodigoServicio == 6) {
			if (this.contratoKey.Ciudad == 2) {
				TipoProducto = "TCO";
			}
			else {
				TipoProducto = "TSI";
			}
		}

		let filterServicio = new FilterSevicio();
		filterServicio.CodigoServicio = this.servicio.CodigoServicio;
		filterServicio.Edad = this.beneficiario.Edad;
		filterServicio.FechaInicioServicio = this.servicio.FechaInicio;
		filterServicio.TipoProducto = TipoProducto;
		filterServicio.Nivel = this.servicio.NivelCobertura;
		filterServicio.CodigoProducto = this.contratoKey.CodigoProducto;
		filterServicio.CodigoPlan = this.contratoKey.CodigoPlan;
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

			},
			error => this.authService.showErrorPopup(error));
	}

	seleccionarNivel(servicioEspecial: ValorNivelDescripcion): void {
		this.servicio.NivelCobertura = servicioEspecial.Nivel;
		$('#myModal').modal('hide');
		this.precioServicio();
	}

	cerrarIncluir(): void {
		this.servicio = new ServiciosContratoEntity();
		this.servicio.CodigoServicio = null;
		this.servicio.FechaInicio = new Date();
		$("#modalIncluir").modal("hide");
	}

	excluir(): void {
		if (this.beneficiario.EstadoBeneficiario == this.constants.CODIGO_ESTADO_ACTIVO) {
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
					contrato = this.contratoKey;
					contrato.CodigoServicio = this.servicioAdicionalSeleccionado.CodigoServicio;
					contrato.NombreServicio = this.servicioAdicionalSeleccionado.DescripcionServicio;
					contrato.PrecioBase = this.servicioAdicionalSeleccionado.PrecioServicios;
					contrato.UsuarioMail = this.beneficiario.NombresApellidos;
	
					this.serviciosAdicionalesService.anularServicioAdicionalBeneficiario(contrato).subscribe(result => {
						this.authService.showSuccessPopup("Se ha anulado el Servicio.");
						this.serviciosAdicionalesService.getServiciosAdicionalesBeneficiario(this.contratoKey).subscribe(serviciosAdicionales => {
							this.serviciosAdicionales = serviciosAdicionales;
							this.servicioAdicionalSeleccionado = this.serviciosAdicionales[0];
							this.activarExcluir(this.serviciosAdicionales);
							this.onLoadBilling.emit(true);
							this.mostrarPdf(result._body);
						});
					}), error => this.authService.showErrorPopup('Ocurrió un error al exlcuir el servicio.' + error);
				}
			});
		} else {
			this.authService.showErrorPopup("El usuario se encuentra Anulado, no se puede realizar la acción");
		}
	}

	reactivar(): void {
		if (this.beneficiario.EstadoBeneficiario == this.constants.CODIGO_ESTADO_ACTIVO) { 
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
						contrato = this.contratoKey;
						contrato.CodigoServicio = this.servicioAdicionalSeleccionado.CodigoServicio;
						contrato.NombreServicio = this.servicioAdicionalSeleccionado.DescripcionServicio;
						contrato.PrecioBase = this.servicioAdicionalSeleccionado.PrecioServicios;
						contrato.UsuarioMail = this.beneficiario.NombresApellidos;
						
						this.serviciosAdicionalesService.reactivarServicioBeneficiario(contrato).subscribe(result => {
							this.serviciosAdicionalesService.getServiciosAdicionalesBeneficiario(this.contratoKey).subscribe(serviciosAdicionales => {
								this.serviciosAdicionales = serviciosAdicionales;
								this.servicioAdicionalSeleccionado = this.serviciosAdicionales[0];
								this.activarExcluir(this.serviciosAdicionales);
								this.onLoadBilling.emit(true);
								this.authService.showSuccessPopup("Se ha reactivado el Servicio.");
								this.mostrarPdf(result._body);
							});
						}, error => this.authService.showErrorPopup('Ocurrió un error al reactivar el servicio.' + error));
					}
				});
			} else {
				this.authService.showInfoPopup("El servicio adicional se encuentra activo");
			}
		} else {
			this.authService.showErrorPopup("El usuario se encuentra Anulado, no se puede realizar la acción");
		}
	}

	mostrarPdf(pdf: any): void {
		var blob = new Blob([pdf], { type: 'application/pdf' });
		var fileURL = URL.createObjectURL(blob);
		window.open(fileURL);
	}
}