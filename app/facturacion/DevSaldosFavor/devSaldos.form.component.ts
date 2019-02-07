import { Component, OnInit, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../seguridad/auth.service';
import { RegionService } from '../../common/servicios/region.service';
import { ContratoService } from '../../common/servicios/contrato.service';

import { ContratoKey } from '../../common/model/contrato';
import { ConstantService } from '../../utils/constant.service';
import { DevSaldosFavorContratoListComponent } from './devSaldosContrato.list.component';
import { TransaccionKey } from '../../common/model/transacciones';

@Component({
    selector: 'devolucionSaldos',
    providers: [ContratoService],
    templateUrl: 'devSaldos.form.template.html'
})

export class DevSaldosFormComponent implements OnInit, OnDestroy {

    suscription: any;
    contratoKey: ContratoKey;
    opcion: string;
    control: boolean;

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService,
        private contratoService: ContratoService, private constantService: ConstantService,
        private contratosSbListComponent: DevSaldosFavorContratoListComponent) {
        this.control = false;
        this.contratoKey = new ContratoKey();

        this.suscription = this.contratosSbListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined && contratoKey.CodigoContrato != undefined) {
                    this.contratoKey = contratoKey;
                }
            }
        );
    }

    ngOnInit(): void {
        this.opcion = "";
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    isActive(divActivo: string) {
        if (this.opcion == divActivo)
            return true;
        return false;
    }

    activar(opcion: string) {
        this.opcion = opcion;
    }

    Procesar() {
        if (this.validar()) {
            var filter = new TransaccionKey();
            filter.CodigoContrato = this.contratoKey.CodigoContrato;
            filter.NumeroContrato = this.contratoKey.NumeroContrato;
            filter.CodigoRegion = this.contratoKey.CodigoRegion;
            filter.CodigoProducto = this.contratoKey.CodigoProducto;

            this.contratoService.descargarReporteSaldosFavor(filter).subscribe(
                resp => {
                    var blob = new Blob([resp._body], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(blob);
                    window.open(fileURL);

                    this.control = true;
                    this.ngOnDestroy();
                    //jQuery("#divConsultar").collapse("show");
                    //jQuery("#divPanelDevolucionSaldos").collapse("hide");
                },
                err => {
                    this.authService.showBlobErrorPopup(err);
                });
        }
    }

    validar(): boolean {

        if (this.contratoKey.CodigoProducto != "IND" && this.contratoKey.CodigoProducto != "ONC" && this.contratoKey.CodigoProducto != "XPR") {
            this.authService.showErrorPopup("Proceso no admitido para contratos "+this.contratoKey.CodigoProducto);
            return false
        }

        if (this.contratoKey.AFavor == 0 || this.contratoKey.AFavor == undefined) {
            this.authService.showErrorPopup("Este contrato no tiene saldo a favor");
            return false
        }
        if (this.contratoKey.EsMoroso == true) {
            this.authService.showErrorPopup("Este contrato seleccionado esta moroso");
            return false
        }
        

        return true;
    }
}
