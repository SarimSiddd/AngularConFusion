import { Component, OnInit, Inject } from '@angular/core';

import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;	
  leader: Leader;
  disherrMess: string;
	
  constructor(private dishservice: DishService,
    private promotionservice: PromotionService, private leaderService: LeaderService,  @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {

    this.dishservice.getFeaturedDish().subscribe(dishes => this.dish = dishes,   disherrmess => this.disherrMess = <any>disherrmess);
    this.promotionservice.getFeaturedPromotion().subscribe(promotions => this.promotion = promotions);
    this.leaderService.getFeaturedLeader().subscribe(leaders=> this.leader = leaders);
  }

}
