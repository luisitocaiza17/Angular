import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { AuthService } from '../seguridad/auth.service';
import { OdasListComponent } from './odas.list.component';

import { ReclamoService } from '../common/servicios/reclamo.service';
import { Autorizacion } from '../common/model/autorizacion';
import { Reclamo, ReclamoEntityFilter, ReclamoKey } from '../common/model/reclamo';

@Component({
    selector: 'emailForm',
    providers: [ReclamoService],
    templateUrl: 'email.form.template.html'
})

export class EmailFormComponent implements OnDestroy {

    urlPdf: any;
    suscription: any;
    mostrarPdf: boolean;
    reclamoKey: ReclamoKey;
    reclamo: Reclamo;

    constructor(private elementRef: ElementRef, private chRef: ChangeDetectorRef, public domSanitizer: DomSanitizer,
        private authService: AuthService, private odasListComponent: OdasListComponent,
        private reclamoService: ReclamoService
    ) {

        this.mostrarPdf = false;
        this.suscription = this.odasListComponent.selectReclamo$.subscribe(
            (reclamoKey) => {
                if (reclamoKey != undefined && reclamoKey.ReclamoSeleccionado != undefined
                    && (reclamoKey.ReclamoSeleccionado.NumeroReclamo != undefined)) {
                    this.reclamoKey = reclamoKey;
                    this.loadForm();
                }
            }
        );
    }

    ngOnInit(): void {
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    loadForm() {
        this.reclamo = this.reclamoKey.ReclamoSeleccionado;
    }

    view(): void {
        if (this.reclamo != undefined) {
            var filter = new ReclamoEntityFilter();
            filter.CodigoContrato = this.reclamoKey.ContratoKey.CodigoContrato;
            filter.NumeroAlcance = this.reclamo.NumeroAlcance;
            filter.NumeroContrato = this.reclamoKey.ContratoKey.NumeroContrato;
            filter.NumeroReclamo = this.reclamo.NumeroReclamo;
            filter.NumeroPrestador = this.reclamoKey.ReclamoSeleccionado.NumeroConvenio;            
            
            filter.TipoReclamo = "ODA";
            let resp = this.reclamoService.generarPdf(filter)
                .subscribe(
                resp => {
                    var blob = new Blob([resp._body], { type: 'application/pdf' });
                    var fileURL = URL.createObjectURL(blob);
                    window.open(fileURL);
                },
                err => {
                    this.authService.showBlobErrorPopup(err);
                });
        }
    }

    enviarMail(): void {
        if (this.reclamo != undefined) {
            // validacion correo usuario
            if (this.correoUsuarioValido()) {
                // popup confirmacion envio
                this.showPopupConfirmacionEnvioMail();
            }
        }
    }

    showPopupConfirmacionEnvioMail(): void {
        var title = "¿Esta seguro(a) que desea enviar un correo electrónico al cliente con la carta de respuesta de cobertura seleccionada?";
        var text = "Se enviará a los correos:</br>" + this.reclamo.EmailDomicilio;
        text += this.reclamo.EmailTrabajo != undefined ? "</br>" + this.reclamo.EmailTrabajo : "";

        if (this.authService.isAuthorizeRequest()) {
            swal({
                title: "<h3>" + title + "</h3>",
                text: "<h3>" + text + "</h3>",
                type: "warning",
                html: true,
                showCancelButton: true,
                confirmButtonColor: "#ec4758",
                confirmButtonText: "¿Continuar y enviar?",
                closeOnConfirm: true
            }, () => {
                var autorizacion = new Autorizacion();
                autorizacion.NombreBeneficiario = this.reclamo.NombreBeneficiario;
                autorizacion.NumeroReclamo = this.reclamo.NumeroReclamo;
                autorizacion.NumeroAlcance = this.reclamo.NumeroAlcance;
                autorizacion.CodigoContrato = this.reclamoKey.ContratoKey.CodigoContrato;
                autorizacion.EmailDomicilio = this.reclamo.EmailDomicilio;
                autorizacion.EmailTrabajo = this.reclamo.EmailTrabajo;
                autorizacion.CodigoPrestador = this.reclamoKey.ReclamoSeleccionado.NumeroConvenio; 

                this.reclamoService.enviarEmail(autorizacion).subscribe(
                    msg => {
                        setTimeout(function () {
                            swal({
                                title: "",
                                text: "<h3>" + msg + "</h3>",
                                html: true,
                                type: 'info',
                                closeOnConfirm: true,
                                confirmButtonColor: "#1a7bb9",
                                confirmButtonText: "OK",
                            });
                        }, 100);
                    },
                    error => this.authService.showErrorPopup(error)
                );
            });
        }
    }

    // Validar correo del usuario autenticado, que sera utilizado como correo origen y CC en el mail a enviar.
    correoUsuarioValido(): boolean {
        var result = false;
        var usuario = this.authService.getDatosUsuarioAutenticado();
        if (usuario != undefined) {
            var regExpression = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            var msg = "para el usuario :NombreUsuario, actualice inmediatamente y vuelva a enviar.";
            if (usuario.Correo == undefined || usuario.Correo == '')
                this.showPopup("Correo de origen no digitado " + msg.replace(":NombreUsuario", usuario.NombreUsuario), 'error');
            else if (!regExpression.test(usuario.Correo))
                this.showPopup("Correo de origen no válido " + msg.replace(":NombreUsuario", usuario.NombreUsuario), 'error');
            else
                result = true;
        } else
            this.showPopup("No se pudo obtener los datos del usuario autenticado.", 'error');

        return result;
    }

    showPopup(msg: string, type: string): void {
        swal({
            title: "",
            text: "<h3>" + msg + "</h3>",
            html: true,
            type: type,
            closeOnConfirm: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "OK",
        });
    }
}