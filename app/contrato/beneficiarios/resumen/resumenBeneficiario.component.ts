import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms'
import { ChartsModule } from 'ng2-charts';

import { AuthService } from '../../../seguridad/auth.service';
import { BeneficiarioService } from '../../../common/servicios/beneficiario.service';

import { ContratoViewComponent } from '../../contrato.view.component';
import { BeneficiariosComponent } from '../beneficiarios.component';

import { ResumenBeneficiario, BeneficiarioKey } from '../../../common/model/beneficiario';
import { GraphicItem } from '../../../common/model/graphicItem';
import { TabPanelControl } from '../../tabPanelControl';

import { Permiso } from '../../../seguridad/usuario';

@Component({
    selector: 'resumenBeneficiario',
    providers: [BeneficiarioService],
    templateUrl: 'resumenBeneficiario.template.html'
})

export class ResumenBeneficiarioComponent extends TabPanelControl implements OnDestroy {

    beneficiarioKey: BeneficiarioKey;
    resumenBeneficiario: ResumenBeneficiario;

    showGraphicConsumidoDisponible: boolean;
    showGraphicMaximoConsumidoDisponible: boolean;
    showGraphicTopDiagnosticos: boolean;
    showGraphicTopPrestadores: boolean;

    consultaVendedor: boolean;

    suscription: any;

    /** Graficos Deducibles y Maximos*/
    public pieChartLabels: string[] = ['Consumido', 'Disponible'];
    public pieChartType: string = 'pie';
    public chartColors: any[] = [{ backgroundColor: ["#da1032", "#005BBB"] }];
    public optionsChart: any = {
        legend: {
            position: 'top', labels: {
                usePointStyle: true
            }
        }
    }

    public pieChartDataDeducible: number[] = [];
    public pieChartDataMaximo: number[] = [];

    /**Graficos Diagnosticos y Prestadores*/
    public barChartDiagnosticoData: any[] = [{ data: [], label: '' }];
    public barChartPrestadoresData: any[] = [{ data: [0, 0, 0, 0, 0], label: '' }];

    public barChartLabels: string[] = ['1', '2', '3', '4', '5'];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = false;
    public barChartColors: any[] = [{ backgroundColor: ["#005BBB", "#3373b7", "#477db7", "#5684b5", "#7da0c6"] }];
    public barChartOptions: any = {
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

    constructor(public beneficiarioService: BeneficiarioService, private beneficiariosComponent: BeneficiariosComponent,
        private contratoViewComponent: ContratoViewComponent, private authService: AuthService, private route: ActivatedRoute,
        private router: Router, private elementRef: ElementRef, private chRef: ChangeDetectorRef
    ) {
        super(TabPanelControl.TAB_BENEFICIARIOS_RESUMEN);

        this.suscription = this.beneficiariosComponent.beneficiarioKey$.subscribe(
            (beneficiarioKey) => {
                if (beneficiarioKey != undefined) {
                    this.beneficiarioKey = beneficiarioKey;
                    this.loadResumenBeneficiario();
                }
            }
        );
    }

    loadResumenBeneficiario(): void {
        this.verificarPermisos();
        if (this.beneficiarioKey != undefined) {
            if (this.beneficiarioKey.NewKey) {
                this.loaded = false;
                this.resumenBeneficiario = new ResumenBeneficiario();
            }

            if (this.isActive(this.beneficiarioKey.ActiveTab)) {
                if (!this.loaded) {
                    var beneficiarioFilter = this.createBeneficiarioFilter(this.beneficiarioKey.CodigoContrato, this.beneficiarioKey.NumeroPersona);
                    this.beneficiarioService.getResumenBeneficiario(beneficiarioFilter).subscribe(
                        result => {
                            if (result != undefined) {
                                this.resumenBeneficiario = result;
                                this.loadGraficos();
                            }
                            this.loaded = true;
                        },
                        error => this.authService.showErrorPopup(error));
                }
            }
        } else
            this.resumenBeneficiario = new ResumenBeneficiario();
    }

    createBeneficiarioFilter(codigoContrato: number, numeroPersona: number): BeneficiarioKey {
        var beneficiarioFilter = new BeneficiarioKey();
        beneficiarioFilter.CodigoContrato = codigoContrato;
        beneficiarioFilter.NumeroPersona = numeroPersona;
        beneficiarioFilter.CodigoProducto = this.beneficiarioKey.CodigoProducto;
        beneficiarioFilter.Transicion = this.beneficiarioKey.Transicion;
        beneficiarioFilter.CodigoRegion = this.beneficiarioKey.CodigoRegion;
        return beneficiarioFilter;
    }

    concatenar(valor: number): string {
        var tamanio = (valor * 3);
        if(tamanio >= 380){
            return 380 + 'px';
        }else{
            return (valor * 3) + 'px';
        }
       
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

    getheight(): string {
        return 15 + 'px';
    }

    loadGraficos(): void {
        if (this.resumenBeneficiario.DeducibleConsumido != undefined && this.resumenBeneficiario.DeducibleDisponible != undefined &&
            (this.resumenBeneficiario.DeducibleConsumido != 0 || this.resumenBeneficiario.DeducibleDisponible != 0)) {
            this.pieChartDataDeducible = [this.resumenBeneficiario.DeducibleConsumido, this.resumenBeneficiario.DeducibleDisponible];
            this.showGraphicConsumidoDisponible = true;
        }
        else {
            this.showGraphicConsumidoDisponible = false;
            this.pieChartDataDeducible = [];
        }

        if (this.resumenBeneficiario.MaximoConsumido != undefined && this.resumenBeneficiario.MaximoDisponible != undefined &&
            (this.resumenBeneficiario.MaximoConsumido != 0 || this.resumenBeneficiario.MaximoDisponible != 0)) {
            this.pieChartDataMaximo = [this.resumenBeneficiario.MaximoConsumido, this.resumenBeneficiario.MaximoDisponible];
            this.showGraphicMaximoConsumidoDisponible = true;
        } else {
            this.pieChartDataMaximo = [];
            this.showGraphicMaximoConsumidoDisponible = false;
        }

        if (this.resumenBeneficiario.TopDiagnosticos != undefined && this.resumenBeneficiario.TopDiagnosticos.length > 0) {
            this.barChartDiagnosticoData = [this.loadGraphicData(this.resumenBeneficiario.TopDiagnosticos)];
            this.showGraphicTopDiagnosticos = true;
        } else {
            this.barChartDiagnosticoData = [{ data: [0, 0, 0, 0, 0], label: '' }];
            this.showGraphicTopDiagnosticos = false;
        }

        if (this.resumenBeneficiario.TopPrestadores != undefined && this.resumenBeneficiario.TopPrestadores.length > 0) {
            this.barChartPrestadoresData = [this.loadGraphicData(this.resumenBeneficiario.TopPrestadores)];
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

    ngOnDestroy() {
        this.suscription.unsubscribe();
    }
}