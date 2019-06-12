import { Component, ViewChild,OnInit,HostListener, ElementRef, Renderer } from '@angular/core';
import {DocumentsService} from '../../documents.service';
import {ActivatedRoute} from '@angular/router';
import { ImageViewerModule } from 'ng2-image-viewer';
import { ToastrService } from 'ngx-toastr';
import { NgSelectComponent } from '@ng-select/ng-select';
import { FormGroup, FormControl,ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {
  PDFProgressData,
  PdfViewerComponent,
  PDFDocumentProxy,
  PDFSource,
} from 'ng2-pdf-viewer';
import { interval } from 'rxjs';


@Component({
  selector: 'app-colas-trabajo',
  templateUrl: './colas-trabajo.component.html',
  styleUrls: ['./colas-trabajo.component.scss']
})
export class ColasTrabajoComponent implements OnInit {

  // variables para formulario dinamico
  public form: FormGroup;
  unsubcribe: any;
  public fields: any[];

  // variables para visor pdf
  error: any;
  page = 1;
  rotation = 0;
  zoom = 1.0;
  originalSize = true;
  pdf: any;
  renderText = true;
  progressData: PDFProgressData;
  isLoaded = false;
  stickToPage = false;
  showAll = false;
  autoresize = true;
  fitToPage = false;
  outline: any[];
  isOutlineShown = false;

  // variables carga lote y datos necesario para mostrar la imagen  y sus campos
  pdfQuery = '';
  mostrarimagen:boolean;
  mostrarFormulario: boolean;
  mostrarok:boolean;
  colas:any = [];
  tiposDocumentales:any= [];
  idTipoDocSelected:any;
  idTemplateSelected:any;
  lote:any = [];
  template:any=[];
  NombreDocumento;
  IdLote;
  colatrabajo;
  colamsg;
  IdDocumento;
  ArrayTemplate:any = [];
  guardarlote:any = [];
  src$:any ;
  title = "HorusWebAngular";

  // variable que escucha cualquier tecla digitada. sirve para renderizar la imagen
  public keypressed;

  // se declaran para hacer focus en el ngselect1 de colas al inicio del componente.
  @ViewChild('ngselect1') select: NgSelectComponent;
  @ViewChild("campos") formulario : NgSelectComponent;

  pdfSrc: string | PDFSource | ArrayBuffer;
  @HostListener('window:keydown', ['$event'])
handleKeyboardEvent(event: KeyboardEvent) {
  this.keypressed = event.keyCode;
  if((this.keypressed == 189 || this.keypressed == 109) && this.pdfSrc != "" )
  {
     this.zoom += -0.1;
  }
  if((this.keypressed == 107 || this.keypressed == 187) && this.pdfSrc != "" )
  {
     this.zoom += 0.1;
  }
  if(this.keypressed == 37 && this.pdfSrc != "" )
  {
     this.rotation += -90;
  }
  if(this.keypressed == 39 && this.pdfSrc != "" )
  {
     this.rotation += 90;
  }
  console.log(this.keypressed);
  // this.zoom += 0.1;
}
  
  imagen ; 

  constructor(private toastr: ToastrService,private renderer: Renderer,private activatedRoute:ActivatedRoute, private restService: DocumentsService, private image:ImageViewerModule ) { 

    this.getColas();     

  }

ngOnInit() {
 
}


onChange($event) {
 console.log($event);
 this.colatrabajo = $event.nombreCola;
 this.colamsg = $event.colaMsgQueue;
 this.imagen = "";
 this.getLotes($event.nombreCola,$event.colaMsgQueue)

 
}

displayform(f) {
  // You don't really need to pass the click event, you can just pass new Event() or '{} as Event' even.
  console.log(f);
  console.log(this.fields);
  // let datosLote = {
  //   fecha :f.xFechaExpedicion,
  //   NIdentificacion:f.xNumeroIdentificacion,
  //   tipodocumento:f.xTipoDocumentoIdentificacion,
  //   identificadorfisico:"123",
  //   idlote:this.IdLote,
  //   idDocumento :this.IdDocumento,
  //   idtipodoc: this.idTipoDocSelected,
  //   idtempla: this.idTemplateSelected
  
  // }
  console.log(f);
  let lote = {
    NIdentificacion: "1",
    fecha: "06/10/2019",
    idDocumento: 139245411,
    identificadorfisico: "123",
    idlote: 31771887,
    idtempla: 1188,
    idtipodoc: 1472,
    tipodocumento: "Cedula de Ciudadania"
    } 
    // return this.http.post(endpoint + 'Lote/guardar', lote)
    // .subscribe(data => { console.log("POST Request Lote", data) },
    // error => { console.log("Error", error) }
  
    // );
  this.guardarlote = this.restService.postGuardarLote(lote);
    // {
    //   this.showSuccess();
    // }
    // else
    // {
    //   this.showError();
    // }

  
}

getColas() {
 this.colas = [];
 this.restService.getColas().subscribe((data: {}) => {
  
   this.colas = data;
   console.log(this.colas);
 if(this.imagen != "")
 {
  this.select.focus();
 }
   console.log(this.imagen);
  
 });

}

 


getLotes( colatrabajo:string, colaMsgQueue:string)
{   
  this.lote = [];
  this.restService.getLotes(colatrabajo,colaMsgQueue).subscribe((datalote: {}) => {
  this.lote = datalote;

  // valores del lote obtenido
  var binaryImg = atob(this.lote.valorimagenBytes);
  var length = binaryImg.length;
  var arrayBuffer = new ArrayBuffer(length);
  var uintArray = new Uint8Array(arrayBuffer);
  this.imagen = this.lote.valorimagenBytes;
  this.NombreDocumento = this.lote.NombreDocumento;
  this.IdLote = this.lote.idLote;
  this.IdDocumento= this.lote.idDocumento;
  for (var i = 0; i < length; i++) {uintArray[i] = binaryImg.charCodeAt(i);}
  var currentBlob = new Blob([uintArray], {type: 'application/pdf'});
  this.pdfSrc =  URL.createObjectURL(currentBlob);

    //renderiza la imagen de entrada a la pantalla
  this.zoom = 0.4000000000000006;
  // llena la lista de tipos documentales
  this.tiposDocumentales = this.lote.tdocumentales;
  // devuelve el valor del tipodocumental ya seleccionado para el lote
  this.idTipoDocSelected = this.lote.idTipoDocumental;

  // devuelve el valor del template ya seleccionado para el lote
  this.ArrayTemplate = this.lote.getTemplates;
  this.idTemplateSelected = this.lote.idTemplate;


  // se crean los campos dinamicamente.
  this.fields = this.lote.lstKwXTemplate;
  console.log(this.fields);
    this.form = new FormGroup({
      fields: new FormControl(JSON.stringify(this.fields))
    })
    this.unsubcribe = this.form.valueChanges.subscribe((update) => {    
      this.fields = JSON.parse(update.fields);
      
     this.formulario.focus();
    });
 });


}

ngDistroy() {
  this.unsubcribe();
}

showSuccess() {
  this.toastr.success('', 'Lote Guardado Exitosamente!');
}
showError()
{
  this.toastr.error('','Error al guardar el lote!')
}

onKey(valor)
{
  console.log(valor);
}

consultarLoteDisponible()
{
   this.mostrarimagen = true;
   this.mostrarFormulario = true;
}

onChangeTipoDocumental($event)
{
  
  this.getTemplate($event.idTipoDocumental);
  console.log($event);
}
guardar( $event)
{
this.imagen = false;
 this.mostrarFormulario = false;
 this.getLotes(this.colatrabajo,this.colamsg);
 this.showSuccess();
 
}

getTemplate(idTipoDocumental:any)
{
  this.ArrayTemplate= [];
  this.idTemplateSelected = "";
  this.fields = [];
  this.template = [];
  this.restService.getTemplate(idTipoDocumental).subscribe((datatemplate: {}) => {
  this.template = datatemplate;
     // devuelve el valor del template ya seleccionado para el lote
     this.ArrayTemplate = this.template.getTemplates;
     this.idTemplateSelected = this.template.idTemplate;
     this.fields = this.template.lstKwXTemplate;
     console.log(this.fields);
       this.form = new FormGroup({
         fields: new FormControl(JSON.stringify(this.fields))
       })
       this.unsubcribe = this.form.valueChanges.subscribe((update) => {    
         this.fields = JSON.parse(update.fields);
       });
      console.log(this.idTipoDocSelected);
      console.log(this.template);

  });

   
}


  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;

 
  private extractDataLote(res: Response) {
    let body = res;
    return body || { };
  }
  private extractDataTemplate(res: Response) {
    let body = res;
    return body || { };
  }



  toggleOutline() {
    this.isOutlineShown = !this.isOutlineShown;
  }

  incrementPage(amount: number) {
    
      this.page +=  amount;  
     console.log(this.page+=amount);
  
    // interval(500);
    
   
  }

  incrementZoom(amount: number) {
    this.zoom += amount;
    console.log(this.zoom);
  }
  onKeyDown(e:any)
  {
    if(e.keyCode == 13 && e.ctrlKey)
    alert('Ctrl+Enter');
    console.log(event);
  }

  rotate(angle: number) {
    this.rotation += angle;
  }

  /**
   * Render PDF preview on selecting file
   */
  onFileSelected() {
    const $pdf: any = document.querySelector('#file');

    if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        console.log(this.pdfSrc);
      };

      reader.readAsArrayBuffer($pdf.files[0]);
    }
  }

  /**
   * Get pdf information after it's loaded
   * @param pdf
   */
  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.pdf = pdf;
    this.isLoaded = true;

    this.loadOutline();
  }

  /**
   * Get outline
   */
  loadOutline() {
    this.pdf.getOutline().then((outline: any[]) => {
      this.outline = outline;
    });
  }

  /**
   * Handle error callback
   *
   * @param error
   */
  onError(error: any) {
    this.error = error; // set error

    if (error.name === 'PasswordException') {
      const password = prompt(
        'This document is password protected. Enter the password:'
      );

      if (password) {
        this.error = null;
        this.setPassword(password);
      }
    }
  }

  setPassword(password: string) {
    let newSrc;
    if (this.pdfSrc instanceof ArrayBuffer) {
      newSrc = { data: this.pdfSrc };
    } else if (typeof this.pdfSrc === 'string') {
      newSrc = { url: this.pdfSrc };
    } else {
      newSrc = { ...this.pdfSrc };
    }
    newSrc.password = password;
    this.pdfSrc = newSrc;
  }

  /**
   * Pdf loading progress callback
   * @param {PDFProgressData} progressData
   */
  onProgress(progressData: PDFProgressData) {
    console.log(progressData);
    this.progressData = progressData;
    this.isLoaded = false;
    this.error = null; // clear error
  }

  getInt(value: number): number {
    return Math.round(value);
  }

  /**
   * Navigate to destination
   * @param destination
   */
  navigateTo(destination: any) {
    this.pdfComponent.pdfLinkService.navigateTo(destination);
  }

  /**
   * Scroll view
   */
  scrollToPage() {
    this.pdfComponent.pdfViewer.scrollPageIntoView({
      pageNumber: 3,
    });
  }

  /**
   * Page rendered callback, which is called when a page is rendered (called multiple times)
   *
   * @param {CustomEvent} e
   */
  pageRendered(e: CustomEvent) {
    console.log('(page-rendered)', e);
  }

  searchQueryChanged(newQuery: string) {
    if (newQuery !== this.pdfQuery) {
      this.pdfQuery = newQuery;
      this.pdfComponent.pdfFindController.executeCommand('find', {
        query: this.pdfQuery,
        highlightAll: true,
      });
    } else {
      this.pdfComponent.pdfFindController.executeCommand('findagain', {
        query: this.pdfQuery,
        highlightAll: true,
      });
    }
  }

}
