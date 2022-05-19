import { Component, OnInit } from '@angular/core';
import { foodlist } from './foodlist';

@Component({
  selector: 'app-edible',
  templateUrl: './edible.page.html',
  styleUrls: ['./edible.page.scss'],
})
export class EdiblePage implements OnInit {
  foodList = [];
  filteredFoodList = [];
  isLoading = false;
  constructor() {}

  ngOnInit() {
    this.isLoading = true;
    this.foodList = foodlist;
    this.filteredFoodList = [
      ...this.foodList.sort((a, b) => a.name.localeCompare(b.name)),
    ];
    setTimeout(() => {
      this.isLoading = false;
    }, 700);
  }

  onFilterChanged(searchBar) {
    if (searchBar.value.trim().length <= 0) {
      this.filteredFoodList = [
        ...this.foodList.sort((a, b) => a.name.localeCompare(b.name)),
      ];
    }
    this.filteredFoodList = [
      ...this.foodList
        .filter((f) =>
          f.name.toLowerCase().includes(searchBar.value.toLowerCase())
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    ];
  }
}
