import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import axios from "axios"

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent implements OnInit {
	
	inscriptionFormGroup: FormGroup;
	submitText: string = "";
	submitted: boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.inscriptionFormGroup = this.formBuilder.group({
		name: ['', [Validators.required]],
		firstname: ['', [Validators.required]],
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required]]
	})
  }
  
	get f() {
		return this.inscriptionFormGroup.controls;
	}

	async inscription() {
		this.submitted = true;

		if (this.inscriptionFormGroup.invalid) {
			return;
		}

		const data = {
			name: this.f.name.value,
			firstname: this.f.firstname.value,
			email: this.f.email.value,
			password: this.f.password.value
		}

		const url = "http://localhost:8080/inscription"
		await axios.post(url, data).then((response) => {
			this.submitText = response.data
			this.inscriptionFormGroup.reset();
			this.submitted = false;

			setTimeout(function () {
				window.location.replace("/connexion")
			}, 2000)
		});
	}

}
