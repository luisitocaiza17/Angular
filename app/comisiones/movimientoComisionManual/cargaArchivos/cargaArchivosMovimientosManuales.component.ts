import { Component, Output, Input, forwardRef, EventEmitter } from "@angular/core";
import { Validator, FormControl, NG_VALIDATORS, ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { AuthService } from "../../../seguridad/auth.service";
import { SpinnerService } from "../../../utils/spinner.service";
import { UploadFile } from "../../../common/model/uploadFile";
import { CargaArchivosMovimientosManualesService } from "./cargaArchivosMovimientosManuales.service";

@Component({
  selector: 'carga-archivos-movimientos-manuales',
  providers: [CargaArchivosMovimientosManualesService, SpinnerService, AuthService, 
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CargaArchivosMovimientosManualesComponent),
      multi: true,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CargaArchivosMovimientosManualesComponent),
      multi: true,
    }
  ],
  templateUrl: 'cargaArchivosMovimientosManuales.component.html'

})

export class CargaArchivosMovimientosManualesComponent implements ControlValueAccessor, Validator {

  uploadFiles: UploadFile[] = [];
  fileToUpload: File = null;

  @Input()
  max: number = 0;

  @Input()
  min: number = 0;

  constructor(private cargaArchivosService: CargaArchivosMovimientosManualesService, private spinner: SpinnerService, public authService: AuthService) {
  }

  private propagateChange = (_: any) => { };
  public writeValue(obj: any) {
    if (obj) {
      this.uploadFiles = obj;
    }
  }

  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

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

  confirmarUploadFileToActivity(): void {
    swal({
        title: "",
        text: "<h3>" + ' Esta Seguro que desea ejecutar esta acción ' + "</h3>",
        html: true,
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#1a7bb9",
        confirmButtonText: "SI",
        cancelButtonText: "NO",
        closeOnConfirm: true,

    },
        confirmed => {
            if (confirmed) {
                this.CargarLoteMovimientosManuales(); 
            }

        });
  }

  CargarLoteMovimientosManuales(){
    let usuarioAutenticado: string; 
    usuarioAutenticado = this.authService.getDatosUsuarioAutenticado().NombreUsuario;

    this.cargaArchivosService.CargaLoteMovimientosManuales(this.fileToUpload, usuarioAutenticado)
          .subscribe(
            data => {              
              this.propagateChange(this.uploadFiles);
              this.spinner.stop();
              this.authService.showSuccessPopup(data);
              // if(!data.includes('ERROR'))
              //   this.authService.showSuccessPopup('Movimientos cargados correctamente');
              // else
              //   this.authService.showErrorPopup(data.replace('ERROR:',''));
            }, 
          error => {
            this.authService.showErrorPopup(error);
          });
  }  

  deleteFile(f): void {
    this.uploadFiles = this.uploadFiles.filter(obj => obj != f);
    this.propagateChange(this.uploadFiles);
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
}