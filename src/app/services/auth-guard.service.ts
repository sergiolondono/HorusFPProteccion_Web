import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { DocumentsService } from './documents.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: DocumentsService, private router: Router) { }

  canActivate(route, state: RouterStateSnapshot){
    if (this.auth.isloggedin()) {
      return true;
    }    
    this.router.navigate(['/Login'], { queryParams: { returnUrl: state.url }});
    return false;
  };

}
