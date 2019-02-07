import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { ContratoListComponent } from './contrato.list.component';
import { ContratoKey, ClaveContratoEntity } from '../common/model/contrato';
import { AuthService } from '../seguridad/auth.service';
import { Permiso } from '../seguridad/usuario';
import { ContratoService } from '../common/servicios/contrato.service';

@Component({
    selector: 'contratoView',
    providers: [ContratoService],
    templateUrl: 'contrato.view.template.html'
})

export class ContratoViewComponent implements OnDestroy {

    suscription: any;
    consultaFull: boolean;
    consultaExterna: boolean;
    consultaVendedor: boolean;

    private contratoDetailKey: BehaviorSubject<ContratoKey> = new BehaviorSubject<ContratoKey>(null);
    contratoDetailKey$: Observable<ContratoKey> = this.contratoDetailKey.asObservable();

    claveContrato: ClaveContratoEntity;
    contrato: ContratoKey;

    constructor(
        private authService: AuthService,
        private contratoListComponent: ContratoListComponent) {

        this.claveContrato = new ClaveContratoEntity();
        this.contrato = new ContratoKey();
        this.consultaVendedor = false;

        this.suscription = this.contratoListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                this.contrato = contratoKey;
                this.contratoDetailKey.next(contratoKey);
                this.verificarPermisos();
            }
        );
    }

    activateTab(tabId: string) {
        var key = this.contratoDetailKey.getValue();
        key.ActiveTab = tabId;
        key.NewKey = false;
        this.contratoDetailKey.next(key);
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    verificarPermisos(): void {
        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {
            var permisoConsultaFull = listaPermisos.find(p => p == Permiso.CONSULTA_FULL || p == Permiso.ADMINISTRADOR);
            if (permisoConsultaFull != undefined)
                this.consultaFull = true;
            else
                this.consultaFull = false;

            var permisosConsultaExterna = listaPermisos.find(p => p == Permiso.CONSULTA_EXTERNA);
            if (permisosConsultaExterna != undefined)
                this.consultaExterna = true;
            else
                this.consultaExterna = false;


            //Para habilitar algunos tabs y navs
            if (this.authService.tipoPermiso == Permiso.CONSULTA_VENDEDOR) {
                console.log("ALLOW SOME TABS TO THE SELLER");
                this.consultaVendedor = true;
            }
            else {
                this.consultaVendedor = false;
            }
        }
    }
}