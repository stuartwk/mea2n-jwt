import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../users/user';
import { AuthService} from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user: User;
  message: string = '';

  constructor(private authService: AuthService, private router: Router ) {
    this.user = new User;
  }

  registerUser(user) {
    this.authService.registerUser(user).subscribe( (res) => {
      if( res['success'] == true ) {
        this.authService.setUser(res['user']);
        this.router.navigate(['']);
      } else {
        this.message = res['message'];
      }
    })
  }

}