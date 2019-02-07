import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../seguridad/auth.service';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { FiltroFechaDesdeHasta } from '../../../common/model/genericos';
import { BanksFileGeneration } from '../../services/generacionArchivosBancos.service';
import { ResultadoGenerarArchivosBancos } from '../../model/recaudo';

@Component({
    providers: [BanksFileGeneration],
    templateUrl: 'generarArchivosCajaPich.component.html'
})

export class GenerarArchivosCajaPichComponent implements OnInit{

    filtroFechaDesdeHasta: FiltroFechaDesdeHasta; 
    nombreArchivo: string; 
    datepickerOpts = {}; 
    resultado: ResultadoGenerarArchivosBancos; 

    constructor(
        private authService: AuthService, 
        private utilidadesGenericasService: utilidadesGenericasService, 
        private fileGenerationService: BanksFileGeneration
        ) 
    {
        
    }

    ngOnInit(){ 
        this.filtroFechaDesdeHasta = new FiltroFechaDesdeHasta();
        this.datepickerOpts = this.utilidadesGenericasService.datepickerOpts;
        this.nombreArchivo = undefined; 
        this.resultado = new ResultadoGenerarArchivosBancos(); 
    }

    geneararArchivosTodosLosBancos(){
        this.fileGenerationService.GeneracionArchivosTodosLosBancos()
                .subscribe(
                    res => {
                        this.resultado = res; 
                        this.authService.showSuccessPopup(
                            "<div class='col-lg-12'>" + 
                                "<div class='col-lg-12'>" + 'Archivo generado: ' + "</div>" + 
                                "<div class='col-lg-12 mTop3rem text-left'>" + res.FileName + "</div><br>" + 
                                "<div class='col-lg-8 mTop3rem text-left'>" + 'Total registros escritos en archivo: ' + "</div><div class='col-lg-4 mTop3rem'>" + res.RegistrosProcesados + "</div>" + 
                                "<div class='col-lg-8 mTop3rem text-left'>" + 'Total registros nombre-duenio-cuenta vacío: ' + "</div><div class='col-lg-4 mTop3rem'>" + res.RegistrosErrorNombreDuenioCuentaVacio + "</div>" + 
                                "<div class='col-lg-8 mTop3rem text-left'>" + 'Total registros: ' + "</div><div class='col-lg-4 mTop3rem'>" + (res.RegistrosProcesados + res.RegistrosErrorNombreDuenioCuentaVacio) + "</div>" +
                            "</div>"  
                        ); 
                        this.descargarTxtResultado(); 
                    },
                    error => {
                        this.authService.showErrorPopup(error);
                    }
                );
    }

    geneararArchivosPagoDirectoYBansalud(){
        this.fileGenerationService.GeneracionArchivosPagoDirectoYBansalud()
                .subscribe(
                    res => {
                        this.resultado = res; 
                        this.authService.showSuccessPopup(
                            "<div class='col-lg-12'>" + 
                                "<div class='col-lg-12'>" + 'Archivo generado: ' + "</div>" + 
                                "<div class='col-lg-12 mTop3rem text-left'>" + res.FileName + "</div><br>" + 
                                "<div class='col-lg-8 mTop3rem text-left'>" + 'Total registros escritos en archivo: ' + "</div><div class='col-lg-4 mTop3rem'>" + res.RegistrosProcesados + "</div>" + 
                                "<div class='col-lg-8 mTop3rem text-left'>" + 'Total registros nombre-duenio-cuenta vacío: ' + "</div><div class='col-lg-4 mTop3rem'>" + res.RegistrosErrorNombreDuenioCuentaVacio + "</div>" + 
                                "<div class='col-lg-8 mTop3rem text-left'>" + 'Total registros: ' + "</div><div class='col-lg-4 mTop3rem'>" + (res.RegistrosProcesados + res.RegistrosErrorNombreDuenioCuentaVacio) + "</div>" +
                            "</div>"  
                        ); 
                        this.descargarTxtResultado(); 
                    },
                    error => {
                        this.authService.showErrorPopup(error);
                    }
                );
    }


    ConfirmarAccion(procesoAEjecutar: string): void {
        swal({
            title: "",
            text: "<h4>" + ' Esta Seguro que desea ejecutar esta acción ' + "</h4>",
            html: true,
            type: "info",
            showCancelButton: true,
            confirmButtonColor: "#1a7bb9",
            confirmButtonText: "SI",
            cancelButtonText: "NO",
            closeOnConfirm: true,
        },
            confirmed => {
                if (confirmed) {
                    if(procesoAEjecutar === 'geneararArchivosTodosLosBancos')
                        this.geneararArchivosTodosLosBancos();
                    if(procesoAEjecutar === 'geneararArchivosPagoDirectoYBansalud')
                        this.geneararArchivosPagoDirectoYBansalud();
                }
            });
    }

    descargarTxtResultado(){
        this.fileGenerationService.descgargarTxt(this.resultado.FileName)
              .subscribe(
                result => {
                  var blob: Blob = null;
                  blob = new Blob([result._body], { type: 'text/plain' });
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
}
