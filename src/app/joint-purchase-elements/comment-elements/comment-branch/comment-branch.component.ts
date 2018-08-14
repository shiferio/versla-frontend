import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommentModel} from '../comment-model';
import {CommentSettings} from '../comment-settings';

@Component({
  selector: 'app-comment-branch',
  templateUrl: './comment-branch.component.html',
  styleUrls: ['./comment-branch.component.scss']
})
export class CommentBranchComponent implements OnInit {

  @Input('comment')
  comment: CommentModel;

  @Input('parent')
  parent: string;

  @Input('level')
  level: number;

  @Input('settings')
  settings: CommentSettings = {
    creatorLogin: null,
    canReply: false
  };

  @Output('commentSent')
  commentSent = new EventEmitter();

  replyVisible = false;

  constructor() { }

  ngOnInit() { }

  onSend() {
    this.replyVisible = false;
    this.commentSent.emit();
  }

}
