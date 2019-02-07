import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../seguridad/auth.service';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { FacturacionService } from '../../../common/servicios/facturacion.service';
import { FiltroFechaDesdeHasta } from '../../../common/model/genericos';

@Component({
    providers: [FacturacionService],
    templateUrl: 'cuadreCajaPich.component.html'
})

export class CuadreCajaPichComponent implements OnInit{

    filtroFechaDesdeHasta: FiltroFechaDesdeHasta; 
    nombreArchivo: string; 
    datepickerOpts = {}; 

    constructor(
        private authService: AuthService, 
        private utilidadesGenericasService: utilidadesGenericasService, 
        private facturacionService: FacturacionService, 
        ) 
    {
        
    }

    ngOnInit(){ 
        this.filtroFechaDesdeHasta = new FiltroFechaDesdeHasta();
        this.datepickerOpts = this.utilidadesGenericasService.datepickerOpts;
        this.nombreArchivo = undefined; 
    }

    generarCuadreCajaPichincha(){
        this.facturacionService.generarCuadreCajaPichincha(this.filtroFechaDesdeHasta, this.nombreArchivo)
                .subscribe(
                    res =>{
                        this.descgargarCsvGenerarCuadreCajaPichincha();
                    },
                    error => {
                        this.authService.showErrorPopup(error);
                    }
                );
    }

    ConfirmarGenerarCajaPichincha(): void {
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
                    this.generarCuadreCajaPichincha();
                }

            });
    }

    descgargarCsvGenerarCuadreCajaPichincha(){
        this.facturacionService.descargarArchivoCuadreCaja(this.nombreArchivo)
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

}
