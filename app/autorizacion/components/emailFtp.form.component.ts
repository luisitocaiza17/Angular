import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { NgModel } from '@angular/forms';

import { AutorizacionListComponent } from '../autorizacion.list.component';
import { AuthService } from '../../seguridad/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Autorizacion, AutorizacionKey, AutorizacionFilter } from '../../common/model/autorizacion';
import { TipoPdf } from '../../common/model/autorizacion.constant';
import { AutorizacionService } from '../../common/servicios/autorizacion.service';
import { CiudadAutorizacion, EstadoCobertura } from '../../common/model/autorizacion.constant';

@Component({
    selector: 'emailFtpForm',
    providers: [AutorizacionService],
    templateUrl: 'emailFtp.form.template.html'
})

export class EmailFtpFormComponent implements OnDestroy {

    urlPdf: any;
    suscription: any;
    autorizacionKey: AutorizacionKey;
    autorizacion: Autorizacion;
    ciudades: string[];

    tipoPdf: TipoPdf;
    datosPdf: any;
    mostrarPdf: boolean;

    constructor(public domSanitizer: DomSanitizer, public autorizacionService: AutorizacionService, private authService: AuthService,
        private autorizacionListComponent: AutorizacionListComponent,
        private elementRef: ElementRef, private chRef: ChangeDetectorRef) {
        this.autorizacion = new Autorizacion();
        this.tipoPdf = new TipoPdf();
        this.mostrarPdf = false;

        // Constantes
        this.ciudades = CiudadAutorizacion.values;

        this.suscription = this.autorizacionListComponent.autorizacionKey$.subscribe(
            (autorizacionKey) => {
                if (autorizacionKey != undefined && autorizacionKey.autorizacionSeleccionado != undefined) {
                    this.autorizacionKey = autorizacionKey;
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
        this.autorizacion = this.autorizacionKey.autorizacionSeleccionado;
        if (this.autorizacion != undefined) {
            var autorizacionFilter = new AutorizacionFilter();
            autorizacionFilter.IdAutorizacion = this.autorizacion.Id;

            this.autorizacionService.getOneByFilter(autorizacionFilter).subscribe(
                result => {
                    this.autorizacion.Alcance = result.Alcance;
                    this.autorizacion.Diagnosticos = result.Diagnosticos;
                    this.determinarTipoCarta();
                },
                err => this.authService.showErrorPopup(err)
            );
        }
    }

    determinarTipoCarta() {
        if (this.autorizacion.Alcance != undefined && this.autorizacion.Alcance)
            this.autorizacion.TipoDocumento = this.tipoPdf.ALCANCE;
        else if (this.autorizacion.EstadoCobertura == EstadoCobertura.CUBIERTO)
            this.autorizacion.TipoDocumento = this.tipoPdf.CUBIERTO;
        else if (this.autorizacion.EstadoCobertura == EstadoCobertura.NO_CUBIERTO)
            this.autorizacion.TipoDocumento = this.tipoPdf.NO_CUBIERTO;
    }

    view(): void {
        if (this.autorizacion != undefined) {
            let resp = this.autorizacionService.getLetter(this.autorizacion)
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
        if (this.autorizacion != undefined) {
            // validacion correo usuario
            if (this.correoUsuarioValido()) {
                // popup confirmacion envio
                this.showPopupConfirmacionEnvioMail();
            }
        }
    }

    showPopupConfirmacionEnvioMail(): void {
        var title = "¿Esta seguro(a) que desea enviar un correo electrónico al cliente con la carta de respuesta de cobertura seleccionada?";
        var text = "Se enviará a los correos:</br>" + this.autorizacion.EmailDomicilio;
        text += this.autorizacion.EmailTrabajo != undefined ? "</br>" + this.autorizacion.EmailTrabajo : "";

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
                this.verificarEnvioCorreo();
            });
        }
    }

    verificarEnvioCorreo(): void {
        if (this.autorizacion != undefined) {
            this.autorizacionService.verificarEnvioCorreoPrevio(this.autorizacion).subscribe(
                result => {
                    if (result != undefined && result != '') {
                        swal({
                            title: "",
                            text: "<h3>" + result + "</h3>",
                            type: "warning",
                            html: true,
                            showCancelButton: true,
                            confirmButtonColor: "#ec4758",
                            confirmButtonText: "¿Continuar y enviar?",
                            closeOnConfirm: true
                        }, () => {
                            this.enviarCorreo();
                        });
                    }
                    else
                        this.enviarCorreo();
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    enviarCorreo(): void {
        this.autorizacionService.enviarEmail(this.autorizacion).subscribe(
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

    verificarEnvioFtp(): void {
        if (this.autorizacion != undefined) {
            this.autorizacionService.verificarEnvioCorreoPrevio(this.autorizacion).subscribe(
                result => {
                    if (result != undefined && result != '') {
                        swal({
                            title: "",
                            text: "<h3>" + result + "</h3>",
                            type: "warning",
                            html: true,
                            showCancelButton: true,
                            confirmButtonColor: "#ec4758",
                            confirmButtonText: "¿Continuar y enviar?",
                            closeOnConfirm: true
                        }, () => {
                            this.enviarFtp();
                        });
                    }
                    else
                        this.enviarFtp();
                },
                error => this.authService.showErrorPopup(error)
            );
        }
    }

    enviarFtp(): void {
        this.autorizacionService.enviarFtp(this.autorizacion).subscribe(
            msg => {
                this.showPopup(msg, 'info');
            }, error => this.authService.showErrorPopup(error)
        );
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