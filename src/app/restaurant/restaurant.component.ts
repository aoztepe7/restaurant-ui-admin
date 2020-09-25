import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {ApiService} from '../api.service';
import {RestaurantList} from './model/Restaurant';
import {HttpErrorResponse} from '@angular/common/http';
import {User} from '../user/model/User';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {

  reviewForm: any = {
    'id': '',
    'userId': '',
    'restaurantId': '',
    'visitDate': '',
    'comment': '',
    'rate': ''
  };

  answerForm: any = {
    'id': '',
    'ownerAnswer': '',
    'restaurantId': '',
    'reviewId': ''
  };

  restaurantForm: any = {
    'userId': '',
    'name': '',
    'ownerName': '',
    'rate': 0,
  };

  alert: any = {
    'type': 'danger',
    'message': ''
  };

  success: any = {
    'type': 'success',
    'message': ''
  };

  public restaurantList;
  public restaurantPage = 0;
  public reviewPage = 0;
  public apiRequest = {};
  public restaurantName;
  public selectedRestaurantId;
  public reviewList;
  public userList;
  public standardUserList;

  modalRef: BsModalRef;

  constructor(private api: ApiService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.getRestaurants(this.restaurantPage);
    this.getOwners(0);
    this.getStandardUsers(0);
  }

  getRestaurants(page: any) {
    this.api.post('restaurant/list-restaurant', this.apiRequest = {page: page , isOwner : false})
      .then((item: RestaurantList) => this.restaurantList = item.restaurants);
  }

  getOwners(page: any) {
    this.api.post('user/list', this.apiRequest = {page: page , role : 'OWNER'})
      .then((item: any) => this.userList = item.users);
  }

  getStandardUsers(page: any) {
    this.api.post('user/list', this.apiRequest = {page: page , role : 'USER'})
      .then((item: any) => this.standardUserList = item.users);
  }

  prevPage() {
    this.restaurantPage -= 1;
    this.getRestaurants(this.restaurantPage);
  }

  nextPage() {
    this.restaurantPage += 1;
    this.getRestaurants(this.restaurantPage);
  }

  editRestaurant(template: TemplateRef<any>, id) {
    this.api.post('restaurant/detail-restaurant', this.apiRequest = {id: id}).then((res: any) => {
      if (res.code === 100) {
        this.restaurantForm = {
          id : res.restaurant.id,
          name : res.restaurant.name,
          owner: res.restaurant.owner.fullName + ' ' + res.restaurant.owner.lastName,
          rate: res.restaurant.rate,
          userId: res.restaurant.owner.id
        };
        this.getModal(template);
      } else {
        console.log(res.message);
      }
    }).catch((error: HttpErrorResponse) => {
      console.log(error.error);
    });
  }

  saveRestaurant() {
    const opt = this.isEmpty(this.restaurantForm.id) === true  ? 'create' : 'update';
    this.api.post('restaurant/' + opt + '-restaurant',
      this.restaurantForm
    ).then((res: any) => {
      if (res.code === 100) {
        this.getRestaurants(this.restaurantPage);
        this.modalService.hide(1);
      } else {
        this.alert.message = res.message;
      }
    }).catch((error: HttpErrorResponse) => {
      this.alert.message = error.error.message;
    });
  }

  isEmpty(str) {
    return (!str || 0 === str.length);
  }


  openModal(template: TemplateRef<any>) {
    this.restaurantForm = {};
    this.alert.message = '';
    this.getModal(template);
  }

  private getModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  FadeOutLink() {
    setTimeout( () => {
      this.success.message = '';
      this.alert.message = '';
    }, 2000);
  }

  getReviews(page: any) {
    this.api.post('review/list', this.apiRequest = {page: page , restaurantId : this.selectedRestaurantId})
      .then((item: any) => this.reviewList = item.reviews);
  }

  prevPageReview() {
    this.reviewPage -= 1;
    this.getReviews(this.reviewPage);
  }

  nextPageReview() {
    this.reviewPage += 1;
    this.getReviews(this.reviewPage);
  }

  showAnswer(template: TemplateRef<any>, id) {
    this.api.post('answer/detail', this.apiRequest = {reviewId: id}).then((res: any) => {
      if (res.code === 100) {
        this.answerForm = {
          id: res.answer.id,
          ownerAnswer: res.answer.ownerAnswer
        };
        this.getModal(template);
      } else {
        console.log(res.message);
      }
    }).catch((error: HttpErrorResponse) => {
      console.log(error.error);
    });
  }

  openReviewPage(template: TemplateRef<any>, id , name) {
    this.restaurantName = name;
    this.selectedRestaurantId = id;
    this.getReviews(0);
    this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
  }

  saveAnswer() {
    this.api.post('answer/update',
      this.answerForm
    ).then((res: any) => {
      if (res.code === 100) {
        this.modalService.hide(2);
      } else {
        this.alert.message = res.message;
      }
    }).catch((error: HttpErrorResponse) => {
      this.alert.message = error.error.message;
    });
  }

  deleteAnswer(id) {
    this.api.post('answer/delete', this.apiRequest = {id: id}).then((res: any) => {
      if (res.code === 100) {
        this.getReviews(0);
        this.modalService.hide(2);
      } else {
        console.log(res.message);
      }
    }).catch((error: HttpErrorResponse) => {
      console.log(error.error);
    });
  }

  deleteRestaurant(id) {
    this.api.post('restaurant/delete-restaurant', this.apiRequest = {id: id}).then((res: any) => {
      if (res.code === 100) {
        this.getRestaurants(this.restaurantPage);
      } else {
        console.log(res.message);
      }
    }).catch((error: HttpErrorResponse) => {
      console.log(error.error);
    });
  }

  editReview(template: TemplateRef<any>, id) {
    this.api.post('review/detail', this.apiRequest = {id: id}).then((res: any) => {
      if (res.code === 100) {
        this.reviewForm = {
          id : res.review.id,
          userId : res.review.user.id,
          restaurantId : res.review.restaurant.id,
          visitDate: res.review.visitDate,
          comment: res.review.comment,
          rate: res.review.rate,
        };
        this.getModal(template);
      } else {
        console.log(res.message);
      }
    }).catch((error: HttpErrorResponse) => {
      console.log(error.error);
    });
  }

  saveReview() {
    this.api.post('review/update',
      this.reviewForm
    ).then((res: any) => {
      if (res.code === 100) {
        this.getReviews(this.reviewPage);
        this.getRestaurants(this.restaurantPage);
        this.modalService.hide(2);
      } else {
        this.alert.message = res.message;
      }
    }).catch((error: HttpErrorResponse) => {
      this.alert.message = error.error.message;
    });
  }


}


