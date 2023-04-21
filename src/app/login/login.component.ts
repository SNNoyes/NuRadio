import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService, GoogleSigninButtonDirective } from '@abacritt/angularx-social-login';
import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { TrackServerService } from '../track-server.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router,
    private authService: SocialAuthService,
    private http: HttpClient,
    private trackService: TrackServerService) { }

  user: SocialUser = new SocialUser;
  loggedIn: boolean = false;

  goToDashboard(): void {
    this.router.navigateByUrl('/dashboard');
  }

  getAccessToken(): void {
    this.authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID)
      .then((accessToken) => {
        localStorage.setItem("accessToken", accessToken);
      });
  };

  // LOGIN COMPONENT IS SUBSCRIBED TO THE LIBRARY LOG IN SERVICE
  // IF LOGGED IN, WE GO TO THE DASHBOARD
  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user !== null);
      if (this.loggedIn) {
        this.goToDashboard();
        this.getAccessToken(); // TO FIX: THIS TRIGGERS A SECOND POP-UP
      };
    });
  }
}
