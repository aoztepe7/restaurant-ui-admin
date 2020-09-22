import {Restaurant} from './Restaurant';

export class Review {
  constructor(public uuid: string,
              public restaurant: Restaurant,
              public visitDate: string,
              public answerRequired: boolean,
              public comment: string) {
  }
}

export class ReviewList {
  constructor(public code: number,
              public message: string,
              public reviews: Pagination) {
  }
}

export class Pagination {
  constructor(public content: Array<Review>,
              public first: boolean,
              public last: boolean,
              public number: number,
              public numberOfElements: number,
              public totalElements: number,
              public totalPages: number) {
  }
}
