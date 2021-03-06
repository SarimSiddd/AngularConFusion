import { Component, OnInit, Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/Comment';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { visibility } from '../animations/app.animation';
import { flyInOut } from '../animations/app.animation';
import { expand} from '../animations/app.animation';

import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
  '[@flyInOut]': 'true',
  'style': 'display: block;'
  },
   animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})

export class DishdetailComponent implements OnInit {

  disherrMess: string;
  dish: Dish;
  dishIds: number[];
  prev: number;
  next: number;
  CommentForm : FormGroup;
  comment: Comment;
  dishcopy = null;
  visibility = 'shown';
  
  constructor(private dishservice: DishService, private route: ActivatedRoute,
    private location: Location, private fb: FormBuilder,  @Inject('BaseURL') private BaseURL) {

     this.createForm();
     }

  ngOnInit() {

    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds,  errmess => this.disherrMess = <any>errmess);
    this.route.params
    .switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); })
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
    errmess => { this.dish = null; this.disherrMess = <any>errmess; });

  
  }


   goBack(): void {
    this.location.back();
  }

  setPrevNext(dishId: number) {
    let index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
  }

     createForm() {
      this.CommentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: ['5', Validators.required],
      comment:['', Validators.required]
    });

    this.CommentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();

}

   formErrors = {
    'author': '',
    'comment': ' '
  };


  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.'
    },

    'comment': {
      'required': 'Comment is required.'

    },
   
  };


   onValueChanged(data?: any) {
    if (!this.CommentForm) { return; }
    const form = this.CommentForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

   onSubmit() {
    var d = new Date();
    var n = d.toISOString();
    this.comment = this.CommentForm.value;
    this.comment.date = n;
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishcopy.save()
    .subscribe(dish => { this.dish = dish; console.log(this.dish); });
    this.CommentForm.reset({
     author: '',
     rating: '5',
     comment: ''
    });
  }

}
