import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import axios from "../../files/axiosConfig"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	connectionFormGroup: FormGroup;
  	submitText: string = "";
  	submitted: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.connectionFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  get f() {
    return this.connectionFormGroup.controls;
  }

  // saisirEmail(event) {
  //   const value: string = event.target.value;
  //   this.email = value
  // }

  // saisirPassword(event) {
  //   const value: string = event.target.value;
  //   this.password = value;
  // }

  async connection() {
    this.submitted = true;

    if (this.connectionFormGroup.invalid) { 
    	return;
    }

    const data = {
    	email: this.f.email.value,
      password: this.f.password.value,
    }

    const url = "http://localhost:8080/connexion"
    await axios.post(url, data).then((response) => {
      const responseData = response.data;

      if (typeof responseData == "string") {
        this.submitText = responseData
      } else {
        window.localStorage.setItem("token", responseData.token);
        window.localStorage.setItem("user", JSON.stringify(responseData.user));

        // this.email = ""
        // this.password = ""
        this.connectionFormGroup.reset();
        this.submitted = false;

        window.location.replace("/")
      }
    });
  }
}










