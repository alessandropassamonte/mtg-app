import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeNavComponent } from './home-nav/home-nav.component';
import { HomeSearchComponent } from './home-search/home-search.component';
import { UtenteComponent } from './utente/utente.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { RicercaComponent } from './ricerca/ricerca.component';
import { JwtModule } from '@auth0/angular-jwt';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DettaglioComponent } from './dettaglio/dettaglio.component';
import { CartePosseduteComponent } from './utente/carte-possedute/carte-possedute.component';
import { GestioneOrdiniComponent } from './utente/gestione-ordini/gestione-ordini.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { OrdineFormComponent } from './utente/gestione-ordini/ordine-form/ordine-form.component';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { CartePosseduteFormComponent } from './utente/carte-possedute/carte-possedute-form/carte-possedute-form.component';
import { CollectionComponent } from './collection/collection.component';
import { PosseduteComponent } from './collection/possedute/possedute.component';
import { EdizioniComponent } from './collection/edizioni/edizioni.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [HomeComponent, HomeNavComponent, HomeSearchComponent, UtenteComponent, RicercaComponent, DettaglioComponent, CartePosseduteComponent, GestioneOrdiniComponent, OrdineFormComponent, CartePosseduteFormComponent, CollectionComponent, PosseduteComponent, EdizioniComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormsModule,
    BsDatepickerModule,
    PaginationModule,
    TypeaheadModule,
    TooltipModule,
    PopoverModule,
    IonicModule
  ]
})
export class HomeModule { }
