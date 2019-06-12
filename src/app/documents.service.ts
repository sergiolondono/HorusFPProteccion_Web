import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
// import { BehaviorSubject } from 'rxjs';



const endpoint1 = 'http://localhost:56121/api/';

const endpoint = 'http://172.20.15.127/WebApiSegura/api/';
// const endpoinobtenerLote ='http://172.20.15.127/WebAPiSegura/api/';
// const endpointobtenertemplate = 'http://172.20.15.127/WebAPiSegura/api/'
// const endpointGuardarLote = 'http://172.20.15.127/WebAPiSegura/api/';
const httpOptions = {


};

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

//  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

 httpOptions = {
  headers: new HttpHeaders({
   "Content-Type":"application/json",

  
  })
};

// get isLoggedIn() {
//   return this.loggedIn.asObservable();
// }

private extractDataTemplate(res: Response) {
  let body = res;
  return body || { };
}

private extractData(res: Response) {
  let body = res;
  return body || { };
}
private extractDataLote(res: Response) {
  let body = res;
  return body || { };
}
private extractGuardarlote(res:Response)
{
  let body = res;
  return body || {};
}
 constructor(private http: HttpClient) { }


 getColas(): Observable<any> {
    return this.http.get(endpoint+"cargueinicial/ConsultaColasIndexacion",httpOptions).pipe(
      map(this.extractData));
  }

  getTemplate(idTipoDocumental)
  {
    return this.http.get(endpoint+ 'tipodocxtemplate/Obtenertemplatextipodoc?idTipoDocumental='+idTipoDocumental,httpOptions).pipe(
      map(this.extractDataTemplate));
  }
  
  getLotes( nombreCola,colaMsgqueue)
  {

    return this.http.get(endpoint+ 'Lote/obtenerLoteIndexacion?colaTrabajo='+nombreCola+'&colaMsgQueue='+colaMsgqueue,httpOptions).pipe(
      map(this.extractDataLote));
  }
  postGuardarLote(datosLote)
  {
    console.log(datosLote);
    let json = JSON.stringify(datosLote);
                 
    let f = {
      fecha :datosLote.fecha,
      NIdentificacion:datosLote.NIdentificacion,
      tipodocumento:datosLote.tipodocumento,
      identificadorfisico:"123",
      idlote:datosLote.idlote,
      idDocumento :datosLote.idDocumento,
      idtipodoc: datosLote.idtipodoc,
      idtempla: datosLote.idtempla
    
    }
    //El backend recogerá un parametro json

  console.log(this.httpOptions)

    let params = "json="+json;
    return this.http.post(endpoint1 + 'Lote/guardar', f,this.httpOptions).subscribe(data => { console.log("POST Request Lote", data) },
error => { console.log("Error", error) }
);
   
    // return this.http.post(endpoint+"Lote/guardar",f,{headers:headers}).pipe(
    //   map(this.extractGuardarlote));
    //  return this.http.post(endpoint+"Lote/guardar", f,{headers:headers});

  }

GuardarLote(){

} 
 

  // private handleError<T> (operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  
  //     // TODO: send the error to remote logging infrastructure
  //     console.error(error); // log to console instead
  
  //     // TODO: better job of transforming error for user consumption
  //     console.log(`${operation} failed: ${error.message}`);
  
  //     // Let the app keep running by returning an empty result.
  //     return of(result as T);
  //   };
  // }
  // login(user: User) {
  //   if (user.userName !== '' && user.password !== '' ) {
  //     this.loggedIn.next(true);
   
  //     //this.router.navigate(['/home']);
  //   }
  // }
  
  // logout() {
  //   this.loggedIn.next(false);
  //   //this.router.navigate(['/Login']);
  //    return this.loggedIn.asObservable();
  // }
  
  
  }

  export interface User {
    userName: string;
    password: string;
  }
