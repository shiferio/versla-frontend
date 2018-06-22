import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {DataService} from '../data.service';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

@Component({
  selector: 'app-new-comment',
  templateUrl: './new-comment.component.html',
  styleUrls: ['./new-comment.component.scss']
})
export class NewCommentComponent implements OnInit {
  @Input('good_id')
  good_id: number;

  @Output('onCommentAdded')
  onCommentAdded = new EventEmitter();

  @Input('comment_id')
  comment_id: string;

  title = '';

  text = '';

  constructor(
    private data: DataService
  ) { }

  ngOnInit() {
  }

  validate(): boolean {
    if (this.title) {
      if (this.text) {
        return true;
      } else {
        this
          .data
          .addToast('Ошибка', 'Коментарий не может быть пустым', 'error');
        return false;
      }
    } else {
      this
        .data
        .addToast('Ошибка', 'Введите заголовок коментария', 'error');
      return false;
    }
  }

  addComment() {
    if (this.validate()) {
      this.onCommentAdded.emit({
        good_id: this.good_id,
        comment_id: this.comment_id,
        title: this.title,
        text: this.text
      });
    }
  }

}
