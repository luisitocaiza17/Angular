import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratoKey } from '../../common/model/contrato';
import { Comentario, Retencion, RetencionKey, Servicio, FiltroMFiles, DescuentoCliente, ParametroRetencion, DescuentosPendiente } from '../../common/model/retencion';
import { RetencionService } from '../../common/servicios/retencion.service';
import { PlanService } from '../../common/servicios/plan.service';
import { AuthService } from '../../seguridad/auth.service';
import { AdministracionSistemaService } from '../../common/servicios/administracionSistema.service';
import { RetencionesVime } from '../../common/servicios/retencionesVime.service';
import { BeneficiarioService } from '../../common/servicios/beneficiario.service';

import { Beneficiario, BeneficiarioKey, BeneficiarioList } from '../../common/model/beneficiario';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { ExclusionFilter } from '../../common/model/exclusion';
import { PlanCambioEntity } from '../../common/model/plan';
import { RetencionListComponent } from '../retencion.list.component';



@Component({
    providers: [AdministracionSistemaService, RetencionesVime, BeneficiarioService, RetencionListComponent],
    templateUrl: 'retencion.cambio.plan.template.html',
    styles: ['.text-primary { color: #337ab7!important; } .btn:hover, .btn:focus, .btn.focus{ background-color:lightgrey; }']
})

export class RetencionCambioPlanComponent {
   // key: RetencionKey;
    retencion: Retencion;
    beneficiarios: BeneficiarioList[];
    planes: PlanCambioEntity[];

    showColumns: boolean;
    columns: any;
    parametroSSC: number;
    rolGestion: string;
    usuarioJefe: string;
    Nivel1: string = "Ejecutivo Contact Center";
    Nivel2: string = "Jefatura SAC Sierra,Jefatura SAC Costa";
    Nivel3: string = "Subgerencia Nacional";

    private contratoKey: BehaviorSubject<ContratoKey> = new BehaviorSubject<ContratoKey>(null);
    selectContrato$: Observable<ContratoKey> = this.contratoKey.asObservable();

    contratoCambio: ContratoKey;
    suscription: any;

    beneficiarioKey: BeneficiarioKey;
    exclusionFilter: ExclusionFilter;
    beneficiarioSeleccionado: Beneficiario;

    constructor(private route: ActivatedRoute, private router: Router,
        private retencionService: RetencionService,
        private administracionSistemaService: AdministracionSistemaService,
        private authService: AuthService, private retencionesVime: RetencionesVime,
        public beneficiarioService: BeneficiarioService,
        private planService: PlanService) {

        this.beneficiarioKey = new BeneficiarioKey();
        this.exclusionFilter = new ExclusionFilter();
        this.beneficiarioSeleccionado = new Beneficiario();
        this.contratoCambio = new ContratoKey();

        this.beneficiarios = [];
        this.planes = [];

        this.retencionService.retenciones.subscribe((res) => {
            this.retencion = res || undefined;
            if (this.retencion) {
                this.retencion.SiniestralidadNumber = parseFloat(this.retencion.Siniestralidad);                
                this.loadCambioPlan();
            }
        });

    }

    loadCambioPlan() {
        this.retencionService.contratoKey.subscribe((res) => {
            this.contratoCambio = res;
            this.loadBeneficiarios();
            this.iniciarkey();
            this.loadPlanCotizacion();
        });
    }

    loadPlanCotizacion() {
        this.planService.getListaPlanesCP(this.contratoCambio.CodigoProducto, this.contratoCambio.NumeroContrato, this.contratoCambio.CodigoRegion, "RET").subscribe(
            result => {
                this.planes = result;
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    loadBeneficiarios(): void {
        if (this.contratoCambio != undefined) {
            this.beneficiarioKey = new BeneficiarioKey();
            this.beneficiarioKey.CodigoRegion = this.contratoCambio.CodigoRegion;
            this.beneficiarioKey.CodigoProducto = this.contratoCambio.CodigoProducto;
            this.beneficiarioKey.NumeroContrato = this.contratoCambio.NumeroContrato;

            this.beneficiarioService.getBeneficiariosMaternidad(this.beneficiarioKey).subscribe(beneficiarios => {
                this.beneficiarios = beneficiarios;
                this.createExclusionesFilter();
            });
        }

    }


    iniciarkey() {
        var key = new ContratoKey();
        key.ActiveTab = "movimientosTab";
        key.CodigoContrato = this.retencion.CodigoContrato;
        this.contratoKey.next(key);
    }

    createExclusionesFilter(): void {
        this.exclusionFilter = new ExclusionFilter();
        this.exclusionFilter.NumeroContrato = this.contratoCambio.NumeroContrato;
        this.exclusionFilter.CodigoProducto = this.contratoCambio.CodigoProducto;
        this.exclusionFilter.CodigoRegion = this.contratoCambio.CodigoRegion;
        this.exclusionFilter.NumeroPersona = this.beneficiarios[0].NumeroPersona;
    }

    onLoadExclusiones(loaded: boolean) {
    }

    seleccionar(beneficiario: Beneficiario): void {
        this.limpiarSeleccion();
        if (beneficiario != undefined) {
            beneficiario.Selected = true;
            this.beneficiarioSeleccionado = beneficiario;

        }
    }

    limpiarSeleccion() {
        if (this.beneficiarios != undefined) {
            this.beneficiarios.forEach(element => {
                element.Selected = false;
            });
        }
    }

    validarPermisosRol() {

    }


    validarPermisoCalculo(beneficiario) {

    }


/* 
    suma<T>(items: T[], f: (item: T) => number): number {
        return items.reduce((xs, x) => xs + f(x), 0);
    } */

/* 
    quitarVacios(obj: any): any {
        return Object.keys(obj).reduce((xs, x) => {
            const value = obj[x];
            if (value) {
                xs[x] = obj[x];
            }
            return xs;
        }, {});
    } */

    mostrarModal(selector: string) {
        $(selector).modal('show');
    }

    esconderModal(selector: string) {
        $(selector).modal('hide');
    }

    enviar() {
        this.esconderModal('#modalEnviar');
        this.mostrarModal('#modalEnviado');
    }

    confirmar() {
        this.esconderModal('#modalEnviado');
    }



    keys(obj) {
        return Object.keys(obj);
    }

    concatenar(valor: number): string {
        return (valor / 4) + 'px';
    }

    getheight(): string {
        return 10 + 'px';
    }

}
