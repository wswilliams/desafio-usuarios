import {Component, OnInit} from '@angular/core';
import {UsuariosService} from "../shared/usuarios.service";
import {Usuarios} from "../shared/usuarios.model";
import toastr from "toastr"

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuario-list.component.html',
  styleUrls: ['./usuario-list.component.scss']
})
export class UsuarioListComponent implements OnInit {
  usuarios: Usuarios[];
  currentPage: number = 1;
  totalPages: number;
  pageSize: number = 10;

  constructor(private usuariosService: UsuariosService) {
  }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(page: number = 0): void {
    this.usuariosService.getAll(page, this.pageSize).subscribe(
      response => {
        this.usuarios = response.users;  // Supondo que a resposta tenha um campo 'data' com os estudantes
        this.totalPages = response.total_pages;  // Supondo que a resposta tenha um campo 'totalPages'
      },
      error => alert('Erro ao carregar a lista!')
    );
  }

  deleteUser(usuario) {
    const mustDelete = confirm(`Deseja realmente excluir este estudante "${usuario.nome}" ?`);

    if (mustDelete) {
      toastr.success("Estudante excluído com sucesso!");
      this.usuariosService.delete(usuario.id).subscribe(
        () => this.usuarios = this.usuarios.filter(element => element != usuario),
        () => alert('Erro ao tentar excluir')
      )
    }
  }

  // Métodos para navegação entre páginas
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsuarios(this.currentPage + 8);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsuarios(this.currentPage);
    }
  }
}