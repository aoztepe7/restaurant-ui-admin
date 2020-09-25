import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../auth.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {
    'mail': '',
    'password': ''
  };
  authError = false;

  response = {};
  constructor(private router: Router,
              private authService: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.authService.logout();
    this.authService.auth(this.form.mail, this.form.password).then((res: any) => {
      if (res.code === 100 && res.role === 'ROLE_ADMIN') {
        this.authService._loginAction(res);
      } else {
        this.authError = true;
      }
    }).catch((err1: HttpErrorResponse) => {
      this.authError = true;
    });
  }

}
