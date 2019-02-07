import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, Injectable, Inject } from '@angular/core';
import { NgModel } from '@angular/forms'

import { Reclamo, ReclamoEntityFilter } from '../../common/model/reclamo';
import { ContratoListComponent } from '../contrato.list.component';
import { SobreService } from '../../common/servicios/sobre.service';
import { AuthService } from '../../seguridad/auth.service';
import { SobreReembolsoService } from '../../sobres/service/sobreReembolso.service';
import { SobreEntity } from '../../sobres/model/SobreEntity';

@Component({
    selector: 'sobre',
    templateUrl: 'sobre.template.html',
    providers: [SobreService]
})

export class SobreComponent implements OnInit, OnDestroy {

    public numeroSobre: string;

    @Output() onSelectReclamo: EventEmitter<Reclamo> = new EventEmitter<Reclamo>();

    reclamoList: Reclamo[];
    sobre:SobreEntity[];
    suscription: any;

    constructor(public sobreService: SobreService, private authService: AuthService, private sobreReembolsoService: SobreReembolsoService,
        private contratoListComponent: ContratoListComponent ) {
        
        this.suscription = this.contratoListComponent.NumeroSobreChange$.subscribe(
            (numeroSobre) => {
                if (numeroSobre != undefined) {
                    this.numeroSobre = numeroSobre;
                    this.sobreService.resetDefaultPaginationConstanst();
                    this.filter();
                }
            }
        );
    }

    ngOnInit(): void {
        this.reclamoList = [];
        if (this.numeroSobre != undefined) {
            this.filter();
        }
    }

    pageChanged(): void {
        this.filter();
    }

    filter(): void {
        var filter = new ReclamoEntityFilter();
        filter.NumeroSobre = this.numeroSobre;      
        this.sobreService.getByNumeroSobrePaginated(filter)
            .subscribe(reclamos => {
                this.loadData(reclamos);      
            },
            error => this.authService.showErrorPopup(error)); 
    }

    loadData(lista: Reclamo[]): void {
        this.reclamoList = lista;
        if (this.reclamoList != undefined && this.reclamoList.length > 0) {
            if (this.reclamoList.length == 1)
                this.onSelected(this.reclamoList[0]);
            else
                jQuery("#sobreViewModal").modal('show');
        } else {
            /*swal({
                title: 'Información',
                text: "<h3>No existen liquidaciones para el número de sobre ingresado.</h3>",
                type: "info",
                confirmButtonColor: "#1a7bb9",
                confirmButtonText: "OK",
                closeOnConfirm: true,
                html: true
            }); */
        }
    }

    onSelected(selected: Reclamo): void {
        this.reclamoList = [];
        this.numeroSobre = undefined;
        this.onSelectReclamo.emit(selected);
        jQuery("#sobreViewModal").modal('hide');
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

}