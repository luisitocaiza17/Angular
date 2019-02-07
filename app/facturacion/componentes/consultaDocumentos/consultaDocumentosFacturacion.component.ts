import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../seguridad/auth.service';
import { DocumentoFacturacion, FilterDocumentoFacturacion } from '../../../common/model/facturacion';
import { ConsultaDocumentosFacturacionService } from '../../service/consultaDocumentosFacturacion.service';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { ReporteDocumentosFacturacionDirectoSri } from '../../service/ReporteDocumentosFacturacionDirectoSri.service.';


@Component({
    selector: 'consultaDocumentosFacturacion',
    providers: [ConsultaDocumentosFacturacionService, utilidadesGenericasService, ReporteDocumentosFacturacionDirectoSri],
    templateUrl: 'consultaDocumentosFacturacion.component.html', 
    styleUrls: ['consultaDocumentosFacturacion.component.css']
})

export class ConsultaDocumentosFacturacionComponent implements OnDestroy, OnInit{

    documentosFacturacion: DocumentoFacturacion[];
    documentoFacturacionSelected: DocumentoFacturacion; 
    filterDF: FilterDocumentoFacturacion;
    datepickerOpts = {}; 

    constructor( 
        private authService: AuthService, 
        public consultaDocumentosFacturacionService: ConsultaDocumentosFacturacionService, 
        private reporteDocumentosFacturacionDirectoSri: ReporteDocumentosFacturacionDirectoSri, 
        private utilidadesGenericasService: utilidadesGenericasService, 
        ) {           
    }

    ngOnInit(){
        this.datepickerOpts = this.utilidadesGenericasService.datepickerOpts;
        this.filterDF = new FilterDocumentoFacturacion(); 
        this.filterDF.FechaEmisionDesde = this.utilidadesGenericasService.getTodayDate();
        this.filterDF.FechaEmisionHasta = this.utilidadesGenericasService.getTodayDate(); 
        this.documentoFacturacionSelected = new DocumentoFacturacion(); 
    }

    ngOnDestroy() {
    }

    loadDocumentosFacturacion(){ 
        this.documentosFacturacion = [];
        this.documentoFacturacionSelected = new DocumentoFacturacion();
        this.filterDF.NoObtenerRetenciones = true;  
        this.consultaDocumentosFacturacionService.GetDocumentosFacturacionPaginated(this.filterDF)
            .subscribe( result => {         
                this.documentosFacturacion = result; 
            }); 
            error => {
                this.authService.showErrorPopup(error)
            }
    }

    limpiarFiltroDocumento(){
        this.documentosFacturacion = [];
        this.documentoFacturacionSelected = new DocumentoFacturacion(); 
        this.filterDF = new FilterDocumentoFacturacion();
        this.filterDF.FechaEmisionDesde = this.utilidadesGenericasService.getTodayDate();
        this.filterDF.FechaEmisionHasta = this.utilidadesGenericasService.getTodayDate(); 
    }

    DescargarReporteDocumentosFacturacionDirectoSri(){
        this.reporteDocumentosFacturacionDirectoSri.GetReporteDocumentosFacturacionDirectoSri(this.filterDF)
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

    pageChanged(): void {
        this.loadDocumentosFacturacion();
    }

    openModal(modalName: string, documento: DocumentoFacturacion) {
        $(modalName).modal(); 
        this.documentoFacturacionSelected = documento; 
    }

    salir() {
        $('#modalFiltros').modal('hide');
    }
}