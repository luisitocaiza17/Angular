import { Component, Output, Input, forwardRef } from "@angular/core";
import { SpinnerService } from "../../utils/spinner.service";
import { UploadFileService } from "./uploadFile.service";
import { UploadFileBancoService } from "../../recaudos/common/uploadFileBanco.service";
import { UploadFile } from "./model/uploadFile";
import { Validator, AbstractControl, FormControl, NG_VALIDATORS, ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { AuthService } from "../../seguridad/auth.service";
import { NgModel, NgForm, FormsModule } from '@angular/forms'; 

@Component({
  selector: 'upload-file',
  providers: [UploadFileBancoService, UploadFileService, SpinnerService, AuthService, 
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
  nombreArchivoSalida: string;
  pathArchivoSalida: string; 

  @Input()
  max: number = 0;

  @Input()
  min: number = 0;

  @Input()
  proceso: string = '';

  @Input()
  conArchivoSalida: boolean = false;

  @Input()
  codigoBanco: number;

  constructor(private uploadFileService: UploadFileService, private uploadFileServiceBanco: UploadFileBancoService, private spinner: SpinnerService, public authService: AuthService) {
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

  uploadFileToActivity() {
    this.spinner.start();

    if(this.proceso == 'SALUDPAY' || this.proceso == "CAJAPICH")
      this.cargarArchivoPichincha();

    if(this.proceso == 'cargaFacturacion')
       this.cargarArchivoFacturacion();
    
    if(this.proceso == 'RESPUESTASBANCO')
      this.cargarRespuestasBanco();   
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
                this.uploadFileToActivity();
            }

        });
  }

  cargarArchivoPichincha(){ 
    this.uploadFileService.cargarArchivoPichincha(this.fileToUpload, this.nombreArchivoSalida, this.proceso).subscribe(res => {
      this.propagateChange(this.uploadFiles);
      this.spinner.stop();

      if(res.MensajeRespuesta.includes('ERROR:'))
          this.authService.showErrorPopup(res.MensajeRespuesta.replace('ERROR:',''));
      else
      {
        this.authService.showSuccessPopup('<h4> Total Registros: ' + res.TotalRegistros + '</h4><br><h4> Valor total: ' + res.MontoTotal + '</h4>' );
        this.descargarCsvRespuestaCargaArchivoCobros(); 
      }  
    }, error => {
      this.authService.showErrorPopup(error);
    });
  }
  
  cargarRespuestasBanco(){
    this.uploadFileServiceBanco.cargarRespuestasBanco(this.fileToUpload, this.nombreArchivoSalida, this.proceso, this.codigoBanco).subscribe(res => {
      this.propagateChange(this.uploadFiles);
      this.spinner.stop();

      if(res.MensajeRespuesta.includes('ERROR:'))
          this.authService.showErrorPopup(res.MensajeRespuesta.replace('ERROR:',''));
      else
      {
        this.authService.showSuccessPopup('<h4> Total Registros: ' + res.TotalRegistros + '</h4><br><h4> Valor total: ' + res.MontoTotal + '</h4>' );
        this.descargarCsvRespuestaCargaArchivoCobros(); 
      }  
    }, error => {
      this.authService.showErrorPopup(error);
    });
  }

  descargarCsvRespuestaCargaArchivoCobros(){
    this.uploadFileService.descargarCsvRespuestaCargaArchivoCobros(this.nombreArchivoSalida)
          .subscribe(
            result => {
              var blob: Blob = null;
              blob = new Blob([result._body], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              if (blob != null) {
                  var fileName = result.headers._headers.get("file-name")[0];
                  var url = window.URL.createObjectURL(blob);
                  var link = document.createElement('a');
                  document.body.appendChild(link);
                  link.href = url;
                  link.download = fileName;
                  link.click();
              }
          },
          error => this.authService.showBlobErrorPopup(error)
        )
  }

  cargarArchivoFacturacion(){
    this.uploadFileService.postFile(this.fileToUpload, this.authService.nombreUsuario).subscribe(data => {
      this.uploadFiles.push(data);
      this.authService.showInfoPopup(data);
      this.propagateChange(this.uploadFiles);
      this.fileToUpload = null;
      this.spinner.stop();
    }, error => {
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