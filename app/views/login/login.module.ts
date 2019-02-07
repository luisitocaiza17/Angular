import { NgModule } from "@angular/core";
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { loginComponent } from "./login.component";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';

@NgModule({
    declarations: [loginComponent],
    imports: [BrowserModule, HttpModule, ReactiveFormsModule, FormsModule, CustomFormsModule]
})

export class LoginModule { }