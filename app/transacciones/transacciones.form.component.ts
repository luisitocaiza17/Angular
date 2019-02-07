import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { RegionService } from '../common/servicios/region.service';
import { TransaccionService } from '../common/servicios/transaccion.service';

import { Region } from '../common/model/region';
import { ContratoEntityFilter, ContratoEntityList, ContratoKey } from '../common/model/contrato';
import { ConstantService } from '../utils/constant.service';
import { ContratosTxListComponent } from './contratosTx.list.component';
import { Permiso } from '../seguridad/usuario';

@Component({
    selector: 'transaccionesForm',
    providers: [TransaccionService],
    templateUrl: 'transacciones.form.template.html'
})

export class TransaccionesFormComponent implements OnInit {

    suscription: any;
    contratoKey: ContratoKey;
    opcion: string;
    accessTransaccionesCambios: boolean;
    accessTransaccionesPagos: boolean;
    accessTransaccionesContratos: boolean;
    accessTransaccionesOtros: boolean;

    accessSubCorrespondencia: boolean;
    accessSubTransaccionesPlan: boolean;
    accessSubTransaccionesTitular: boolean;
    accessSubTransaccionesEmpresa: boolean;
    accessSubTransaccionesPendienteVigente: boolean;
    accessSubTransaccionesPrecio: boolean;
    accessSubTransaccionesFormaPago: boolean;
    accessSubTransaccionesPagoInteligente: boolean;
    accessSubTransaccionesAnulacion: boolean;
    accessSubTransaccionesAplicacionDescuentos: boolean;
    accessSubTransaccionesBloqueoDesbloqueoMorosidad: boolean;
    accessSubTransaccionesFacturacionManual: boolean;
    accessSubTransaccionesQuitarCarencias: boolean;
    accessSubTransaccionesRenovacion: boolean;
    accessSubTransaccionesReactivacion: boolean;
    accessSubTransaccionesMantenimientoObservaciones: boolean;
    accessSubTransaccionesModificarBeneficiarios: boolean;
    accessSubTransaccionesTransicionAnticipada: boolean;
    accessSubTransaccionesSeguroDegravamen: boolean;
    accessSubTransaccionesMaternidad: boolean;
    accessSubTransaccionesEmisionTarjetas: boolean;
    accessSubTransaccionesReasignacionCartera: boolean;


    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
        private authService: AuthService, private regionService: RegionService,
        public transaccionService: TransaccionService, private constantService: ConstantService,
        private contratosTxListComponent: ContratosTxListComponent) {

        this.verificarPermisos();

        this.contratoKey = new ContratoKey();

        this.suscription = this.contratosTxListComponent.selectContrato$.subscribe(
            (contratoKey) => {
                if (contratoKey != undefined && contratoKey.CodigoContrato != undefined) {
                    this.contratoKey = contratoKey;
                }
            }
        );
    }

    ngOnInit(): void {
        this.opcion = "";
    }

    isActive(divActivo: string) {
        if (this.opcion == divActivo)
            return true;
        return false;
    }

    activar(opcion: string) {
        this.opcion = opcion;
    }

    verificarPermisos(): void {
        this.accessTransaccionesCambios = false;
        this.accessTransaccionesContratos = false;
        this.accessTransaccionesOtros = false;
        this.accessTransaccionesPagos = false;

        this.accessSubTransaccionesPlan = false;
        this.accessSubTransaccionesTitular = false;
        this.accessSubTransaccionesEmpresa = false;
        this.accessSubTransaccionesPrecio = false;
        this.accessSubTransaccionesPendienteVigente = false;
        this.accessSubCorrespondencia = false;
        this.accessSubTransaccionesFormaPago = false;
        this.accessSubTransaccionesPagoInteligente = false;
        this.accessSubTransaccionesAnulacion = false;
        this.accessSubTransaccionesAplicacionDescuentos = false;
        this.accessSubTransaccionesBloqueoDesbloqueoMorosidad = false;
        this.accessSubTransaccionesFacturacionManual = false;
        this.accessSubTransaccionesQuitarCarencias = false;
        this.accessSubTransaccionesRenovacion = false;
        this.accessSubTransaccionesReactivacion = false;
        this.accessSubTransaccionesMantenimientoObservaciones = false;
        this.accessSubTransaccionesEmisionTarjetas = false;
        this.accessSubTransaccionesMaternidad = false;
        this.accessSubTransaccionesModificarBeneficiarios = false;
        this.accessSubTransaccionesTransicionAnticipada = false;
        this.accessSubTransaccionesSeguroDegravamen = false;
        this.accessSubTransaccionesReasignacionCartera = false;



        var listaPermisos: string[] = this.authService.getPermisos();
        if (listaPermisos != undefined && listaPermisos.length > 0) {
            var admin = listaPermisos.find(p => p == Permiso.ADMINISTRADOR);
            if (admin != undefined) {
                this.accessTransaccionesCambios = true;
                this.accessTransaccionesContratos = true;
                this.accessTransaccionesOtros = true;
                this.accessTransaccionesPagos = true;

                this.accessSubTransaccionesPlan = true;
                this.accessSubTransaccionesTitular = true;
                this.accessSubTransaccionesEmpresa = true;
                this.accessSubTransaccionesPrecio = true;
                this.accessSubTransaccionesPendienteVigente = true;
                this.accessSubCorrespondencia = true;
                this.accessSubTransaccionesFormaPago = true;
                this.accessSubTransaccionesPagoInteligente = true;
                this.accessSubTransaccionesAnulacion = true;
                this.accessSubTransaccionesAplicacionDescuentos = true;
                this.accessSubTransaccionesBloqueoDesbloqueoMorosidad = true;
                this.accessSubTransaccionesFacturacionManual = true;
                this.accessSubTransaccionesQuitarCarencias = true;
                this.accessSubTransaccionesRenovacion = true;
                this.accessSubTransaccionesReactivacion = true;
                this.accessSubTransaccionesMantenimientoObservaciones = true;
                this.accessSubTransaccionesEmisionTarjetas = true;
                this.accessSubTransaccionesMaternidad = true;
                this.accessSubTransaccionesModificarBeneficiarios = true;
                this.accessSubTransaccionesTransicionAnticipada = true;
                this.accessSubTransaccionesSeguroDegravamen = true;
                this.accessSubTransaccionesReasignacionCartera = true;

            }
            else {
                // transacciones
                auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_CAMBIO_CORRESPONDENCIA);
                if (auth != undefined) {
                    this.accessTransaccionesCambios = true;
                    this.accessSubCorrespondencia = true;
                }

                var auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_CAMBIOS);
                if (auth != undefined) {
                    this.accessTransaccionesCambios = true;
                    this.accessSubTransaccionesPlan = true;
                    this.accessSubTransaccionesTitular = true;
                    this.accessSubTransaccionesEmpresa = true;
                    this.accessSubTransaccionesPrecio = true;
                    this.accessSubTransaccionesPendienteVigente = true;
                } else {

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_PLAN);
                    if (auth != undefined) {
                        this.accessTransaccionesCambios = true;
                        this.accessSubTransaccionesPlan = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_TITULAR);
                    if (auth != undefined) {
                        this.accessTransaccionesCambios = true;
                        this.accessSubTransaccionesTitular = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_EMPRESA);
                    if (auth != undefined) {
                        this.accessTransaccionesCambios = true;
                        this.accessSubTransaccionesEmpresa = true;
                        this.accessSubTransaccionesPrecio = true;
                        this.accessSubTransaccionesPendienteVigente = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_REASIGNACION_CARTERA);
                    if (auth != undefined) {
                        this.accessTransaccionesCambios = true;
                        this.accessSubTransaccionesReasignacionCartera = true;
                    }

                }

                auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_PAGOS);
                if (auth != undefined) {
                    this.accessTransaccionesPagos = true;
                    this.accessSubTransaccionesFormaPago = true;
                    this.accessSubTransaccionesPagoInteligente = true;
                } else {

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_FORMA_PAGO);
                    if (auth != undefined) {
                        this.accessTransaccionesPagos = true;
                        this.accessSubTransaccionesFormaPago = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_PAGO_INTELIGENTE);
                    if (auth != undefined) {
                        this.accessTransaccionesPagos = true;
                        this.accessSubTransaccionesPagoInteligente = true;
                    }

                }


                auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_CONTRATOS);
                if (auth != undefined) {
                    this.accessTransaccionesContratos = true;
                    this.accessSubTransaccionesAnulacion = true;
                    this.accessSubTransaccionesBloqueoDesbloqueoMorosidad = true;
                    this.accessSubTransaccionesRenovacion = true;
                    this.accessSubTransaccionesReactivacion = true;
                    this.accessSubTransaccionesMantenimientoObservaciones = true;
                    this.accessSubTransaccionesEmisionTarjetas = true;
                } else {

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_ANULACION);
                    if (auth != undefined) {
                        this.accessTransaccionesContratos = true;
                        this.accessSubTransaccionesAnulacion = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_APLICACION_DESCUENTO);
                    if (auth != undefined) {
                        this.accessTransaccionesContratos = true;
                        this.accessSubTransaccionesAplicacionDescuentos = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_BLOQUEO_DESBLOQUEO);
                    if (auth != undefined) {
                        this.accessTransaccionesContratos = true;
                        this.accessSubTransaccionesBloqueoDesbloqueoMorosidad = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_FACTURACION_MANUAL);
                    if (auth != undefined) {
                        this.accessTransaccionesContratos = true;
                        this.accessSubTransaccionesFacturacionManual = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_QUITAR_CARENCIAS);
                    if (auth != undefined) {
                        this.accessTransaccionesContratos = true;
                        this.accessSubTransaccionesQuitarCarencias = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_RENOVACION);
                    if (auth != undefined) {
                        this.accessTransaccionesContratos = true;
                        this.accessSubTransaccionesRenovacion = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_REACTIVACION);
                    if (auth != undefined) {
                        this.accessTransaccionesContratos = true;
                        this.accessSubTransaccionesReactivacion = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_MANTENIMIENTO_OBS);
                    if (auth != undefined) {
                        this.accessTransaccionesContratos = true;;
                        this.accessSubTransaccionesMantenimientoObservaciones = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_EMISION_TARJETAS);
                    if (auth != undefined) {
                        this.accessTransaccionesContratos = true;
                        this.accessSubTransaccionesEmisionTarjetas = true;
                    }
                }


                auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_OTROS);
                if (auth != undefined) {
                    this.accessTransaccionesOtros = true;
                    this.accessSubTransaccionesModificarBeneficiarios = true;
                    this.accessSubTransaccionesTransicionAnticipada = true;
                    this.accessSubTransaccionesSeguroDegravamen = true;
                } else {

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_MOD_MATERNIDAD);
                    if (auth != undefined) {
                        this.accessTransaccionesOtros = true;
                        this.accessSubTransaccionesMaternidad = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_MOD_BENEFICIARIO);
                    if (auth != undefined) {
                        this.accessTransaccionesOtros = true;
                        this.accessSubTransaccionesModificarBeneficiarios = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_ANTICIPADA);
                    if (auth != undefined) {
                        this.accessTransaccionesOtros = true;
                        this.accessSubTransaccionesTransicionAnticipada = true;
                    }

                    auth = listaPermisos.find(p => p == Permiso.TRANSACCIONES_SEG_DESGRAVAMEN);
                    if (auth != undefined) {
                        this.accessTransaccionesOtros = true;
                        this.accessSubTransaccionesSeguroDegravamen = true;
                    }

                    

                }

            }
        }
    }
}
