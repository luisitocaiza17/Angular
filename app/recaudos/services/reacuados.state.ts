import { Injectable, Inject } from '@angular/core';
import { RemesaEntity } from '../../common/model/remesa';
import { BancoEntity } from '../../common/model/genericos';
import { EstadoRecaudos } from '../model/recaudo';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable()
export class RecaudosState {

    private estadoRecaudos: EstadoRecaudos

    private bancoObs: BehaviorSubject<BancoEntity>;
    banco$: Observable<BancoEntity>; 

    private remesasDebancoObs: BehaviorSubject<RemesaEntity[]>; 
    remesasDebanco$: Observable<RemesaEntity[]>; 

    private remesaSelectedObs: BehaviorSubject<RemesaEntity>;
    remesaSelelected$: Observable<RemesaEntity>; 

    constructor(){ 
        this.estadoRecaudos = new EstadoRecaudos();
        this.inicializarObservables(); 
    }

    inicializarObservables() { 
        this.bancoObs = new BehaviorSubject<BancoEntity>(null);
        this.banco$ = this.bancoObs.asObservable();

        this.remesasDebancoObs = new BehaviorSubject<RemesaEntity[]>(null); 
        this.remesasDebanco$ =  this.remesasDebancoObs.asObservable();

        this.remesaSelectedObs = new BehaviorSubject<RemesaEntity>(null);
        this.remesaSelelected$ = this.remesaSelectedObs.asObservable();
    }

    setUltimasRemesasBanco(remesas: RemesaEntity[]): void{ 
        this.estadoRecaudos.utlimasRemesasBanco = remesas;
        this.remesasDebancoObs.next(this.estadoRecaudos.utlimasRemesasBanco);
    }

    setBancoSelected(banco: BancoEntity): void { 
        this.estadoRecaudos.bancoAnterior = this.estadoRecaudos.bancoSelected; 
        this.estadoRecaudos.bancoSelected = banco; 
        this.bancoObs.next(this.estadoRecaudos.bancoSelected);
    }

    setRemesaSelected(remesa: RemesaEntity):void { 
        this.estadoRecaudos.remesaSelected = remesa; 
        this.remesaSelectedObs.next(remesa); 
    }

    getRemesaSelected(){ 
        return this.estadoRecaudos.remesaSelected; 
    }

    GetRemesasFromConsultaRemesas(): RemesaEntity[]{ 
        return this.estadoRecaudos.utlimasRemesasBanco; 
    }

    getBancoSelected(): BancoEntity{ 
        return this.estadoRecaudos.bancoSelected; 
    }

    getBancoAnterior(): BancoEntity{ 
        return this.estadoRecaudos.bancoAnterior; 
    }

    limpiarEstado(){ 
        this.estadoRecaudos.bancoSelected = new BancoEntity(); 
        this.estadoRecaudos.bancoAnterior = new BancoEntity(); 
        this.estadoRecaudos.utlimasRemesasBanco = []; 
        this.estadoRecaudos.remesaSelected = new RemesaEntity(); 
    }

    limpiarObservables(){
        this.bancoObs = new BehaviorSubject<BancoEntity>(null);
        this.remesasDebancoObs = new BehaviorSubject<RemesaEntity[]>(null);
        this.remesaSelectedObs = new BehaviorSubject<RemesaEntity>(null);
    }

}