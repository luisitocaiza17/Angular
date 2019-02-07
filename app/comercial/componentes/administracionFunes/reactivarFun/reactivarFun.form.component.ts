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
import { MotivosFunEntity } from '../../../model/motivosFunEntity';
import { GenericosService } from '../../../../common/servicios/genericos.service';
import { ComercialMotivosFilter } from '../../../model/comercialMotivosFilter';
import { GrupoUsuario } from '../../../../common/model/grupoUsuario';

@Component({
    selector: 'reactivarFunForm',
    providers: [ServicioFunVendedorService, ConstantesComercialService, CatalogoComercialService, PersonaService, GenericosService],
    templateUrl: 'reactivarFun.form.template.html'
})

export class ReactivarFunFormComponent {

    nombrePersona: string;
    funFilter: FunFilter;
    listaFunes: FunEntity[];
    listaRegiones: RegionEntity[];
    listaFunesSeleccionados: FunEntity[];
    listaMotivosAnulacion: MotivosFunEntity[];
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
        this.listaMotivosAnulacion = [];
        this.listaPersonas = [];
        this.personasFiltradas = [];


        this.cargarCombos();
        this.loadMotivosAnulacion();
    }


    loadMotivosAnulacion() {
        var filter = new ComercialMotivosFilter();
        filter.CodigoEstado = 2;
        filter.Estado = 1;
        filter.NumeroMotivo = null;

        this.catalogoService.MotivoEstadoFun(filter).subscribe(
            result => {
                this.listaMotivosAnulacion = result;
                this.loadGrupoPersonas();
            },
            error => this.authService.showErrorPopup(error)
        );
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

    pageFunChanged() {
        this.buscarFunesReactivacion();
    }

    cargarCombos() {
        if (this.listaRegiones.length == 0) {
            this.listaRegiones = RegionEntity.values;
        }
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

    buscarFunesReactivacion() {
        this.funFilter.Estado = this.constantService.CODIGO_ESTADO_ANULADO;//buscar estado 2
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

                        var obsrv = this.listaMotivosAnulacion.find(x => x.NumeroMotivo == element.NumeroMotivo);
                        if (obsrv.Descripcion != undefined) {
                            element.Observacion = obsrv.Descripcion;
                        }

                    });
                }
                else {
                    this.authService.showErrorPopup("No existen resultados de la búsqueda");
                }
            },
            error => this.authService.showErrorPopup(error)
        );
    }

    seleccionarFun(fun: FunEntity): void {
        if (fun.Selected == true) {
            fun.Selected = false;
            this.listaFunes.forEach(element => {
                if (element.NumeroFun == fun.NumeroFun) {
                    element.Selected = false;
                }
            })
        }
        else {
            fun.Selected = true;
            this.listaFunes.forEach(element => {
                if (element.NumeroFun == fun.NumeroFun) {
                    element.Selected = true;
                }
            })
        }
    }

    seleccionarTodos() {
        this.listaFunesSeleccionados = [];
        if (this.listaFunes.length > 0) {
            this.listaFunes.forEach(element => {
                element.Selected = true;
                this.listaFunesSeleccionados.push(element);
            });
        }
    }

    reactivarFun() {
        if (this.validarReactivar()) {
            this.funService.ActualizarFun(this.listaFunesSeleccionados).subscribe(
                result => {
                    this.authService.showSuccessPopup("Los Funes se han reactivado correctamente");
                    this.buscarFunesReactivacion();
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    validarReactivar(): boolean {
        this.listaFunesSeleccionados = [];
        this.listaFunes.forEach(element => {
            if (element.Selected == true) {
                element.Estado = this.constantService.CODIGO_ESTADO_PREEMITIDO;//pasa a estado 62
                element.CodigoAgenteVenta = null;
                this.listaFunesSeleccionados.push(element)
            }
        });

        if (this.listaFunesSeleccionados.length == 0) {
            this.authService.showErrorPopup("Debe seleccionar uno o m&aacute;s Funes");
            return false;
        }

        return true;
    }


}