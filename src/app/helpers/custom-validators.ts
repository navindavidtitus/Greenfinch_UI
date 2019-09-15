import { ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export class CustomValidators {
    static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return null;
            }

            const valid = regex.test(control.value);

            return valid ? null : error;
        };
    }

    static passwordsMatchValidator(control: AbstractControl) {
        const password: string = control.get('password').value; // get password from our password form control
        const confirmPassword: string = control.get('confirmPassword').value; // get password from our confirmPassword form control
        // compare is the password math
        if (password !== confirmPassword) {
            // if they don't match, set an error in our confirmPassword form control
            control.get('confirmPassword').setErrors({ passwordsNotEqual: true });
        }
    }

    static usernameValidator(authService: AuthService) {
        return (control: AbstractControl) => {
            return authService.checkUsernameAvailable(control.value)
                .pipe(
                    map(res => {
                        if (res) {
                            return null;
                        } else {
                            return { 'userNameExists': true };
                        }
                    })
                );
        }
    }
}
