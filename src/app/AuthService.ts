import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn: boolean = false;
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) { 
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    window.addEventListener('beforeunload', () => {
      this.logoutOnClose();
    });
  }

  login(): void {
    this.isLoggedIn = true;
    localStorage.setItem('isLoggedIn', 'true');
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
    sessionStorage.clear(); 
  }

  logoutOnClose() {
    if (this.isLoggedIn) {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        this.http.post('logout-url', { token }).subscribe(() => {
          localStorage.removeItem(this.tokenKey);
        });
      }
    }
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
