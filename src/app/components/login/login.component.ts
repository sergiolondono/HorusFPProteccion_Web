import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  private formSubmitAttempt: boolean;
 
  endpoint = "http://localhost:56121/api/";
  //endpoint = "http://192.168.213.196:8080/HorusFPService/api/"; 

  token;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
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
  showError() {
    this.toastr.error(
      "",
      "Usuario o contraseña incorrectos o el usuario ya esta logueado!"
    );
  }
  onSubmit(formulario) {
    let credentials = {
      userName: formulario.usuario,
      password: formulario.clave
    };

    if (this.form.valid) {
      return this.http
        .post(this.endpoint + "login/authenticate", credentials)
        .subscribe(
          data => {
            this.token = data;
            console.log("POST Request is successful", data);
            localStorage.setItem("token", this.token);
            localStorage.setItem("usuario", credentials.userName);

            this.router.navigateByUrl("/colas");
          },
          error => {
            this.showError();
          }
        );
    }
    this.formSubmitAttempt = true;
  }
}
