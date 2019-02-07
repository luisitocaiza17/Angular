import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GenericosService } from "../../../common/servicios/genericos.service";
import { BancoEntity, FormatoFecha } from "../../../common/model/genericos";
import { AuthService } from "../../../seguridad/auth.service";
import {ColumnaBdd, ConfiguracionCargaEstadoCuentaEntity } from "../../model/estadoCuentaBancaria.model";
import { EstadoCuentaBancariaService } from "../../services/estadoCuentaBancaria.service";
import { ConfiguracionCargaEstadoCuentaService } from "../../services/configuracionCargaEstadoCuenta.service";
import { UploadFile } from "../common/model/uploadFile";

@Component({
    selector: 'configuracionCargaEstadoCuenta',
    providers: [EstadoCuentaBancariaService, ConfiguracionCargaEstadoCuentaService],
    templateUrl: 'configuracionCargaEstadoCuenta.component.html'
})

export class configuracionCargaEstadoCuentaComponent implements OnInit
{
    public bancos: BancoEntity[]; 
    public configuracionEstadoCuenta: ConfiguracionCargaEstadoCuentaEntity; 
    public caracterNuevo: string; 
    public estructuraEstadoCuentaBancaria: ColumnaBdd[]; 
    public positionOnFile: number; 
    public signoMonto: number; 
    public formatosFecha: FormatoFecha[]; 

    constructor(
        public genericosService: GenericosService,
        public authService: AuthService, 
        public estadoCuentaBancariaService: EstadoCuentaBancariaService, 
        public configuracionCargaEstadoCuentaService: ConfiguracionCargaEstadoCuentaService
    ){ 

    }

    ngOnInit(){ 
        this.configuracionEstadoCuenta = new ConfiguracionCargaEstadoCuentaEntity(); 
        this.configuracionEstadoCuenta.TieneCabeceras = false; 
        this.configuracionEstadoCuenta.FormatoArchivo = 'csv'; 
        this.configuracionEstadoCuenta.CaracteresAEliminar = [];
        this.estructuraEstadoCuentaBancaria = [];
        this.loadBancos();  
        this.loadEstructuraEstadoCuentaBancaria();
        this.loadFormatosFecha();        
    }

    loadBancos(){ 
        this.genericosService.cargarBancosUsados()
            .subscribe(
                res => { 
                    this.bancos = res;
                    this.configuracionEstadoCuenta.CodigoBanco = this.bancos[0].CodigoBanco; 
                    this.loadConfiguracionCargaCuenta();
                }, 
                error => {
                    this.authService.showErrorPopup(error); 
                }
        )
    }

    agregarCaracter(){ 
        this.configuracionEstadoCuenta.CaracteresAEliminar.push(this.caracterNuevo);
        this.caracterNuevo = ""; 
    }

    quitarCaracter(caracter: string){ 
        var index =  this.configuracionEstadoCuenta.CaracteresAEliminar.indexOf(caracter);
        if (index !== -1) 
            this.configuracionEstadoCuenta.CaracteresAEliminar.splice(index, 1);
    }

    verificarLongitudUno(caracter: string){ 
        if(caracter == ' ')
            return false;
        else if(caracter == undefined || caracter == null || caracter.length != 1)
            return false; 
        else
            return true; 
    }

    existeCaracterEnLista(caracter){ 
        var index =  this.configuracionEstadoCuenta.CaracteresAEliminar.indexOf(caracter);
        if (index !== -1) 
            return true;
        else 
            return false;
    }

    loadEstructuraEstadoCuentaBancaria(){ 
        this.estadoCuentaBancariaService.getEstructuraEstadoCuentaBancaria()
                .subscribe(
                    res => { 
                        this.estructuraEstadoCuentaBancaria = res;
                    }, 
                    error => { 
                        this.authService.showErrorPopup(error); 
                    }
                );
    }

    guardarConfiguracion(){ 
        if(this.signoMonto == 1)
            this.configuracionEstadoCuenta.IdentificadorCredito = '-'; 

        this.configuracionCargaEstadoCuentaService.guardarConfiguracion(this.configuracionEstadoCuenta)
            .subscribe(
                res => {
                    if(res)
                        this.authService.showSuccessPopup('Configruacion guardada correctamente');
                    else 
                        this.authService.showErrorPopup('No se han podido guardar los datos');
                }, 
                error => { 
                    this.authService.showErrorPopup(error);
                }
            );
    }

    loadConfiguracionCargaCuenta(){ 
        this.configuracionCargaEstadoCuentaService.getConfiguracion(this.configuracionEstadoCuenta.CodigoBanco)
                .subscribe(
                    res => { 
                        if(res.CodigoBanco != undefined){
                            this.configuracionEstadoCuenta = res;
                            if(this.configuracionEstadoCuenta.IdentificadorCredito == '-')
                                this.signoMonto = 1;
                            else
                                this.signoMonto = 0; 
                        }                           
                        else{
                            this.limpiarConfiguracion(); 
                        }                         
                    }, 
                    error => { 
                        this.authService.showErrorPopup(error);
                    }
                ); 
    }

    limpiarConfiguracion(){ 
        let codigoBanco = this.configuracionEstadoCuenta.CodigoBanco; 
        this.configuracionEstadoCuenta = new ConfiguracionCargaEstadoCuentaEntity(); 
        this.configuracionEstadoCuenta.CodigoBanco = codigoBanco; 
        this.configuracionEstadoCuenta.TieneCabeceras = false; 
        this.configuracionEstadoCuenta.FormatoArchivo = 'csv'; 
        this.configuracionEstadoCuenta.CaracteresAEliminar = [];
        this.signoMonto = 0; 
    }

    loadFormatosFecha(){ 
        this.genericosService.GetFormatosFecha() 
            .subscribe(
                res => { 
                    this.formatosFecha = res; 
                    this.configuracionEstadoCuenta.CodigoFormatoFecha = this.formatosFecha[0].Codigo; 
                }, 
                error => { 
                    this.authService.showErrorPopup(error); 
                }
            );
    }

    openModal(modalName: string) {
        $(modalName).modal(); 
    }
}
