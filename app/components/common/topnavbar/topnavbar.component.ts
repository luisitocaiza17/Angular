import { Component, Compiler } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
import { correctHeight } from '../../../app.helpers';
import { AuthService } from '../../../seguridad/auth.service';

@Component({
    selector: 'topnavbar',
    templateUrl: 'topnavbar.template.html'
})
export class TopnavbarComponent {

    constructor(public authService: AuthService, private compiler: Compiler) {
    }

    toggleNavigation(): void {
        jQuery("body").toggleClass("mini-navbar");
        smoothlyMenu();
    }

    ngAfterViewInit() {
        jQuery('.goHome').click(() => {
            setTimeout(() => {
                correctHeight();
            }, 300)
        });
    }

    logout(): void {
        localStorage.clear();
        this.compiler.clearCache();
    }
}
