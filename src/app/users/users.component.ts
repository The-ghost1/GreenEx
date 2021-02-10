import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import Swal from 'sweetalert2'

import axios from "../../files/axiosConfig"
import { connected, getCurrentUser, closeModal } from "../../files/helpers"

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class UsersComponent implements OnInit {
  users = [];
  name = "";
  firstname = "";
  email = "";
  password = "";
  role = "";
  action = "creation"
  user = {}

  constructor(   ) { }

  ngOnInit(): void {
  	this.getUtilisateurs()
  }

  /*
  *
  * Récupération des Utilisateurs
  */
  getUtilisateurs = async () => {
  	const url = "/users"

  	await axios.get(url).then(response => {
  		const data = response.data;

  		this.users = data
  	});
  }

  getValues = (event) => {
  	const value = event.target.value;
  	const name = event.target.name;
  	this[name] = value;
  }

  /*
  *
  *Création d'un utilisateur
  */
  creerUtilisateur = async () => {
  	this.action = "creation"
  	const url = "/create-user"

  	await axios.post(url, {
  		name: this.name,
  		firstname: this.firstname,
  		email: this.email,
  		password: this.password,
  		role: this.role,
  	}).then(response => {
  		const data = response.data;

  		if (data.status === "success") {
  			const user = { name: this.name, firstname: this.firstname, email: this.email, role: this.role };

  			this.users.push(user);
  			closeModal();
  			this.viderValeurUtilisateur()
  		}
  		return Swal.fire({
  			icon: data.status,
  			title: data.title,
  			text: data.message,
  		})
  	});
  }

  /*
  *
  * Définir les valeurs de l'utilisateur avant de la modifier
  */
  setValeurUtilisateur = (user) => {
  	this.action = "modification"
  	this.user = user;
  	this.name = user.name
  	this.firstname = user.firstname
  	this.email = user.email
  	this.role = user.role
  }

  /*
  *
  * Vider les valeurs de l'utilisateur
  */
  viderValeurUtilisateur = () => {
  	this.name = ""
  	this.firstname = ""
  	this.email = ""
  	this.role = ""
  	this.password = ""
  }

  /*
  *
  * Modifier les valeurs d'un utilisateur
  */
  modifierUtilisateur = async (user) => {
  	const url = `/edit-user/${user.id}`

  	await axios.put(url, {
  		name: this.name,
  		firstname: this.firstname,
  		email: this.email,
  		password: this.password,
  		role: this.role,
  	}).then(response => {
  		const data = response.data;

  		if (data.status === "success") {
  			closeModal();
  			this.viderValeurUtilisateur();
  		}
  		return Swal.fire({
  			icon: data.status,
  			title: data.title,
  			text: data.message,
  		})
  	});
  }

  /*
  *
  * Supprimer un utilisateur
  */
  supprimerUtilisateur = async (user) => {
  	const url = `/delete-user/${user.id}`

  	return Swal.fire({
  		title: 'Êtes-vous sûre ?',
  		text: "Cette action est irreversible !",
  		icon: 'warning',
  		showCancelButton: true,
  		confirmButtonColor: '#3085d6',
  		cancelButtonColor: '#d33',
  		confirmButtonText: 'Yes, delete it !'
  	}).then(async (result) => {
  		if (result.isConfirmed) {
  			await axios.delete(url).then(response => {
  				Swal.fire(
  					'Suppression réuissie !',
  					"L'utilisateur à été supprimé avec succès !",
  					'success'
  				)
  			});
  		}
  	})
  }

}
