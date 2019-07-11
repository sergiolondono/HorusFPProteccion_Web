import { Component, OnInit } from '@angular/core';
import { DocumentsService } from './documents.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"

})
export class AppComponent implements OnInit {

  document;

  constructor(private rest: DocumentsService) { }

  title = "HorusWeb";
  
  ngOnInit() {
  }

}