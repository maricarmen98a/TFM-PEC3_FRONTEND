import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthDTO } from 'src/app/Models/auth.dto';
import { SharedService } from './shared.service';

export class User {
  name!: String;
  email!: String;
  password!: String;
  password_confirmation!: String;
}
export interface AuthToken {
  user_id: string;
  access_token: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getAccessToken() {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient,
    private sharedService: SharedService) {}
    register(user: User): Observable<any> {
      return this.http.post('http://127.0.0.1:8000/api/auth/register', user);
    }
 
    signin(user: User): Observable<any> {
      return this.http.post<any>('http://127.0.0.1:8000/api/auth/login', user);
    }
  profileUser() {
    return this.http.get('http://127.0.0.1:8000/api/auth/user-profile');
  }
  sendResetPasswordLink(data: any) {
    return this.http.post('http://127.0.0.1:8000/api/auth/reset-password-request', data)
  }
  resetPassword(data: any) {
    return this.http.post(
      'http://127.0.0.1:8000/api/auth/change-password',
      data
    );
  }
}
