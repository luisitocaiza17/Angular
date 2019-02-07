import { Component, OnInit } from '@angular/core';
import { RecaudosState } from '../../services/reacuados.state';
import { RemesaEntity } from '../../../common/model/remesa';
import { BancoEntity } from '../../../common/model/genericos';
import { InputForEnvioDebitosInstituciones } from '../../model/recaudo';
import { EnvioDebitosInstitucionesService } from '../../services/envioDebitosInstituciones.service';
import { AuthService } from '../../../seguridad/auth.service';
import { EnvioDebitosInstitucionesPdfService } from '../../services/envioDebitosInstitucionesPdf.service';
import { EnvioDebitosInstitucionesHangfireService } from '../../services/envioDebitosInstitucionesHangfire.service';
import { ISubscription } from 'rxjs/Subscription';
import { BinesTarjeta } from '../../model/recaudo';
import { BinesTarjetaCodificacionService } from '../../services/binesTarjetaCodificacion.service';

@Component({
    selector: 'primerEnvioArchivos',
    providers: [EnvioDebitosInstitucionesPdfService, EnvioDebitosInstitucionesHangfireService, BinesTarjetaCodificacionService],
    templateUrl: 'primerEnvio.component.html'
})



export class primerEnvioComponent implements OnInit {

    remesaSelected: RemesaEntity;
    bancoSelected: BancoEntity;
    origenModal: string;
    bancoSubscription: ISubscription;
    sumaAnio: number = 0;
    binesTarjetaCod: string;
    codificaciones: BinesTarjeta[];

    tiposArchivos: { tipoArchivo: string, descripcion: string }[];

    tipoArchivo: string

    constructor(
        private authService: AuthService,
        private recaudosState: RecaudosState,
        public envioDebitosInstitucionesService: EnvioDebitosInstitucionesService,
        public envioDebitosInstitucionesPdfService: EnvioDebitosInstitucionesPdfService,
        public envioDebitosInstitucionesServiceHangfire: EnvioDebitosInstitucionesHangfireService,
        public binesTarjetaCodificacion: BinesTarjetaCodificacionService
    ) {

    }

    ngOnInit() {

        this.tiposArchivos = [
            { tipoArchivo: 'CUENTA', descripcion: 'Por cuenta' },
            { tipoArchivo: 'CUOTA', descripcion: 'Por cuota' }
        ];

        this.tipoArchivo = this.tiposArchivos[0].tipoArchivo;

        this.recaudosState.remesaSelelected$
            .subscribe(
                remesa => {
                    this.remesaSelected = remesa;
                }
            );

        this.bancoSubscription = this.recaudosState.banco$
            .subscribe(
                data => {
                    this.bancoSelected = data;
                }
            );

        this.loadCodificaciones();
    }

    GenerarArchivosDebitosInstitucionPorRegion() {

        var input = new InputForEnvioDebitosInstituciones();
        input.Remesa = this.remesaSelected;
        input.Banco = this.recaudosState.getBancoSelected();
        input.EsReproceso = false;
        input.AniosSuma = this.sumaAnio;
        input.BinesTarjetaCodificacion = this.binesTarjetaCod;

        this.envioDebitosInstitucionesServiceHangfire.GenerarArchivosDebitosInstitucionPorRegion(input)
            .subscribe(
                res => {
                    console.log(res.includes("ERROR"));
                    if(res.includes("ERROR"))
                        this.authService.showErrorPopup(res.replace("ERROR:", ""));
                    else
                        this.authService.showSuccessPopup(res);
                },
                error => { this.authService.showErrorPopup(error) }
            );
    }

    GenerarArchivosDebitosNacional() {
        var input = new InputForEnvioDebitosInstituciones();
        input.Banco = this.recaudosState.getBancoSelected();
        input.AniosSuma = this.sumaAnio;
        input.TipoArchivo = this.tipoArchivo;
        input.BinesTarjetaCodificacion = this.binesTarjetaCod;

        this.envioDebitosInstitucionesServiceHangfire.GenerarArchivosDebitosInstitucionNacional(input)
            .subscribe(
                res => {
                    console.log(res.includes("ERROR"));
                    if(res.includes("ERROR"))
                        this.authService.showErrorPopup(res.replace("ERROR:", ""));
                    else
                        this.authService.showSuccessPopup(res);
                },
                error => { this.authService.showErrorPopup(error) }
            );
    }

    descargarPdfsSoportePorRegion() {
        this.descargarPdfSoporteBancoDeRemesa();
        this.descargarPdfSoporteUsuarioDeRemesa();
    }

    descargarPdfSoporteBancoDeRemesa() {
        var input = new InputForEnvioDebitosInstituciones();
        input.Remesa = this.remesaSelected;
        input.Banco = this.recaudosState.getBancoSelected();
        input.BinesTarjetaCodificacion = this.binesTarjetaCod;

        this.envioDebitosInstitucionesPdfService.descargarPdfSoporteBancoDeRemesa(input)
            .subscribe(
                result => {
                    var blob: Blob = null;
                    blob = new Blob([result._body], { type: 'application/pdf' });
                    if (blob != null) {
                        var fileName = result.headers._headers.get("file-name")[0];
                        var url = window.URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        document.body.appendChild(link);
                        link.href = url;
                        link.download = fileName;
                        link.click();
                    }
                },
                error => this.authService.showBlobErrorPopup(error)
            )
    }

    descargarPdfSoporteUsuarioDeRemesa() {
        var input = new InputForEnvioDebitosInstituciones();
        input.Remesa = this.remesaSelected;
        input.Banco = this.recaudosState.getBancoSelected();
        input.BinesTarjetaCodificacion = this.binesTarjetaCod;

        this.envioDebitosInstitucionesPdfService.descargarPdfSoporteUsuarioDeRemesa(input)
            .subscribe(
                result => {
                    var blob: Blob = null;
                    blob = new Blob([result._body], { type: 'application/pdf' });
                    if (blob != null) {
                        var fileName = result.headers._headers.get("file-name")[0];
                        var url = window.URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        document.body.appendChild(link);
                        link.href = url;
                        link.download = fileName;
                        link.click();
                    }
                },
                error => this.authService.showBlobErrorPopup(error)
            )
    }

    seleccionarAccionModal() {
        if (this.origenModal == "Boton1")
            this.GenerarArchivosDebitosInstitucionPorRegion();
        if (this.origenModal == "Boton2")
            this.GenerarArchivosDebitosNacional();
        if (this.origenModal == "Boton4")
            this.descargarPdfsSoporteNacional();
    }

    descargarPdfsSoporteNacional() {
        if (this.tipoArchivo === "CUENTA")
            this.descargarPdfNacionalCuenta();
        if (this.tipoArchivo === "CUOTA")
            this.descargarPdfNacionalCuota();
    }

    descargarPdfNacionalCuenta() {
        this.descargarPdfNacionalPorCuentaBanco();
        this.descargarPdfNacionalPorCuentaUsuario();
    }

    descargarPdfNacionalPorCuentaBanco() {
        var input = new InputForEnvioDebitosInstituciones();
        input.Remesa = null;
        input.Banco = this.recaudosState.getBancoSelected();
        input.BinesTarjetaCodificacion = this.binesTarjetaCod;

        this.envioDebitosInstitucionesPdfService.descargarPdfSoporteBancoNacionalPorCuenta(input)
            .subscribe(
                result => {
                    var blob: Blob = null;
                    blob = new Blob([result._body], { type: 'application/pdf' });
                    if (blob != null) {
                        var fileName = result.headers._headers.get("file-name")[0];
                        var url = window.URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        document.body.appendChild(link);
                        link.href = url;
                        link.download = fileName;
                        link.click();
                    }
                },
                error => this.authService.showBlobErrorPopup(error)
            )
    }

    descargarPdfNacionalPorCuentaUsuario() {
        var input = new InputForEnvioDebitosInstituciones();
        input.Remesa = null;
        input.Banco = this.recaudosState.getBancoSelected();
        input.BinesTarjetaCodificacion = this.binesTarjetaCod;

        this.envioDebitosInstitucionesPdfService.descargarPdfSoporteUsuarioNacionalPorCuenta(input)
            .subscribe(
                result => {
                    var blob: Blob = null;
                    blob = new Blob([result._body], { type: 'application/pdf' });
                    if (blob != null) {
                        var fileName = result.headers._headers.get("file-name")[0];
                        var url = window.URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        document.body.appendChild(link);
                        link.href = url;
                        link.download = fileName;
                        link.click();
                    }
                },
                error => this.authService.showBlobErrorPopup(error)
            )
    }

    descargarPdfNacionalCuota() {
        this.descargarPdfNacionalPorCuotaBanco();
        this.descargarPdfNacionalPorCuotaUsuario();
    }

    descargarPdfNacionalPorCuotaBanco() {
        var input = new InputForEnvioDebitosInstituciones();
        input.Remesa = null;
        input.Banco = this.recaudosState.getBancoSelected();
        input.BinesTarjetaCodificacion = this.binesTarjetaCod;

        this.envioDebitosInstitucionesPdfService.descargarPdfSoporteBancoNacionalPorCuota(input)
            .subscribe(
                result => {
                    var blob: Blob = null;
                    blob = new Blob([result._body], { type: 'application/pdf' });
                    if (blob != null) {
                        var fileName = result.headers._headers.get("file-name")[0];
                        var url = window.URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        document.body.appendChild(link);
                        link.href = url;
                        link.download = fileName;
                        link.click();
                    }
                },
                error => this.authService.showBlobErrorPopup(error)
            )
    }

    descargarPdfNacionalPorCuotaUsuario() {
        var input = new InputForEnvioDebitosInstituciones();
        input.Remesa = null;
        input.Banco = this.recaudosState.getBancoSelected();
        input.BinesTarjetaCodificacion = this.binesTarjetaCod;

        this.envioDebitosInstitucionesPdfService.descargarPdfSoporteUsuarioNacionalPorCuota(input)
            .subscribe(
                result => {
                    var blob: Blob = null;
                    blob = new Blob([result._body], { type: 'application/pdf' });
                    if (blob != null) {
                        var fileName = result.headers._headers.get("file-name")[0];
                        var url = window.URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        document.body.appendChild(link);
                        link.href = url;
                        link.download = fileName;
                        link.click();
                    }
                },
                error => this.authService.showBlobErrorPopup(error)
            )
    }

    openModal(modalName: string, origen: string) {
        this.origenModal = origen;
        $(modalName).modal();
    }

    closeModal(modalName: string) {
        $(modalName).modal('hide');
    }

    loadCodificaciones(): void {
        if (this.codificaciones == undefined || this.codificaciones.length == 0) {
            this.binesTarjetaCodificacion.GetBines().subscribe(
                result => {
                    this.codificaciones = result;
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    getTotalBanco(){ 
        this.envioDebitosInstitucionesService.GetTotalBanco(this.bancoSelected.CodigoBanco).subscribe(
            res => { 
                this.authService.showInfoPopup('Total Nacional = $ ' + res );
            },
            error =>{ 
                this.authService.showErrorPopup(error);
            }
        );
    }
}