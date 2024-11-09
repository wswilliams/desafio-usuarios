import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuariosService } from '../usuarios/shared/usuarios.service';


@Injectable({
  providedIn: 'root'
})
export class GuardiaoGuard implements CanActivate {

  constructor(private userService: UsuariosService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    console.info("Chamando guardião");

    // Verifica se o usuário está autenticado
    if (this.userService.userAutenticado()) {
      return true; // O usuário está autenticado, permite o acesso
    } else {
      this.router.navigate(['/login']); // Redireciona para a tela de login
      return false; // Bloqueia o acesso à rota
    }
  }
}
