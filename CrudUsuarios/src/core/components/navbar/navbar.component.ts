import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isShow: boolean;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.esconderBarrar();
  }
  public logout() {
    localStorage.clear();
    this.router.navigate(['login']);
  
  }

  public esconderBarrar() {
    let token = localStorage.getItem('token');
    if (token !== null &&
      token.toString().trim() !== null) {
        this.isShow = true;
    } else {
      this.isShow =  false;
    }
  }

}
