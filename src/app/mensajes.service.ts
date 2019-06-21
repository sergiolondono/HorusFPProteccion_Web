import { Injectable } from '@angular/core';
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor(private toastr: ToastrService,) { }

  showSuccess() {
    this.toastr.success("", "Lote Guardado Exitosamente!");
  }

  showSuccessDescarte() {
    this.toastr.success("", "Documento Descartado Exitosamente!");
  }

  showErrorDescarte() {
    this.toastr.success("", "Error al descartar el documento!");
  }

  showError() {
    this.toastr.error("", "Error al guardar el lote!");
  }

  showWarning(message){
    this.toastr.warning("", message);
  }

}
