import { Component, ElementRef } from '@angular/core';

import { AuthService } from '../../../seguridad/auth.service';
import { PagoService } from '../../../common/servicios/pago.service';
import { TareasProgramadasFacturacionService } from '../../service/tareasProgramadasFacturacion.service';



import { EmitirNotaEntity } from '../../../common/model/pago';
import { Catalogo } from '../../../common/model/catalogo';
import { UploadFile } from '../../common/model/uploadFile';
import { SpinnerService } from '../../../utils/spinner.service';
import { FormControl } from '../../../../../node_modules/@angular/forms';
import { DatosTransaccion } from '../../../common/model/transacciones';

@Component({
    selector: 'notasCreditoMasivas',
    providers: [PagoService, SpinnerService, TareasProgramadasFacturacionService],
    templateUrl: 'notasCreditoMasivas.form.template.html'
})

export class NotasCreditoMasivasFormComponent {

    desabilitar: boolean;
    motivosNotaCredito: Catalogo[];
    motivosSalud: Catalogo[];
    filterEmitir: EmitirNotaEntity;
    max: number;
    min: number = 0;
    uploadFiles: UploadFile[] = [];
    fileToUpload: File = null;



    constructor(private elementRef: ElementRef, private authService: AuthService,
        public pagoService: PagoService, private spinner: SpinnerService, public tareasProgramadasFacturacionService: TareasProgramadasFacturacionService) {

        this.desabilitar = false;
        this.motivosNotaCredito = [];
        this.motivosSalud = [];

        this.filterEmitir = new EmitirNotaEntity();
        this.filterEmitir.ValorAcreditado = 0;
        this.max = 0;

        this.getMotivosNotaCredito();
    }

    // the method set in registerOnChange, it is just 
    // a placeholder for a method that takes one parameter, 
    // we use it to emit changes back to the form
    private propagateChange = (_: any) => { };
    // this is the initial value set to the component
    public writeValue(obj: any) {
        if (obj) {
            this.uploadFiles = obj;
        }
    }
    // registers 'fn' that will be fired when changes are made
    // this is how we emit the changes back to the form
    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }
    // not used, used for touch input
    public registerOnTouched() { }


    validate(c: FormControl): { [key: string]: any; } {
        if (this.min == 0) {
            return null;
        }

        if (this.uploadFiles.length >= this.min) {
            return null;
        }

        return {
            validateMin: false
        }
    }

    handleFileInput(files: FileList) {
        this.fileToUpload = null;
        this.fileToUpload = files.item(0);
    }


    getMotivosNotaCredito(): void {
        this.pagoService.obtenerMotivosNotaCredito()
            .subscribe(result => {
                this.motivosNotaCredito = result;
                this.getMotivosSalud();

            },
                error => this.authService.showErrorPopup(error));
    }


    getMotivosSalud(): void {
        this.pagoService.obtenerMotivosSalud()
            .subscribe(result => {
                this.motivosSalud = result;
            },
                error => this.authService.showErrorPopup(error));
    }

    haveMaxFiles(): boolean {
        if (this.max == 0) {
            return false;
        }
        if (this.uploadFiles.length >= this.max) {
            return true;
        }
        return false;
    }

    emitir() {
        /*
        var resultado = new DatosTransaccion;
        this.tareasProgramadasFacturacionService.emitirNotasCreditoMasivas(this.fileToUpload, this.filterEmitir)
            .subscribe(result => {
                resultado = result;
                if (resultado.EstadoTransaccion) {
                    this.authService.showSuccessPopup(resultado.Mensaje);
                }
                else {
                    this.authService.showErrorPopup(resultado.Mensaje);
                }
            },
                error => this.authService.showErrorPopup(error));
                */
    }

}

