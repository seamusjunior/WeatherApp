import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
}) 
export class AuthService {
  baseUrl = 'https://weatherapp-api.azurewebsites.net/api' + '/auth/';
  jwtHelper = new JwtHelperService();
  decodedToken: any;
  currentUser: any;
  photoUrl = new BehaviorSubject<string>('../../assets/user.png');
  currentPhotUrl = this.photoUrl.asObservable();

  constructor(
    private http: HttpClient) { }

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          console.log(user);
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      }
      ));
  }
  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
  logOut() {
    localStorage.removeItem('token');
    console.log('Token out');
  }
  get token(){
    return localStorage.getItem('token');
  }
}
