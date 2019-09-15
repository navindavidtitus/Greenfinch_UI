import { CustomValidators } from './../../helpers/custom-validators';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  loading = false;
  submitted = false;
  registerForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService, private toastr: ToastrService
  ) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: [null, Validators.compose([Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]{2,}')])],
      username: [null, Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9\'\-]+$')]), CustomValidators.usernameValidator(this.authService)],
      password: [
        null,
        Validators.compose([
          Validators.required,
          CustomValidators.patternValidator(/\d/, {
            hasNumber: true
          }),
          CustomValidators.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          CustomValidators.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          Validators.minLength(8)
        ])
      ],
      confirmPassword: [null, Validators.compose([Validators.required])]
    },
      {
        validator: CustomValidators.passwordsMatchValidator
      });
  }

  get f() { return this.registerForm.controls; }

  signUp() {

    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.loading = true;
    const signUpDetails = { name: this.registerForm.value.name, username: this.registerForm.value.username, password: this.registerForm.value.password }
    // console.log(signUpDetails);
    this.authService.register(signUpDetails)
      .pipe(first())
      .subscribe(
        data => {
          this.toastr.success("You have signedup successfully")
          this.loading = false;
          this.registerForm.reset();
        },
        error => {
          this.toastr.error("An error occurred during Sign-up")
          this.loading = false;
        });
  }

}
