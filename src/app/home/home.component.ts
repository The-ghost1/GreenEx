import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	submitText: string = "";
	connected: boolean = false;

  constructor() { }

  ngOnInit(): void {

  }

  userConnected() {
  	this.connected = window.localStorage.getItem("connected") == "true";

  	if (this.connected) {
  		this.submitText = "Vous êtes connecté !"
  	}
  }
}
