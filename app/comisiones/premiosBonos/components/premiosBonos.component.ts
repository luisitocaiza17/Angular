import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
	providers: [],
	templateUrl: 'premiosBonos.template.html'
})
export class PremiosBonosComponent implements OnInit {
	
	constructor(public route: ActivatedRoute, public router: Router) { }

	ngOnInit(): void {
		this.router.navigate(['indicadores'],{relativeTo: this.route});
	}
}