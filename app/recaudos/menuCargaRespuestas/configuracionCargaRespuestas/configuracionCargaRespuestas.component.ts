import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GenericosService } from "../../../common/servicios/genericos.service";
import { BancoEntity, FormatoFecha } from "../../../common/model/genericos";
import { AuthService } from "../../../seguridad/auth.service";
import { EstadoCargaRespuestasService } from "../services/estadoCargaRespuestas.service";
import { ConfiguracionCargaBancoEntity, ColumnaBdd } from "../model/estadoCargaRespuestas.model";
import { ConfiguracionCargaRespuestasService } from "../services/configuracionCargaRespuestas.service";

@Component({
    selector: 'configuracionCargaRespuestas',
    providers: [EstadoCargaRespuestasService, ConfiguracionCargaRespuestasService],
    templateUrl: 'configuracionCargaRespuestas.component.html'
})

export class configuracionCargaRespuestasComponent implements OnInit
{
    public bancos: BancoEntity[];
    public estructuraCargaRespuestasBanco: ColumnaBdd[]; 
    public configuracionEstadoCuenta: ConfiguracionCargaBancoEntity;

    constructor(
        public genericosService: GenericosService,
        public authService: AuthService,
        public estadoCargaRespuestasService: EstadoCargaRespuestasService,
        public configuracionCargaRespuestasService: ConfiguracionCargaRespuestasService
    ){ 

    }

    ngOnInit(){ 
        this.configuracionEstadoCuenta = new ConfiguracionCargaBancoEntity();
        this.estructuraCargaRespuestasBanco = [];
        this.loadBancos(); 
        this.loadEstructuraCargaRespuestasBanco();
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

    loadConfiguracionCargaCuenta(){ 
        this.configuracionCargaRespuestasService.getConfiguracion(this.configuracionEstadoCuenta.CodigoBanco)
                .subscribe(
                    res => { 
                        if(res.CodigoBanco != undefined){
                            this.configuracionEstadoCuenta = res;
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
        this.configuracionEstadoCuenta = new ConfiguracionCargaBancoEntity(); 
        this.configuracionEstadoCuenta.CodigoBanco = codigoBanco; 
    }

    loadEstructuraCargaRespuestasBanco(){ 
        this.estadoCargaRespuestasService.getEstructuraCargaRespuestasBanco()
                .subscribe(
                    res => { 
                        this.estructuraCargaRespuestasBanco = res;
                    }, 
                    error => { 
                        this.authService.showErrorPopup(error); 
                    }
                );
    }

    guardarConfiguracion(){ 
        this.configuracionCargaRespuestasService.guardarConfiguracion(this.configuracionEstadoCuenta)
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

    
}
