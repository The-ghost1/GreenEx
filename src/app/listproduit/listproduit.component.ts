import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { closeModal } from 'src/files/helpers';
import Swal from 'sweetalert2';

import axios from '../../files/axiosConfig';

@Component({
  selector: 'app-listproduit',
  templateUrl: './listproduit.component.html',
  styleUrls: ['./listproduit.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default

})
export class ListproduitComponent implements OnInit {
	produits = [];
	temperature = "";
	eau = "";
	gaz = "";
	libelle="";
	id = "";
	action = "creation";
	produit = {};
	ajouterFormGroup: FormGroup;
	submitText: string = "";
	submitted: boolean = false;
	constructor(	private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.getProduits(),
	this.ajouterFormGroup = this.formBuilder.group({
		eau: ['', [Validators.required]],
		gaz: ['', [Validators.required]],
		temperature: ['', [Validators.required]],
		libelle: ['', [Validators.required]]
	})
    }
	get f() {
		return this.ajouterFormGroup.controls;
	}

  getProduits = async () => {
		const url = "/listproduit"

		await axios.get(url).then(response => {
			const data = response.data;
	
			this.produits = data
		});
	}
	
	
	getValues = (event) => {
			const value = event.target.value;
			const name = event.target.name;
			this[name] = value;
	}
	


	/*
	*
	* Creation d'un produit
	*/

    async creerProduit() {
		this.submitted = true;

		if (this.ajouterFormGroup.invalid) {
			return;
		}

		const data = {
			libelle: this.f.libelle.value,
			eau: this.f.eau.value,
			gaz: this.f.gaz.value,
			temperature: this.f.temperature.value
		}

		const url = "http://localhost:8080/create-produit"
		await axios.post(url, data).then((response) => {
			this.submitText = response.data
			this.ajouterFormGroup.reset();
			this.submitted = false;
			setTimeout(function () {
				window.location.replace("/listproduit")
			}, 2000)
		});
	}

/*
  *
  * Suppression d'un produit
*/
 supprimerProduit = async (produit) => {
    const url = `/delete-produit/${produit.id}` 

    return Swal.fire({
      title: 'Êtes-vous sure ?',
      text: "Cette action est irreversible !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: "Ok daccord!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(url).then(response => {
        Swal.fire(
            'Suppression réuissie!',
            "La demande a été supprimée avec succès !",
            'success'
          )
      });
      }
    })
  }

   /*
  *
  * Definir les valeurs de la demande avant la modification
  */
 setValeurProduit = (produit) => {
	this.eau = produit.eau
	this.libelle = produit.libelle
    this.gaz = produit.gaz
	this.temperature = produit.temperature 
	this.produit = produit

  }

 /*
  *
  * Clear request values
  */
 viderValeurProduit = () => {
	this.eau ="";
	this.gaz ="";
	this.temperature ="";
	this.libelle="";

 }
 
  
 /*
  *
  * Modification d'un produit
  */
 
 

  modifierProduit = async (produit) => {
 
	const url = `/edit-produit/${produit.id}` 

	await axios.put(url, {
      eau: this.eau,
      gaz: this.gaz, 
	  temperature: this.temperature,
	  libelle: this.libelle 

		}).then(response => {
			const data = response.data;

			if (data.status === "success") {
				closeModal();				
				this.viderValeurProduit();
			}
			return Swal.fire({
			  icon: data.status,
			  title: data.title,
			  text: data.message,
			})
		});
	}

}
