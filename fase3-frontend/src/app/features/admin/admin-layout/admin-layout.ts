import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,

  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  cerrarSesion(): void {

    this.authService.cerrarSesion();

    this.router.navigate([
      '/login'
    ]);

  }

}