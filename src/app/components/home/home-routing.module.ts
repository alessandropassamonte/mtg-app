import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { UtenteComponent } from './utente/utente.component';
import { RicercaComponent } from './ricerca/ricerca.component';
import { DettaglioComponent } from './dettaglio/dettaglio.component';
import { CartePosseduteComponent } from './utente/carte-possedute/carte-possedute.component';
import { GestioneOrdiniComponent } from './utente/gestione-ordini/gestione-ordini.component';
import { OrdineFormComponent } from './utente/gestione-ordini/ordine-form/ordine-form.component';
import { CartePosseduteFormComponent } from './utente/carte-possedute/carte-possedute-form/carte-possedute-form.component';
import { CardScanComponent } from '../login/card-scan/card-scan.component';
import { CollectionComponent } from './collection/collection.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'utente', component: UtenteComponent},
  {path: 'utente/carte', component: CartePosseduteComponent},
  {path: 'utente/carte/aggiungi', component: CartePosseduteFormComponent},
  {path: 'utente/carte/aggiungi/scan', component: CardScanComponent},
  {path: 'utente/ordini', component: GestioneOrdiniComponent},
  {path: 'utente/ordini/form', component: OrdineFormComponent},
  {path: 'collection', component: CollectionComponent},
  {path: 'ricerca', component: RicercaComponent},
  { path: 'dettaglio/:id', component: DettaglioComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
