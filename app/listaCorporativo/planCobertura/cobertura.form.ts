import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlanFormComponent } from '../plan.form.component';
import { ListaPlanesCorporativoEntity } from '../../comisiones/corporativo/model/listaPlanesCorporativo';
import { CoberturaPlanService } from '../../common/servicios/coberturaPlan.service';
import { AuthService } from '../../seguridad/auth.service';
import { CoberturaPlan } from '../../common/model/coberturaPlan';
import { Convenio } from '../../common/model/convenio';
import { ConstantesCorporativo } from '../utils/constantesCorporativo';
import { _document } from '@angular/platform-browser/src/browser';

@Component({
    selector: 'cobertura',
    providers: [ConstantesCorporativo],
    templateUrl: 'cobertura.form.html'
})

export class CoberturaFormComponent implements OnInit, OnDestroy {

    _coberturaKey: ListaPlanesCorporativoEntity;
    listadoCobertura: CoberturaPlan[];
    coberturas: CoberturaPlan[];
    coberturasOriginales: CoberturaPlan[];
    popupTitle : string;

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


    constructor(private planFormComponent: PlanFormComponent, private coberturaService: CoberturaPlanService, private authService: AuthService, public constantesCorporativo:ConstantesCorporativo) {

    }

    ngOnInit() {
        this._coberturaKey = new ListaPlanesCorporativoEntity();
        this.coberturaSelected = new CoberturaPlan();
        this.cobertura = new CoberturaPlan();
        this.coberturas = [];
        this.coberturasOriginales = [];
        this.isNueva = true;
        this.isActualizar=false;
        this.popupTitle = "Tipo de Cobertura"
        this.suscription = this.planFormComponent.selectCobertura$.subscribe(
            (resp) => {
                if (resp != undefined && resp.CodigoProducto != undefined && resp.CodigoPlan != undefined && resp.VersionPlan != undefined) {
                    this._coberturaKey = resp;
                    this.cargarDatos();
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

}