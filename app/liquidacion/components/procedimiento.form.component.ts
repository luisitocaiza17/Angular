import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms';
import { leftPad } from '../../app.helpers';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthService } from '../../seguridad/auth.service';
import { PlanService } from '../../common/servicios/plan.service';
import { ProcedimientoService } from '../../common/servicios/procedimiento.service';

import { Funcion } from '../../common/model/procedimiento.constant';
import { Autorizacion } from '../../common/model/autorizacion';
import { Plan } from '../../common/model/plan';
import { DetalleProcedimiento } from '../../common/model/detalleProcedimiento';

@Component({
    selector: 'procedimientos',
    providers: [ProcedimientoService],
    templateUrl: 'procedimiento.form.template.html'
})

export class ProcedimientoFormComponent {
    disableNuevoButton: boolean;
    disablePlanSelect: boolean;

    esNuevo : boolean;

    currentProcedimientoIndex: number;

    funciones: any;
    planes: Plan[];
    planKeySelected: string;

    nombreProcedimiento: string;
    showMsgPlanRequired: boolean;

    procedimientoOriginalEdicion: DetalleProcedimiento;

    _autorizacion: Autorizacion;
    @Input()
    set autorizacion(autorizacion: Autorizacion) {
        this._autorizacion = autorizacion;
        if (this._autorizacion == undefined)
            this._autorizacion = new Autorizacion();
        if (this._autorizacion.DetallesProcedimientos == undefined){
            this._autorizacion.DetallesProcedimientos = [];
            this.autorizacion.Vadidar = false;
        }
        this.inicializar();
    }
    get autorizacion() {
        return this._autorizacion;
    }

    constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef, private authService: AuthService, 
        public procedimientoService: ProcedimientoService,private planService: PlanService) {

        this.disableNuevoButton = false;
        this.disablePlanSelect = true;
        this.autorizacion = new Autorizacion();
        this._autorizacion.DetallesProcedimientos = [];
        this.autorizacion.Vadidar = false;
        this.inicializar();
        this.funciones = Funcion.funciones;
        this.esNuevo = false;
    }

    ngOnInit(): void {
        this.inicializar();
    }

    inicializar(): void {
        this.currentProcedimientoIndex = -1;
        this.showMsgPlanRequired = false;
        this.disableNuevoButton = false;
        this.autorizacion.Vadidar = false;
        this.disablePlanSelect = true;
        this.planKeySelected = undefined;
        this.nombreProcedimiento = null;
    }

    // NUEVO
    nuevoProcedimiento(): void {
        if (this._autorizacion.CodigoContrato != undefined && this._autorizacion.CodigoProducto != undefined) {
            this.esNuevo = true;
            this.loadPlanes();          
            
            this.disableNuevoButton = true;
            this.disablePlanSelect = false;

            this.currentProcedimientoIndex = 0;
            var procedimiento = this.setProcedimientoDefaultValues(new DetalleProcedimiento());
            procedimiento.Nuevo = true;
            procedimiento.Edicion = false;
            procedimiento.AplicarCambios = false;
            this.deshabilitarAcciones(true);
            procedimiento.Deshabilitado = false;
            this._autorizacion.DetallesProcedimientos.splice(this.currentProcedimientoIndex, 0, procedimiento);
            this.autorizacion.Vadidar = true;
        }
    }

    setProcedimientoDefaultValues(procedimiento: DetalleProcedimiento): DetalleProcedimiento {
        procedimiento.CodigoProcedimiento = leftPad(0, 10);
        procedimiento.Puntaje = 0;
        procedimiento.Funcion = null;
        procedimiento.Porcentaje = 0;
        procedimiento.Cantidad = 1;
        procedimiento.NombrePrestador = null;
        procedimiento.CodigoPrestador = null;
        procedimiento.ValorPorPuntos = 0;
        procedimiento.ValorUnitario = 0;
        procedimiento.ValorAFacturar = 0;
        procedimiento.ValorAPagar = 0;
        return procedimiento;
    }

    // EDICION
    prepararEdicion(p: DetalleProcedimiento, index: number): void {
        if (this._autorizacion.CodigoContrato != undefined && this._autorizacion.CodigoProducto != undefined) {
            this.esNuevo = false;
            this.loadPlanes();
            this.disableNuevoButton = true;
            this.autorizacion.Vadidar = true;
            this.disablePlanSelect = true;
            this.showMsgPlanRequired = false;
            this.nombreProcedimiento = p.NombreProcedimiento;
            this.procedimientoOriginalEdicion = Object.assign({}, p);

            var key = p.CodigoPlan != null ? p.CodigoPlan : "";
            key += p.CodigoVersion != null ? p.CodigoVersion : "";
            key += p.NivelPlan != null ? p.NivelPlan : "";
            this.planKeySelected = key;
            this.currentProcedimientoIndex = index;
            p.Nuevo = false;
            p.Edicion = true;
            p.AplicarCambios = false;
            this.deshabilitarAcciones(true);
            p.Deshabilitado = false;
        }
    }

    checkForApplyChanges(p: DetalleProcedimiento) {
        if (p.CodigoProcedimiento != undefined && p.NombreProcedimiento != undefined && p.Puntaje != undefined
            && p.Funcion != undefined && p.Cantidad > 0)
            p.AplicarCambios = true;
        else
            p.AplicarCambios = false;
    }

    // PLANES
    loadPlanes(): void {
        if (this._autorizacion.CodigoContrato != undefined && this._autorizacion.CodigoProducto != undefined) {
            if (this.planes == undefined || this.planes.length == 0) {
                this.planService.getByFiltersForAutorizacion(this.autorizacion.CodigoContrato, this.autorizacion.CodigoProducto)
                    .subscribe(planes => {
                        this.planes = planes;
                        if(this.esNuevo){
                            this.loadPlanActual();
                        }
                    },
                    error => this.authService.showErrorPopup(error));
            }
        }
    }

    loadPlanActual(): void {
        if (this._autorizacion.ContratoNumero != undefined && this._autorizacion.CodigoProducto != undefined && this._autorizacion.CodigoPlan) {            
                this.planService.getActualByFiltersForAutorizacion(this.autorizacion.ContratoNumero, this.autorizacion.CodigoProducto, this._autorizacion.CodigoPlan)
                    .subscribe(result => {
                        this.planKeySelected = this.loadPlanActualCorporativo(result.CodigoPlan, result.CodigoVersion, this._autorizacion.NivelReferencia);
                        if(this.planKeySelected == undefined){
                            this.showMsgPlanRequired = true;                            
                        }else{
                            this.showMsgPlanRequired = false;
                            this.onChangePlan();
                        }                        
                    },
                    error => this.authService.showErrorPopup(error));            
        }
    }

    loadPlanActualCorporativo(codPlan: string, version: number, nivel: number): string{
        for (let plan of this.planes) {            
            if(plan.Nivel == null){
                if (plan.CodigoPlan == codPlan && 
                    plan.CodigoVersion == version) {
                    return plan.Key;
                }
            }else{
                if (plan.CodigoPlan == codPlan && 
                    plan.CodigoVersion == version &&
                    plan.Nivel == version) {
                    return plan.Key;
                }  
            }               
        }
        return undefined;
    }

    onChangePlan() {
        if (this._autorizacion.DetallesProcedimientos != undefined && this._autorizacion.DetallesProcedimientos.length > 0 && this.currentProcedimientoIndex != -1) {
            var p = this._autorizacion.DetallesProcedimientos[this.currentProcedimientoIndex];
            if (this.planKeySelected != undefined) {
                var plan = this.planes.find(p => p.Key == this.planKeySelected);
                if (plan != null) {
                    p.CodigoPlan = plan.CodigoPlan;
                    p.CodigoVersion = plan.CodigoVersion;
                    p.NivelPlan = plan.Nivel;
                    this.showMsgPlanRequired = false;
                    this.checkForApplyChanges(p);
                }
            } else {
                p.CodigoPlan = undefined;
                p.CodigoVersion = undefined;
                p.NivelPlan = undefined;
                p.ValorPorPuntos = 0;
                p.Puntaje = 0;
                p.ValorUnitario = 0;
                this.checkForApplyChanges(p);
            }
            this.calcularValoresProcedimiento(p);
        }
    }

    // acciones de la tabla
    deshabilitarAcciones(deshabilitar: boolean) {
        if (this._autorizacion.DetallesProcedimientos != undefined && this._autorizacion.DetallesProcedimientos.length > 0) {
            this._autorizacion.DetallesProcedimientos.forEach(element => {
                element.Deshabilitado = deshabilitar;
            });
        }
    }

    cancelar(index: number, p: DetalleProcedimiento): void {
        if (p != undefined) {
            if (p.Nuevo)
                this.autorizacion.DetallesProcedimientos.splice(index, 1);
            else {
                p = Object.assign(p, this.procedimientoOriginalEdicion);
                p.Nuevo = false;
                p.Edicion = false;
                this.procedimientoOriginalEdicion = null;
            }
        }
        this.deshabilitarAcciones(false);
        this.showMsgPlanRequired = false;
        this.disableNuevoButton = false;
        this.autorizacion.Vadidar = false;
        this.disablePlanSelect = true;
        this.nombreProcedimiento = null;
        this.planKeySelected = null;
        this.planKeySelected = undefined;
        this.autorizacion.Vadidar = false;
    }

    buscarProcedimiento(p: DetalleProcedimiento) {
        if (p != undefined && p.CodigoProcedimiento != undefined) {
            if (p.CodigoPlan == undefined || p.CodigoVersion == undefined) {
                this.showMsgPlanRequired = true;
                return;
            }
            var numeroProcedimiento = parseInt(p.CodigoProcedimiento);
            var pp = new Plan();
            pp.NumProcedimiento = numeroProcedimiento;
            pp.CodigoPlan = p.CodigoPlan;
            pp.CodigoVersion = p.CodigoVersion;
            pp.CodigoProducto = this.autorizacion.CodigoProducto;
            this.procedimientoService.getOneByKey(pp).subscribe(
                result => {
                    if (result != undefined) {
                        this.nombreProcedimiento = result.NombreProcedimiento;
                        p.NombreProcedimiento = result.NombreProcedimiento;
                        p.ValorPorPuntos = result.ValorPorPuntos;
                        p.Puntaje = result.Puntaje;
                        p.ValorUnitario = result.ValorUnitario;
                        this.calcularValoresProcedimiento(p);
                        this.checkForApplyChanges(p);
                    } else {
                        this.nombreProcedimiento = "No se encuentra el procedimiento especificado.";
                        p.NombreProcedimiento = null;
                        p.ValorPorPuntos = 0;
                        p.Puntaje = 0;
                        p.ValorUnitario = 0;
                        this.calcularValoresProcedimiento(p);
                        this.checkForApplyChanges(p);
                    }
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    onChangeFuncion(p: DetalleProcedimiento) {
        if (p.Funcion != undefined) {
            var func = this.funciones.find(f => f.Nombre == p.Funcion);
            if (func != undefined) {
                p.Funcion = func.Nombre;
                p.Porcentaje = func.Porcentaje;
                this.establecerValoresFuncion(p);
                this.calcularValoresProcedimiento(p);
            } else {
                this.limpiarValoresFuncion(p);
                this.calcularValoresProcedimiento(p);
            }
        } else {
            this.limpiarValoresFuncion(p);
            this.calcularValoresProcedimiento(p);
        }
        this.checkForApplyChanges(p);
    }

    establecerValoresFuncion(p: DetalleProcedimiento) {
        if (p.Funcion == Funcion.CLINICA) {
            p.CodigoPrestador = this._autorizacion.CodigoPrestadorEmpresa;
            p.NombrePrestador = this._autorizacion.NombrePrestadorEmpresa;
        } else {
            p.CodigoPrestador = this._autorizacion.CodigoPrestador;;
            p.NombrePrestador = this._autorizacion.NombrePrestador;
        }
    }

    limpiarValoresFuncion(p: DetalleProcedimiento): void {
        p.CodigoPrestador = null;
        p.NombrePrestador = null;
        p.Porcentaje = 0;
    }

    calcularValoresProcedimiento(p: DetalleProcedimiento): void {
        p.ValorAPagar = p.Cantidad * p.ValorUnitario * p.Porcentaje;
        this.checkForApplyChanges(p);
    }

    // Crear o Actualizar
    aplicarCambios(p: DetalleProcedimiento): void {
        p.AutorizacionId = this._autorizacion.Id;
        p.Nuevo = false;
        p.Edicion = false;

        this.deshabilitarAcciones(false);
        this.showMsgPlanRequired = false;
        this.disableNuevoButton = false;
        this.autorizacion.Vadidar = false;
        this.disablePlanSelect = true;
        this.nombreProcedimiento = null;
        this.planKeySelected = null;
        this.planKeySelected = undefined;
    }

    eliminar(id: number, index: number): void {
        if (this.authService.isAuthorizeRequest()) {
            swal({
                title: "¿Está seguro?",
                text: "Va a eliminar el procedimiento!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ec4758",
                confirmButtonText: "Si, elimínelo",
                closeOnConfirm: true
            }, () => {
                this.autorizacion.DetallesProcedimientos.splice(index, 1);
                this.chRef.detectChanges();
            });
        }
    }
}