import { Component, OnInit, OnDestroy } from '@angular/core';
import { menuGenerarArchivosDebitosInstitucionesComponent } from '../menuGenerarArchivosDebitosInstituciones.component';
import { BancoEntity } from '../../../common/model/genericos';
import { EnvioDebitosInstitucionesService } from '../../services/envioDebitosInstituciones.service';
import { RemesaEntity } from '../../../common/model/remesa';
import { AuthService } from '../../../seguridad/auth.service';
import { RecaudosState } from '../../services/reacuados.state';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISubscription } from 'rxjs/Subscription';

@Component({
    selector: 'consultaRemesas',
    providers: [],
    templateUrl: 'consultaRemesas.component.html' 
})



export class ConsultaRemesasComponent implements OnInit, OnDestroy {

    bancoSelected: BancoEntity;
    remesas: RemesaEntity[]; 
    remesaSelected: RemesaEntity;
    subscription: ISubscription;

    constructor( 
        public envioDebitosInstitucionesService: EnvioDebitosInstitucionesService, 
        private authService: AuthService, 
        private recaudosState: RecaudosState
    ) { 
        this.remesas = []; 
    }

    private remesasObs: BehaviorSubject<RemesaEntity[]> = new BehaviorSubject<RemesaEntity[]>(null);
    remesa$: Observable<RemesaEntity[]> = this.remesasObs.asObservable();

    ngOnInit(){ 
        this.inicializarRemesas();
        this.subscription = this.recaudosState.banco$
                .subscribe(
                    data => {     
                        if(data == null)
                            this.bancoSelected = new BancoEntity(); 
                        else{
                            this.bancoSelected = data;  
                            var bancoAnterior = this.recaudosState.getBancoAnterior(); 
                            if(this.bancoSelected.CodigoBanco != bancoAnterior.CodigoBanco){
                                this.GetLastRemesaFromEachRegionByCodigoBanco(); 
                            }
                        }
                                                 
                    }
                ); 
    }

    inicializarRemesas(){ 
        var aux = this.recaudosState.GetRemesasFromConsultaRemesas();
        aux = aux == undefined ? [] : aux; 
        if(aux.length <= 0)
            this.remesas = []; 
        else 
            this.remesas = aux; 
    }

    GetLastRemesaFromEachRegionByCodigoBanco(){ 
        this.envioDebitosInstitucionesService.GetLastRemesaFromEachRegionByCodigoBanco(this.bancoSelected.CodigoBanco)
                .subscribe(
                    res => { 
                        this.remesas = res;
                        this.recaudosState.setUltimasRemesasBanco(this.remesas);
                    }, 
                    error => { this.authService.showErrorPopup(error) }
                ); 
    }

    seleccionar(remesa: RemesaEntity): void {
        this.remesaSelected = new BancoEntity(); 
        if (this.remesas != undefined) {
            this.remesas.forEach(element => {
                element.Selected = false;
            });
        }
        remesa.Selected = true;
        this.remesaSelected = remesa;
        this.recaudosState.setUltimasRemesasBanco(this.remesas);
        this.recaudosState.setRemesaSelected(this.remesaSelected);
    }

    ngOnDestroy(){
        this.subscription.unsubscribe(); 
        this.recaudosState.setBancoSelected(this.bancoSelected); 
    }

}