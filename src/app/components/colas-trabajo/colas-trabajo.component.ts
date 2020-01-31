import {
  Component,
  ViewChild,
  OnInit,
  HostListener,
  ElementRef,
  Input
} from "@angular/core";

import { NgSelectComponent } from "@ng-select/ng-select";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormControl } from "@angular/forms";
import { DatePipe } from "@angular/common";

import {
  PDFProgressData,
  PdfViewerComponent,
  PDFDocumentProxy,
  PDFSource
} from "ng2-pdf-viewer";
import { MensajesService } from "src/app/services/mensajes.service";
import { DocumentsService } from "src/app/services/documents.service";

@Component({
  selector: "app-colas-trabajo",
  templateUrl: "./colas-trabajo.component.html",
  styleUrls: ["./colas-trabajo.component.scss"],
  providers: [DatePipe]
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
  focus = 0;
  date = new Date();
  validar = false;
  arraydocsvalidar: any = [];
  noguardar = false;
  Guardando = false;
  indexDocActual: any;
  CantidadDocumentos: any;
  TipoDocumentoAutoHereda: any;
  NDocumentoAutoHereda: any;
  RazonSocialHereda: any;
  iddocumentosLote: any;
  // variable que escucha cualquier tecla digitada. sirve para renderizar la imagen
  public keypressed;

  // se declaran para hacer focus en el ngselect1 de colas al inicio del componente.
  @ViewChild("ngselectColas") select: NgSelectComponent;
  @ViewChild("ngselectTipoDocs") ngSelectTipoDocs: NgSelectComponent;
  @ViewChild("campos") formulario: NgSelectComponent;
  @ViewChild("ngSelectTemplate") selectTemplate: NgSelectComponent;
  @ViewChild("ngselectTipodocumental") selectTipodoc: NgSelectComponent;
  @ViewChild("modalDescarte") modaldescarte: ElementRef;
  @ViewChild("descarte") NgSelectModule;
  @ViewChild("pdfV") public target: ElementRef;
  @ViewChild("divFormDinamico") public divDinamico: ElementRef;
  modalOptions: NgbModalOptions = {};
  pdfSrc: string | PDFSource | ArrayBuffer;

  constructor(
    private toastr: MensajesService,
    private modalService: NgbModal,
    private restService: DocumentsService,
    private datePipe: DatePipe
  ) {
    this.getColas();
    this.getMotivosDescarte();
    this.limpiarLocalStorage();
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
      f4 = 115,
      tab = 9,
      enter = 13
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
      this.target.nativeElement.scrollLeft -= 20;
    }
    if (e.shiftKey && this.keypressed == keyAscii.l && this.pdfSrc != "") {
      e.preventDefault();
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

    if (this.keypressed == keyAscii.tab && this.idTemplateSelected) {
      let divDinamico = this.divDinamico.nativeElement.scrollTop;
      if (divDinamico === 0 || divDinamico === 1)
        this.divDinamico.nativeElement.scrollTop += 1;
      else this.divDinamico.nativeElement.scrollTop += 30;
    }

    if (
      this.keypressed == keyAscii.enter &&
      this.idTemplateSelected &&
      this.idTipoDocSelected
    ) {
      // let divDinamico = this.divDinamico.nativeElement.scrollTop;
      // if (this.focus < this.fields.length) {
      //   if (this.focus == 0) {
      //     document.getElementById(this.fields[this.focus].name).focus();
      //     this.focus = this.focus + 1;
      //     if (divDinamico === 0 || divDinamico === 1)
      //       this.divDinamico.nativeElement.scrollTop += 1;
      //   } else {
      //     document.getElementById(this.fields[this.focus].name).focus();
      //     this.focus = this.focus + 1;
      //     if (divDinamico === 0 || divDinamico === 1)
      //       this.divDinamico.nativeElement.scrollTop += 1;
      //     else this.divDinamico.nativeElement.scrollTop += 30;
      //   }
      // }
    }

    if (
      e.shiftKey &&
      e.ctrlKey &&
      this.idTemplateSelected &&
      this.idTemplateSelected
    ) {
      if (this.fields[this.focus - 1].type === "datetext") {
        var date = this.datePipe.transform(this.date, "ddMMyyyy");
        (<HTMLInputElement>(
          document.getElementById(this.fields[this.focus - 1].name)
        )).value = date;
      }
    }

    if (e.shiftKey && this.keypressed == keyAscii.tab) {
      if (this.focus > 0) {
        this.focus = this.focus - 1;
      }
    }
  }

  onChange($event) {
    this.colatrabajo = $event.nombreCola;
    this.colamsg = $event.colaMsgQueue;
    this.imagen = false;
    this.getLotes($event.nombreCola, $event.colaMsgQueue);
    this.limpiarLocalStorage();
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
    if (!this.validar) {
      // this.arraydocsvalidar =  (localStorage.getItem("idDocs") == null ? '' :localStorage.getItem("idDocs").split('*'));
      if (localStorage.getItem("idDocs") != null)
        this.arraydocsvalidar = localStorage.getItem("idDocs").split("*");

      if (this.arraydocsvalidar != "") {
        for (var i = 0; i < this.arraydocsvalidar.count; i++) {
          if (this.arraydocsvalidar[i] == this.IdDocumento)
            this.noguardar = true;
        }
      }
      this.validar = true;
    } else if (
      this.validar == true &&
      this.noguardar == false &&
      this.Guardando == false
    ) {
      // this.keypressed.preventDefault();
      this.page = 1;
      this.pdf = "";
      this.pdfSrc = "";

      this.Guardando = true;
      if (!this.noguardar) {
        this.validar = false;
        if ((this.noguardar = true)) this.noguardar = false;
        this.validarlotecantidadDocumentos(
          f,
          "",
          f.NroIdentificacion,
          f.TipoDocumentoIdenticacion
        );
        localStorage.setItem("NroIdentificacion", f.NroIdentificacion);
        localStorage.setItem("TipoIdentificacion", f.TipoIdentificacion);
        localStorage.setItem("Nombre_RazonSocial", f.Nombre_RazonSocial);        
      }
    }
  }

  validarlotecantidadDocumentos(
    f,
    motivoDescarte,
    numeroIdentHereda,
    tipoDocumentHereda
  ) {
    let datoslote = {
      datosFormulario: f,
      idlote: this.IdLote,
      idDocumento: this.IdDocumento,
      idtipodoc: this.idTipoDocSelected,
      idtempla: this.idTemplateSelected,
      usuario: localStorage.getItem("usuario"),
      proceso: "captura",
      categoria: "indexacion",
      motivoDescarte: motivoDescarte,
      colatrabajo: this.colatrabajo
    };

    if (this.indexDocActual == this.CantidadDocumentos) {
      this.imagen = false;
      this.mostrarFormulario = false;
      this.actualizarDocumentosLS(datoslote);
      this.guardarlote = this.restService
        .postGuardarLote(JSON.parse(localStorage.getItem("arrayDocumentos")))
        .subscribe((dataguardar: {}) => {
          this.procesoOK = dataguardar;
          if (this.procesoOK) {
            this.toastr.showSuccess();
            this.getLotes(this.colatrabajo, this.colamsg);
            this.Guardando = false;
            this.limpiarLocalStorage();
          } else {
            this.toastr.showError();
          }
        });
    } else {
      this.NDocumentoAutoHereda = localStorage.getItem("NroIdentificacion");
      this.TipoDocumentoAutoHereda = localStorage.getItem("TipoIdentificacion");
      this.RazonSocialHereda = localStorage.getItem("Nombre_RazonSocial");

      this.iddocumentosLote = localStorage.getItem("idDocs");
      this.actualizarDocumentosLS(datoslote);
      if (this.iddocumentosLote == null)
        localStorage.setItem("idDocs", this.IdDocumento);
      else
        localStorage.setItem(
          "idDocs",
          this.iddocumentosLote + "*" + this.IdDocumento
        );
      this.validarLote(
        localStorage.getItem("idDocs").toString(),
        this.IdLote,
        this.NDocumentoAutoHereda,
        this.TipoDocumentoAutoHereda,
        this.RazonSocialHereda
      );
      localStorage.setItem("primerCaptura", "1");
      this.focus = 0;
      this.Guardando = false;
    }
  }

  limpiarLocalStorage() {
    localStorage.removeItem("arrayDocumentos");
    localStorage.removeItem("idDocs");
    localStorage.removeItem("primerCaptura");
    localStorage.removeItem("ValorTipodoc");
    localStorage.removeItem("NroIdentificacion");
    localStorage.removeItem("TipoIdentificacion");
    localStorage.removeItem("Nombre_RazonSocial");

    this.focus = 0;
    this.fields = [];
    this.page = 1;

    this.NDocumentoAutoHereda = null;
    this.TipoDocumentoAutoHereda = null;
  }

  actualizarDocumentosLS(datoslote) {
    if (localStorage.getItem("arrayDocumentos") == null) {
      let arrayDocumentos = [];
      arrayDocumentos.push(datoslote);
      localStorage.setItem("arrayDocumentos", JSON.stringify(arrayDocumentos));
      return false;
    }
    let documentos = JSON.parse(localStorage.getItem("arrayDocumentos"));
    var contadorMod = 0;
    for (var i = 0; i < documentos.length; i++){
      if (documentos[i].datosFormulario != datoslote.datosFormulario){
        contadorMod ++;
        documentos[i].datosFormulario = datoslote.datosFormulario;
      }
    }
    console.log('documentos modificados' + contadorMod);
    documentos.push(datoslote);
    localStorage.setItem("arrayDocumentos", JSON.stringify(documentos));
  }

  validarLote(
    IdDocs: string,
    idlote: string,
    xNumeroIdentificacion: string,
    xTipoDocumentoIdentificacion: string,
    Radicado: string
  ) {
    this.lote = [];
    this.NombreDocumento = "";
    this.restService
      .validarLoteFull(
        IdDocs,
        idlote,
        xNumeroIdentificacion,
        xTipoDocumentoIdentificacion,
        null,
        Radicado
      )
      .subscribe((datalote: {}) => {
        this.lote = datalote;
        // valores del lote obtenido
        var binaryImg = atob(this.lote.valorimagenBytes);
        var length = binaryImg.length;
        var arrayBuffer = new ArrayBuffer(length);
        var uintArray = new Uint8Array(arrayBuffer);
        this.imagen = this.lote.valorimagenBytes;
        this.NombreDocumento = this.lote.NombreDocumento;
        if (this.imagen == "")
          //this.toastr.showWarning();

        this.IdLote = this.lote.idLote;
        this.IdDocumento = this.lote.idDocumento;
        this.indexDocActual = this.lote.indexDocActual;
        this.CantidadDocumentos = this.lote.totalDocumentos;
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
        // this.arrayTiempos = this.lote.registroTiempos;
        // devuelve el valor del template ya seleccionado para el lote
        this.ArrayTemplate = this.lote.getTemplates;
        this.idTemplateSelected = this.lote.idTemplate;

        // if(this.lote.idTipoDocumental != "")
        // {
        //   this.selectTemplate.focus();
        // }
        // else{
        //   this.selectTipodoc.focus();
        // }
        if (this.lote.idTipoDocumental != "")
          //this.PrecargaTipoDoc = "Ok";
          // se crean los campos dinamicamente.
          this.fields = this.lote.lstKwXTemplate;
        this.form = new FormGroup({
          fields: new FormControl(JSON.stringify(this.fields))
        });
        this.unsubcribe = this.form.valueChanges.subscribe(update => {
          this.fields = JSON.parse(update.fields);
          this.formulario.focus();
        });
      });
      this.select.focus();
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
      if (this.imagen != "") {
        this.select.focus();
      }
    });
  }

  getLotes(colatrabajo: string, colaMsgQueue: string) {
    this.lote = [];
    this.restService.getLotes(colatrabajo, colaMsgQueue).subscribe(
      (datalote: {}) => {
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
        this.indexDocActual = this.lote.indexDocActual;
        this.CantidadDocumentos = this.lote.totalDocumentos;

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
        this.form = new FormGroup({
          fields: new FormControl(JSON.stringify(this.fields))
        });
        this.unsubcribe = this.form.valueChanges.subscribe(update => {
          this.fields = JSON.parse(update.fields);

          this.formulario.focus();
        });
      },
      error => {
        this.toastr.showWarning("No se encontraron lotes para procesar!");
      }
    );
  }

  ngDestroy() {
    this.unsubcribe();
  }

  consultarLoteDisponible() {
    this.mostrarimagen = true;
    this.mostrarFormulario = true;
  }

  onChangeTipoDocumental($event) {
    this.getTemplate(
      $event.idTipoDocumental,
      localStorage.getItem("NroIdentificacion") != null
        ? localStorage.getItem("NroIdentificacion")
        : null,
      localStorage.getItem("TipoIdentificacion") != null
        ? localStorage.getItem("TipoIdentificacion")
        : null,
      localStorage.getItem("Nombre_RazonSocial") != null
        ? localStorage.getItem("Nombre_RazonSocial")
        : null
    );
    this.selectTemplate.focus();
  }

  getTemplate(
    idTipoDocumental: any,
    NroIdentificacion: string,
    TipoIdentificacion: string,
    RazonSocial: string
  ) {
    this.ArrayTemplate = [];
    this.idTemplateSelected = "";
    this.fields = [];
    this.template = [];
    this.restService
      .getTemplate(
        idTipoDocumental,
        this.IdDocumento,
        this.categoria,
        NroIdentificacion,
        TipoIdentificacion,
        RazonSocial
      )
      .subscribe((datatemplate: {}) => {
        this.template = datatemplate;
        // devuelve el valor del template ya seleccionado para el lote
        this.ArrayTemplate = this.template.getTemplates;
        this.idTemplateSelected = this.template.idTemplate;
        this.fields = this.template.lstKwXTemplate;
        this.form = new FormGroup({
          fields: new FormControl(JSON.stringify(this.fields))
        });
        this.unsubcribe = this.form.valueChanges.subscribe(update => {
          this.fields = JSON.parse(update.fields);
        });
      });
  }

  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;

  toggleOutline() {
    this.isOutlineShown = !this.isOutlineShown;
  }

  incrementPage(amount: number) {
    this.page += amount;
  }

  incrementZoom(amount: number) {
    this.zoom += amount;
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
  pageRendered(e: CustomEvent) {}

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

  moveDivForm(movement) {
    if (movement == "up") this.divDinamico.nativeElement.scrollTop -= 20;
    else this.divDinamico.nativeElement.scrollTop += 20;
  }
}
