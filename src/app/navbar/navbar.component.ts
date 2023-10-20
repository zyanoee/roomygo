import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { ValidationService } from '../services/ValidationService';
import { PhotoService } from '../services/PhotoService';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  username : string = "";
  authenticated : boolean = false;
  showOverlayLogo = false;
  showCartoverlayLogo = false;

  constructor(
    private router: Router,
    private http: HttpClient, 
    private cookieService: CookieService, 
    private validationService: ValidationService,
    private photoService: PhotoService) {
      
      

    }

  

  async ngOnInit() {
    const accessToken = this.cookieService.get('accessToken');
    if (accessToken && (await this.validationService.validateToken(accessToken))) {
      this.username = this.cookieService.get('username');
      this.authenticated = true;
    } else {
      this.authenticated = false;
      this.username = "";
    }
  }

}
