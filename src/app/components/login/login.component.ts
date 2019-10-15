import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SweetMessageService } from 'src/app/services/sweet-message.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
 
  //endpoint = "http://localhost:56121/api/";
  APIEndpoint = environment.APIEndpoint;

  token;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private message: SweetMessageService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      usuario: ["", Validators.required],
      clave: ["", Validators.required]
    });
  }
  isFieldInvalid(field: string) {
    return (
      (!this.form.get(field).valid && this.form.get(field).touched) ||
      (this.form.get(field).untouched && this.formSubmitAttempt)
    );
  }

  onSubmit(formulario) {
    let credentials = {
      userName: formulario.usuario,
      password: formulario.clave
    };

    if (this.form.valid) {
      this.message.showLoading();
      return this.http
        .post(this.APIEndpoint + "login/authenticate", credentials)
        .subscribe(
          data => {
            this.message.close();

            this.token = data;
            localStorage.setItem("token", this.token);
            localStorage.setItem("usuario", credentials.userName);

            this.router.navigateByUrl("/colas");
          },
          error => {
            console.log(error.error.Message);
            if(error.error.Message != null)
              this.message.showError(error.error.Message);
            else  
              this.message.showError(error.message);
          }
        );
    }
    this.formSubmitAttempt = true;
  }
}
