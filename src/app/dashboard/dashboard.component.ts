import { Component, OnInit } from '@angular/core';

import { connected, getCurrentUser, closeModal } from "../../files/helpers"
import axios from "../../files/axiosConfig"

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  connected = false

  constructor() { }

  ngOnInit(): void {
  }

  userConnected = () => {
  	this.connected = connected()
  };

  getUser = () => getCurrentUser();
}
