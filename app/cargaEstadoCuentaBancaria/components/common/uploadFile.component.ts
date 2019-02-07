import { Component, Output, Input, forwardRef, EventEmitter } from "@angular/core";
import { UploadFileService } from "./uploadFile.service";
import { UploadFile } from "./model/uploadFile";
import { Validator, AbstractControl, FormControl, NG_VALIDATORS, ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { NgModel, NgForm, FormsModule } from '@angular/forms'; 
import { AuthService } from "../../../seguridad/auth.service";
import { SpinnerService } from "../../../utils/spinner.service";
import { ColumnaBdd } from "../../model/estadoCuentaBancaria.model";

@Component({
  selector: 'upload-file',
  providers: [UploadFileService, SpinnerService, AuthService, 
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => UploadFileComponent),
      multi: true,
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UploadFileComponent),
      multi: true,
    }
  ],
  templateUrl: 'uploadFile.component.html'

})

export class UploadFileComponent implements ControlValueAccessor, Validator {

  uploadFiles: UploadFile[] = [];
  fileToUpload: File = null;

  @Input()
  max: number = 0;

  @Input()
  min: number = 0;

  @Input() 
  codigoBanco: number = 0; 

  constructor(private uploadFileService: UploadFileService, private spinner: SpinnerService, public authService: AuthService) {
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
                this.cargarEstadoCuenta(); 
            }

        });
  }

  cargarEstadoCuenta(){
    this.uploadFileService.CargarEstadoDeCuenta(this.fileToUpload, this.codigoBanco)
          .subscribe(
            data => {              
              this.propagateChange(this.uploadFiles);
              this.spinner.stop();
              if(!data.includes('ERROR'))
                this.authService.showSuccessPopup('Estado de cuenta cargado correctamente');
              else
                this.authService.showErrorPopup(data.replace('ERROR:',''));
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