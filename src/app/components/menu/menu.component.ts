import { Component, OnInit } from '@angular/core';
import {Router} from  '@angular/router';
import {ActivatedRoute} from '@angular/router';
import {DocumentsService} from '../../documents.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  usuario:Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  constructor( private router:Router, private activatedRoute:ActivatedRoute,private service:DocumentsService) {
    
 


    

   }

  ngOnInit() {
 
    // this.isLoggedIn$ = this.service.isLoggedIn;
    
  }
  onLogout() {
    // this.service.logout();
  }
}