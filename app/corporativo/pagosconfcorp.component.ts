import {Component, OnInit, ElementRef, ChangeDetectorRef, Output, Input, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../seguridad/auth.service';
import { ConstantService } from '../utils/constant.service';
import {CorporativoService} from '../common/servicios/corporativo.service';
import {Unidad} from '../common/model/unidad';
import {HttpClient} from '@angular/common/http';
import {PrefacturaService} from '../common/servicios/prefactura.services';
import {CORP_PreFactura} from '../common/model/corpprefacturadetalle';
import {AgenteService} from '../common/servicios/agente.service';


@Component({
    providers: [CorporativoService],
    templateUrl: 'pagosconfcorp.template.html'
})

export class PagosConfCorpComponent implements OnInit {
    // configuracion de variables
    listEmpresas: CORP_PreFactura[];
    listConfirmados: CORP_PreFactura[];
    searchNumeroE: string;
    searchRucE: string;
    searchDate: Date;
    unidades: Unidad[];
    searchejecutivoResponsable:number;
    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    // Constructor, se ejecuta al inicializar el proceso, inicializa las variables
    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
                private authService: AuthService, private constantService: ConstantService, private prefacturaServices: PrefacturaService,
                private corporativoService: CorporativoService, private http: HttpClient) {
        this.listConfirmados = [];
        this.listEmpresas = [];
    }
    // Corre cuando Angular está cargado y todos los componentes descargados
    // sirve para inizializar los datos
    ngOnInit(): void {
        // No muestro nada en pantalla inicialmente, hasta que ponga un criterio de búsqueda
        // Si deseo cargar de entrada, llamo a buscar simplemente
        this.consultarUnidades();
    }

    // Método que indica si se activa el botón buscar, cuando se quiere poner una validación para poder buscar y no traiga toda la base
    puedeBuscar(): boolean {
        let numeroLLeno = true;
        if (this.searchNumeroE === undefined || this.searchNumeroE === '' || this.searchRucE === null ) {
            numeroLLeno = false;
        }
        let RucLLeno = true;
        if (this.searchRucE === undefined || this.searchRucE === null || this.searchRucE === '') {
            RucLLeno = false;
        }
        let DateLleno = true;
        if ( this.searchDate === undefined || this.searchDate === null ) {
            DateLleno = false;
        }
        debugger;
        let ejecutivoResponsableLleno=true;
        if ( this.searchejecutivoResponsable === undefined || ''+this.searchejecutivoResponsable === 'undefined'|| this.searchejecutivoResponsable === null ) {
            ejecutivoResponsableLleno = false;
        }

        if (numeroLLeno || RucLLeno || DateLleno || ejecutivoResponsableLleno) {
            return true;
        } else {
            return false;
        }
    }
    // metodos para limpiar
    limpiarBusqueda(): void {
        this.searchNumeroE = '';
        this.searchRucE = '';
        this.searchDate = new Date();
    }
    // metodo para buscar por filtro
    busquedaEspecifica(): void {
        // busqueda especifica
    }
    //combo de ejecutivo reponsable
    consultarUnidades(): void {
        this.corporativoService.getUnidadesResponsables().subscribe(
            result => {
                this.unidades = result;
                //console.log(result);
            },
            error => console.log(error)
        );
    }
    // metodo para agregar las empresas a confirmar
    agregarEmpresa(e, empresa: CORP_PreFactura): void {
        var isCheckedT = e.target.checked;
        if (isCheckedT) {
            empresa.isCheck = true;
            this.listConfirmados.push(empresa);
        }else{
            empresa.isCheck = false;
            this.listConfirmados = this.listConfirmados.filter(obj => obj !== empresa);
        }
    }
    // metodo para busqueda
    buscar() {
        this.listConfirmados = [];
        this.listEmpresas = [];
        let numeroEmpresa: number;
        if (this.searchNumeroE === null || this.searchNumeroE === '' || this.searchNumeroE === '0' || this.searchNumeroE === undefined) {
            numeroEmpresa = 0;
        }else {
            numeroEmpresa = Number(this.searchNumeroE);
        }
        let numeroRuc: string;
        if (this.searchRucE === null || this.searchRucE === '' || this.searchRucE === '0' || this.searchRucE === undefined) {
            numeroRuc = null;
        }else {
            numeroRuc =  this.searchRucE;
        }
        let fechaDesde: string;
        if (this.searchDate === null || this.searchDate === undefined) {
            fechaDesde = null;
        }else {
            fechaDesde = this.searchDate.getFullYear() + '-' + this.searchDate.getUTCMonth() + '-' + this.searchDate.getUTCDate();
        }
        if (this.searchNumeroE === null || this.searchNumeroE === '' || this.searchNumeroE === '0' || this.searchNumeroE === undefined) {
            numeroEmpresa = 0;
        }else {
            numeroEmpresa = Number(this.searchNumeroE);
        }
        //busqueda por ejecutivo responsable
        let numeroEjecutivoResponsable:number;
        if ( this.searchejecutivoResponsable === undefined || this.searchejecutivoResponsable === 0 ) {
            numeroEjecutivoResponsable=0;
        }else{
            numeroEjecutivoResponsable=this.searchejecutivoResponsable;
        }


        this.prefacturaServices.getPrefacturas(numeroEmpresa, numeroRuc, fechaDesde )
            .subscribe(result => {
                    if (result === null || result.length === 0) {
                        alert('No se encontraron registros para la empresa');
                    }else {
                        let listConfirmados1: CORP_PreFactura[];
                        listConfirmados1 = result;
                        for ( let oc of listConfirmados1) {
                            oc.isCheck = false;
                            this.listEmpresas.push(oc);
                        }
                        console.log('Lista de resultados');
                        console.log(this.listEmpresas);
                    }
                },
                error => this.authService.showErrorPopup(error));
    }
    // metodo de envio de las confirmaciones
    confirmarEmpresas() {
        var con = confirm('Esta seguro que desea confirmar las empresas seleccionadas?')
        if( con ) {
            // me conecto al servicio y envio los parametros
            this.prefacturaServices.GrabarPreFacturacionAprobacion(this.listConfirmados)
                .subscribe(result => {
                        if (result === null || result.length === 0) {
                            this.listConfirmados = [];
                            alert('No se encontraron registros para la empresa');
                        }else {
                            if ( result === true) {
                                alert('Confimaciones correctas!!');
                                this.listConfirmados = [];
                                this.listEmpresas = [];
                            }else{
                                alert('Existio un problema en las Confimaciones, intentelo de nuevo!!');
                            }
                        }
                    },
                    error => this.authService.showErrorPopup(error));
        }
    }
    // metodo para verificar cual es checked(){
    esCheked(empresa: CORP_PreFactura) {
        let isCheckedT = empresa.isCheck;
        if (isCheckedT) {
            return true;
        }else {
            return false;
        }
    }
    // formato de fecha
    formatDate = function(date){
        var dateOut = new Date(date);
        return dateOut;
    };
}

