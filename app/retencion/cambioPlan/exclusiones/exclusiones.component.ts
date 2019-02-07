import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ExclusionEntityList, ExclusionFilter } from '../../../common/model/exclusion';
import { ExclusionesService } from '../../../common/servicios/exclusiones.service';
import { AuthService } from '../../../seguridad/auth.service';

@Component({
    selector: 'exclusiones',
    providers: [ExclusionesService],
    templateUrl: 'exclusiones.template.html'
})

export class ExclusionesComponent {

    exclusiones: ExclusionEntityList[];

    _filter: ExclusionFilter;
    @Input()
    set filter(exclusionfilter: ExclusionFilter) {
        this._filter = exclusionfilter;
        if (this._filter != undefined)
            this.loadExclusionList();
        else
            this.exclusiones = [];
    }

    get filter() {
        return this._filter;
    }

    @Output() onLoadExclusiones: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public exclusionesService: ExclusionesService, private authService: AuthService) {
        this.exclusiones = [];
    }

    ngOnInit(): void {
        this.exclusiones = [];
    }

    pageChanged(): void {
        this.loadExclusionList();
    }

    loadExclusionList(): void {
        if (this._filter.CodigoProducto != undefined && this._filter.CodigoRegion != undefined
            && this._filter.NumeroContrato != undefined && this._filter.NumeroPersona != undefined) {
            this.exclusionesService.getExclusionListByFilter(this._filter).subscribe(
                exclusiones => {
                    this.exclusiones = exclusiones;
                    this.onLoadExclusiones.emit(true);
                },
                error => {
                    this.onLoadExclusiones.emit(false);
                    this.authService.showErrorPopup(error)
                });
        }
        else {
            this.exclusiones = [];
        }
    }
}