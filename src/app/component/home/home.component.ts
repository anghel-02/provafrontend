import { Component } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {AuthService} from "../../auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent{
  constructor(private authService: AuthService, private route: Router) {}

  isUserLoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }
  
  logout(): void {
    this.authService.removeToken();
    this.route.navigate(["home"])
  }

  onTabChanged(event: MatTabChangeEvent): void {
    console.log('Scheda cambiata:', event.index);
  }


}
