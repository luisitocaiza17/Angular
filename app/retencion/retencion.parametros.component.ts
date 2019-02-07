import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratoEntityList } from '../common/model/contrato';
import { Beneficiario, Comentario, Retencion, RetencionKey, Servicio, ServiciosKey, FiltroMFiles, DescuentoCliente, ParametroRetencion, RespuestaParametroRetencion } from '../common/model/retencion';
import { RetencionService } from '../common/servicios/retencion.service';
import { AuthService } from '../seguridad/auth.service';
import { AdministracionSistemaService } from '../common/servicios/administracionSistema.service';
import { OnlyNumber} from '../retencion/only-number.directive';
import { RolAdmin } from '../common/model/admin';

@Component({
    providers: [AdministracionSistemaService],
    templateUrl: 'retencion.parametros.template.html'
})

export class RetencionParametrosComponent {
    parametros: ParametroRetencion[]
    nombreParametrosDefault: string[]
    catalagoTipoValor: string[]
    roles: RolAdmin[]
    parametroSeleccionado:number = 0
    resultadoParametro: RespuestaParametroRetencion

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private retencionService: RetencionService,
        private administracionSistemaService: AdministracionSistemaService, 
        private authService: AuthService
    ) {

        this.catalagoTipoValor = [
            "NUMERO",
            "TEXTO"
        ];

        this.nombreParametrosDefault = [
            "Rol1", "Param2", "Param3"
        ];

        //this.parametros = Array(3).fill(null).map((x, i) => this.testDesc(i));

        this.administracionSistemaService.GetRoles()
            .subscribe(result => {
                this.roles = result;         
            },
            error => this.authService.showErrorPopup(error));

        this.obtenerParametros();
    
        var data = authService.getPermisos();

    }

    obtenerParametros() : void{
        this.retencionService.obtenerParametros().subscribe(prm => {
            this.parametros = prm.map(x => {
                return x;
            });
        });   
      
    }

    changeCheckRangoAprobbacion(parametro){
        parametro.RangoAprobacion = !parametro.RangoAprobacion
        parametro.Nombre = undefined;
    }

    seleccionarParamaetro(parametro):void{
        this.parametroSeleccionado = parametro;
    }

    crearParamaetro():void{
        this.parametros.push(this.testDesc(0));
    }

    eliminarParametro(parametro):void{
        if(parametro.Id && parametro.Id > 0){
            this.retencionService
                .deleteParametro(parametro.Id)
                    .subscribe(result => {
                        if(result.Estado == "Ok"){
                            this.authService.showSuccessPopup(result.Mensaje);
                        } else {
                            this.authService.showErrorPopup(result.Mensaje);
                        }
                    },
                    error => this.authService.showErrorPopup(error));
        }
        const index = this.parametros.indexOf(parametro);
        this.parametros.splice(index, 1);
    }

    procesarParametro(parametro):void{
        if(parametro.Id == 0){
            this.retencionService
            .crearParametro(parametro)
                .subscribe(result => {
                    if(result.Estado){
                        this.authService.showSuccessPopup(result.Mensaje);
                    } else {
                        this.authService.showErrorPopup(result.Mensaje);
                    }
                    this.obtenerParametros();
                },
                error => this.authService.showErrorPopup(error));

        } else {
            this.retencionService
                .modificarParametro(parametro)
                    .subscribe(result => {
                        if(result.Estado){
                            this.authService.showSuccessPopup(result.Mensaje);
                        } else {
                            this.authService.showErrorPopup(result.Mensaje);
                        }
                        this.obtenerParametros();
                    },
                    error => this.authService.showErrorPopup(error));

        }
    }

    suma<T>(items: T[], f: (item: T) => number): number {
        return items.reduce((xs, x) => xs + f(x), 0);
    }

    testDesc(index: number): ParametroRetencion {
        return {
            Id: 0,
            Nombre: '',
            Valor: null,
            RangoAprobacion: false
        }
    }

    keys(obj) {
        return Object.keys(obj);
    }

    mostrarModal(selector: string) {
        $(selector).modal('show');
    }

    esconderModal(selector: string) {
        $(selector).modal('hide');
    }

    paddingHack() {
        setTimeout(() => document.body.style.paddingRight = '0px', 500);
    }

    enviar(){
        
    }



}
