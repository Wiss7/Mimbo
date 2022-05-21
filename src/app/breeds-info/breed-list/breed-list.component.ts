import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-breed-list',
  templateUrl: './breed-list.component.html',
  styleUrls: ['./breed-list.component.scss'],
})
export class BreedListComponent implements OnInit {
  @Input() breedsList;
  filteredBreedsList = [];
  isLoading = false;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.isLoading = true;
    this.filteredBreedsList = [...this.breedsList];
    setTimeout(() => {
      this.isLoading = false;
    }, 600);
  }
  onFilterChanged(searchBar) {
    if (searchBar.value.trim().length <= 0) {
      this.filteredBreedsList = [
        ...this.breedsList.sort((a, b) => a.name.localeCompare(b.name)),
      ];
    }
    this.filteredBreedsList = [
      ...this.breedsList
        .filter((b) =>
          b.name.toLowerCase().includes(searchBar.value.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    ];
  }
  onClose() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  onSelect(breed) {
    this.modalCtrl.dismiss({ breedId: breed.id }, 'select');
  }
}
