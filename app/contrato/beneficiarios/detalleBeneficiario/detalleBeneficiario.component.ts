import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../../seguridad/auth.service';
import { BeneficiarioService } from '../../../common/servicios/beneficiario.service';
import { TabPanelControl } from '../../tabPanelControl';
import { BeneficiariosComponent } from '../beneficiarios.component';
import { Beneficiario, BeneficiarioKey } from '../../../common/model/beneficiario';

@Component({
    selector: 'detalleBeneficiario',
    providers: [BeneficiarioService],
    templateUrl: 'detalleBeneficiario.template.html'
})

export class DetalleBeneficiarioComponent extends TabPanelControl implements OnDestroy {

    beneficiarioKey: BeneficiarioKey;
    beneficiario: Beneficiario;
    maternidad : string;
    cedulaPasaporte : string;
    numeroCedulaPasaporte : string;
    

    suscription: any;

    constructor(private authService: AuthService, private beneficiariosComponent: BeneficiariosComponent, public beneficiarioService: BeneficiarioService) {

        super(TabPanelControl.TAB_BENEFICIARIOS_DETALLE);

        this.cedulaPasaporte = "Número Cédula:";
        this.numeroCedulaPasaporte = "0000000000";

        this.suscription = this.beneficiariosComponent.beneficiarioKey$.subscribe(
            (beneficiarioKey) => {
                if (beneficiarioKey != undefined) {
                    this.beneficiarioKey = beneficiarioKey;
                    this.loadBeneficiario();
                }
            }
        );
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    loadBeneficiario(): void {
        if (this.beneficiarioKey != undefined) {
            if (this.beneficiarioKey.NewKey) {
                this.loaded = false;
                this.beneficiario = new Beneficiario();
            }

            if (this.isActive(this.beneficiarioKey.ActiveTab)) {
                if (!this.loaded) {
                    var beneficiarioFilter = this.createBeneficiarioFilter(this.beneficiarioKey.CodigoContrato, this.beneficiarioKey.NumeroPersona);
                    this.beneficiarioService.getOneBeneficiarioByKey(beneficiarioFilter).subscribe(
                        result => {
                            this.beneficiario = result;
                            this.setPasaporteCedula();
                            this.loaded = true;
                            if(this.beneficiario.TarjetaBeneficiario==true){
                                this.maternidad="SI";
                            }
                            else{
                                this.maternidad="NO";
                            }
                        },
                        error => this.authService.showErrorPopup(error));
                }
            }
        } else
            this.beneficiario = new Beneficiario();
    }

    setPasaporteCedula(): void{
        if (this.beneficiario.NumeroCedula != "") {
            this.cedulaPasaporte = "Número Cédula:";
            this.numeroCedulaPasaporte = this.beneficiario.NumeroCedula;
        } else {
            this.cedulaPasaporte = "Número Pasaporte:";
            this.numeroCedulaPasaporte = this.beneficiario.NumeroPasaporte;
        }
    }

    createBeneficiarioFilter(codigoContrato: number, numeroPersona: number): BeneficiarioKey {
        var beneficiarioFilter = new BeneficiarioKey();
        beneficiarioFilter.CodigoContrato = codigoContrato;
        beneficiarioFilter.NumeroPersona = numeroPersona;
        beneficiarioFilter.CodigoPlan = this.beneficiarioKey.CodigoPlan;
        beneficiarioFilter.VersionPlan = this.beneficiarioKey.VersionPlan;
        return beneficiarioFilter;
    }
}