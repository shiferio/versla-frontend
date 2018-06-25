import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';


@Component({
  selector: 'app-integer-counter',
  templateUrl: './integer-counter.component.html',
  styleUrls: ['./integer-counter.component.scss']
})
export class IntegerCounterComponent implements OnInit {
  @Input('initial')
  initial: number;

  @Input('goodId')
  goodId: number;

  @Input('minimal')
  minimal: number;

  @Output('onCounterChange')
  onCounterChange = new EventEmitter();

  counter = 0;

  constructor() { }

  ngOnInit() {
    this.counter = this.initial || 0;
    this.minimal = this.minimal || 0;
  }

  increment() {
    this.counter++;
    this.onCounterChange.emit({
      good_id: this.goodId,
      counter: this.counter
    });
  }

  decrement() {
    if (this.counter > this.minimal) {
      this.counter--;
      this.onCounterChange.emit({
        good_id: this.goodId,
        counter: this.counter
      });
    }
  }

}
