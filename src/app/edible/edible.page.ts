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
  constructor() {}

  ngOnInit() {
    this.foodList = foodlist;
    this.filteredFoodList = [
      ...this.foodList.sort((a, b) => a.food.localeCompare(b.food)),
    ];
  }

  onFilterChanged(searchBar) {
    if (searchBar.value.trim().length <= 0) {
      this.filteredFoodList = [
        ...this.foodList.sort((a, b) => a.food.localeCompare(b.food)),
      ];
    }
    this.filteredFoodList = [
      ...this.foodList
        .filter((f) =>
          f.food.toLowerCase().includes(searchBar.value.toLowerCase())
        )
        .sort((a, b) => a.food.localeCompare(b.food)),
    ];
  }
}
