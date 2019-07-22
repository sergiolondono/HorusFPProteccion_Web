import { Component, OnInit } from '@angular/core';
import { DocumentsService } from './services/documents.service';

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