import { Component } from '@angular/core';
import { AuthService } from '../../../../seguridad/auth.service';
import { ServicioFunVendedorService } from '../../../service/servicioFunVendedor.service';
import { CatalogoComercialService } from '../../../service/catalogoComercial.service';
import { VariablesConstantService } from '../../../../utils/variableConstant.service.';
import { ConstantesComercialService } from '../../../utils/constantesComercial.service.';
import { PersonaService } from '../../../../common/servicios/persona.service';

import { RegionEntity } from '../../../../common/model/genericos';
import { FunFilter } from '../../../model/funFilter';
import { FunEntity } from '../../../model/funEntity';
import { utilidadesGenericasService } from '../../../../utils/utilidadesGenericas';
import { GenericosService } from '../../../../common/servicios/genericos.service';
import { GrupoUsuario } from '../../../../common/model/grupoUsuario';

@Component({
    selector: 'consultarFunForm',
    providers: [ServicioFunVendedorService, ConstantesComercialService, CatalogoComercialService, PersonaService, GenericosService],
    templateUrl: 'consultarFun.form.template.html'
})

export class ConsultarFunFormComponent {

    nombrePersona: string;
    funFilter: FunFilter;

    listaFunes: FunEntity[];
    listaRegiones: RegionEntity[];
    listaPersonas: GrupoUsuario[];
    personasFiltradas: GrupoUsuario[];


    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    constructor(
        private authService: AuthService, public constantService: VariablesConstantService,
        public constantesComercial: ConstantesComercialService, public utils: utilidadesGenericasService,
        public funService: ServicioFunVendedorService, public catalogoService: CatalogoComercialService,
        public personaService: PersonaService, public genericoService: GenericosService) {

        this.funFilter = new FunFilter();
        this.listaRegiones = [];
        this.listaFunes = [];
        this.listaPersonas = [];
        this.personasFiltradas = [];

        this.cargarCombos();
        this.loadGrupoPersonas();
    }

    pageFunChanged() {
        this.loadFunes();
    }

    cargarCombos() {
        if (this.listaRegiones.length == 0) {
            this.listaRegiones = RegionEntity.values;
        }
    }

    loadGrupoPersonas() {
        var lista = [];
        lista.push(this.constantesComercial.GRUPO_VENDEDORES);
        this.genericoService.ObtenerUsuariosGrupo(lista).subscribe(
            result => {
                this.listaPersonas = result;
                this.personasFiltradas = result;
            },
            error => this.authService.showErrorPopup(error)
        )
    }

    limpiar() {
        this.funFilter = new FunFilter();
        this.listaFunes = [];
        this.funService.resetDefaultPaginationConstanst();
    }

    /*Usuario Directorio Activo */
    abrirMolalUsuarios() {
        $('#myModalListadoPersonas').modal();
    }

    seleccionarPersona(persona: GrupoUsuario) {
        this.funFilter.UsuarioEmisor = persona.Usuario;
        this.funFilter.NombreUsuarioEmisor = persona.NombreCompleto;
        $('#myModalListadoPersonas').modal('hide');
        this.personasFiltradas = this.listaPersonas;
        this.nombrePersona = undefined;
    }

    filtrarPersona(searchValue: string) {
        if (this.personasFiltradas != undefined && this.personasFiltradas.length > 0) {
            var a = this.listaPersonas.filter(item => item.NombreCompleto.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.personasFiltradas = a;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.personasFiltradas = this.listaPersonas;
        }
    }
    /*Fin Usuario Directorio Activo */

    /*Funes*/
    loadFunes() {
        this.funService.Fun(this.funFilter).subscribe(
            result => {
                this.listaFunes = result;
                if (this.listaFunes.length > 0) {
                    this.listaFunes.forEach(element => {
                        if (element.FechaEntrega != undefined && element.FechaEntrega != null) {
                            element.FechaEntrega = this.utils.GetDateTimeUTCTimeZone(element.FechaEntrega);
                        }
                        if (element.FechaCierre != undefined && element.FechaCierre != null) {
                            element.FechaCierre = this.utils.GetDateTimeUTCTimeZone(element.FechaCierre);
                        }
                        if (element.FechaCreacion != undefined && element.FechaCreacion != null) {
                            element.FechaCreacion = this.utils.GetDateTimeUTCTimeZone(element.FechaCreacion);
                        }
                    });
                }
                else {
                    this.authService.showInfoPopup("No existen resultados de la búsqueda");
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }




}