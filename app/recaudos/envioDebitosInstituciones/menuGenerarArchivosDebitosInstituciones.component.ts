import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GenericosService } from '../../common/servicios/genericos.service';
import { BancoEntity } from '../../common/model/genericos';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { RecaudosState } from '../services/reacuados.state';
import { RemesaEntity } from '../../common/model/remesa';
import { EnvioDebitosInstitucionesService } from '../services/envioDebitosInstituciones.service';

@Component({
    selector: 'menu-cobros-pichincha',
    providers: [GenericosService, RecaudosState],
    templateUrl: 'menuGenerarArchivosDebitosInstituciones.component.html' 
})

export class menuGenerarArchivosDebitosInstitucionesComponent implements OnInit, OnDestroy {

    bancos: BancoEntity[]; 
    bancoSelected: BancoEntity;

    constructor( 
        private route: ActivatedRoute, 
        private router: Router, 
        public genericoService: GenericosService, 
        public envioDebitosInstitucionesService: EnvioDebitosInstitucionesService,
        public authService: AuthService, 
        private recaudosState: RecaudosState
    ) {
        
    }

    ngOnInit(){ 
        this.LoadAllBancos(); 
        this.recaudosState.limpiarEstado(); 
    }

    LoadAllBancos(){ 
        this.envioDebitosInstitucionesService.GetBancosUsados()
                .subscribe(
                    res => { this.bancos = res },
                    error => { this.authService.showErrorPopup(error) }
                ); 
    }

    seleccionar(banco: BancoEntity): void {
        this.bancoSelected = new BancoEntity(); 
        if (this.bancos != undefined) {
            this.bancos.forEach(element => {
                element.Selected = false;
            });
        }
        banco.Selected = true;
        this.bancoSelected = banco;
        this.recaudosState.setBancoSelected(this.bancoSelected); 
        this.recaudosState.setUltimasRemesasBanco([]); 
        this.recaudosState.setRemesaSelected(new RemesaEntity());
    }

    pageChanged(): void {
        this.LoadAllBancos();
    }

    ngOnDestroy(){
        this.recaudosState.limpiarEstado(); 
    }
}