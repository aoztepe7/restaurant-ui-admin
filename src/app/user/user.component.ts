import {Component, OnInit, TemplateRef} from '@angular/core';
import {ApiService} from '../api.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {User, UserList} from './model/User';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userForm: any = {
    'id': '',
    'firstName': '',
    'lastName': '',
    'mail': '',
    'role': ''
  };

  alert: any = {
    'type': 'danger',
    'message': ''
  };

  success: any = {
    'type': 'success',
    'message': ''
  };

  public userList;
  public userPage = 0;
  public apiRequest = {};
  modalRef: BsModalRef;

  constructor(private api: ApiService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.getUsers(this.userPage);
  }

  getUsers(page: any) {
    this.api.post('user/list', this.apiRequest = {page: page})
      .then((item: UserList) => this.userList = item.users);
  }

  editUser(template: TemplateRef<any>, id) {
    this.api.post('user/detail-user', this.apiRequest = {id: id}).then((res: any) => {
      if (res.code === 100) {
        this.userForm = {
          id : res.user.id,
          firstName : res.user.firstName,
          lastName: res.user.lastName,
          mail: res.user.mail,
          role: res.user.role
        };
        this.getModal(template);
      } else {
        console.log(res.message);
      }
    }).catch((error: HttpErrorResponse) => {
      console.log(error.error);
    });
  }

  prevPage() {
    this.userPage -= 1;
    this.getUsers(this.userPage);
  }

  nextPage() {
    this.userPage += 1;
    this.getUsers(this.userPage);
  }

  isEmpty(str) {
    return (!str || 0 === str.length);
  }

  FadeOutLink() {
    setTimeout( () => {
      this.success.message = '';
      this.alert.message = '';
    }, 2000);
  }

  openModal(template: TemplateRef<any>) {
    this.userForm = {};
    this.alert.message = '';
    this.getModal(template);
  }

  private getModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  saveUser() {
    this.api.post('user/update-user',
      this.userForm
    ).then((res: any) => {
      if (res.code === 100) {
        this.getUsers(this.userPage);
        this.modalService.hide(1);
      } else {
        this.alert.message = res.message;
      }
    }).catch((error: HttpErrorResponse) => {
      this.alert.message = error.error.message;
    });
  }

  deleteUser(id) {
    this.api.post('user/delete-user', this.apiRequest = {id: id}).then((res: any) => {
      if (res.code === 100) {
        this.getUsers(0);
      } else {
        console.log(res.message);
      }
    }).catch((error: HttpErrorResponse) => {
      console.log(error.error);
    });
  }



}
