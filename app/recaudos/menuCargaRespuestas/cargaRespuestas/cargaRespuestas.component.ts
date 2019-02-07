import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GenericosService } from "../../../common/servicios/genericos.service";
import { BancoEntity } from "../../../common/model/genericos";
import { AuthService } from "../../../seguridad/auth.service";
import { UploadFile } from "../../../facturacion/common/model/uploadFile";
import { BehaviorSubject, Observable } from "rxjs";

@Component({
    selector: 'cargaRespuestas',
    providers: [],
    templateUrl: 'cargaRespuestas.component.html'
})

export class cargaRespuestasComponent implements OnInit
{
    public codigoBanco: number; 
    public bancos: BancoEntity[]; 

    inputFiles : UploadFile[];

    constructor(
        public genericosService: GenericosService, 
        public authService: AuthService
    ) { 
        this.inputFiles = Array<UploadFile>();
    }

    ngOnInit(){       
        this.loadBancos(); 
    }

    loadBancos(){ 
        this.genericosService.cargarBancosUsados()
            .subscribe(
                res => { 
                    this.bancos = res;
                    this.codigoBanco = this.bancos[0].CodigoBanco; 
                }, 
                error => {
                    this.authService.showErrorPopup(error); 
                }
        )
    }

    cargarObjeto() {
        var banco = new BancoEntity();
        banco.CodigoBanco = this.codigoBanco;
      }
}
