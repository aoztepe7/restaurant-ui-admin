export class User {
  constructor(public uuid: string,
              public firstName: string,
              public lastName: string,
              public mail: string,
              public role: string) {
  }
}

export class UserList {
  constructor(public code: number,
              public message: string,
              public users: Pagination) {
  }
}

export class Pagination {
  constructor(public content: Array<User>,
              public first: boolean,
              public last: boolean,
              public number: number,
              public numberOfElements: number,
              public totalElements: number,
              public totalPages: number) {
  }
}
