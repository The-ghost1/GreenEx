import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InscriptionComponent } from './inscription/inscription.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ListproduitComponent } from './listproduit/listproduit.component';
import { DetailsComponent } from './details/details.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomersOrdersComponent } from './customers-orders/customers-orders.component';


const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "acceuil", component: HomeComponent },
  { path: "connexion", component: LoginComponent },
  { path: 'listproduit', component: ListproduitComponent },
  { path: "inscription", component: InscriptionComponent },
  { path: "details", component: DetailsComponent },
  { path: "tableau-de-bord", component: DashboardComponent },
  { path: "commandes-clients", component: CustomersOrdersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

 }
