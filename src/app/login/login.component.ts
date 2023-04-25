import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GauthService } from '../gauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router,
    public gauth: GauthService) { }
  
    goToDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }

  async signIn() {
    await this.gauth.handleAuthClick()
      .then(() => {
        this.goToDashboard();
      })
  }
}
