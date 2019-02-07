import { Injectable } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable()
export class ConstantesCorporativo {
    TIPO_AMBULATORIO: String;
    TIPO_HOSPITALARIO: String;
    TIPO_AMBOS: String;
    ESTADO_TRUE :boolean;
    ESTADO_FALSE :boolean;

    APLICAREDCONVENIO:boolean;
    APLICAREDPRIVADA:boolean;
    APLICAOTROS:boolean;
    
    constructor() {
        this.TIPO_AMBULATORIO="Ambulatorio";
        this.TIPO_HOSPITALARIO="Hospitalario";
        this.TIPO_AMBOS="Ambos";
        this.ESTADO_TRUE = true;
        this.ESTADO_FALSE = false;

    }
}