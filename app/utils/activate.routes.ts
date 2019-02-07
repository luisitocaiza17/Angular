import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired, JwtHelper, AuthHttpError } from 'angular2-jwt';
import { AuthService } from '../seguridad/auth.service';

@Injectable()
export class ActivateRoutes implements CanActivate {

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        var token = localStorage.getItem('id_token');
        if (token != null) {
            var urlPath = state.url;
            if (route.params['id'] != undefined) {
                urlPath = urlPath.replace(route.params['id'], '');
            }
            if (this.authService.isAuthorize(urlPath)) {                
                return this.authService.isAuthorizeRequest(100);
            } else {
                this.router.navigate(['/unauthorized']);
                return false;
            }
        } else {
            // not token in so logout
            localStorage.clear();
            this.router.navigate(['/login']); // hay q dejar el redirect asi, pq aqui no w el window.location el logout
            return false;
        }
    }
}