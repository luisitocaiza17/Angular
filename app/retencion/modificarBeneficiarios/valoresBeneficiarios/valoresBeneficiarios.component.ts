import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RetencionService } from '../../../common/servicios/retencion.service';
import { Beneficiario, ServiciosKey, Servicio } from '../../../common/model/retencion';
import { AuthService } from '../../../seguridad/auth.service';
import { RetencionKey } from '../../../common/model/retencion';

@Component({
	selector: 'valoresBeneficiarios',
	providers: [],
	templateUrl: 'valoresBeneficiarios.template.html'
})

export class ValoresBeneficiariosComponent implements OnInit { 

	key: RetencionKey;
	beneficiarios: Beneficiario[];
	expandidoAnterior: boolean;
	servicios: Servicio[];
	expandidoIncremento: boolean;
	total: boolean;

	constructor(private route: ActivatedRoute, private router: Router, private retencionService: RetencionService, 
		private authService: AuthService) { }

	ngOnInit(): void {

		this.route.params.subscribe((params: RetencionKey) => {
			this.key = params
		})

		this.retencionService.beneficiariosContratoValores.subscribe(beneficiarios => {
			this.beneficiarios = beneficiarios;
		})
	}

	alternarExpandidoAnterior() {
		this.expandidoAnterior = !this.expandidoAnterior;
	}

	mostrarServicios(beneficiario: Beneficiario) {
		const key = this.key;
		const serviciosKey: ServiciosKey = {
			Region: key.Region,
			CodigoProducto: key.CodigoProducto,
			NumeroContrato: key.NumeroContrato,
			PersonaNumero: beneficiario.PersonaNumero,
			Secuencial: beneficiario.Secuencial
		};

		this.retencionService.servicios(serviciosKey).subscribe(servicios => {
			if (servicios.length > 0) {
				this.servicios = servicios;
				$("#myModalServicios").modal();
			} else {
				this.authService.showErrorPopup("El beneficiario no tiene servicios adicionales");
			}
		});
	}

	cerrarServicios() {
		this.servicios = [];
		$('#myModalServicios').modal('hide');
	}

	alternarExpandidoIncremento() {
		this.expandidoIncremento = !this.expandidoIncremento
	}

	alternarLog(beneficiario: Beneficiario) {
		beneficiario.MostrarLog = !beneficiario.MostrarLog;
	}
}