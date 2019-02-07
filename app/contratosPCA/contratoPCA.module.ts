import { NgModule } from "@angular/core";
import { ContratoPCAComponent } from "./components/contratoPCA.component";
import { CommonModule } from "../facturacion/common/common.module";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ContratoPCAService } from "./services/contratoPCA.services";
import { ContratoPCARouting } from "./contratoPCA.routing";

@NgModule({
	declarations: [ ContratoPCAComponent ],
	exports: [ ContratoPCAComponent ],
	imports: [ CommonModule, BrowserModule, FormsModule, RouterModule, ContratoPCARouting ],
	providers: [ ContratoPCAService ]
})

export class ContratoPCAModule { }