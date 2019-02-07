import { Component, OnInit } from '@angular/core';
import { PlanFormComponent } from '../plan.form.component';
import { ListaPlanesCorporativoEntity } from '../../comisiones/corporativo/model/listaPlanesCorporativo';
import { CoberturaPlanService } from '../../common/servicios/coberturaPlan.service';
import { AuthService } from '../../seguridad/auth.service';
import { CoberturaPlan } from '../../common/model/coberturaPlan';
import { ConstantesCorporativo } from '../utils/constantesCorporativo';
import { _document } from '@angular/platform-browser/src/browser';
import { Beneficio } from '../model/Beneficio';

@Component({
    selector: 'manipulacion',
    providers: [ConstantesCorporativo],
    templateUrl: 'manipulacionBeneficiario.form.html'
})

export class ManipulacionFormComponent implements OnInit {

    _coberturaKey: ListaPlanesCorporativoEntity;
    listadoCobertura: CoberturaPlan[];
    coberturas: CoberturaPlan[];
    coberturasOriginales: CoberturaPlan[];
    popupTitle: string;
    popupTitle2: string;
    fechaInicio: Date;
    beneficios: Beneficio[];
    coberturaSelected: CoberturaPlan;
    cobertura: CoberturaPlan;
    nombreCobertura: string;
    suscription: any;

    datepickerOpts = {
        autoclose: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        icon: 'fa fa-calendar',
        placeholder: 'dd/mm/yyyy',
        language: 'es'
    };

    respuestas: object =
        [
            {
                mensaje: 'SI',
                codigo: 1
            }, {
                mensaje: 'NO',
                codigo: 0
            }
        ];

    respuestasMaximos: object =
        [
            {
                mensaje: 'Maximos',
                codigo: 1
            }, {
                mensaje: 'SubMaximos',
                codigo: 0
            }
        ];
    isActualizar: boolean;
    isNueva: boolean;
    filtro: CoberturaPlan;
    beneficioData: Beneficio;
    beneficio: Beneficio;

    constructor(private planFormComponent: PlanFormComponent, public coberturaService: CoberturaPlanService, private authService: AuthService, public constantesCorporativo: ConstantesCorporativo) {

    }

    ngOnInit() {
        this._coberturaKey = new ListaPlanesCorporativoEntity();
        this.coberturaSelected = new CoberturaPlan();
        this.cobertura = new CoberturaPlan();
        this.coberturas = [];
        this.coberturasOriginales = [];
        this.isNueva = true;
        this.isActualizar = false;
        this.popupTitle = "Tipo de Cobertura"
        this.popupTitle = "Planes"
        this.filtro = new CoberturaPlan;
        this.beneficios = [];
        this.beneficio = new Beneficio();
        this.beneficioData = new Beneficio();
        this.beneficio.FechaInicioCobertura=undefined; 
        
  
        this.suscription = this.planFormComponent.selectCobertura$.subscribe(
            (resp) => {
                if (resp != undefined && resp.CodigoProducto != undefined && resp.CodigoPlan != undefined && resp.VersionPlan != undefined) {
                    this._coberturaKey = resp;
                    console.log(this._coberturaKey);
                    this.filtro.CodigoCobertura = this._coberturaKey.Cobertura;
                    this.filtro.CodigoPlan = this._coberturaKey.CodigoPlan;
                    this.filtro.CodigoProducto = this._coberturaKey.CodigoProducto;
                    this.filtro.Region = this._coberturaKey.Region;
                    this.filtro.VersionPlan = this._coberturaKey.VersionPlan;
                    this.filtro.empresaNumero = this._coberturaKey.EmpresaNumero;
                    this.filtro.tabla= true;
                    
                    this.cargarTabla();
                }
            }
        );

    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }

    cargarDatos() {
        
        this.listadoCobertura =[];
        this.coberturaService.getCoberturasPlan(this._coberturaKey.CodigoProducto, this._coberturaKey.CodigoPlan, this._coberturaKey.VersionPlan).subscribe(
            result => {
                console.log(result);
                this.listadoCobertura = result; 
                            
            },
            error => this.authService.showErrorPopup(error)
        );
        this.cargarTabla();   
    }
    pageChanged(): void {
        this.cargarTabla();
    }

    //Metodo se Ejecuta por cada fila Boton editar
    cargarTabla() {
        
        this.filtro.CodigoCobertura = this._coberturaKey.Cobertura;
                    this.filtro.CodigoPlan = this._coberturaKey.CodigoPlan;
                    this.filtro.CodigoProducto = this._coberturaKey.CodigoProducto;
                    this.filtro.Region = this._coberturaKey.Region;
                    this.filtro.VersionPlan = this._coberturaKey.VersionPlan;
                    this.filtro.empresaNumero = this._coberturaKey.EmpresaNumero;
                    this.filtro.tabla= true;                  
                    
        this.listadoCobertura = [];     
      
        this.coberturaService.getBeneficios(this.filtro, 5).subscribe(
            result => {
                this.beneficios = result;
                console.log(result);                
                console.log(this.beneficios);
            },
            error => this.authService.showErrorPopup(error)
        );
    }
    seleccionar(cobertura: CoberturaPlan): void {

        this.listadoCobertura.forEach(element => {
            element.Selected = false;
        });

        cobertura.Selected = true;
        this.cobertura = cobertura;

        this.isActualizar = true
        this.isNueva = false
    }





    seleccionarCobertura(convenioSeleccionado: CoberturaPlan): void {

        this.cobertura.CodigoCobertura = convenioSeleccionado.CodigoCobertura;
        this.cobertura.NombreCobertura = convenioSeleccionado.NombreCobertura;
        jQuery("#prestadorViewModal").modal("hide");
    }

    listarConvenios() {
        debugger;
        this.coberturaService.getCatalogoCobertura(this.cobertura.NombreCobertura).subscribe(
            coberturasServicio => {
                this.coberturas = coberturasServicio;
                this.coberturasOriginales = coberturasServicio;
                this.pintarConvenio();
                $("#prestadorViewModal").modal();

            },
            error => this.authService.showErrorPopup(error));
    }

    pintarConvenio() {
        //selecciona el prestador o medico escogido anteriormente
        if (this.coberturas != undefined && this.cobertura.Nombre != undefined) {

            this.coberturas.forEach(element => {
                if (element.CodigoCobertura == this.cobertura.CodigoCobertura)
                    element.Selected = true;
                else
                    element.Selected = false;
            });
        }
    }
    ActualizarCobertura(cobertura: CoberturaPlan) {
        cobertura.CodigoPlan = this._coberturaKey.CodigoPlan;
        cobertura.CodigoProducto = this._coberturaKey.CodigoProducto;
        cobertura.VersionPlan = this._coberturaKey.VersionPlan;
        cobertura.Region = this._coberturaKey.Region;
        this.coberturaService.actualizarCobertura(cobertura).subscribe(
            coberturasServicio => {
                if (coberturasServicio) {
                    this.authService.showSuccessPopup("Cobertura Actualizada");
                }
                else {
                    this.authService.showErrorPopup("Ha ocurrido un error");
                }
            },
            error => this.authService.showErrorPopup(error));
    }

    NuevaCobertura() {
        var nueva = new CoberturaPlan();
        nueva = this.cobertura;
        nueva.CodigoPlan = this._coberturaKey.CodigoPlan;
        nueva.CodigoProducto = this._coberturaKey.CodigoProducto;
        nueva.VersionPlan = this._coberturaKey.VersionPlan;
        nueva.Region = this._coberturaKey.Region;
        this.coberturaService.insertarCobertura(nueva).subscribe(
            coberturasServicio => {
                if (coberturasServicio) {
                    this.authService.showSuccessPopup("Cobertura Ingresada");
                    this.cargarDatos();
                }
                else {
                    this.authService.showErrorPopup("Ha ocurrido un error");
                }
            },
            error => this.authService.showErrorPopup(error));
    }

    editarConvenio(cob: CoberturaPlan) {
        console.log("aaaa");
        cob.CodigoProducto = this._coberturaKey.CodigoProducto;
        cob.Region = this._coberturaKey.Region;
        console.log(cob);
        this.coberturaService.getListaPlanesCor(cob).subscribe(
            resp => {
                console.log("wwww");
                console.log(resp);
            },
            error => this.authService.showErrorPopup(error));

    }
    abrirPlanes(cob: CoberturaPlan){
        cob.Region = this._coberturaKey.Region;
        cob.CodigoProducto = this._coberturaKey.CodigoProducto;
        cob.CodigoPlan = this._coberturaKey.CodigoPlan;
        console.log(cob);
        this.coberturaService.getListaBeneficios(cob).subscribe(
            resp => {
                console.log(resp);
            },
            error => this.authService.showErrorPopup(error));

        $("#planesViewModal").modal();
    }
    seleccionarBeneficio(beneficio: Beneficio): void {
        debugger;
        this.beneficios.forEach(element => {
            element.Selected = false;
        });

        beneficio.Selected = true;
        this.beneficioData = beneficio;
        this.beneficioData.FechaInicioCobertura = new Date(beneficio.FechaInicioCobertura);
        this.isActualizar = true
        this.isNueva = false
    }


}