import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { correctHeight } from '../app.helpers';
import { AuthService } from '../seguridad/auth.service';
import { ConstantService } from '../utils/constant.service';
import {CorredoresGrupoAgenteVentaServices} from '../common/servicios/corredoresGrupoAgentes.services';
import {PC_GrupoAgentes} from '../common/model/PC_GrupoAgentes';
import {AgenteVenta} from '../common/model/agenteVenta';
import {CorredoresAgenteVentaServices} from '../common/servicios/corredoresAgenteVenta.services';
import {
    AgenteVentaCambioFilter,
    ContratoEntityFilterBroker,
    ContratoEntityListBroker,
    EmpresaList
} from '../common/model/agenteVentaCorredoresEntity';
import {Sucursal} from '../common/model/sucursal';

@Component({
    providers: [CorredoresGrupoAgenteVentaServices,CorredoresAgenteVentaServices],
    templateUrl: 'corredoresReasignacion.list.template.html'
})

export class CorredoresReasignacionListComponent implements OnInit {
    //combos
    tipoAsignacionList:any[];
    tipoAsignacion:any;
    tipoProductoList:any[];
    tipoProducto:any;
    //controlador general de tipo de producto
    valorTipoAsignacion?:number;
    valorTipoproducto?:string;
    //filtros de busqueda de agentes
    nombreBroker:string;
    codigoBroker:string;
    rucBroker:string;
    //filtros de busqueda de agentes
    nombreBrokerAAsignar:string;
    codigoBrokerAAsignar:string;
    rucBrokerAAsignar:string;
    //filtros busqueda contrato
    numeroContro:string;
    numeroCedula:string;
    nombreApellidos:string;
    //filtro busqueda lista
    numeroRuc:string;
    numeroEmpresa:string;
    nombreEmpresa:string;
    numeroLista:string;

    //Visualizadores iniciales
    showEditor:boolean;
    VerTabla:boolean;
    //Visualizadores de tipos de busqueda
    verContrato:boolean;
    verLista:boolean;
    verProducto:boolean;
    //visualizadores de grillas contratos y sucursales
    VerContratosListas:boolean;
    VerTablaAfiliado:boolean;
    VerTablaListas:boolean;
    VerTablaProducto:boolean;
    VerSeleccionBrokerReasignacion:boolean;
    VerTablaSucursal:boolean;
    VerTablaBrokerAAsignar:boolean;
    //seccion Final
    verSeccionFinal:boolean;
    busquedaTipoContrato:number;
    comboContraro:boolean;
    busquedaBroker:boolean;
    //desabilitar boton comision
    comisionActivate:boolean;

    corredoresList:AgenteVenta[];
    corredoresListAASignar:AgenteVenta[];
    corredorAsignar:AgenteVenta;
    //contratos
    contratos:ContratoEntityListBroker[];
    contratosSeleccionados:ContratoEntityListBroker[];
    corredorInicial:AgenteVenta;
    //sucursales
    sucursalesList:EmpresaList[];
    sucursalesSeleccionadas:EmpresaList[];
    //comision
    valorComision:number;
   // Constructor, se ejecuta al inicializar el proceso, inicializa las variables
    constructor(private elementRef: ElementRef, private router: Router, private chRef: ChangeDetectorRef,
                private authService: AuthService, private constantService: ConstantService,
                private corredoresAgenteServices: CorredoresAgenteVentaServices ) {
        this.showEditor=true;
        this.VerTabla=false;
        this.verContrato=false;
        this.verLista=false;
        this.busquedaBroker=true;
        this.comisionActivate=false;
    }


    ngOnInit(): void {
        this.cargarTipoAsignacion();
        this.cargarProducto();
    }
    cargarTipoAsignacion(){
        this.tipoAsignacionList = new Array<any>();
        this.tipoAsignacion = new Object();
        this.tipoAsignacion.id = 1;
        this.tipoAsignacion.nombre = 'Contratos';
        this.tipoAsignacionList.push(this.tipoAsignacion);
        this.tipoAsignacion = new Object();
        this.tipoAsignacion.id = 2;
        this.tipoAsignacion.nombre = 'Listas';
        this.tipoAsignacionList.push(this.tipoAsignacion);
        this.tipoAsignacion = new Object();
        this.tipoAsignacion.id = 3
        this.tipoAsignacion.nombre = 'Productos';
        this.tipoAsignacionList.push(this.tipoAsignacion);
    }
    cargarProducto(){
        this.tipoProductoList = new Array<any>();
        this.tipoProducto = new Object();
        this.tipoProducto.id = 'IND';
        this.tipoProducto.nombre = 'Independiente';
        this.tipoProductoList.push(this.tipoProducto);
        this.tipoProducto = new Object();
        this.tipoProducto.id = 'XPR';
        this.tipoProducto.nombre = 'Experience';
        this.tipoProductoList.push(this.tipoProducto);
        this.tipoProducto = new Object();
        this.tipoProducto.id = 'COOR';
        this.tipoProducto.nombre = 'Corporativo';
        this.tipoProductoList.push(this.tipoProducto);
        this.tipoProducto = new Object();
        this.tipoProducto.id = 'SMARTPLAN';
        this.tipoProducto.nombre = 'SmartPlan';
        this.tipoProductoList.push(this.tipoProducto);
        this.tipoProducto = new Object();
        this.tipoProducto.id = 'POO';
        this.tipoProducto.nombre = 'Pool';
        this.tipoProductoList.push(this.tipoProducto);
        this.tipoProducto = new Object();
        this.tipoProducto.id = 'GRUPAL'
        this.tipoProducto.nombre = 'Grupal';
        this.tipoProductoList.push(this.tipoProducto);
    }

    seleccionarAsignacion(){
        if(this.valorTipoAsignacion==1){
            this.verContrato=true;
            this.verLista=false;
            this.verProducto=false;
            this.VerTablaListas=false;
        }
        if(this.valorTipoAsignacion==2){
            this.verContrato=false;
            this.verProducto=false;
            this.verLista=true;
            this.VerTablaAfiliado=false;
        }
        if(this.valorTipoAsignacion==3){
            this.verContrato=false;
            this.verLista=false;
            this.verProducto=true;
            this.VerTablaProducto=false;
        }
        if(this.valorTipoAsignacion==undefined||
            this.valorTipoAsignacion==null||
            this.valorTipoAsignacion==0){
            this.verContrato=false;
            this.verLista=false;
            this.VerTablaAfiliado=false;
            this.VerTablaListas=false;
        }
    }
    traerFiltros(){
        if(this.nombreBroker === undefined &&this.codigoBroker===undefined && this.rucBroker===undefined)
            return alert('Debe ingresar al menos un filtro para realizar la busqueda especifica');
        if(this.nombreBroker != undefined && this.nombreBroker!= ''){
            this.corredoresAgenteServices.CorredoresObtenerAgentesVentaVendedorPorNombre(this.nombreBroker) .subscribe(result => {
                    this.corredoresList = result;
                    this.VerTabla=true;
                },
                error => this.authService.showErrorPopup(error));
            return;
        }
        if(this.codigoBroker != undefined && this.codigoBroker!= ''){
            this.corredoresAgenteServices.CorredoresObtenerAgentesVentaVendedorPorCodigoCorredor(Number(this.codigoBroker)) .subscribe(result => {
                    this.corredoresList = result;
                    this.VerTabla=true;
                },
                error => this.authService.showErrorPopup(error));
            return;
        }
        if(this.rucBroker != undefined && this.rucBroker!= ''){
            this.corredoresAgenteServices.CorredoresObtenerAgentesVentaVendedorPorRucCorredor(this.rucBroker) .subscribe(result => {
                    this.corredoresList = result;
                    this.VerTabla=true;
                },
                error => this.authService.showErrorPopup(error));
            return;
        }
    }
    traerFiltrosAAsignar(){
        debugger;
        if(this.nombreBrokerAAsignar === undefined &&this.codigoBrokerAAsignar===undefined && this.rucBrokerAAsignar===undefined)
            return alert('Debe ingresar al menos un filtro para realizar la busqueda especifica');
        if(this.nombreBrokerAAsignar != undefined && this.nombreBrokerAAsignar!= ''){
            this.corredoresAgenteServices.CorredoresObtenerAgentesVentaPorNombre(this.nombreBrokerAAsignar) .subscribe(result => {
                    this.corredoresListAASignar = result;
                    this.VerTablaBrokerAAsignar=true;
                },
                error => this.authService.showErrorPopup(error));
            return;
        }
        if(this.codigoBroker != undefined && this.codigoBroker!= ''){
            this.corredoresAgenteServices.CorredoresObtenerAgentesVentaPorCodigoCorredor(Number(this.codigoBroker)) .subscribe(result => {
                    this.corredoresListAASignar = result;
                    this.VerTablaBrokerAAsignar=true;
                },
                error => this.authService.showErrorPopup(error));
            return;
        }
        if(this.rucBroker != undefined && this.rucBroker!= ''){
            this.corredoresAgenteServices.CorredoresObtenerAgentesVentaPorRucCorredor(this.rucBroker) .subscribe(result => {
                    this.corredoresListAASignar = result;
                    this.VerTablaBrokerAAsignar=true;
                },
                error => this.authService.showErrorPopup(error));
            return;
        }
    }
    abrirEdicion(corredor:AgenteVenta) {
        this.corredorInicial=corredor;
        this.showEditor = false;
        this.VerTabla=false;
        this.busquedaBroker=false;
        this.VerContratosListas=true;
        this.valorTipoAsignacion=0;
        this.VerTablaListas=false;
        //limpio los controles de la siguiente ventana
        this.numeroContro='';
        this.numeroCedula='';
        this.nombreApellidos='';
    }
    //funcion que buscar los contratos o listas
    buscar(){
        var filtro:ContratoEntityFilterBroker = new ContratoEntityFilterBroker();
        if(this.numeroContro!=undefined&&this.numeroContro!=null && this.numeroContro!=''){
            filtro.NumeroContrato=Number(this.numeroContro);
        }
        if(this.numeroCedula!=undefined&&this.numeroCedula!=null && this.numeroCedula!=''){
            filtro.NumeroCedula=this.numeroCedula;
        }
        if(this.nombreApellidos!=undefined&&this.nombreApellidos!=null && this.nombreApellidos!=''){
            filtro.NombrePersona=this.nombreApellidos;
        }
        filtro.Brokers=[this.corredorInicial.Codigo];
        filtro.lstProductos=['IND','XPR'];
        filtro.SoloActivos=true;
        this.corredoresAgenteServices.ConsultarContratosPorFiltro(filtro) .subscribe(result => {
                this.contratos = result;
                this.VerTablaAfiliado=true;
                this.busquedaTipoContrato=1;
                this.comboContraro=false;
            },
            error => this.authService.showErrorPopup(error));
    }
    buscarListas(){
        var filtro:ContratoEntityFilterBroker = new ContratoEntityFilterBroker();
        if(this.numeroRuc!=undefined&&this.numeroRuc!=null && this.numeroRuc!=''){
            filtro.RUCEmpresa=this.numeroRuc;
        }
        if(this.numeroEmpresa!=undefined&&this.numeroEmpresa!=null && this.numeroEmpresa!=''){
            filtro.NumeroEmpresa=this.numeroEmpresa;
        }
        if(this.nombreEmpresa!=undefined&&this.nombreEmpresa!=null && this.nombreEmpresa!=''){
            filtro.RazonSocial=this.nombreEmpresa;
        }
        if(this.numeroLista!=undefined&&this.numeroLista!=null && this.numeroLista!=''){
            filtro.NumeroSucursal=this.numeroLista;
        }
        filtro.Brokers=[this.corredorInicial.Codigo];
        filtro.lstProductos=['COR','POOL','SMARTPLAN','GRUPAL'];
        filtro.SoloActivos=true;
        this.corredoresAgenteServices.ConsultarContratosListPorAgente(filtro) .subscribe(result => {
                this.sucursalesList = result;
                this.VerTablaListas=true;
                this.busquedaTipoContrato=2;
                this.comboContraro=false;
            },
            error => this.authService.showErrorPopup(error));
    }

    buscarProducto(){
        if(this.valorTipoproducto===undefined || this.valorTipoproducto===null || this.valorTipoproducto==='')
            return alert('Debe seleccionar un producto.');

        var filtro:ContratoEntityFilterBroker = new ContratoEntityFilterBroker();
        filtro.Brokers=[this.corredorInicial.Codigo];
        filtro.SoloActivos=true;
        if(this.valorTipoproducto==='COR'||this.valorTipoproducto==='POOL'||this.valorTipoproducto==='SMARTPLAN'
            ||this.valorTipoproducto==='GRUPAL'){
            filtro.lstProductos=[this.valorTipoproducto];
            this.corredoresAgenteServices.ConsultarContratosListPorAgente(filtro) .subscribe(result => {
                    this.sucursalesList = result;
                    this.VerTablaListas=true;
                    this.busquedaTipoContrato=2;
                    this.comboContraro=true;
                },
                error => this.authService.showErrorPopup(error));
        }else{
            if(this.valorTipoproducto==='IND')
                filtro.SoloIndividual=true;
            filtro.lstProductos=[this.valorTipoproducto];
            this.corredoresAgenteServices.ConsultarContratosPorFiltro(filtro) .subscribe(result => {
                    this.contratos = result;
                    this.VerTablaAfiliado=true;
                    this.busquedaTipoContrato=1;
                    this.comboContraro=true;
                },
                error => this.authService.showErrorPopup(error));
        }
    }

    continuar(){
        if(this.busquedaTipoContrato==1){
            this.contratosSeleccionados=[];
            this.contratosSeleccionados=this.contratos.filter(x=> x.esSeleccionado==true);
            if(this.contratosSeleccionados.length==0)
                return alert('Debe seleccionar al menos un contrato.');
        }
        if(this.busquedaTipoContrato==2){
            this.sucursalesSeleccionadas=[];
            this.sucursalesSeleccionadas=this.sucursalesList.filter(x=> x.esSeleccionado==true);
            if(this.sucursalesSeleccionadas.length==0)
                return alert('Debe seleccionar al menos una lista');
        }
        this.VerTablaAfiliado=false;
        this.VerTablaListas=false;
        this.verContrato=false;
        this.VerContratosListas=false;
        this.VerSeleccionBrokerReasignacion=true;
        this.VerTablaBrokerAAsignar=false;
        this.nombreBrokerAAsignar='';
        this.codigoBrokerAAsignar='';
        this.rucBrokerAAsignar='';
    }
    abrirEdicionAsignar(corredor:AgenteVenta) {
        this.corredorAsignar=corredor;
        if(this.corredorAsignar.Codigo==this.corredorInicial.Codigo)
            return alert('No se puede reasignar hacia el mismo broker.');
        this.VerTablaBrokerAAsignar=false;
        this.VerSeleccionBrokerReasignacion=false;
        this.verSeccionFinal=true;
        if(this.busquedaTipoContrato==2)
            this.comisionActivate=true;
        else
            this.comisionActivate=false;
    }
    Reasignar() {
        if(this.busquedaTipoContrato==1){
            if (confirm('Desea Reasignar los contratos al broker seleccionado?')) {
                var filtro: AgenteVentaCambioFilter = new AgenteVentaCambioFilter();
                filtro.AgenteVentaNuevo = this.corredorAsignar.Codigo;
                if (this.contratosSeleccionados.length == 0) {
                    alert('No existen contratos seleccionados para reasignar');
                    return false;
                }
                var contratosSel: Array<number> = new Array<number>();
                for (let o of this.contratosSeleccionados) {
                    contratosSel.push(o.CodigoContrato);
                }
                filtro.Contratos = contratosSel;
                filtro.UsuarioModifica = this.authService.nombreCompleto;
                filtro.NombreAgenteVentaAnterior = this.corredorInicial.RazonSocialBroker==""?this.corredorInicial.Nombre:this.corredorInicial.RazonSocialBroker;
                filtro.NombreAgenteVentaNuevo = this.corredorAsignar.RazonSocialBroker==""?this.corredorAsignar.Nombre:this.corredorAsignar.RazonSocialBroker;
                this.corredoresAgenteServices.CorredoresAgentesVentaReasignacionContratos(filtro).subscribe(result => {
                        if (result != undefined) {
                            if (result == true) {
                                this.authService.showSuccessPopup("Proceso Correcto!!");
                                this.RegresarInicio();
                                this.VerTabla = false;
                                this.verSeccionFinal = false;
                            } else {
                                this.authService.showErrorPopup("Tuvimos un Problema al realizar la reasignación, por favor " +
                                    "refresque la página e intentelo de nuevo ");
                            }
                        } else {
                            this.authService.showErrorPopup("Tuvimos un Problema al realizar la reasignación, por favor " +
                                "refresque la página e intentelo de nuevo ");
                        }

                    },
                    error => this.authService.showErrorPopup(error));
            }else {
                return false;
            }
        }
        if(this.busquedaTipoContrato==2) {
            if (confirm('Desea Reasignar las listas y sus contratos al broker seleccionado?')) {
                var filtro: AgenteVentaCambioFilter = new AgenteVentaCambioFilter();
                filtro.AgenteVentaNuevo = this.corredorAsignar.Codigo;
                filtro.Contratos = contratosSel;
                filtro.UsuarioModifica = this.authService.nombreCompleto;
                filtro.NombreAgenteVentaAnterior = this.corredorInicial.RazonSocialBroker==""?this.corredorInicial.Nombre:this.corredorInicial.RazonSocialBroker;
                filtro.NombreAgenteVentaNuevo = this.corredorAsignar.RazonSocialBroker==""?this.corredorAsignar.Nombre:this.corredorAsignar.RazonSocialBroker;
                filtro.ComisionNueva = this.valorComision;
                debugger;
                if (this.sucursalesSeleccionadas.length == 0) {
                    alert('No existen listas seleccionados para reasignar');
                    return false;
                }
                var cSucursal: Array<number> = new Array<number>();
                var cEmpresas: Array<number> = new Array<number>();
                for (let o of this.sucursalesSeleccionadas) {
                    cSucursal.push(o.NumeroSucursal);
                    cEmpresas.push(Number(o.NumeroEmpresa));
                }
                filtro.Listas = cSucursal;
                filtro.Empresas = cEmpresas;
                this.corredoresAgenteServices.CorredoresAgentesVentaReasignacionLista(filtro).subscribe(result => {
                        if (result != undefined) {
                            if (result == true) {
                                this.authService.showSuccessPopup("Proceso Correcto!!");
                                this.RegresarInicio();
                                this.VerTabla = false;
                            } else {
                                this.authService.showErrorPopup("Tuvimos un Problema al realizar la reasignación, por favor " +
                                    "refresque la página e intentelo de nuevo ");
                            }
                        } else {
                            this.authService.showErrorPopup("Tuvimos un Problema al realizar la reasignación, por favor " +
                                "refresque la página e intentelo de nuevo ");
                        }

                    },
                    error => this.authService.showErrorPopup(error));
            }
        }else{
            return;
        }
    }
    RegresarInicio(){
        this.busquedaBroker=true;
        this.verContrato=false;
        this.verLista=false;
        this.verProducto=false;
        this.VerTablaAfiliado=false;
        this.VerTablaSucursal=false;
        this.VerTabla=true;
        this.comboContraro=false;
    }
    RegresarContratos(){
        this.VerSeleccionBrokerReasignacion=false;
        this.VerTablaBrokerAAsignar=false;
        this.VerContratosListas=true;
        if(this.busquedaTipoContrato==1){
            this.VerTablaAfiliado=true;
            this.verContrato=true;
            this.VerTablaListas=false;
            this.verLista=false;
        }
        if(this.busquedaTipoContrato==2){
            this.VerTablaAfiliado=false;
            this.verContrato=false;
            this.VerTablaListas=true;
            this.verLista=true;
        }
        if(this.comboContraro){
            this.verContrato=false;
            this.verLista=false;
            this.verProducto=true;
        }
    }
    RegresarSeleccionBrokerReasignacion(){
        this.contratosSeleccionados=[];
        this.verSeccionFinal=false;
        this.VerSeleccionBrokerReasignacion=true;
        this.VerTablaBrokerAAsignar=true;
    }

    Inicio(){
        this.busquedaBroker=true;
        this.VerTabla=false;
        this.VerContratosListas=false;
        this.VerSeleccionBrokerReasignacion=false;
        this.verSeccionFinal=false;
        this.verLista=false;
        this.verProducto=false;
        this.verContrato=false;
        this.VerTablaAfiliado=false;
        this.VerTablaListas=false;
        this.VerTablaBrokerAAsignar=false;
        this.nombreBroker="";
        this.codigoBroker="";
        this.rucBroker="";
        //filtros de busqueda de agentes
        this.nombreBrokerAAsignar="";
        this.codigoBrokerAAsignar="";
        this.rucBrokerAAsignar="";
        //filtros busqueda contrato
        this.numeroContro="";
        this.numeroCedula="";
        this.nombreApellidos="";
        //filtro busqueda lista
        this.numeroRuc="";
        this.numeroEmpresa="";
        this.nombreEmpresa="";
        this.numeroLista="";
    }

}
