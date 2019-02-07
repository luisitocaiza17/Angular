import { Component, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../seguridad/auth.service';
import { Permiso } from '../../../../seguridad/usuario';
import { RegionService } from '../../../../common/servicios/region.service';
import { ServicioFunVendedorService } from '../../../service/servicioFunVendedor.service';
import { CatalogoComercialService } from '../../../service/catalogoComercial.service';
import { VariablesConstantService } from '../../../../utils/variableConstant.service.';
import { ConstantesComercialService } from '../../../utils/constantesComercial.service.';
import { PersonaService } from '../../../../common/servicios/persona.service';


import { RegionEntity } from '../../../../common/model/genericos';
import { FunFilter } from '../../../model/funFilter';
import { FunEntity } from '../../../model/funEntity';
import { utilidadesGenericasService } from '../../../../utils/utilidadesGenericas';
import { ComercialMotivosFilter } from '../../../model/comercialMotivosFilter';
import { MotivosFunEntity } from '../../../model/motivosFunEntity';
import { GenericosService } from '../../../../common/servicios/genericos.service';
import { GrupoUsuario } from '../../../../common/model/grupoUsuario';

@Component({
    selector: 'anularFunForm',
    providers: [ServicioFunVendedorService, ConstantesComercialService, CatalogoComercialService, PersonaService, GenericosService],
    templateUrl: 'anularFun.form.template.html'
})

export class AnularFunFormComponent {

    accessAdminFun: boolean;

    motivoAnulacion: number;
    nombrePersona: string;

    funFilter: FunFilter;

    listaFunes: FunEntity[];
    listaRegiones: RegionEntity[];
    listaFunesSeleccionados: FunEntity[];
    listaMotivosAnulacion: MotivosFunEntity[];
    listaMotivosAnulacionOriginales: MotivosFunEntity[];
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

    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService,
        public constantService: VariablesConstantService,
        public constantesComercial: ConstantesComercialService, public utils: utilidadesGenericasService,
        public funService: ServicioFunVendedorService, public catalogoService: CatalogoComercialService,
        public personaService: PersonaService, public genericoService: GenericosService) {

        this.motivoAnulacion = undefined;
        this.accessAdminFun = false;
        this.funFilter = new FunFilter();
        this.listaRegiones = [];
        this.listaFunes = [];
        this.listaMotivosAnulacion = [];
        this.listaMotivosAnulacionOriginales = [];
        this.listaPersonas = [];
        this.personasFiltradas = [];


        this.verificarPermisos();
        this.cargarCombos();
        this.loadMotivosAnulacion();
    }

    verificarPermisos(): void {
        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {
            var admin = listaPermisos.find(p => p == Permiso.ADMINISTRADOR);
            var adminFun = listaPermisos.find(p => p == Permiso.ADMINISTRADOR_FUN);
            if (admin != undefined || adminFun != undefined) {
                this.accessAdminFun = true;
            }
            else {
                var auth = listaPermisos.find(p => p == Permiso.EJECUTIVO_COMERCIAL);
                if (auth != undefined)
                    this.accessAdminFun = true;
            }
        }
    }

    pageFunChanged() {
        this.loadFunes();
    }

    cargarCombos() {
        if (this.listaRegiones.length == 0) {
            this.listaRegiones = RegionEntity.values;
        }
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

    abrirModalMotivos() {
        this.motivoAnulacion = undefined;
        $('#myModalListadoMotivos').modal();;
    }

    filtarMotivo(searchValue: string) {
        if (this.listaMotivosAnulacion != undefined && this.listaMotivosAnulacion.length > 0) {
            var listaAux = this.listaMotivosAnulacionOriginales.filter(item => item.Descripcion.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.listaMotivosAnulacion = listaAux;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.listaMotivosAnulacion = this.listaMotivosAnulacionOriginales;
        }
    }

    seleccionarMotivo(motivo: MotivosFunEntity) {
        this.motivoAnulacion = motivo.NumeroMotivo;
        this.anularFun();
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
        if (!this.accessAdminFun) {
            this.funFilter.Estado = this.constantService.CODIGO_ESTADO_PREEMITIDO;
        }
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

    anularFun() {
        if (this.validarAnular()) {
            this.funService.ActualizarFun(this.listaFunesSeleccionados).subscribe(
                result => {
                    this.authService.showSuccessPopup("Los Funes se han anulado correctamente");
                    this.loadFunes();
                    $('#myModalListadoMotivos').modal('hide');
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    validarAnular(): boolean {
        this.listaFunesSeleccionados = [];
        this.listaFunes.forEach(element => {
            if (element.Selected == true) {
                element.Estado = this.constantService.CODIGO_ESTADO_ANULADO;
                element.NumeroMotivo = this.motivoAnulacion;
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