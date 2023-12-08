
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchCriteria } from '../entity/SearchCriteria';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {

  constructor(private formBuilder: FormBuilder) {}

  @Output() reset: EventEmitter<void> = new EventEmitter<void>();
  @Output() search: EventEmitter<void> = new EventEmitter<void>();
  @Input()  criteria: SearchCriteria = new SearchCriteria();
  selectedRegion: string = '';
  selectedType: string = '';
  selectedAriacondizionata: boolean = false;
  services = this.formBuilder.group({
    parcheggio:  false,
    ariacondizionata: false,
    wifi: false,
  });

  onSearchClick(): void {
    this.criteria.ariacondizionata = this.services.get('ariacondizionata')!.value!
    this.criteria.parcheggio = this.services.get('parcheggio')!.value!
    this.criteria.wifi = this.services.get('wifi')!.value!
    this.search.emit();
  }

  onResetClick(): void {
    this.reset.emit();
  }

  setRegion(regione: string) {
    this.criteria.regione = regione.toLowerCase();
    this.selectedRegion = regione;
  }

  setType(tipo: string) {
    this.criteria.tipoStanza = tipo.toLowerCase();
    this.selectedType = tipo;
  }

  

}