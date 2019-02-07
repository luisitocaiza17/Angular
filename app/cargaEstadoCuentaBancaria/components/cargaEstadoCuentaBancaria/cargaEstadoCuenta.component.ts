import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GenericosService } from "../../../common/servicios/genericos.service";
import { BancoEntity } from "../../../common/model/genericos";
import { AuthService } from "../../../seguridad/auth.service";
import { UploadFile } from "../common/model/uploadFile";

@Component({
    selector: 'cargaEstadoCuenta',
    providers: [],
    templateUrl: 'cargaEstadoCuenta.component.html'
})

export class cargaEstadoCuentaComponent implements OnInit
{
    public codigoBanco: number; 
    public bancos: BancoEntity[]; 

    inputFiles : UploadFile[];

    constructor(
        public genericosService: GenericosService, 
        public authService: AuthService
    ) { 

    }

    ngOnInit(){ 
        this.inputFiles = Array<UploadFile>();
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
}
