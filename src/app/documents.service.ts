import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

const endpoint = "http://localhost:56121/api/";
//const endpoint = "http://192.168.213.196:8080/HorusFPService/api/";

const httpOptions = {};

@Injectable({
  providedIn: "root"
})
export class DocumentsService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
  };

  private extractDataTemplate(res: Response) {
    let body = res;
    return body || {};
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }
  private extractDataLote(res: Response) {
    let body = res;
    return body || {};
  }

  private extractGuardarlote(res: Response) {
    let body = res;
    return body || {};
  }

  constructor(private http: HttpClient) {}

  getColas(): Observable<any> {
    return this.http
      .get(endpoint + "cargueinicial/ConsultaColasIndexacion", httpOptions)
      .pipe(map(this.extractData));
  }

  getMotivosDescarte(modulo): Observable<any> {
    return this.http
      .get(
        endpoint + "cargueinicial/MotivosDescarte?modulo=" + modulo,
        this.httpOptions
      )
      .pipe(map(this.extractData));
  }

  getTemplate(idTipoDocumental) {
    return this.http
      .get(
        endpoint +
          "TipoDocXTemplate/getTemplate?idTipoDocumental=" +
          idTipoDocumental,
        httpOptions
      )
      .pipe(map(this.extractDataTemplate));
  }

  getLotes(nombreCola, colaMsgqueue) {
    let usuario = localStorage.getItem("usuario");
    return this.http
      .get(
        endpoint +
          "Lote/obtenerLoteIndexacion?colaTrabajo=" +
          nombreCola +
          "&colaMsgQueue=" +
          colaMsgqueue +
          "&usuario=" +
          usuario,
        httpOptions
      )
      .pipe(map(this.extractDataLote));
  }
  postGuardarLote(datosLote) {
    console.log(datosLote);
    let json = JSON.stringify(datosLote);
    //El backend recogerá un parametro json
    console.log(this.httpOptions);

    let params = "json=" + json;
    return this.http
      .post(endpoint + "Lote/guardar", datosLote, this.httpOptions)
      .pipe(map(this.extractData));
  }

  isloggedin() {
    if (localStorage.getItem("usuario") != null) return true;

    return false;
  }

  GuardarLote() {}
  
}

export interface User {
  userName: string;
  password: string;
}
