import { Component, AfterViewInit } from '@angular/core';
import { GauthService } from '../gauth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  constructor(public gauth: GauthService) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.gauth.handleAuthClick();
    }, 1000);
  }
}
