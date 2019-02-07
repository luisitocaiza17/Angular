import { NgModule } from "@angular/core";
import { UploadFileComponent } from "./uploadFile.component";
import { UploadFileService } from "./uploadFile.service";
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports:      [ BrowserModule, ReactiveFormsModule, FormsModule],
  declarations: [ UploadFileComponent],
  providers: [ UploadFileService],
  exports: [UploadFileComponent],
})
export class CommonModule { }