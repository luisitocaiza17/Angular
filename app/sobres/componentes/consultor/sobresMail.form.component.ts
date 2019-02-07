import { Component, OnInit, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'

import { AuthService } from '../../../seguridad/auth.service';
import { SbConsultorListComponent } from './listadoSbConsultor.list.component';
import { ServicioSMS } from '../../../common/servicios/sms.Service';

import { SobreReembolsoService } from '../../service/sobreReembolso.service';
import { EmailSobreReembolsoService } from '../../service/emailSobreReembolso.service';
import { PdfSobreReembolsoService } from '../../service/pdfSobreReembolso.service';
import { ConstantesSobres } from '../../utils/constantesSobres';

import { ContratoService } from '../../../common/servicios/contrato.service';
import { TransaccionKey } from '../../../common/model/transacciones';
import { DatosTitular } from '../../../common/model/contrato';
import { MensajeSMS, TipoSMS } from '../../../common/model/mensajesms';
import { SobreEntity } from '../../model/SobreEntity';
import { EmailSobreFilter } from '../../model/EmailSobreFilter';

@Component({
    selector: 'sobresMail',
    providers: [ContratoService, EmailSobreReembolsoService, PdfSobreReembolsoService],
    templateUrl: 'sobresMail.form.template.html'
})

export class EmailSobresFormComponent implements OnInit, OnDestroy {

    urlPdf: any;
    suscription: any;
    tipoMesaje: string;


    opcion: string;
    sobre: SobreEntity;
    datos: DatosTitular;
    filter: EmailSobreFilter;

    constructor(private elementRef: ElementRef, private chRef: ChangeDetectorRef, public domSanitizer: DomSanitizer,
        private authService: AuthService, private sbConsultorListComponent: SbConsultorListComponent, private contratoService: ContratoService,
        private sobreService: SobreReembolsoService, public servicioSMS: ServicioSMS, public pdfSobreReembolsoService: PdfSobreReembolsoService,
        public emailSobreReembolsoService: EmailSobreReembolsoService, public constantesSobres: ConstantesSobres
    ) {

        this.sobre = new SobreEntity();
        this.datos = new DatosTitular();
        this.suscription = this.sbConsultorListComponent.selectSobre$.subscribe(
            (sobre) => {
                if (sobre != undefined && sobre.CodigoRegion != undefined && sobre.NumeroContrato != undefined && sobre.CodigoProducto != undefined) {
                    this.sobre = sobre;
                    this.loadDatos();
                }
            }
        );
    }

    ngOnInit(): void {
        this.opcion = "";
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    isActive(divActivo: string) {
        if (this.opcion == divActivo)
            return true;
        return false;
    }

    activar(opcion: string) {
        this.opcion = opcion;
    }

    loadDatos() {
        var filter = new TransaccionKey();
        filter.CodigoContrato = this.sobre.CodigoContrato;
        filter.CodigoProducto = this.sobre.CodigoProducto;
        filter.CodigoRegion = this.sobre.CodigoRegion;
        filter.NumeroContrato = this.sobre.NumeroContrato;

        this.contratoService.getDatosTitular(filter).subscribe(
            result => {
                this.datos = result;
                this.sobre.NombresTitular = result.Nombres + " " + result.Apellidos;
                this.sobre.EmailDomicilio = result.DomicilioEmail;
                this.sobre.EmailTrabajo = result.TrabajoEmail;
                this.sobre.RenovacionEmailBroker = result.RenovacionEmailBroker;
                this.sobre.Empresa = result.Empresa;

            },
            error => this.authService.showErrorPopup(error)
        );
    }

    view(): void {
        if (this.sobre != undefined) {

            this.filter = new EmailSobreFilter();
            this.filter.IdSobre = this.sobre.IdSobre;
            this.filter.Ciudad = this.sobre.Ciudad;
            let resp = this.pdfSobreReembolsoService.generarCartaDevolcionPdf(this.filter)
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


    notificarCliente(tipo: string): void {
      
        this.tipoMesaje = tipo;
        if (tipo == this.constantesSobres.TIPO_MAIL || tipo == this.constantesSobres.TIPO_MAIL_SMS) {
            if (this.sobre != undefined) {
                // validacion correo usuario
                if (this.correoUsuarioValido()) {

                    if (tipo == this.constantesSobres.TIPO_MAIL_SMS) {
                        var title = "¿Esta seguro(a) que desea enviar un correo electrónico y mensaje al cliente?";
                        var text = "Se enviará a los correos:</br>" + this.sobre.EmailDomicilio;
                        text += this.sobre.EmailTrabajo != undefined ? "</br>" + this.sobre.EmailTrabajo : ""
                        text += this.sobre.RenovacionEmailBroker != undefined ? "</br>" + this.sobre.RenovacionEmailBroker : "</br>";
                        text += "</br>Se enviará un SMS al número:</br>" + this.sobre.Celular;
                        this.showPopupConfirmacionEnvioMail(title, text, tipo);
                    }

                    if (tipo == this.constantesSobres.TIPO_MAIL) {
                        var title = "¿Esta seguro(a) que desea enviar un correo electrónico al cliente?";
                        var text = "Se enviará a los correos:</br>" + this.sobre.EmailDomicilio;
                        text += this.sobre.EmailTrabajo != undefined ? "</br>" + this.sobre.EmailTrabajo : ""
                        text += this.sobre.RenovacionEmailBroker != undefined ? "</br>" + this.sobre.RenovacionEmailBroker : "";
                        
                        this.showPopupConfirmacionEnvioMail(title, text, tipo);
                    }
                }
            }
        }
        if (tipo == this.constantesSobres.TIPO_SMS) {

            var title = "¿Esta seguro(a) que desea enviar un SMS?";
            var text = "Se enviará un SMS al número:</br>" + this.sobre.Celular;
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
                    this.enviarSMS();
                });
            }
        }
    }

    showPopupConfirmacionEnvioMail(title: string, text: string, tipo: string): void {

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

                this.filter = new EmailSobreFilter();
                
                this.filter.IdSobre = this.sobre.IdSobre;
                this.filter.EmailDomicilio = this.sobre.EmailDomicilio;
                this.filter.EmailTrabajo = this.sobre.EmailTrabajo;
                this.filter.RenovacionEmailBroker = this.sobre.RenovacionEmailBroker;
                this.filter.NumeroSobre = this.sobre.NumeroSobre;
                this.emailSobreReembolsoService.enviarEmail(this.filter).subscribe(
                    msg => {
                        if (tipo == this.constantesSobres.TIPO_MAIL_SMS) {
                            this.enviarSMS();
                        }
                        if (tipo == this.constantesSobres.TIPO_MAIL) {
                            this.menu();
                        }
                    },
                    error => this.authService.showErrorPopup(error)
                );
            });
        }
    }

    enviarSMS() {

        var mensajeSMS = new MensajeSMS;
        mensajeSMS.CelularDestino = this.sobre.Celular;
        mensajeSMS.Data = [""];
        mensajeSMS.IDMensaje = TipoSMS.DEVOLUCION;
        this.servicioSMS.postSendSMS(mensajeSMS).subscribe(

            result => {
                this.sobre.SMSDevolucion = true;
                this.sobre.Accion = this.constantesSobres.ACCION_ENVIAR_MENSAJE_DEVOLUCION;

                this.actualizarSMSDevolucion(this.sobre);
            },
            error => {
                if (this.tipoMesaje == this.constantesSobres.TIPO_SMS)
                    this.authService.showErrorPopup(error)
                if (this.tipoMesaje == this.constantesSobres.TIPO_MAIL_SMS)
                    this.authService.showErrorPopup("Los correos electrónicos generados se encuentran: Aceptados para envío, pero ha ocurrido un error al enviar el mensaje")
            }
        );

    }

    actualizarSMSDevolucion(sobre: SobreEntity) {

        var listaSobre = [];
        listaSobre.push(sobre);

        this.sobreService.actualizarSobre(listaSobre).subscribe(
            result => {
                this.menu();
            },
            error => {
                if (this.tipoMesaje == this.constantesSobres.TIPO_SMS)
                    this.authService.showErrorPopup(error)
                if (this.tipoMesaje == this.constantesSobres.TIPO_MAIL_SMS)
                    this.authService.showErrorPopup("Los correos electrónicos generados se encuentran: Aceptados para envío, pero ha ocurrido un error al enviar el mensaje")
            }
        );
    }


    menu() {
        if (this.tipoMesaje == this.constantesSobres.TIPO_MAIL)
            this.authService.showSuccessPopup("Los correos electrónicos generados se encuentran: Aceptados para envío")
        if (this.tipoMesaje == this.constantesSobres.TIPO_SMS)
            this.authService.showSuccessPopup("El mensaje ha sido enviado")
        if (this.tipoMesaje == this.constantesSobres.TIPO_MAIL_SMS) {
            this.authService.showSuccessPopup("Los correos electrónicos generados se encuentran: Aceptados para envío además el mensaje ha sido enviado")
        }

        this.ngOnDestroy();
        this.sbConsultorListComponent.colapsarTab();
        this.sbConsultorListComponent.loadSobres();
        jQuery("#divPanelMail").collapse("hide");
        jQuery("#divConsultar").collapse("show");
    }

    // Validar correo del usuario autenticado, que  sera utilizado como correo origen y CC en el mail a enviar.
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