import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { ContratoPCAComponent } from "./components/contratoPCA.component";


const ContratoPCARoutes: Routes = [
  {
		path: 'contratosPCA',
		children: [
			{ path: 'uploads', component: ContratoPCAComponent }
		]
	}
]

export const ContratoPCARouting: ModuleWithProviders = RouterModule.forChild(ContratoPCARoutes);