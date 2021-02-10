import { Component, OnInit } from '@angular/core';

import { connected } from "../../files/helpers"

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  submitText: string = ""
  connected: boolean = false;

  constructor() { }

  ngOnInit(): void {
  	this.userConnected()
  }

  userConnected() {
  	this.connected = connected();

  	if(this.connected) {
  		this.submitText = "Vous êtes connecté !"
  	}
  }

  deconnexion() {
  	this.submitText = "Vous êtes deconnecté !"
  	window.localStorage.removeItem("token")
  	window.location.replace("/")
  }
}
