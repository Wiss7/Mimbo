import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DogService } from '../account/mydogs/dogs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.page.html',
  styleUrls: ['./birthday.page.scss'],
})
export class BirthdayPage implements OnInit {
  dogId = 0;
  name = '';
  dogImage = '';
  getSub: Subscription;
  isLoading = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    private dogService: DogService
  ) {}

  ngOnInit() {
    this.dogId = +this.activatedRoute.snapshot.params.id;
    if (this.dogId > 0) {
      this.getSub = this.dogService.getDogById(this.dogId).subscribe((dog) => {
        this.name = dog.name;
        this.isLoading = false;
        if (dog.imageUrl.length > 0) {
          this.dogImage = dog.imageUrl;
        }
      });
    }
  }
}
