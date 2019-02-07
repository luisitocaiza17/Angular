import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { AutorizacionService } from '../common/servicios/autorizacion.service';
import { ConstantService } from '../utils/constant.service';
import { Permiso } from '../seguridad/usuario';
import { ClienteFilter, ClienteEntity, ClientePassword } from '../common/model/cliente';
import { ClienteService } from '../common/servicios/clienteService';
import { NgModel } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { PasswordValidation } from './passwordValidator';
import { utilidadesGenericasService } from '../utils/utilidadesGenericas';

@Component({
    providers: [ClienteService],
    templateUrl: 'portalClientes.form.template.html',
    styles: ['./portalClientes.form.style.css']
})

export class PortalClientesFormComponent implements OnInit {

    filter: ClienteFilter;
    listadoClientes: ClienteEntity[];
    clienteSelectedTable: ClienteEntity;
    suscription: any;
    nuevoPassword: string;
    nuevoPasswordConfirmar: string;
    clientePassword: ClientePassword;
    form: FormGroup;
    tempFechaNacimiento: Date;

    tempClienteEditado: ClienteEntity;
    ultimoAcceso: boolean;


    constructor(public autorizacionService: AutorizacionService, public clienteService: ClienteService, private authService: AuthService, fb: FormBuilder,
        public genericosService: utilidadesGenericasService) {
        this.filter = new ClienteFilter();
        this.listadoClientes = [];
        this.clienteSelectedTable = new ClienteEntity;
        this.clientePassword = new ClientePassword;
        this.form = fb.group({
            nuevoPassword: ['', Validators.required],
            nuevoPasswordConfirmar: ['', Validators.required]
        }, {
                validator: PasswordValidation.MatchPassword
            });
        this.tempClienteEditado = new ClienteEntity;
        this.ultimoAcceso = false;
        this.tempFechaNacimiento = new Date();


    }

    buscar(): void {
        this.autorizacionService.resetDefaultPaginationConstanst();
        this.listadoClientes = [];
        this.filtrar();
    }


    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    pageChanged(): void {
        this.filtrar();
    }


    filtrar(): void {
        this.clienteService.getByFilter(20, this.filter).subscribe(
            result => {
                this.listadoClientes = result;
                this.listadoClientes.forEach(element => {
                    element.FechaNacimiento = this.genericosService.GetDateTimeUTCTimeZone(element.FechaNacimiento)
                });
            },
            error => this.authService.showErrorPopup("No se tienen resultados, vuelva a intentar más tarde")
        );
    }

    bloquear(cliente: ClienteEntity) {
        cliente.EstaBloqueado = true;
        this.clienteService.updateCliente(cliente)
            .subscribe(result => {
                if (result) {
                    this.authService.showSuccessPopup(result + "Registro actualizado correctamente"); this.ngOnDestroy();
                    this.salir();
                }
                else {
                    this.authService.showErrorPopup("Ha ocurrido un error");
                }
            },
                error => this.authService.showErrorPopup(error)
            );

    }

    ngOnInit(): void {
        this.filter = new ClienteFilter();
        this.listadoClientes = [];
        this.tempClienteEditado = new ClienteEntity;
    }

    limpiar(): void {
        this.filter = new ClienteFilter();
        this.autorizacionService.resetDefaultPaginationConstanst();
        this.listadoClientes = [];
    }

    openModal(modalName: string) {
        $(modalName).modal();
    }


    seleccionar(clienteSelected: ClienteEntity): void {

        if (this.listadoClientes != undefined) {
            this.listadoClientes.forEach(element => {
                element.Selected = false;
            });
        }
        clienteSelected.Selected = true;
        this.clienteSelectedTable = clienteSelected;
        this.tempClienteEditado.DocumentoIdentificacion = this.clienteSelectedTable.DocumentoIdentificacion;
        this.tempClienteEditado.Nombres = this.clienteSelectedTable.Nombres;
        this.tempClienteEditado.ApellidoPaterno = this.clienteSelectedTable.ApellidoPaterno;
        this.tempClienteEditado.ApellidoMaterno = this.clienteSelectedTable.ApellidoMaterno;
        this.tempClienteEditado.Usuario = this.clienteSelectedTable.Usuario;
        this.tempClienteEditado.TelefonoFijo = this.clienteSelectedTable.TelefonoFijo;
        this.tempClienteEditado.TelefonoMovil = this.clienteSelectedTable.TelefonoMovil;
        this.tempClienteEditado.UltimoAcceso = this.clienteSelectedTable.UltimoAcceso;
        this.tempClienteEditado.CambiarContrasenia = this.clienteSelectedTable.CambiarContrasenia;
        this.tempClienteEditado.Email = this.clienteSelectedTable.Email;
        this.tempClienteEditado.EstaBloqueado = this.clienteSelectedTable.EstaBloqueado;
        this.tempClienteEditado.FechaNacimiento = new Date(this.clienteSelectedTable.FechaNacimiento);
        if (this.tempClienteEditado.UltimoAcceso === null) {
            this.ultimoAcceso = true;

        } else {
            this.ultimoAcceso = false;
        }

    }

    guardar() {
        if (this.ultimoAcceso) {
            this.guardarNuevoPassword();
            this.salir();
        } else {
            this.clienteService.updateCliente(this.tempClienteEditado)
                .subscribe(result => {
                    if (result) {
                        this.authService.showSuccessPopup(result + "Registro actualizado correctamente"); this.ngOnDestroy();
                        this.salir();
                    }
                    else {
                        this.authService.showErrorPopup("Ha ocurrido un error");
                    }
                },
                    error => this.authService.showErrorPopup(error)
                );
        }
    }



    guardarNuevoPassword() {
        this.clienteService.generatemd5Password(this.nuevoPassword)
            .subscribe(result => {
                if (result) {
                    this.authService.showSuccessPopup("Registro actualizado correctamente"); this.ngOnDestroy();
                    this.clientePassword.DocumentoIdentificacion = this.clienteSelectedTable.DocumentoIdentificacion;
                    this.clientePassword.PasswordMD5 = result.Datos;
                    this.guardarPasswordUsuario(this.clientePassword);
                }
                else {
                    this.authService.showErrorPopup("Ha ocurrido un error");
                }
            },
                error => this.authService.showErrorPopup(error)
            );

    }

    guardarPasswordUsuario(clientePassword: ClientePassword) {
        this.clienteService.savenewPassword(this.clientePassword)
            .subscribe(result => {
                if (result) {
                    this.authService.showSuccessPopup("Registro actualizado correctamente"); this.ngOnDestroy();
                }
                else {
                    this.authService.showErrorPopup("Ha ocurrido un error");
                }
            },
                error => this.authService.showErrorPopup(error)
            );
        this.salirPassword();
    }

    salir() {
        $('#modalEditar').modal('hide');
        this.tempClienteEditado = new ClienteEntity;
        this.filtrar();
    }

    salirPassword() {
        $('#modalEditarPassword').modal('hide');
        this.filtrar();
    }

    ngOnDestroy(): void {
        if (this.suscription != undefined)
            this.suscription.unsubscribe();

    }
}