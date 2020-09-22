export class TokenResponse {
  constructor(public code: number,
              public message: string,
              public token: string,
              public role: string) {
  }
}
