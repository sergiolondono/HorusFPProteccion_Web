import { Component, OnInit } from '@angular/core';
import {Router} from  '@angular/router';
import {ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DocumentsService } from 'src/app/services/documents.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  authenticate: any;
  isLoggedIn$: Observable<boolean>;

  constructor( private router:Router, private activatedRoute:ActivatedRoute,public service:DocumentsService) {
    
     


    

   }

  ngOnInit() {

    this.authenticate = localStorage.getItem("userName");
  }
  Logout() {
    localStorage.clear();
    this.router.navigateByUrl("/Login");
  }
}