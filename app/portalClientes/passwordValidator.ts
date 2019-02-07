import {AbstractControl} from '@angular/forms';
export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
       let password = AC.get('nuevoPassword').value; // to get value in input tag
       let confirmPassword = AC.get('nuevoPasswordConfirmar').value; // to get value in input tag
        if(password != confirmPassword) {
            AC.get('nuevoPasswordConfirmar').setErrors( {MatchPassword: true} )
        } else {
            return null
        }
    }
}