import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms';

import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AutorizacionService } from '../../common/servicios/autorizacion.service';
import { DiagnosticoService } from '../../common/servicios/diagnostico.service';
import { MotivoDiagnosticoNoCubiertoService } from '../../common/servicios/motivoDiagnostivoNoCubierto.service';

import { Autorizacion, AutorizacionValidacionKey } from '../../common/model/autorizacion';
import { MotivoDiagnosticoNoCubierto } from '../../common/model/motivoDiagnosticoNoCubierto';
import { Diagnostico } from '../../common/model/diagnostico';
import { EstadoCobertura } from '../../common/model/autorizacion.constant';

@Component({
    selector: 'coberturaDiagnosticoLiquidacionForm',
    providers: [AutorizacionService, MotivoDiagnosticoNoCubiertoService],
    templateUrl: 'coberturaDiagnosticoLiquidacion.form.template.html'
})

export class CoberturaDiagnosticoLiquidacionFormComponent {

    estadosCobertura: string[];

    diagnostico: Diagnostico;

    diagnosticos: Diagnostico[];
    diagnosticosOriginales: Diagnostico[];

    verLblTipoDiagnostico: boolean = true;
    diagnosticoNoCubiertos: MotivoDiagnosticoNoCubierto[];
    estadoCobertura: EstadoCobertura;
    esEditar: boolean;
    existePrincipal: boolean;

    _autorizacion: Autorizacion;
    @Input()
    set autorizacion(autorizacion: Autorizacion) {
        this._autorizacion = autorizacion;
        if (this._autorizacion == undefined)
            this._autorizacion = new Autorizacion();
        if (this._autorizacion.Diagnosticos == undefined)
            this._autorizacion.Diagnosticos = [];
        if (this._autorizacion.MotivoNoCubierto == undefined)
            this._autorizacion.MotivoNoCubierto = new MotivoDiagnosticoNoCubierto();
        this.inicializar();

        if (this._autorizacion.CodigoContrato != undefined)
            this.loadMotivosNoCubiertos();
    }

    get autorizacion() {
        return this._autorizacion;
    }

    _msgMostrar: string;
    @Input()
    set msgMostrar(mensaje: string) {
        this._msgMostrar = mensaje;
    }
    get msgMostrar() {
        return this._msgMostrar;
    }

    constructor(private route: ActivatedRoute, private router: Router, private elementRef: ElementRef,
        private chRef: ChangeDetectorRef, private authService: AuthService, public autorizacionService: AutorizacionService,
        private diagnosticoService: DiagnosticoService, private motivoDiagnosticoNoCubiertoService: MotivoDiagnosticoNoCubiertoService) {

        // constantes
        this.estadosCobertura = EstadoCobertura.values;

        //
        this._autorizacion = new Autorizacion();
        this._autorizacion.MotivoNoCubierto = new MotivoDiagnosticoNoCubierto();
        this._autorizacion.Diagnosticos = [];
        this.inicializar();
    }

    ngOnInit(): void {
        this.inicializar();
        this.diagnosticos = [];
        this.diagnosticoNoCubiertos = [];
    }

    inicializar(): void {
        this.verLblTipoDiagnostico = true;
        this.estadoCobertura = new EstadoCobertura();
        this.diagnostico = new Diagnostico();
        this.diagnostico.Preexistencia = false;
        this.diagnostico.Principal = false;
        this.esEditar = false;

        if (this.autorizacion != undefined && this.autorizacion.Id != undefined && this.autorizacion.Id != 0) {
            this.diagnostico.Tipo = this.estadoCobertura.NoCubierto;
            this.esEditar = true;
            if (this.autorizacion.Diagnosticos != undefined) {
                var autDiagnostico = this.autorizacion.Diagnosticos.find(x => x.Principal == true);
                if (autDiagnostico != undefined) {
                    this.existePrincipal = true;
                }
            }
        }
        else if (this.autorizacion != undefined && (this.autorizacion.Id == undefined || this.autorizacion.Id == 0)) {
            this.diagnostico.Tipo = this.autorizacion.EstadoCobertura;
        } else
            this.diagnostico.Tipo = "";

        if (this.autorizacion != undefined && this.autorizacion.DetalleExcepcion != undefined && this.autorizacion.DetalleExcepcion != "") {
            this.autorizacion.Excepcion = true;
        }
    }

    loadMotivosNoCubiertos(): void {
        if (this.diagnosticoNoCubiertos == undefined || this.diagnosticoNoCubiertos.length < 1) {
            this.motivoDiagnosticoNoCubiertoService.getAll()
                .subscribe(diagnosticosNoCubiertos => {
                    this.diagnosticoNoCubiertos = diagnosticosNoCubiertos;
                },
                    error => this.authService.showErrorPopup(error));
        }
    }

    onChangeEstadoCobertura(estado: string) {

        this.diagnostico.Tipo = this.estadoCobertura.NoCubierto;
        //cambia el tipo segun es estadoCobertura
        if (!this.esEditar) {
            this.diagnostico.Tipo = estado;
        }

        if (this.autorizacion.EstadoCobertura == this.estadoCobertura.Cubierto)
            this.autorizacion.isHabilitarMotivo = true;

        if (this.autorizacion.Diagnosticos != undefined && this.autorizacion.Diagnosticos.length > 0) {
            this.autorizacion.Diagnosticos.forEach(x => {
                if (!x.Preexistencia)
                    x.Tipo = estado;
                //se elimina los nuevos diagnosticos ingresados cuando edito
                if (this.esEditar && !x.Basico && !x.Preexistencia) {
                    var pos = this.autorizacion.Diagnosticos.indexOf(x);
                    this.autorizacion.Diagnosticos.splice(pos, 1);
                }

            });
        }

        //limpia campos segun estado
        if (estado == this.estadoCobertura.NoCubierto) {
            this.autorizacion.MontoAutorizado = null;
        } else if (estado == this.estadoCobertura.Cubierto) {
            this.autorizacion.MotivoNoCubierto = new MotivoDiagnosticoNoCubierto();
            this.autorizacion.DetalleMotivoNoCubierto = null;
        }
        else {
            this.diagnostico.Tipo = "";
            this.autorizacion.MontoAutorizado = null;
            this.autorizacion.MotivoNoCubierto = new MotivoDiagnosticoNoCubierto();
            this.autorizacion.DetalleMotivoNoCubierto = null;
        }
    }

    // Diagnosticos
    adicionarDiagnostico(): void {
        if (this.autorizacion.Diagnosticos == undefined && this.diagnostico != undefined)
            this.autorizacion.Diagnosticos = [];

        var existe = false;
        this.autorizacion.Diagnosticos.forEach(element => {
            if (element.CodigoDiagnostico == this.diagnostico.CodigoDiagnostico && element.Preexistencia == this.diagnostico.Preexistencia) {
                existe = true;
            }
        });

        if (!existe) {
            if (this.autorizacion.EstadoCobertura == this.estadoCobertura.Cubierto && this.diagnostico.Tipo == this.estadoCobertura.NoCubierto)
                this.autorizacion.isHabilitarMotivo = false;
            this.chRef.detectChanges();
            if ((this._autorizacion.Id == undefined || this._autorizacion.Id == 0) && (!this.diagnostico.Preexistencia)) //&& this.diagnostico.Tipo == this.estadoCobertura.Cubierto))
                this.diagnostico.Basico = true;


            this.autorizacion.Diagnosticos.push(this.diagnostico);
            this.autorizacion.Diagnosticos.sort((a, b) => {
                if (a.Preexistencia < b.Preexistencia) {
                    return -1;
                } else if (a.Preexistencia > b.Preexistencia) {
                    return 1;
                } else {
                    return 0;
                }
            });

            //validacion de diagnostico
            this.validarDiagnostico(this.diagnostico);
        } else {
            this.deplegarSwal("info", "El diagnostico seleccionado ya existe");
        }

        this.inicializar();
    }

    validarDiagnostico(diagnostico: Diagnostico) {
        var msg = "";
        var nombreDiagnostico = this.diagnostico.CodigoDiagnostico + " " + this.diagnostico.Diagnostico;
        if (diagnostico.Principal) {
            this.existePrincipal = true;
            if (diagnostico.CabeceraDiagnostico == undefined || diagnostico.CabeceraDiagnostico.length == 0) {
                msg = "El diagnostico cabecera para el diagnóstico: " + nombreDiagnostico + " No esta ingresado en el beneficario " + this.autorizacion.NombreBeneficiario;
                this.deplegarSwal("info", msg);
            } else {
                var autorizacionKey = this.createAutorizacionValidacionKey(diagnostico);
                this.autorizacionService.validacionDiagnostico(autorizacionKey).subscribe(
                    mensaje => {
                        if (mensaje != undefined && mensaje.arra != undefined) {
                            var msg = "";
                            mensaje.array.forEach(element => {
                                msg += "<li>" + element + "</li>";
                            });
                            this.deplegarSwal("info", msg);
                        }
                    },
                    error => this.authService.showErrorPopup(error)
                );
            }
        }
    }

    createAutorizacionValidacionKey(diagnostico: Diagnostico): AutorizacionValidacionKey {
        var autorizacionKey = new AutorizacionValidacionKey();
        autorizacionKey.CodigoPlan = this.autorizacion.CodigoPlan;
        autorizacionKey.CodProducto = this.autorizacion.CodigoProducto;
        autorizacionKey.EstadoConvenio = this.autorizacion.NumeroEstadoConvenio;
        autorizacionKey.TipoConvenio = this.autorizacion.TipoConvenio;
        autorizacionKey.CodigoPlan = this.autorizacion.CodigoPlan;
        autorizacionKey.Region = this.autorizacion.Region;
        autorizacionKey.VersioPlan = this.autorizacion.VersionPlan;
        autorizacionKey.CabeceraDiagnostico = diagnostico.CabeceraDiagnostico;
        autorizacionKey.ContratoNumero = this.autorizacion.ContratoNumero;
        autorizacionKey.CodigoContrato = this.autorizacion.CodigoContrato;
        autorizacionKey.PersonaNumero = this.autorizacion.PersonaNumero;
        autorizacionKey.CodigoDiagnostico = diagnostico.CodigoDiagnostico;
        autorizacionKey.Diagnostico = diagnostico.Diagnostico;
        autorizacionKey.TipoSolicitud = this.autorizacion.TipoSolicitud;
        return autorizacionKey;
    }

    eliminarDiagnostico(diagnosticoSeleccionado: Diagnostico): void {
        var pos = this.autorizacion.Diagnosticos.indexOf(diagnosticoSeleccionado);
        this.autorizacion.Diagnosticos.splice(pos, 1);

        if (diagnosticoSeleccionado.Principal)
            this.existePrincipal = false;
    }

    listarTipoDiagnostico(valor: any) {
        if (this.autorizacion != undefined && (this.autorizacion.Id == undefined || this.autorizacion.Id == 0)) {
            if (valor) {
                this.verLblTipoDiagnostico = false;
                this.diagnostico.Id = null;
                this.diagnostico.CodigoDiagnostico = null;
                this.diagnostico.Diagnostico = null;
            }
            else {
                this.verLblTipoDiagnostico = true;
                this.diagnostico.Tipo = this.estadoCobertura.Cubierto;
            }
        } else {
            if (valor) {
                this.verLblTipoDiagnostico = false;
                this.diagnostico.Id = null;
                this.diagnostico.CodigoDiagnostico = null;
                this.diagnostico.Diagnostico = null;
            }
            else {
                this.verLblTipoDiagnostico = true;
                this.diagnostico.Tipo = this.estadoCobertura.NoCubierto;
            }
        }
    }
    //Modal    
    listarDiagnosticos() {
        if (this.autorizacion.EstadoCobertura == this.estadoCobertura.Cubierto && this.diagnostico.Tipo == this.estadoCobertura.NoCubierto) {
            this.deplegarSwal("warning", "<h3>" + "Va a agregar un diagnostico no cubierto en una Autorizacion de tipo Cubierta" + "</h3>");
        }

        this.diagnosticoService.getAllByIniciales(this.diagnostico.Diagnostico).subscribe(
            diagnosticos => {
                this.diagnosticos = diagnosticos;
                this.diagnosticosOriginales = diagnosticos;
            },
            error => this.authService.showErrorPopup(error));
    }

    deplegarSwal(tipo: string, mensaje: string) {
        swal({
            title: "",
            text: mensaje,
            html: true,
            type: tipo,
            closeOnConfirm: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
        });
    }

    filtrarDiagnostico(searchValue: string) {
        if (this.diagnosticos != undefined && this.diagnosticos.length > 0) {
            var a = this.diagnosticosOriginales.filter(item => item.Diagnostico.toLocaleUpperCase().includes(searchValue.toLocaleUpperCase()));
            this.diagnosticos = a;
        }
        if (searchValue == undefined || searchValue.length == 0) {
            this.diagnosticos = this.diagnosticosOriginales;
        }
    }

    seleccionarDiagnostico(diagnosticoSeleccionado: Diagnostico): void {
        this.diagnostico.Id = diagnosticoSeleccionado.Id;
        this.diagnostico.CodigoDiagnostico = diagnosticoSeleccionado.CodigoDiagnostico;
        this.diagnostico.Diagnostico = diagnosticoSeleccionado.Diagnostico;
        this.diagnostico.CabeceraDiagnostico = diagnosticoSeleccionado.CabeceraDiagnostico;
        this.adicionarDiagnostico();
        jQuery("#diagnosticoViewModal").modal("hide");
        this.msgMostrar = null;
    }
    onSelectionChange() {
        if (this.autorizacion.Excepcion == false) {
            this.autorizacion.DetalleExcepcion = undefined;
        }
    }
}