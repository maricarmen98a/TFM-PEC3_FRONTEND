/* import { Component, OnInit } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';
import { AuthService, AuthToken } from '../../../shared/Services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { TokenService } from '../../../shared/Services/token.service';
import { AuthStateService } from '../../../shared/Services/auth-state.service';
import { trigger, animate, state, style, transition } from '@angular/animations';
import { AuthDTO } from 'src/app/Models/auth.dto';
import { LocalStorageService } from 'src/app/shared/Services/local-storage.service';
import { HeaderMenusService } from 'src/app/shared/Services/header-menus.service';
import { finalize } from 'rxjs';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { SharedService } from 'src/app/shared/Services/shared.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0.2,
        })
      ),
      transition('void <=> *', animate(1500)),
    ]),
  ],
})
export class SigninComponent implements OnInit {
  loginUser: AuthDTO;
  email: FormControl;
  password: FormControl;
  loginForm: FormGroup;
  errors:any = null;
  constructor(
    public router: Router,
    public fb: FormBuilder,
    public authService: AuthService,
    private token: TokenService,
    private authState: AuthStateService,
    private formBuilder: FormBuilder,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private sharedService: SharedService
  ) {
    this.loginUser = new AuthDTO('', '', '', '');

    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }
  ngOnInit() {}
  
  login(): void {
    let responseOK: boolean = false;
    let errorResponse: any;

    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;

    this.authService
      .signin(this.loginUser)
      .pipe(
        finalize(async () => {
          await this.sharedService.managementToast(
            'loginFeedback',
            responseOK,
            errorResponse
          );
          if (responseOK) {
            const headerInfo: HeaderMenus = {
              showAuthSection: true,
              showNoAuthSection: false,
            };
            console.log('Usuario correcto');
            this.headerMenusService.headerManagement.next(headerInfo);
            this.router.navigateByUrl('profile');
          }
        })
      )
      .subscribe(
        (resp: AuthToken) => {
          responseOK = true;
          this.loginUser.user_id = resp.user_id;
          this.loginUser.access_token = resp.access_token;

          this.localStorageService.set('user_id', this.loginUser.user_id);
          this.localStorageService.set(
            'access_token',
            this.loginUser.access_token
          );

        },
        (error: HttpErrorResponse) => {
          responseOK = false;
          errorResponse = error.error;
          const headerInfo: HeaderMenus = {
            showAuthSection: false,
            showNoAuthSection: true,
          };
          this.errors = error.error;
          this.headerMenusService.headerManagement.next(headerInfo);
          this.sharedService.errorLog(error.error);

        }
      );
  }
} */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/shared/Services/auth.service';
import { AuthStateService } from 'src/app/shared/Services/auth-state.service';
import { TokenService } from 'src/app/shared/Services/token.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  loginForm: FormGroup;
  errors:any = null;
  constructor(
    public router: Router,
    public fb: FormBuilder,
    public authService: AuthService,
    private token: TokenService,
    private authState: AuthStateService
  ) {
    this.loginForm = this.fb.group({
      email: [],
      password: [],
    });
  }
  ngOnInit() {}
  onSubmit() {
    this.authService.signin(this.loginForm.value).subscribe(
      (result) => {
        this.responseHandler(result);
      },
      (error) => {
        this.errors = error.error;
      },
      () => {
        this.authState.setAuthState(true);
        this.loginForm.reset();
        this.router.navigate(['profile']);
      }
    );
  }
  // Handle response
  responseHandler(data:any) {
    this.token.handleData(data.access_token);
  }

}