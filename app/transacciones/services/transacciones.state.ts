import { Injectable } from "@angular/core";
import { ContratoKey } from "../../common/model/contrato";

@Injectable()
export class TransaccionesState {

    private Motivo: string;
    private ComentarioMotivo: string;
    private KeepContrato: ContratoKey;

    public setMotivo(motivo: string): void {
        this.Motivo = motivo;
    }

    public setComentarioMotivo(comentarioMotivo: string): void {
        this.ComentarioMotivo = comentarioMotivo;
    }

    public setContratoKey(keepContrato: ContratoKey): void {
        this.KeepContrato = keepContrato;
    }

    public getMotivo(): string {
        return this.Motivo;
    }

    public getComentarioMotivo(): string {
        return this.ComentarioMotivo;
    }

    public getContratoKey(): ContratoKey {
        return this.KeepContrato;
    }
}