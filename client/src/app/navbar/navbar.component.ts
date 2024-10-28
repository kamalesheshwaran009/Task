import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  username: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUserName();
  }

  logout(): void {
    this.authService.logout();
  }
}
