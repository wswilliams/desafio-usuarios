import {AfterContentChecked, Component, OnInit} from '@angular/core';
import {UsuariosService} from "../shared/usuarios.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Usuarios} from "../shared/usuarios.model";
import {switchMap} from "rxjs/operators";

import toastr from "toastr";

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.scss']
})
export class UsuarioFormComponent implements OnInit, AfterContentChecked {
  currentAction: string;
  usuarioForm: FormGroup;
  pageTitle: string;
  serverErrorMessage: string[] = null;
  submittingForm: boolean = false;
  usuario: Usuarios = new Usuarios();
  listaEstados: string[] = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];


  constructor(
    private usuarioService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildUsuariosForm();
    this.loadUsuarios();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle()
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction == 'new')
      this.createUsuarios()
    else
      this.updateUsuarios()
  }

  //PRIVATE METHODS

  private setPageTitle() {
    if (this.currentAction == 'new')
      this.pageTitle = 'Cadastro de Novo Usuários'
    else {
      const usuarioName = this.usuario.nome || ''
      this.pageTitle = 'Editando o Usuários: ' + usuarioName;
    }
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new'
    else
      this.currentAction = 'edit'
  }

  private buildUsuariosForm() {
    this.usuarioForm = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.minLength(5)]],
      senha: [null, [Validators.required, Validators.minLength(5)]],
      tipo: [null, [Validators.required]],
      status: [null, [Validators.required]]
    })

  }

  private loadUsuarios() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.usuarioService.getById(Number(params.get("id"))))
      )
        .subscribe(
          (usuario) => {
            this.usuario = usuario;
            this.usuarioForm.patchValue(usuario); // set values on form
          },
          (error) => alert('Ocorreu um error no servidor, tente mais tarde!')
        )
    }
  }

  private createUsuarios() {
    const usuario: Usuarios = Object.assign(new Usuarios(), this.usuarioForm.value)
    usuario.id = this.getIdNext();
    this.usuarioService.create(usuario)
      .subscribe(
        usuario => this.actionsForSuccess(usuario),
        error => this.actionsForError(error)
      )
  }

  private getIdNext(): number {
    const usuarios: Usuarios[] = JSON.parse(localStorage.getItem("usuarios"))
    return (usuarios && usuarios.length > 0) ? Math.max(...usuarios.map(usuarios => usuarios.id)) + 1 : 1;
  }

  private updateUsuarios() {
    const usuarios: Usuarios = Object.assign(new Usuarios(), this.usuarioForm.value)
    const mustUpdate = confirm(`Deseja realmente atualizar este usuários "${usuarios.nome}" ?`);

    if (mustUpdate) {
      this.usuarioService.update(usuarios).subscribe(
        usuarios => this.actionsForSuccess(usuarios),
        error => this.actionsForError(error)
      )
    }
  }

  private actionsForSuccess(usuario: Usuarios): void {
    toastr.success("Solicitação processada com sucesso!");

    this.router.navigateByUrl('usuarios', {skipLocationChange: true}).then(
      () => this.router.navigate(['usuarios', usuario.id, 'edit'])
    )
  }

  private actionsForError(error: any): void {
    toastr.error("Ocorreu um erro ao processar a sua solicitação!");
    this.submittingForm = false;
    console.error(error);
    if (error.status === 422)
      this.serverErrorMessage = error;
    else
      this.serverErrorMessage = ["Falha na comunicação com o servidor. Por favor, tente mais tarde!"]
  }
}
