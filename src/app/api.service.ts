import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';

@Injectable()
export class ApiService {

  private apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient,
              private router: Router) {
  }

  post(path: string, data?: any) {
    return new Promise((resolve, reject) => {
      if (data == null) {
        data = '{}';
      }
      this.http.post(this.apiUrl + 'api/v1/' + path, data)
        .pipe(map(res => res))
        .subscribe(
          (result) => resolve(result),
          (error: Response) => {
            if (error.status === 401) {
              this.router.navigateByUrl('/login');
            }
            reject(error);
          }
        );
    });
  }

  get(path: string, data?: any) {
    return new Promise((resolve, reject) => {
      if (data == null) {
        data = '{}';
      }
      this.http.get(this.apiUrl + '/api/v1/' + path, data)
        .pipe(map(res => res))
        .subscribe(
          (result) => resolve(result),
          (error: Response) => {
            if (error.status === 401) {
              this.router.navigateByUrl('/login');
            }
            reject(error);
          }
        );
    });
  }

}
