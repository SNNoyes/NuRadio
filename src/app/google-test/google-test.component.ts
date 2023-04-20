import { Component } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService, GoogleSigninButtonDirective } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-google-test',
  templateUrl: './google-test.component.html',
  styleUrls: ['./google-test.component.css'],
})
export class GoogleTestComponent {
  constructor(private authService: SocialAuthService) { }


  // DOES SOMETHING
  // signInHandler(): void {
  //   this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
  //     .then((data) => {
  //       console.log(data);
  //     })
  // }

}
