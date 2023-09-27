/* eslint-disable no-underscore-dangle */
export class User {
  constructor(
    public id: number,
    public email: string,
    public phoneCode: string,
    public phoneRegion: string,
    public phoneNumber: string,
    public username: string,
    public firstName: string,
    public lastName: string,
    public _token: string,
    public tokenExpirationDate: Date
  ) {}
  get token() {
    if (!this.tokenExpirationDate || this.tokenExpirationDate <= new Date()) {
      return null;
    }
    return this._token;
  }
}
