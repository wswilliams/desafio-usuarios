import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Router } from '@angular/router';
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Usuarios } from './usuarios.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  // Alterado para URL externa do backend
  private apiPath: string = "http://localhost:8003/users"; 
  token: any;
  
  constructor(private http: HttpClient, private router: Router) {
    this.token = localStorage.getItem('token'); // Ou onde quer que você tenha armazenado o token
    
   }

  getAll(page: number = 1, pageSize: number = 10): Observable<any> {
    const url = `${this.apiPath}?limit=${pageSize}&offset=${page}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(url,{ headers }).pipe(
      catchError(this.handleError),
      map(response => response)  // Ajustado para lidar com o formato da resposta paginada
    );
  }

  getById(id: number): Observable<Usuarios> {
    const url = `${this.apiPath}/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(url,{ headers }).pipe(
      catchError(this.handleError),
      map(this.jsonDataToUsuario)
    );
  }

  create(usuario: Usuarios): Observable<Usuarios> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(this.apiPath, usuario, { headers }).pipe(
      catchError(this.handleError),
      map(this.jsonDataToUsuario)
    );
  }

  update(usuario: Usuarios): Observable<Usuarios> {
    const url = `${this.apiPath}/${usuario.id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(url, usuario, { headers }).pipe(
      catchError(this.handleError),
      map(() => usuario)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(url, { headers }).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  //Private Methods
  private jsonDataToUsuarios(jsonData: any[]): Usuarios[] {
    const usuarios: Usuarios[] = [];
    jsonData.forEach(element => usuarios.push(element as Usuarios));
    return usuarios;
  }

  private jsonDataToUsuario(jsonData: any): Usuarios {
    return jsonData as Usuarios;
  }

  private jsonDataToTokem(jsonData: any): any {
    var token = JSON.parse(JSON.stringify(jsonData));
    localStorage.setItem("token", token.access_token);
    return token.access_token
  }

  private handleError(error: any): Observable<any> {
    console.error('An error occurred', error);
    return throwError(error);
  }

  public login(usuario: any) : Observable<any> {
   return this.http.post(`${this.apiPath}/login`,
    usuario,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    ).pipe(
      catchError(this.handleError),
      map(this.jsonDataToTokem)
    );
  }

  userAutenticado() {
    this.token = localStorage.getItem('token');
    if (this.token !== null &&
      this.token.toString().trim() !== null) {
        return this.token;
    } else {
      return null;
    }
  }

  getUserStats(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiPath}/user-stats`, { headers });
  }
}