import {OnInit, ElementRef, ChangeDetectorRef, Component} from '@angular/core';
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
    AgenteReport, AgenteReportResult,
    AgenteVentaCambioFilter,
    ContratoEntityFilterBroker,
    ContratoEntityListBroker,
    EmpresaList
} from '../common/model/agenteVentaCorredoresEntity';
import {Sucursal} from '../common/model/sucursal';

@Component({
    providers: [CorredoresGrupoAgenteVentaServices,CorredoresAgenteVentaServices],
    templateUrl: 'CorredoresReporteReasignacion.list.template.html'
})

export class CorredoresReporteReasignacionListComponent implements OnInit {
    nombreBroker:string;
    codigoBroker:string;
    rucBroker:string
    fechaInicio:Date;
    fechaFin:Date;
    VerTabla:boolean;
    corredoresList:AgenteVenta[];
    listadoMovimientos:AgenteReportResult[]
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
                private authService: AuthService, private constantService: ConstantService,
                private corredoresAgenteServices: CorredoresAgenteVentaServices ) {
        this.corredoresList = new Array<AgenteVenta>();
    }


    ngOnInit(): void {
        this.fechaInicio== new Date();
        this.fechaFin== new Date();
        this.VerTabla=false;
    }

    traerFiltrosR() {
        let filtro: AgenteReport = new AgenteReport();
        if (this.fechaInicio == null || this.fechaFin == null) {
            return alert('Debe seleccionar un rango de fecha.');
        }
        if (this.fechaInicio > this.fechaFin){
            return alert('la fecha de inicio no puede ser mayor a la fecha de fin.');
        }
        if(this.codigoBroker!=undefined&&this.codigoBroker!=''){
            filtro.AgenteVentaId=Number(this.codigoBroker);
        }
        if(this.nombreBroker!=undefined&&this.nombreBroker!=''){
            filtro.Nombre=this.nombreBroker;
        }
        if(this.rucBroker!=undefined&&this.rucBroker!=''){
            filtro.Ruc=this.rucBroker;
        }
        filtro.FechaFin=this.fechaFin;
        filtro.FechaInicio=this.fechaInicio;
        this.corredoresAgenteServices.CorredoresAgentesVentaReporte(filtro)
            .subscribe(res => {
                    this.listadoMovimientos=res;
                    this.VerTabla=true;
                },
                error => this.authService.showErrorPopup(error));
    }
}
