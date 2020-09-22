export class Restaurant {
  constructor(public uuid: string,
              public name: string,
              public owner: string,
              public rate: number) {
  }
}

export class RestaurantList {
  constructor(public code: number,
              public message: string,
              public restaurants: Pagination) {
  }
}

export class Pagination {
  constructor(public content: Array<Restaurant>,
              public first: boolean,
              public last: boolean,
              public number: number,
              public numberOfElements: number,
              public totalElements: number,
              public totalPages: number) {
  }
}
