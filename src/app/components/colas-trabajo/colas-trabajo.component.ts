import {
  Component,
  ViewChild,
  OnInit,
  HostListener,
  ElementRef,
  Input
} from "@angular/core";
import { DocumentsService } from "../../documents.service";

import { NgSelectComponent } from "@ng-select/ng-select";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl } from "@angular/forms";

import {
  PDFProgressData,
  PdfViewerComponent,
  PDFDocumentProxy,
  PDFSource
} from "ng2-pdf-viewer";
import { MensajesService } from "src/app/mensajes.service";

@Component({
  selector: "app-colas-trabajo",
  templateUrl: "./colas-trabajo.component.html",
  styleUrls: ["./colas-trabajo.component.scss"]
})
export class ColasTrabajoComponent {
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
  pdfQuery = "";
  mostrarimagen: boolean;
  mostrarFormulario: boolean;
  mostrarok: boolean;
  colas: any = [];
  tiposDocumentales: any = [];
  idTipoDocSelected: any;
  idTemplateSelected: any;
  lote: any = [];
  template: any = [];
  NombreDocumento;
  IdLote;
  imagen;
  colatrabajo;
  colamsg;
  IdDocumento;
  procesoOK: any;
  ArrayTemplate: any = [];
  guardarlote: any = [];
  src$: any;
  title = "HorusWebAngular";
  authenticate: any;
  motivosDescarte: any = [];
  categoria: any;
  motivoSelected: any;

  // variable que escucha cualquier tecla digitada. sirve para renderizar la imagen
  public keypressed;

  // se declaran para hacer focus en el ngselect1 de colas al inicio del componente.
  @ViewChild("ngselectColas") select: NgSelectComponent;
  @ViewChild("campos") formulario: NgSelectComponent;
  @ViewChild("modalDescarte") modaldescarte: ElementRef;
  @ViewChild("descarte") NgSelectModule;
  @ViewChild("pdfV") public target: ElementRef;
  modalOptions: NgbModalOptions = {};
  pdfSrc: string | PDFSource | ArrayBuffer;

  constructor(
    private toastr: MensajesService,
    private modalService: NgbModal,
    private restService: DocumentsService
  ) {
    this.getColas();
    this.getMotivosDescarte();
  }

  @HostListener("paste", ["$event"]) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener("copy", ["$event"]) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener("cut", ["$event"]) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener("window:keydown", ["$event"])
  handleKeyboardEvent(e) {
    this.keypressed = e.keyCode;

    enum keyAscii {
      i = 73,
      j = 74,
      k = 75,
      l = 76,
      menos = 109,
      menosInterno = 189,
      mas = 107,
      masInterno = 187,
      flechaDerecha = 39,
      flechaIzquierda = 37,
      f2 = 113,
      f3 = 114,
      f4 = 115
    }

    if (
      ((e.shiftKey && this.keypressed == keyAscii.menosInterno) ||
        (e.shiftKey && this.keypressed == keyAscii.menos)) &&
      this.pdfSrc != ""
    ) {
      e.preventDefault();
      this.zoom += -0.1;
    }
    if (
      ((e.shiftKey && this.keypressed == keyAscii.mas) ||
        (e.shiftKey && this.keypressed == keyAscii.masInterno)) &&
      this.pdfSrc != ""
    ) {
      e.preventDefault();
      this.zoom += 0.1;
    }
    if (
      e.shiftKey &&
      this.keypressed == keyAscii.flechaIzquierda &&
      this.pdfSrc != ""
    ) {
      this.rotation += -90;
    }
    if (
      e.shiftKey &&
      this.keypressed == keyAscii.flechaDerecha &&
      this.pdfSrc != ""
    ) {
      this.rotation += 90;
    }

    if (e.shiftKey && this.keypressed == keyAscii.i && this.pdfSrc != "") {
      e.preventDefault();
      this.target.nativeElement.scrollTop -= 20;
    }
    if (e.shiftKey && this.keypressed == keyAscii.k && this.pdfSrc != "") {
      e.preventDefault();
      this.target.nativeElement.scrollTop += 20;
    }

    if (e.shiftKey && this.keypressed == keyAscii.j && this.pdfSrc != "") {
      e.preventDefault();
      console.log(this.keypressed);
      this.target.nativeElement.scrollLeft -= 20;
    }
    if (e.shiftKey && this.keypressed == keyAscii.l && this.pdfSrc != "") {
      e.preventDefault();
      console.log(this.keypressed);
      this.target.nativeElement.scrollLeft += 20;
    }

    if (this.keypressed == keyAscii.f2 && this.pdf != "") {
      this.page += 1;
    }
    if (this.keypressed == keyAscii.f4 && this.pdf != "") {
      this.page += -1;
    }

    if (e.altKey && this.keypressed == keyAscii.f3 && this.pdfSrc != "") {
      this.modalOptions.backdrop = "static";
      this.modalOptions.keyboard = false;

      this.modalService.open(this.modaldescarte, this.modalOptions);
    }
    // console.log(this.keypressed);
  }

  onChange($event) {
    console.log($event);
    this.colatrabajo = $event.nombreCola;
    this.colamsg = $event.colaMsgQueue;
    this.imagen = "";
    this.getLotes($event.nombreCola, $event.colaMsgQueue);
  }

  CerrarModal() {
    this.modalService.dismissAll(this.modaldescarte);
  }

  guardarDescarte() {
    this.imagen = false;
    this.mostrarFormulario = false;

    let datoslote = {
      datosFormulario: "",
      idlote: this.IdLote,
      idDocumento: this.IdDocumento,
      idtipodoc: this.idTipoDocSelected,
      idtempla: this.idTemplateSelected,
      usuario: localStorage.getItem("usuario"),
      proceso: "captura",
      categoria: "indexacion",
      motivoDescarte: this.motivoSelected
    };

    this.guardarlote = this.restService
      .postGuardarLote(datoslote)
      .subscribe((dataguardar: {}) => {
        this.procesoOK = dataguardar;
        if (this.procesoOK) {
          this.toastr.showSuccessDescarte();
          this.CerrarModal();
          this.getLotes(this.colatrabajo, this.colamsg);
        } else {
          this.toastr.showErrorDescarte();
        }
      });
  }

  displayform(f) {
    this.imagen = false;
    this.mostrarFormulario = false;
    console.log(f);
    let datoslote = {
      datosFormulario: f,
      idlote: this.IdLote,
      idDocumento: this.IdDocumento,
      idtipodoc: this.idTipoDocSelected,
      idtempla: this.idTemplateSelected,
      usuario: localStorage.getItem("usuario"),
      proceso: "captura",
      categoria: "indexacion",
      movitoDescarte: ""
    };

    this.guardarlote = this.restService
      .postGuardarLote(datoslote)
      .subscribe((dataguardar: {}) => {
        this.procesoOK = dataguardar;
        if (this.procesoOK) {
          this.toastr.showSuccess();
          this.getLotes(this.colatrabajo, this.colamsg);
        } else {
          this.toastr.showError();
        }
      });
  }

  getMotivosDescarte() {
    this.categoria = "indexacion";
    this.motivosDescarte = [];
    this.restService
      .getMotivosDescarte(this.categoria)
      .subscribe((data: {}) => {
        this.motivosDescarte = data;
      });
  }

  getColas() {
    this.colas = [];
    this.restService.getColas().subscribe((data: {}) => {
      this.colas = data;
      console.log(this.colas);
      if (this.imagen != "") {
        this.select.focus();
      }
      console.log(this.imagen);
    });
  }

  getLotes(colatrabajo: string, colaMsgQueue: string) {
    this.lote = [];
    this.restService
      .getLotes(colatrabajo, colaMsgQueue)
      .subscribe((datalote: {}) => {
        this.lote = datalote;
        if (
          this.lote.valorimagenBytes === "" &&
          this.lote.tdocumentales.length === 0
        )
          this.toastr.showWarning("Cola de trabajo no configurada!");

        // valores del lote obtenido
        var binaryImg = atob(this.lote.valorimagenBytes);
        var length = binaryImg.length;
        var arrayBuffer = new ArrayBuffer(length);
        var uintArray = new Uint8Array(arrayBuffer);
        this.imagen = this.lote.valorimagenBytes;
        this.NombreDocumento = this.lote.NombreDocumento;
        this.IdLote = this.lote.idLote;
        this.IdDocumento = this.lote.idDocumento;
        for (var i = 0; i < length; i++) {
          uintArray[i] = binaryImg.charCodeAt(i);
        }
        var currentBlob = new Blob([uintArray], { type: "application/pdf" });
        this.pdfSrc = URL.createObjectURL(currentBlob);

        //renderiza la imagen de entrada a la pantalla
        this.zoom = 1;
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
        });
        this.unsubcribe = this.form.valueChanges.subscribe(update => {
          this.fields = JSON.parse(update.fields);

          this.formulario.focus();
        });
      });
  }

  ngDestroy() {
    this.unsubcribe();
  }

  consultarLoteDisponible() {
    this.mostrarimagen = true;
    this.mostrarFormulario = true;
  }

  onChangeTipoDocumental($event) {
    this.getTemplate($event.idTipoDocumental);
    console.log($event);
  }

  getTemplate(idTipoDocumental: any) {
    this.ArrayTemplate = [];
    this.idTemplateSelected = "";
    this.fields = [];
    this.template = [];
    this.restService
      .getTemplate(idTipoDocumental)
      .subscribe((datatemplate: {}) => {
        this.template = datatemplate;
        // devuelve el valor del template ya seleccionado para el lote
        this.ArrayTemplate = this.template.getTemplates;
        this.idTemplateSelected = this.template.idTemplate;
        this.fields = this.template.lstKwXTemplate;
        console.log(this.fields);
        this.form = new FormGroup({
          fields: new FormControl(JSON.stringify(this.fields))
        });
        this.unsubcribe = this.form.valueChanges.subscribe(update => {
          this.fields = JSON.parse(update.fields);
        });
        console.log(this.idTipoDocSelected);
        console.log(this.template);
      });
  }

  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;

  toggleOutline() {
    this.isOutlineShown = !this.isOutlineShown;
  }

  incrementPage(amount: number) {
    this.page += amount;
    console.log((this.page += amount));

    // interval(500);
  }

  incrementZoom(amount: number) {
    this.zoom += amount;
    console.log(this.zoom);
  }

  rotate(angle: number) {
    this.rotation += angle;
  }

  /**
   * Render PDF preview on selecting file
   */
  onFileSelected() {
    const $pdf: any = document.querySelector("#file");

    if (typeof FileReader !== "undefined") {
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

    if (error.name === "PasswordException") {
      const password = prompt(
        "This document is password protected. Enter the password:"
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
    } else if (typeof this.pdfSrc === "string") {
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
      pageNumber: 3
    });
  }

  /**
   * Page rendered callback, which is called when a page is rendered (called multiple times)
   *
   * @param {CustomEvent} e
   */
  pageRendered(e: CustomEvent) {
    console.log("(page-rendered)", e);
  }

  searchQueryChanged(newQuery: string) {
    if (newQuery !== this.pdfQuery) {
      this.pdfQuery = newQuery;
      this.pdfComponent.pdfFindController.executeCommand("find", {
        query: this.pdfQuery,
        highlightAll: true
      });
    } else {
      this.pdfComponent.pdfFindController.executeCommand("findagain", {
        query: this.pdfQuery,
        highlightAll: true
      });
    }
  }
}
