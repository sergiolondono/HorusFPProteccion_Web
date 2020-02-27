import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";
import { environment } from 'src/environments/environment';

//const endpoint = "http://localhost:56121/api/";
const APIEndpoint = environment.APIEndpoint;

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
      .get(APIEndpoint + "cargueinicial/ConsultaColasIndexacion", httpOptions)
      .pipe(map(this.extractData));
  }
  
  validarLoteFull(iddocumentos,idlote,xnumeroIdentificacion,xtipoIdentificacion,registrarTiempos,Radicado)
  {
    let datosLote = {
      IdDocs : iddocumentos,
      idLote :idlote,
      xNumeroIdentificacion :xnumeroIdentificacion,
      xTipoDocumentoIdentificacion : xtipoIdentificacion,
      registrarTiempos: registrarTiempos,
      Radicado:Radicado
    }
   // return this.http.get(endpoint+ 'Lote/ValidarLoteFull?IdDocs='+iddocumentos+'&idlote='+idlote+'&xNumeroIdentificacion='+xnumeroIdentificacion+"&xTipoDocumentoIdentificacion="+xtipoIdentificacion ,httpOptions).pipe(
    return this.http.post(APIEndpoint+ 'Lote/ValidarLoteFull',datosLote,httpOptions).pipe(
     map(this.extractDataLote));
  }


  getMotivosDescarte(modulo): Observable<any> {
    return this.http
      .get(
        APIEndpoint + "cargueinicial/MotivosDescarte?modulo=" + modulo,
        this.httpOptions
      )
      .pipe(map(this.extractData));
  }

  getTemplate(idTipoDocumental,iddocumento,categoria,NroIdentificacion,TipoIdentificacion,RazonSocial) {  
    let datoslote = {
      idTipodocumental: idTipoDocumental,
      iddocumento: iddocumento,
      categoria: categoria,
      NroIdentificacion: NroIdentificacion,
      TipoIdentificacion: TipoIdentificacion,
      RazonSocial : RazonSocial
    };

    return this.http
    .post(
      APIEndpoint +
        "TipoDocXTemplate/getTemplate" ,
      datoslote
    )
    .pipe(map(this.extractDataTemplate));

    // return this.http
    //   .get(
    //     APIEndpoint +
    //       "TipoDocXTemplate/getTemplate?idTipoDocumental=" +
    //       idTipoDocumental,
    //     httpOptions
    //   )
    //   .pipe(map(this.extractDataTemplate));
  }

  getLotes(nombreCola, colaMsgqueue) {
    let usuario = localStorage.getItem("usuario");
    return this.http
      .get(
        APIEndpoint +
          "Lote/obtenerLoteIndexacion?colaTrabajo=" +
          nombreCola +
          "&colaMsgQueue=" +
          colaMsgqueue +
          "&usuario=" +
          usuario,
        httpOptions
      )
      .pipe(
        map(this.extractDataLote),
        catchError(this.handle_Error)
        );
  }
  postGuardarLote(datosLote) {
    let json = JSON.stringify(datosLote);

    let params = "json=" + json;
    return this.http
      .post(APIEndpoint + "Lote/guardar", datosLote, this.httpOptions)
      .pipe(map(this.extractData));
  }

  isloggedin() {
    if (localStorage.getItem("usuario") != null) return true;

    return false;
  }

  GuardarLote() {}
  
  handle_Error(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      console.log(`status: ${error.status} Message: ${error.error.ExceptionMessage}`);
      errorMessage = `\n${error.error.ExceptionMessage}`;
    }
    return throwError(errorMessage);
  }
  
}

export interface User {
  userName: string;
  password: string;
}
