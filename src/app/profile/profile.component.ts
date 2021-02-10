import { Component, OnInit } from '@angular/core';
import { getCurrentUser } from "../../files/helpers"

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  getUser = () => getCurrentUser();
}
