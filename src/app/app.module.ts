import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
 import {APP_ROUTING} from './app.routes';
 import { NgSelectModule } from '@ng-select/ng-select';
 import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 import { ToastrModule } from 'ngx-toastr';
 import { PdfViewerModule } from 'ng2-pdf-viewer';
 import { InlineSVGModule } from 'ng-inline-svg';
 import { DynamicFormBuilderModule } from './dynamic-form-builder/dynamic-form-builder.module';
 //import { AuthHttp, AuthConfig, AUTH_PROVIDERS, provideAuth, AuthModule } from 'angular2-jwt';
 
 import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
 import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { ColasTrabajoComponent } from './components/colas-trabajo/colas-trabajo.component';
import { LoginComponent } from './components/login/login.component';


import {NgbModule,NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FieldsFunctionalityService } from './services/fields-functionality.service';
import {DocumentsService} from './services/documents.service';

// export function authHttpServiceFactory(http: Http, options: RequestOptions) {
//   return new AuthHttp(new AuthConfig({
//     tokenGetter: (() => localStorage.getItem('token'))
//   }), http, options);
// }

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    ColasTrabajoComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    ImageViewerModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:56121', '192.168.213.196:8080', '192.168.213.195:8080']
      }
    }),
    NgSelectModule,
     APP_ROUTING,
     BrowserAnimationsModule,
     PdfViewerModule,
     ToastrModule.forRoot(),
     InlineSVGModule.forRoot(),
     FormsModule,
     ReactiveFormsModule,
     DynamicFormBuilderModule,
     NgbModule.forRoot()    
  ],
  providers: [
    //AuthHttp, 
    FieldsFunctionalityService, 
    DocumentsService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }



