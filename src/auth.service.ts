import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

import {environment} from './environments/environment';
import {TokenResponse} from './app/login/model/TokenResponse';

@Injectable()
export class AuthService {

  private apiUrl: String = environment.apiUrl;


  constructor(private http: HttpClient,
              private router: Router) {
  }


  auth(mail: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'login', {mail: mail, password: password})
        .pipe(map(res => res))
        .subscribe(
          (result) => resolve(result),
          (error) => reject(error)
        );
    });
  }

  register(form: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl + 'register', form)
        .pipe(map(res => res))
        .subscribe(
          (result) => resolve(result),
          (error) => reject(error)
        );
    });
  }

  _loginAction(result: TokenResponse) {
    if (result && result.token) {
      localStorage.setItem('token', result.token);
      window.location.href = '/';
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

}
