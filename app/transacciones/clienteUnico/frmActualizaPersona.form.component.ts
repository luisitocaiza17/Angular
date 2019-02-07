import { Component, Input, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser'
import { AuthService } from '../../seguridad/auth.service';
import { PersonaUnicaEntity, TipoPantallaPersonaUnica } from '../../common/model/persona';
import { Catalogo } from '../../common/model/catalogo';
import { ClienteUnicoService } from '../../common/servicios/clienteUnico.service';
import { CatalogoService } from '../../common/servicios/catalogo.service';
import { ProvinciasEntity } from '../../common/model/provincias';

@Component({
    selector: 'frmActualizaPersona',
    providers: [ClienteUnicoService],
    templateUrl: 'frmActualizaPersona.form.template.html'
})

export class FrmActualizaPersonaFormComponent {

    persona: PersonaUnicaEntity;
    tipoDocumento: number;
    sexo: number;
    correspondencia: number;
    estadoCivil: number;
    nacionalidad: number;
    ciudades: Catalogo[];
    provincias: ProvinciasEntity[];

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es',
    };

    _datosPantalla: TipoPantallaPersonaUnica;
    @Input()
    set tipoPantalla(datosPantalla: TipoPantallaPersonaUnica) {
        this._datosPantalla = datosPantalla;
        if (this._datosPantalla.NumeroPersona != undefined) {
            this.loadCiudades();
            this.loadProvincias();

        }
        else {
            this.persona = new PersonaUnicaEntity();
            this._datosPantalla = new TipoPantallaPersonaUnica();
        }
    }


    constructor(public domSanitizer: DomSanitizer, private authService: AuthService, private elementRef: ElementRef,
        private clienteUnico: ClienteUnicoService, private catalogoService: CatalogoService) {
        this.persona = new PersonaUnicaEntity();
        this._datosPantalla = new TipoPantallaPersonaUnica();
        this.ciudades = [];
    }

    loadDatos(): void {
        this.clienteUnico.getClienteUnico(this._datosPantalla.NumeroPersona).subscribe(
            result => {

                if (result.TipoDocumento == undefined && result.Cedula == undefined && result.Pasaporte == undefined && result.NumeroPersona == undefined) {
                    this.authService.showInfoPopup("No se encuentra a la persona");
                }
                else {
                    this.persona = result;

                    if (this.persona.FechaNacimiento != undefined) {
                        this.persona.FechaNacimiento = new Date(this.persona.FechaNacimiento);
                    }

                    if (this.persona.TipoDocumento.toUpperCase() == "CI") {
                        this.tipoDocumento = 1;
                    }
                    if (this.persona.TipoDocumento.toUpperCase() == "PS") {
                        this.tipoDocumento = 2;
                    }
                    if (this.persona.TipoDocumento.toUpperCase() == "HS") {
                        this.tipoDocumento = 3;
                    }

                    if (this.persona.Sexo.toUpperCase() == "M") {
                        this.sexo = 1;
                    }
                    if (this.persona.Sexo.toUpperCase() == "F") {
                        this.sexo = 2;
                    }

                    if (this.persona.EstadoCivil != undefined) {
                        if (this.persona.EstadoCivil.toUpperCase() == "SOLTERO") {
                            this.estadoCivil = 1;
                        }
                        if (this.persona.EstadoCivil.toUpperCase() == "CASADO") {
                            this.estadoCivil = 2;
                        }
                        if (this.persona.EstadoCivil.toUpperCase() == "DIVORCIADO") {
                            this.estadoCivil = 3;
                        }
                        if (this.persona.EstadoCivil.toUpperCase() == "VIUDO") {
                            this.estadoCivil = 4;
                        }
                        if (this.persona.EstadoCivil.toUpperCase() == "UNION LIBRE") {
                            this.estadoCivil = 5;
                        }
                    }
                    if (this.persona.Correspondencia != undefined) {
                        if (this.persona.Correspondencia.toUpperCase() == "DM") {
                            this.correspondencia = 1;
                        }
                        if (this.persona.Correspondencia.toUpperCase() == "TR") {
                            this.correspondencia = 2;
                        }
                    }
                    this.persona.CiudadDomicilio = result.CiudadDomicilio;
                }
            },
            error => this.authService.showErrorPopup(error));
    }

    loadCiudades(): void {
        if (this.ciudades == undefined || this.ciudades.length == 0) {
            this.catalogoService.getCiudadesForOdas().subscribe(
                result => {
                    this.ciudades = result;
                },
                error => this.authService.showErrorPopup(error));
        }

    }
    loadProvincias(): void {
        if (this.provincias == undefined || this.provincias.length == 0) {
            this.clienteUnico.GetProvincias().subscribe(
                result => {
                    this.provincias = result;
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    noTrabaja(): void {
        this.persona.ProvinciaTrabajo = "No especificado";
        this.persona.CiudadTrabajo = 0;
        this.persona.CallePrincipalTrabajo = "S/N";
        this.persona.CalleTransversalTrabajo = "S/N";
        this.persona.NumeracionTrabajo = "S/N";
        this.persona.ReferenciaTrabajo = "S/N";
        this.persona.BarrioTrabajo = "S/N";
        this.persona.TrabajoLatitud = "0.0";
        this.persona.TrabajoLongitud = "0.0";
    }

    insertar(): void {
        var validacion = this.validar();
        if (validacion == 0) {
            this.llenarValores();
            this.mayusculas();
            this.clienteUnico.insertClienteUnico(this.persona).subscribe(
                result => {
                    if (result > 0) {
                        this.authService.showSuccessPopup("Cliente Insertado");
                    }
                    else {
                        this.authService.showErrorPopup("Ha ocurrido un Error");
                    }
                },
                error => this.authService.showErrorPopup(error));
        }
        else {
            this.mensajeError(validacion);
        }
    }

    actualizar(): void {
        console.log(this.persona.Nacionalidad);

        var validacion = this.validar();
        if (validacion == 0) {

            this.llenarValores();
            this.mayusculas();
            this.clienteUnico.updateClienteUnico(this.persona).subscribe(
                result => {
                    if (result) {
                        this.authService.showSuccessPopup("Cliente actualizado");
                        this.salir();
                    }
                    else {
                        this.authService.showErrorPopup("Ha ocurrido un Error");
                    }

                },
                error => this.authService.showErrorPopup(error));
        }
        else {
            this.mensajeError(validacion);
        }
    }

    mensajeError(validacion) {
        switch (validacion) {
            case 1:
                this.authService.showInfoPopup("Cédula Inválida");
                break;

            case 2:
                this.authService.showInfoPopup("Pasaporte Inválido");
                break;

            case 3:
                this.authService.showInfoPopup("Debe escoger un sexo de la Persona");
                break;

            case 35:
                this.authService.showInfoPopup("La edad sobrepasa los 18 años");
                break;

            case 43:
                this.authService.showInfoPopup("La fecha de nacimiento no puede exceder 240 días futuros");
                break;

            case 44:
                this.authService.showInfoPopup("La fecha de Nacimiento no puede ser mayot a la fecha Actual");
                break;

            case 45:
                this.authService.showInfoPopup("Teléfono de Domicilio inválido");
                break;

            case 46:
                this.authService.showInfoPopup("Teléfono Celular inválido");
                break;

            case 47:
                this.authService.showInfoPopup("Teléfono de Trabajo inválido");
                break;

            case 48:
                this.authService.showInfoPopup("Teléfono de Contacto inválido");
                break;

            case 49:
                this.authService.showInfoPopup("E-mail personal Inválido");
                break;

            case 57:
                this.authService.showInfoPopup("Edad sobrepasa los 100 años");
                break;

            case 58:
                this.authService.showInfoPopup("Debe Ingresar una fecha de Nacimiento");
                break;

            case 59:
                this.authService.showInfoPopup("E-mail de trabajo Inválido");
                break;
        }
    }


    validar() {

        if (this.tipoDocumento == 1) {
            if (!this.validaDocumento(this.persona.Cedula)) {
                return 1;
            }
        }

        if (this.tipoDocumento == 2) {
            if (!this.validaDocumentoPasaporte(this.persona.Pasaporte)) {
                return 2;
            }
        }

        if (!this.validarSexo()) {
            return 3;
        }

        var validarMail = 0;
        var validarEdad = this.validarEdad();
        if (validarEdad != 0) {
            return validarEdad;
        }


        if (this.persona.EmailPersonal != undefined && this.persona.EmailPersonal != null && this.persona.EmailPersonal != "") {
            if (!this.validarEmail(this.persona.EmailPersonal)) {
                return 49;
            }
        }

        if (this.persona.EmailTrabajo != undefined && this.persona.EmailTrabajo != null && this.persona.EmailTrabajo != "") {
            if (!this.validarEmail(this.persona.EmailPersonal)) {
                return 59;
            }
        }

        if (this.persona.TelefonoContacto != undefined && this.persona.TelefonoContacto != null && this.persona.TelefonoContacto != "") {
            if (!this.validarTelefono(this.persona.TelefonoContacto)) {
                return 48;
            }
        }

        if (this.persona.TelefonoTrabajo != undefined && this.persona.TelefonoTrabajo != null && this.persona.TelefonoTrabajo != "") {
            if (!this.validarTelefono(this.persona.TelefonoTrabajo)) {
                return 47;
            }
        }

        if (this.persona.TelefonoDomicilio != undefined && this.persona.TelefonoDomicilio != null && this.persona.TelefonoDomicilio != "") {
            if (!this.validarTelefono(this.persona.TelefonoDomicilio)) {
                return 45;
            }
        }

        if (this.persona.Celular != undefined && this.persona.Celular != null && this.persona.Celular != "") {
            if (!this.validarTelefono(this.persona.Celular)) {
                return 46;
            }
        }

        return 0;
    }


    validarEdad() {

        var fechaActual = new Date();
        if (this.persona.FechaNacimiento == undefined || this.persona.FechaNacimiento == null && this.persona.EmailPersonal != "") {
            return 58;
        }
        else {
            if (this.tipoDocumento == 3) { //SIN DOCUMENTO

                var fechaFutura = new Date(fechaActual.setDate(fechaActual.getDate() + 240));

                if (new Date(this.persona.FechaNacimiento) > new Date(fechaActual)) {
                    return 43;
                }
                else {
                    var edad = this.calcularEdad(this.persona.FechaNacimiento);
                    if (edad >= 18) {
                        return 35;
                    }
                }
            }
            else {

                if (new Date(this.persona.FechaNacimiento) > new Date(fechaActual)) {
                    return 44;
                }
                else {
                    var fechaAnterior = new Date();
                    fechaAnterior.setFullYear(fechaAnterior.getFullYear() - 100);

                    if (new Date(this.persona.FechaNacimiento) < new Date(fechaAnterior)) {
                        return 57;
                    }
                    else {
                        return 0;
                    }
                }
            }

        }
    }

    validarEmail(email: string) {
        var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
        //Se muestra un texto a modo de ejemplo, luego va a ser un icono
        if (emailRegex.test(email)) {
            return true;
        } else {
            return false;
        }
    }

    validarTelefono(telefono: string) {
        if (telefono.length < 9) {
            return (false);
        }
        return true;
    }

    validaDocumento(documento: string) {
        if (documento.length < 10) {
            return false;
        }
        else {
            if (!/^([0-9])*$/.test(documento)) {
                return false;
            }
        }
        return true;
    }

    validaDocumentoPasaporte(documento: string) {
        if (documento != undefined && documento != null) {
            if (documento.length == 0) {
                return false;
            }
            else {
                return true;
                /*  if (!/^([a-zA-Z]{2}[0-9]{7})*$/.test(documento)) {
                     return false;
                 } else {
                     return true;
                 } */
            }
        } else {
            return false;
        }
    }

    validarSexo() {
        if (this.sexo == undefined) {
            return false;
        }
        return true;
    }

    llenarValores() {

        console.log(this.persona.Nacionalidad);
        switch (this.sexo) {
            case 1:
                this.persona.Sexo = "M";
                break;
            case 2:
                this.persona.Sexo = "F";
                break;
        }

        switch (this.tipoDocumento) {
            case 1:
                this.persona.TipoDocumento = "CI";
                break;
            case 2:
                this.persona.TipoDocumento = "PS";
                break;
            case undefined:
                this.persona.TipoDocumento = "HS";
                break;
        }

        switch (this.correspondencia) {
            case 1:
                this.persona.Correspondencia = "DM";
                break;
            case 2:
                this.persona.Correspondencia = "TR";
                break;
            case undefined:
                this.persona.Correspondencia = "DM";
                break;
        }

        switch (this.estadoCivil) {
            case 1:
                this.persona.EstadoCivil = "SOLTERO";
                break;
            case 2:
                this.persona.EstadoCivil = "CASADO";
                break;
            case 3:
                this.persona.EstadoCivil = "DIVORCIADO";
                break;
            case 4:
                this.persona.EstadoCivil = "VIUDO";
                break;
            case 6:
                this.persona.EstadoCivil = "UNION LIBRE";
                break;
        }
    }

    calcularEdad(fechaNacimiento: Date) {
        var diaCorte = new Date().getDate();
        var mesCorte = new Date().getMonth() + 1;
        var yearCorte = new Date().getFullYear();
        //var fechaActual = year + "-" + mes + "-" + dia;

        var diaNacimiento = fechaNacimiento.getDate();
        var mesNacimiento = fechaNacimiento.getMonth() + 1;
        var yearNacimiento = fechaNacimiento.getFullYear();

        if (diaNacimiento > diaCorte) {
            diaCorte = diaCorte + 30 - diaNacimiento;
            mesNacimiento = mesNacimiento + 1;
        }
        else {
            diaCorte = diaCorte - diaNacimiento;
        }

        if (mesNacimiento > mesCorte) {
            mesCorte = mesCorte + 12 - mesNacimiento;
            yearNacimiento = yearNacimiento + 1;
        }
        else {
            mesCorte = mesCorte - mesNacimiento;
        }

        var edad = yearCorte - yearNacimiento;
        return edad;
    }

    mayusculas() {
        if (this.persona.Nombres != undefined) {
            this.persona.Nombres = this.persona.Nombres.toUpperCase();
        }

        if (this.persona.ApellidoPaterno != undefined) {
            this.persona.ApellidoPaterno = this.persona.ApellidoPaterno.toUpperCase();
        }

        if (this.persona.ApellidoMaterno != undefined) {
            this.persona.ApellidoMaterno = this.persona.ApellidoMaterno.toUpperCase();
        }

        if (this.persona.NombreContacto != undefined) {
            this.persona.NombreContacto = this.persona.NombreContacto.toUpperCase();
        }

        if (this.persona.CallePrincipalDomicilio != undefined) {
            this.persona.CallePrincipalDomicilio = this.persona.CallePrincipalDomicilio.toUpperCase();
        }

        if (this.persona.CalleTransversalDomicilio != undefined) {
            this.persona.CalleTransversalDomicilio = this.persona.CalleTransversalDomicilio.toUpperCase();
        }

        if (this.persona.NumeracionDomicilio != undefined) {
            this.persona.NumeracionDomicilio = this.persona.NumeracionDomicilio.toUpperCase();
        }

        if (this.persona.BarrioDomicilio != undefined) {
            this.persona.BarrioDomicilio = this.persona.BarrioDomicilio.toUpperCase();
        }

        if (this.persona.ReferenciaDomicilio != undefined) {
            this.persona.ReferenciaDomicilio = this.persona.ReferenciaDomicilio.toUpperCase();
        }

        if (this.persona.CallePrincipalTrabajo != undefined) {
            this.persona.CallePrincipalTrabajo = this.persona.CallePrincipalTrabajo.toUpperCase();
        }

        if (this.persona.CalleTransversalTrabajo != undefined) {
            this.persona.CalleTransversalTrabajo = this.persona.CalleTransversalTrabajo.toUpperCase();
        }

        if (this.persona.NumeracionTrabajo != undefined) {
            this.persona.NumeracionTrabajo = this.persona.NumeracionTrabajo.toUpperCase();
        }

        if (this.persona.BarrioTrabajo != undefined) {
            this.persona.BarrioTrabajo = this.persona.BarrioTrabajo.toUpperCase();
        }

        if (this.persona.ReferenciaTrabajo != undefined) {
            this.persona.ReferenciaTrabajo = this.persona.ReferenciaTrabajo.toUpperCase();
        }

        if (this.persona.Hobby != undefined) {
            this.persona.Hobby = this.persona.Hobby.toUpperCase();
        }

        if (this.persona.CondicionLaboral != undefined) {
            this.persona.CondicionLaboral = this.persona.CondicionLaboral.toUpperCase();
        }

        if (this.persona.Vehiculo != undefined) {
            this.persona.Vehiculo = this.persona.Vehiculo.toUpperCase();
        }

    }

    Editar(): void {
        this._datosPantalla.Desabilitar = false;
        if (this._datosPantalla.TipoPantalla == 1) {
            this.persona = new PersonaUnicaEntity();
            this.persona.TipoDocumento = this._datosPantalla.TipoDocumento;
            if (this.persona.TipoDocumento == "CI") {
                this.tipoDocumento = 1;
                this.persona.Cedula = this._datosPantalla.Cedula;
                this.persona.Pasaporte = "";
            }
            if (this.persona.TipoDocumento == "PS") {
                this.tipoDocumento = 2;
                this.persona.Pasaporte = this._datosPantalla.Pasaporte;
                this.persona.Cedula = "";
            }
            if (this.persona.TipoDocumento == "HS") {
                this.tipoDocumento = 3;
                this.persona.Cedula = this._datosPantalla.Cedula;
                this.persona.Pasaporte = "";
            }
            this.persona.NumeroPersona = this._datosPantalla.NumeroPersona;
            this.persona.RegistroPrincipal = false;
        }
        else {
            this.loadDatos();
        }
    }

    salir(): void {
        // this.desabilitar = true;
        //$("#ActualizaPersona").modal('hide');
        $('#informacionPersonal').collapse('hide');
        $('#direccionDomicilio').collapse('hide');
        $('#direccionTrabajo').collapse('hide');
        $('#emergencia').collapse('hide');
        $('#correspondencia').collapse('hide');
        $('#infoOpcional').collapse('hide');
    }

    datosBeneficiarioTitular() {
        if (this._datosPantalla.PersonaEntity != null) {
            this.persona.EmailPersonal = this._datosPantalla.PersonaEntity.DomicilioEmail;
            this.persona.Celular = this._datosPantalla.PersonaEntity.DomicilioTelefono1;
            this.persona.EmpresaTrabajo = this._datosPantalla.PersonaEntity.TrabajoEmpresa;
            this.persona.EmailTrabajo = this._datosPantalla.PersonaEntity.TrabajoEmail;
            this.persona.TelefonoTrabajo = this._datosPantalla.PersonaEntity.TrabajoTelefono1;
            this.persona.TelefonoDomicilio = this._datosPantalla.PersonaEntity.DomicilioTelefono1;
        } else {
            this.authService.showInfoPopup("No se pudo obtener la informaci&oacuten desde la enterior pantalla.");
        }
    }
}