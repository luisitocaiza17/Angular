import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { ChartsModule } from 'ng2-charts';

import { AuthService } from '../../seguridad/auth.service';
import { ContratoService } from '../../common/servicios/contrato.service';

import { GraphicItem } from '../../common/model/graphicItem';
import { Resumen, ContratoKey } from '../../common/model/contrato';
import { ContratoViewComponent } from '../contrato.view.component';
import { TabPanelControl } from '../tabPanelControl';
import { Permiso } from '../../seguridad/usuario';


@Component({
    selector: 'dashboard',
    providers: [ContratoService],
    templateUrl: 'dashboard.template.html'

})
export class DashboardComponent extends TabPanelControl implements OnDestroy {

    contratoKey: ContratoKey;
    resumen: Resumen;

    showGraphicEvolucionPrecios: boolean;
    showGraphicTopDiagnosticos: boolean;
    showGraphicTopPrestadores: boolean;
    msgEstadoContato: string;

    suscription: any;

    consultaVendedor: boolean;

    /** Pie Chart */
    public pieChartLabels: string[] = ['Consumido', 'Disponible'];
    public pieChartData: number[] = [300, 500];
    public pieChartDataMaximo: number[] = [100, 500];
    public pieChartType: string = 'pie';
    public chartColors: any[] = [
        {
            backgroundColor: ["#005BBB", "#3789dd", "#005cbb", "#23578c", "#003c7a"]
        }];

    public optionsChart: any = {
        legend: {
            position: 'top', labels: {
                usePointStyle: true
            }
        }

    }

    /**Bar Chart Diagnosticos */
    public barChartDiagnosticoLabels: string[] = ['1', '2', '3', '4', '5'];
    public barChartDiagnosticoType: string = 'bar';
    public barChartDiagnosticoLegend: boolean = false;
    public barChartDiagnosticoData: any[] = [{ data: [], label: '' }];
    public barChartDiagnosticoOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                },
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                barThickness: 36,
            }]
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    var labels = data.datasets[tooltipItem.datasetIndex].label.split('|SA|');
                    var name = labels[tooltipItem.index];
                    return name.length > 35 ? name.substr(0, 35) + '...: ' + value : name + ': ' + value;
                }
            }
        }
    };
    public barChartDiagnosticoColors: any[] = [{ backgroundColor: ["#005BBB", "#3373b7", "#477db7", "#5684b5", "#7da0c6"] }];

    /**Bar Chart Prestadores */
    public barChartPrestadoresLabels: string[] = ['1', '2', '3', '4', '5'];
    public barChartPrestadoresType: string = 'bar';
    public barChartPrestadoresLegend: boolean = false;
    public barChartPrestadoresData: any[] = [{ data: [0, 0, 0, 0, 0], label: '' }];
    public barChartPrestadoresOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
            yAxes: [{
                scaleLabel: {
                    display: true,
                },
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                barThickness: 36,
            }]
        },
        tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
                label: function (tooltipItem, data) {
                    var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    var labels = data.datasets[tooltipItem.datasetIndex].label.split('|SA|');
                    var name = labels[tooltipItem.index];
                    return name.length > 35 ? name.substr(0, 35) + '...: ' + value : name + ': ' + value;
                }
            },

        }
    };
    public barChartPrestadoresColors: any[] = [{ backgroundColor: ["#005BBB", "#3373b7", "#477db7", "#5684b5", "#7da0c6"] }];

    /**Line Chart Precios*/
    public lineChartDataPrecios: any[] = [{ data: [], label: '' }];
    public lineColors: any[] = [
        {
            backgroundColor: "rgba(0,91,187,0.5)"
        }];
    public lineChartTypePrecios: string = 'line';
    public lineChartLegendPrecios: boolean = false;
    public lineChartOptionsPrecios: any = {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }],
            xAxes: [{
                type: 'time',
                time: {
                    tooltipFormat: 'll',
                    interval: 6,
                    unit: 'month',
                    displayFormats: {
                        quarter: 'MMM YYYY'
                    }
                }
            }]
        }
    };

    constructor(public contratoService: ContratoService, private route: ActivatedRoute,
        private router: Router, private elementRef: ElementRef,
        private contratoViewComponent: ContratoViewComponent,
        private chRef: ChangeDetectorRef, private authService: AuthService) {

        super(TabPanelControl.TAB_DASHBOARD);

        this.verificarPermisos();

        this.suscription = this.contratoViewComponent.contratoDetailKey$.subscribe(
            (contratoKey) => {
                this.contratoKey = contratoKey;
                this.cargarDatos();
            }
        );
    }

    pageChanged(): void {
        this.loadDashboard();
    }

    verificarPermisos(): void {
            //Para habilitar algunos tabs y navs
            if (this.authService.tipoPermiso == Permiso.CONSULTA_VENDEDOR) {
                console.log("ALLOW SOME TABS TO THE SELLER");
                this.consultaVendedor = true;
            }
            else {
                this.consultaVendedor = false;
            }

    }

    cargarDatos(): void {
        if (this.contratoKey != undefined) {
            if (this.contratoKey.NewKey) {
                this.loaded = false;
                this.resumen = new Resumen();
                jQuery("#topDiagnosticosTab").click();
            }

            if (this.isActive(this.contratoKey.ActiveTab)) {
                if (!this.loaded) {
                    this.loadDashboard();
                }
            }
        } else {
            this.resumen = new Resumen();
            this.msgEstadoContato = "";
        }
    }

    loadDashboard(): void {
        if (this.contratoKey != undefined) {
            this.contratoService.getResumenContrato(this.contratoKey).subscribe(
                result => {
                    this.resumen = result;
                    this.msgEstadoContato = "";                    
                    if (this.resumen.Moroso == true) {
                        this.msgEstadoContato = "Contrato Bloqueado";
                    }

                    /*var ambu = 0;
                    var hosp = 0;
                    let fechaAmbulatoria = new Date(this.contratoKey.FechaInicio);
                    let fechaHospitalaria = new Date(this.contratoKey.FechaInicio);                    

                    fechaAmbulatoria = new Date(fechaAmbulatoria.setDate(fechaAmbulatoria.getDate() + 30));
                    if (fechaAmbulatoria > new Date) {
                        if (this.resumen.CarenciasAmbulatorias != null || this.resumen.CarenciasAmbulatorias != "") {
                            ambu = 1;
                        }
                    }

                    fechaHospitalaria = new Date(fechaHospitalaria.setDate(fechaHospitalaria.getDate() + 90));
                    if (fechaHospitalaria > new Date) {
                        if (this.resumen.CarenciasHospitalarias != null || this.resumen.CarenciasHospitalarias != "") {
                            hosp = 1;
                        }
                    }

                    if(ambu == 1 && hosp == 0){
                        this.msgEstadoContato += " El beneficiario posee carencias ambulatorias ";
                    }

                    if(ambu == 0 && hosp == 1){
                        this.msgEstadoContato += " El beneficiario posee carencias hospitalaria";  
                    }

                    if(ambu == 1 && hosp == 1){
                        this.msgEstadoContato += " El beneficiario posee carencias ambulatorias y hospitalaria";
                    }*/

                    this.resumen.Transicion = this.contratoKey.Transicion;
                    this.loaded = true;
                    if (this.resumen != undefined) {
                        this.loadTopDiagnosticos();
                        this.loadTopPrestadores();
                        this.loadEvolucionPrecios();
                    }
                },
                error => this.authService.showErrorPopup(error));
        }
        else {
            this.resumen = new Resumen();
        }
    }

    public loadTopDiagnosticos() {
        if (this.resumen.TopDiagnosticos != undefined && this.resumen.TopDiagnosticos.length > 0) {
            this.barChartDiagnosticoData = [this.loadGraphicData(this.resumen.TopDiagnosticos)];
            this.showGraphicTopDiagnosticos = true;
        } else {
            this.barChartDiagnosticoData = [{ data: [0, 0, 0, 0, 0], label: '' }];
            this.showGraphicTopDiagnosticos = false;
        }
    }
    public loadTopPrestadores() {
        if (this.resumen.TopPrestadores != undefined && this.resumen.TopPrestadores.length > 0) {
            this.barChartPrestadoresData = [this.loadGraphicData(this.resumen.TopPrestadores)];
            this.showGraphicTopPrestadores = true;
        } else {
            this.barChartPrestadoresData = [{ data: [0, 0, 0, 0, 0], label: '' }];
            this.showGraphicTopPrestadores = false;
        }
    }

    private loadGraphicData(items: GraphicItem[]): any {
        var data: any = null;
        var labels: string = '';
        if (items != undefined && items.length > 0) {
            var values: number[] = [];
            items.forEach(element => {
                values.push(element.Value);
                if (labels == '')
                    labels = element.Label;
                else
                    labels += '|SA|' + element.Label;
            });

        }
        if (labels == undefined)
            labels = '';
        if (values == undefined)
            values = [];
        data = { data: values, label: labels };
        return data;
    }

    public loadEvolucionPrecios() {
        var datos: any[] = [];
        if (this.resumen != undefined && this.resumen.EvolucionPrecio != undefined && this.resumen.EvolucionPrecio.Precios != undefined && this.resumen.EvolucionPrecio.Precios.length > 0) {
            this.showGraphicEvolucionPrecios = true;
            this.resumen.EvolucionPrecio.Precios.forEach(element => {
                var elements = { x: element.Fecha, y: element.Value };
                datos.push(elements);
            });
            this.lineChartDataPrecios = [{ data: datos, label: '' }];
        }
        else {
            this.lineChartDataPrecios = [{ data: [], label: '' }];
            this.showGraphicEvolucionPrecios = false;
        }
    }

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }
}