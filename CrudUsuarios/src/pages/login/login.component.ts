import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {UsuariosService} from "../usuarios/shared/usuarios.service";
import toastr from "toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginValid = true;
  public email = '';
  public senha = '';

  loginForm: FormGroup;
  LoginRequestDTO = { senha: '', email: '' };
  token: any;
  serverErrorMessage: string[] = null;
  submittingForm: boolean = false;

  constructor(
    private loginService: UsuariosService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }



  ngOnInit() {
    this.buildUsuariosForm();
    this.token = localStorage.getItem('token');
    if (this.token !== null &&
      this.token.toString().trim() !== null) {
      this.router.navigate(['/home']);
    }
  }

  private buildUsuariosForm() {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.minLength(5)]],
      senha: [null, [Validators.required, Validators.minLength(3)]],
    })
  }

  public onSubmit() {
    this.submittingForm = true;
    this.LoginRequestDTO.email = this.loginForm.get('email')?.value;
    this.LoginRequestDTO.senha = this.loginForm.get('senha')?.value;
    
    this.loginService.login(this.LoginRequestDTO)
    .subscribe(
      usuario => this.actionsForSuccess(usuario),
      error => this.actionsForError(error)
    )
  }

  private actionsForSuccess(usuario: any): void {
    toastr.success("Solicitação processada com sucesso!");
      this.router.navigate(['home']);
  }

  private actionsForError(error: any): void {
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");
    this.submittingForm = false;
    console.error(error);
    if (error.status === 401)
      this.serverErrorMessage = error;
    else
      this.serverErrorMessage = ["Falha na comunicação com o servidor. Por favor, tente mais tarde!"]
  }

  // public recuperar() {
  //   this.loginService.recuperar(this.LoginRequestDTO.email);
  // }
}
