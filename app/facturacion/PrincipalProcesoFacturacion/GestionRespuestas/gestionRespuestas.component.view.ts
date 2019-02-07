import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../../seguridad/auth.service';
import { ConsultasFacturacionElectronicaService } from '../../../common/servicios/consultasFacturacionElectronica.service';
import { DocumentoFacturacion, FilterDocumentoFacturacion, DetalleDocumentoFacturacion, DetalleDocumentoFe03Filter, ContadorEstadosDocumentosFacturacion } from '../../../common/model/facturacion';
import { ReporteService } from '../../../common/servicios/reporte.service';
import { utilidadesGenericasService } from '../../../utils/utilidadesGenericas';
import { FacturacionService } from '../../../common/servicios/facturacion.service';

@Component({
    selector: 'gestionRespuestasFacturacion',
    providers: [ConsultasFacturacionElectronicaService, utilidadesGenericasService, FacturacionService],
    templateUrl: 'gestionRespuestas.component.view.html'
})

export class GestionRespuestasComponent implements OnDestroy {

    suscription: any;
    consultaFull: boolean;
    consultaExterna: boolean;
    documentosFacturacion: DocumentoFacturacion[];
    documentoFacturacionSelected: DocumentoFacturacion; 
    documentoFacturacionAGestionar: DocumentoFacturacion; 
    detallesDocumentoSeleccionado: DetalleDocumentoFacturacion[]; 
    filterDF: FilterDocumentoFacturacion;
    filterDetalleDF: DetalleDocumentoFe03Filter; 
    cantidadDFPorEstado: ContadorEstadosDocumentosFacturacion; 
    filterOptions = [
        { value: 'mayorQue', label: 'Mayor' }, 
        { value: 'mayorIgual', label: 'Mayor o igual' }, 
        { value: 'igual', label: 'Igual' }, 
        { value: 'menorIgual', label: 'Menor o igual' }, 
        { value: 'menorQue', label: 'Menor' }
     ];
    
    regionesEntorno = [
        {value: 'Sierra', label: 'Sierra'}, 
        {value: 'Costa', label: 'Costa'}, 
        {value: 'Austro', label: 'Austro'}
    ];

    optionsTipoIdComprador = [
        { value: 4, label: 'RUC' }, 
        { value: 5, label: 'CEDULA' }, 
        { value: 6, label: 'PASAPORTE' }
    ];

    constructor( 
        private chRef: ChangeDetectorRef, 
        private authService: AuthService, 
        public facturacionConsultasService: ConsultasFacturacionElectronicaService, 
        private reporteService: ReporteService, 
        private utilidadesGenericasService: utilidadesGenericasService,
        private facturacionService: FacturacionService) {           
    }

    ngOnInit(){
        this.filterDF = new FilterDocumentoFacturacion(); 
        this.cantidadDFPorEstado = new ContadorEstadosDocumentosFacturacion();
        this.documentoFacturacionSelected = new DocumentoFacturacion(); 
        this.documentoFacturacionAGestionar = new DocumentoFacturacion(); 
    }

    ngOnDestroy() {
    }
 
    loadDocumentosFacturacion(){ 
        this.documentosFacturacion = [];
        this.detallesDocumentoSeleccionado = []; 
        this.documentoFacturacionSelected = new DocumentoFacturacion();
        this.filterDF.Estado = 101; 
        this.filterDF.EstadoQueryType = 'igual';
        this.filterDF.NoObtenerRetenciones = true; 
        this.facturacionConsultasService.getDocumentosFacturacionByFiltersPaginated(this.filterDF)
            .subscribe( result => {         
                this.documentosFacturacion = result;
            }); 
            error => {
                this.authService.showErrorPopup(error)
            }
    }

    seleccionar(documentoFacturacion: DocumentoFacturacion): void {
        this.documentoFacturacionSelected = new DocumentoFacturacion(); 
        this.cantidadDFPorEstado = new ContadorEstadosDocumentosFacturacion(); 
        if (this.documentosFacturacion != undefined) {
            this.documentosFacturacion.forEach(element => {
                element.Selected = false;
            });
        }
        documentoFacturacion.Selected = true;
        this.documentoFacturacionSelected = documentoFacturacion;
        this.documentoFacturacionSelected.VariableEntornoRegion = 'Sierra'; 
        this.loadDetallesDocumento();
        this.documentoFacturacionAGestionar = Object.assign({},this.documentoFacturacionSelected);     
    }

    loadDetallesDocumento(){ 
        this.filterDetalleDF = new DetalleDocumentoFe03Filter(); 
        this.filterDetalleDF.Establecimiento = this.documentoFacturacionSelected.Establecimiento; 
        this.filterDetalleDF.PuntoEmision = this.documentoFacturacionSelected.PuntoEmision; 
        this.filterDetalleDF.Secuencial = this.documentoFacturacionSelected.Secuencial; 
        this.filterDetalleDF.TipoDocumento = this.documentoFacturacionSelected.TipoDocumento;
        this.facturacionConsultasService.getDetallesDocumentoFacturacionByFilters(this.filterDetalleDF)
            .subscribe( result => {
                this.detallesDocumentoSeleccionado = result;
            }); 
            error => {
                this.authService.showErrorPopup(error)
            }
    }

    limpiarFiltroDocumento(){
        this.documentosFacturacion = [];
        this.documentoFacturacionSelected = new DocumentoFacturacion(); 
        this.documentoFacturacionSelected.VariableEntornoRegion = 'Sierra';
        this.detallesDocumentoSeleccionado = []; 
        this.filterDF = new FilterDocumentoFacturacion();
    }

    generarReporteDocumentos(){
        this.documentosFacturacion = [];
        this.detallesDocumentoSeleccionado = []; 
        this.documentoFacturacionSelected = new DocumentoFacturacion();
        this.filterDF.Estado = 101; 
        this.filterDF.EstadoQueryType = 'igual';
        this.filterDF.NoObtenerRetenciones = true; 
        this.reporteService.descargarReporteDocumentosFacturacion(this.filterDF).subscribe(
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
            error => this.authService.showBlobErrorPopup(error));
    }

    loadCantidadesDocumentosFacturacionPorEnvio(){
        this.facturacionConsultasService.getCantidadFacturasEnDiferentesEstados(this.documentoFacturacionSelected.NumeroEnvio, this.documentoFacturacionSelected.SecuencialEnvio)
        .subscribe( result => {
            this.cantidadDFPorEstado = result;
        }); 
        error => {
            this.authService.showErrorPopup(error)
        }
    }
    
    keyDownFunction(event) {
        if(event.keyCode == 13) {
            this.loadDocumentosFacturacion(); 
            this.salir('#modalFiltros'); 
        }
    }

    pageChanged(): void {
        this.loadDocumentosFacturacion();
    }

    openModal(modalName: string) {
        $(modalName).modal(); 
    }

    salir(modalName: string) {
        $(modalName).modal('hide');
    }

    calcularMaximaLongitudIdComprador(tipoIdComprador: number){ 
        var result = undefined; 
        if(tipoIdComprador == 5)
            result = 10;
        if(tipoIdComprador == 4)
            result = 13; 
        if(tipoIdComprador == 6)
            result = 100; 

        return result; 
    }

    calcularMinimaLongitudIdComprador(tipoIdComprador: number){ 
        var result = undefined; 
        if(tipoIdComprador == 5)
            result = 10;
        if(tipoIdComprador == 4)
            result = 13; 
        if(tipoIdComprador == 6)
            result = 3; 

        return result; 
    }

    definirPatronParaInputIdComprador(tipoIdComprador: number){
        var res = null; 

        if(tipoIdComprador == 6)
            res = '[a-zA-Z0-9_.-]*$';
        else
            res = '\\d*'; 

        return res; 
    }

    cancelarGestionDeDocumentos(){ 
        this.documentoFacturacionAGestionar = Object.assign({},this.documentoFacturacionSelected);
        this.documentoFacturacionAGestionar.VariableEntornoRegion = 'Sierra'; 
    }

    compararObjetos(objetoA: Object, objetoB: Object){
       return (this.utilidadesGenericasService.compararDosObjetos(objetoA, objetoB));
    }

    gestionarDocumentoFactuacion(){ 
        this.setearNuevosDatosYResetearDatosOriginales();
        this.facturacionService.gestionarDocumentoFacturacion(this.documentoFacturacionAGestionar)
                .subscribe( res => {
                    if(res.includes('ERROR'))
                        this.authService.showErrorPopup(res); 
                    else
                        this.authService.showSuccessPopup(res); 

                    this.salir('#modalGestionDocumentosCor'); 
                    this.salir('#modalGestionDocumentosInd'); 
                }, 
                error => this.authService.showErrorPopup(error) 
            )     
        this.salir('#modalGestionDocumentos'); 
        this.limpiarFiltroDocumento(); 
    }

    setearNuevosDatosYResetearDatosOriginales(){ 
        this.documentoFacturacionAGestionar.NewTipoIdComprador = this.documentoFacturacionAGestionar.TipoIdComprador; 
        this.documentoFacturacionAGestionar.NewIdComprador = this.documentoFacturacionAGestionar.IdComprador;
        this.documentoFacturacionAGestionar.NewRazonSocialComprador = this.documentoFacturacionAGestionar.RazonSocialComprador; 
        this.documentoFacturacionAGestionar.NewEmail = this.documentoFacturacionAGestionar.Email; 
        this.documentoFacturacionAGestionar.NewEmailBrokerDocElec = this.documentoFacturacionAGestionar.EmailBrokerDocElec; 
        this.documentoFacturacionAGestionar.NewEmailContactoDocElec = this.documentoFacturacionAGestionar.EmailContactoDocElec; 
        this.documentoFacturacionAGestionar.NewEmailSucursalDocElec = this.documentoFacturacionAGestionar.EmailSucursalDocElec; 
        this.documentoFacturacionAGestionar.NewDireccionCliente = this.documentoFacturacionAGestionar.NewDireccionCliente;

        this.documentoFacturacionAGestionar.TipoIdComprador = this.documentoFacturacionSelected.TipoIdComprador; 
        this.documentoFacturacionAGestionar.IdComprador = this.documentoFacturacionSelected.IdComprador; 
        this.documentoFacturacionAGestionar.RazonSocial = this.documentoFacturacionSelected.RazonSocial; 
        this.documentoFacturacionAGestionar.Email = this.documentoFacturacionSelected.Email; 
        this.documentoFacturacionAGestionar.EmailBrokerDocElec = this.documentoFacturacionSelected.EmailBrokerDocElec; 
        this.documentoFacturacionAGestionar.EmailContactoDocElec = this.documentoFacturacionSelected.EmailContactoDocElec;
        this.documentoFacturacionAGestionar.EmailSucursalDocElec = this.documentoFacturacionSelected.EmailSucursalDocElec;
        this.documentoFacturacionAGestionar.NewDireccionCliente = this.documentoFacturacionSelected.DireccionCliente; 
    }

    abrirModalGestionDependiendoDelCaso(){ 
        if(this.verificarSiContratoEsIndOncPcaXpr())
            this.openModal('#modalGestionDocumentosInd'); 
        if(this.verificarSiContratoEsCorExeDenCpoPoo())
            this.openModal('#modalGestionDocumentosCor');
    }

    verificarSiContratoEsIndOncPcaXpr(){ 
        if( ['IND','ONC','PCA','XPR'].indexOf(this.documentoFacturacionSelected.CodigProducto) > -1 )
            return true; 
        else 
            return false; 
    }

    verificarSiContratoEsCorExeDenCpoPoo(){ 
        if( ['COR','EXE','DEN','CPO', 'POO'].indexOf(this.documentoFacturacionSelected.CodigProducto) > -1 )
            return true; 
        else 
            return false; 
    }

}