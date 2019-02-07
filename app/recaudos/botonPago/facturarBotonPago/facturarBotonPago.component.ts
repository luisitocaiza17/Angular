import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../seguridad/auth.service';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { FacturacionService } from '../../../common/servicios/facturacion.service';
import { FiltroFechaDesdeHasta } from '../../../common/model/genericos';

@Component({
    providers: [FacturacionService],
    templateUrl: 'facturarBotonPago.component.html'
})

export class FacturarBotonPagoComponent implements OnInit{

    opcionFacturar: number; 
    filtroFechaDesdeHasta: FiltroFechaDesdeHasta; 
    nombreArchivo: string; 
    datepickerOpts = {}; 
    lugarPago: string; 

    constructor(
        private authService: AuthService, 
        private utilidadesGenericasService: utilidadesGenericasService, 
        private facturacionService: FacturacionService, 
        ) 
    {
        
    }

    ngOnInit(){ 
        this.lugarPago = "CAJAPICH"; 
        this.filtroFechaDesdeHasta = new FiltroFechaDesdeHasta();
        this.datepickerOpts = this.utilidadesGenericasService.datepickerOpts;
        this.opcionFacturar = 1; 
        this.nombreArchivo = undefined; 
    }

    ejecutarFacturacionCobrosSaludPay() { 
        this.facturacionService.facturarCobrosPichincha(this.filtroFechaDesdeHasta, this.nombreArchivo, this.lugarPago)
                .subscribe( 
                    res => {
                        this.authService.showSuccessPopup('<h4> Total Registros: ' + res.ContadorExitosos + '</h4><br><h4> Monto total: ' + res.MontoTotal + '</h4>' );
                        this.descargarReporteFacturacionCobrosPichincha(); 
                    }, 
                    error => { this.authService.showErrorPopup(error); } 
                ); 
    }

    descargarReporteFacturacionCobrosPichincha(){
        this.facturacionService.descargarReporteFacturacionCobrosPichincha(this.nombreArchivo)
              .subscribe(
                result => {
                  var blob: Blob = null;
                  blob = new Blob([result._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
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

    ConfirmarEjecutarFacturacionCobrosSaludPay(): void {
        swal({
            title: "",
            text: "<h3>" + ' Esta Seguro que desea ejecutar esta acción ' + "</h3>",
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
                    this.ejecutarFacturacionCobrosSaludPay();
                }

            });
    }

    descgargarCsvResultadoFacturarCobrosSaludPay(){
        this.facturacionService.descgargarCsvFacturacion(this.nombreArchivo)
              .subscribe(
                result => {
                  var blob: Blob = null;
                  blob = new Blob([result._body], { type: 'text/csv' });
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
