import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable }     from 'rxjs/observable';
import { User } from './users/user';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

  private base_url = 'http://127.0.0.1:3000/api/user';
  token: string;
  private userSource = new Subject<User>();
  user$ = this.userSource.asObservable();

  constructor(public http: Http) { }

  setUser(user: User) {
    console.log('inside setUser');
    this.userSource.next(user);
  }

  registerUser(user: User): Observable<boolean> {
    let body = JSON.stringify(user);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${this.base_url}/register`, body, options).map( (res) => this.setToken(res) );
  }

  loginUser(user): Observable<Object> {
    let body = JSON.stringify(user);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });

    return this.http.post(`${this.base_url}/login`, body, options).map( (res) => this.setToken(res) );
  }

  logout() {
    this.token = null;
    localStorage.removeItem('currentUser');
  }

  verify(): Observable<Object> {

    let currUser = JSON.parse(localStorage.getItem('currentUser')); 

    console.log('currUser is', currUser);
    let token = ( currUser && 'token' in currUser) ? currUser.token : this.token;

    console.log('token is', token);
    let headers = new Headers({ 'x-access-token': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${this.base_url}/check-state`, options).map( res => this.parseRes(res) );
    
  }

  setToken(res){
    let body = JSON.parse(res['_body']);
    if( body['success'] == true ){
      console.log('res success is true');
      this.token = body['token'];
      localStorage.setItem('currentUser', JSON.stringify({ 
        email: body['user']['email'], 
        token: this.token 
      }));
    }
    return body;
  }

  parseRes(res){
    console.log('res is', res);
    let body = JSON.parse(res['_body']);
    return body;
  }

}
