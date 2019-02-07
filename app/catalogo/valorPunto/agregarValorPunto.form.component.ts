import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../seguridad/auth.service';
import { PaginationService } from '../../utils/pagination.service';
import { ProcedimientoService } from '../../common/servicios/procedimiento.service';
import { ValorPuntoService } from '../../common/servicios/valorPunto.service';
import { GenericosService } from '../../common/servicios/genericos.service';
import { correctHeight } from '../../app.helpers';


import { ProcedimientoFilter, Procedimiento } from '../../common/model/procedimiento';
import { ValorPunto, ValorPuntoFilter } from '../../common/model/valorPunto';
import { Permiso } from '../../seguridad/usuario';
import { Catalogo } from '../../common/model/catalogo';


@Component({
    selector: 'agregarPuntoValorForm',
    providers: [GenericosService],
    templateUrl: 'agregarValorPunto.form.template.html'
})
export class AgregarValorPuntoFormComponent {

    valorPunto: ValorPunto;
    grupoAranceles: Catalogo[];
    descripcionGrupo: string;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es',
    };

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private procedimientoService: ProcedimientoService,
        private valorPuntoService: ValorPuntoService, private genericosService: GenericosService) {

        this.valorPunto = new ValorPunto();
        this.grupoAranceles = [];
        this.descripcionGrupo = undefined;

        this.buscarGrupoAranceles();

    }

    buscarGrupoAranceles() {
        this.genericosService.grupoArancel().subscribe(
            result => {
                this.grupoAranceles = result;
            }
        );
    }

    abrirModalGrupoArancel() {
        $("#grupoArancelViewModal").modal();
    }

    seleccionarGrupoArancel(grupoArancel: Catalogo) {
        this.descripcionGrupo = grupoArancel.Valor
        this.valorPunto.CodigoGrupoArancel = grupoArancel.Id;
        this.sugerirFechaInicio();
        $('#grupoArancelViewModal').modal('hide');
    }

    sugerirFechaInicio() {
        this.valorPuntoService.obtenerFechaInicioValorPunto(this.valorPunto).subscribe(
            result => {
                this.valorPunto.FechaDesde= new Date(result);
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    crearValorPunto() {
        this.valorPuntoService.ingresarValorPunto(this.valorPunto).subscribe(
            result => {
                this.authService.showSuccessPopup("Datos Ingresados Correctamente");
            },
            error => this.authService.showErrorPopup(error)
        );
    }

}
