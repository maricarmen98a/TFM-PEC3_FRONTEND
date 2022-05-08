/* import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../shared/Services/auth.service';
import { AbstractControl, FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDTO } from 'src/app/Models/user.dto';
import { UserService } from 'src/app/shared/Services/user.service';
import { HeaderMenusService } from 'src/app/shared/Services/header-menus.service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { SharedService } from 'src/app/shared/Services/shared.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerUser: UserDTO;
  usuarioRepetido: boolean = false;
  contrasenasDiferentes: boolean = false;
  name: FormControl;
  password_confirmation: FormControl;
  email: FormControl;
  password: FormControl;

  registerForm: FormGroup;
  isValidForm: boolean | null;
  errors: any = null;
  validateForm: boolean = false;
  constructor(
    private userService: UserService,
    private headerMenusService: HeaderMenusService,
    private router: Router,
    public fb: FormBuilder,
    public authService: AuthService,
    private sharedService: SharedService
  ) {
    this.registerUser = new UserDTO('', '', '', '');

    this.isValidForm = null;

    this.name = new FormControl(this.registerUser.name, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);

    this.email = new FormControl(this.registerUser.email, [
      Validators.required,
      Validators.email]);

    this.password = new FormControl(this.registerUser.password, [
      Validators.required,
      Validators.minLength(8),
    ]);

    this.password_confirmation = new FormControl(this.registerUser.password_confirmation, [
      Validators.required,
      Validators.minLength(8),
    ]);

   this.registerForm = this.fb.group({
      name: this.name,
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
    }); 
  }
  ngOnInit() {}

  onSubmit() {}

  register(): void {
    let responseOK: boolean = false;
    this.isValidForm = false;
    let errorResponse: any;
    this.validateForm = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.registerUser = this.registerForm.value;

    this.authService
      .register(this.registerUser)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            'registerFeedback',
            responseOK,
            errorResponse
          );
          if (responseOK) {
            this.registerForm.reset();
            this.router.navigateByUrl('');
          }
        })
      )
      .subscribe(
        () => {
          responseOK = true;
        }
        ,(error: HttpErrorResponse) => {
          this.errors = error.error;
          if(error.error.email) {
            this.usuarioRepetido = true;
          } else if(error.error.password) {
            this.contrasenasDiferentes = true;
          }
          if(!error.error.password) {
            this.contrasenasDiferentes = false;
          } 
          if(!error.error.email) {
            this.usuarioRepetido = false;
          } 
          if(!error.error.password && !error.error.email ) {
            this.contrasenasDiferentes = false;
            this.usuarioRepetido = false;
          }
          const headerInfo: HeaderMenus = {
            showAuthSection: false,
            showNoAuthSection: true,
          };
          this.headerMenusService.headerManagement.next(headerInfo);
          this.sharedService.errorLog(errorResponse);
        }
      );
  }

}
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/shared/Services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  registerForm: FormGroup;
  errors: any = null;
  constructor(
    public router: Router,
    public fb: FormBuilder,
    public authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: [''],
      email: [''],
      password: [''],
      password_confirmation: [''],
    });
  }
  ngOnInit() {}
  onSubmit() {
    this.authService.register(this.registerForm.value).subscribe(
      (result: any) => {
        console.log(result);
      },
      (error: any) => {
        this.errors = error.error;
      },
      () => {
        this.registerForm.reset();
        this.router.navigate(['login']);
      }
    );
  }

}