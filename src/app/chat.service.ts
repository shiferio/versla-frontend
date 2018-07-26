import {Injectable} from '@angular/core';
import {RestApiService} from './rest-api.service';
import {Subject, Observable, BehaviorSubject} from 'rxjs';
import io from 'socket.io-client';
import {environment} from '../environments/environment';
import {DataService} from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = environment.apiUrl;

  private socket: any;

  private chatsInfo = new Map<string, any>();

  private _userId = '';

  chats = new Subject<any[]>();

  incomingMessage = new Subject<any>();

  constructor(
    private rest: RestApiService,
    private data: DataService
  ) {
    this.data.observableUser.subscribe(user => {
      if (user && this._userId !== user['_id']) {
        this._userId = user['_id'];
        this.connect();
      }
    });
  }

  get userId(): string {
    return this._userId;
  }

  private async getChatDisplayName(chat: any) {
    if (this.chatsInfo.has(chat['_id'])) {
      return this.chatsInfo.get(chat['_id'])['display_name'];
    }

    const participants = chat['participants'];

    if (participants.length > 2) { // group chat
      return chat['display_name'];
    } else { // tet-a-tet chat
      const index = participants.findIndex(id => id !== this.userId);

      const res = await this.rest.getUserById(participants[index]);
      if (res['meta'].success) {
        return res['data'].user.login;
      } else {
        return participants[index];
      }
    }
  }

  private async normalizeChats(chats: Array<any>) {
    for (const chat of chats) {
      chat['display_name'] = await this.getChatDisplayName(chat);
      this.chatsInfo.set(chat['_id'], chat);
    }
  }

  sendMessage(data: any, cb: (status) => void) {
    this.socket.emit('message', data, (status) => {
      console.log(status);
      cb(status);
    });
  }

  markChatAsSeen(chatId: string) {
    const data = {
      chat: chatId,
      user: this.userId
    };

    this.socket.emit('seen', data, (status) => {
      console.log(status);
    });
  }

  connect() {
    this.disconnect();

    this.socket = io.connect(`${this.apiUrl}?user=${this.data.user._id}`);

    /**
     * data: {
     *   chat: 'chat_id',
     *   from: 'from_id',
     *   message: 'message'
     * }
     */
    this.socket.on('message', (data) => {
      console.log(data);
      const {chat, from, message} = data;
      const chatInfo = this.chatsInfo.get(chat);

      this.incomingMessage.next({
        chat: chatInfo,
        data: {
          from,
          message
        }
      });
    });

    /**
     * data: {
     *   chats: [chats]
     * }
     */
    this.socket.on('allchats', async (data) => {
      console.log(data);
      const {chats} = data;
      await this.normalizeChats(chats);
      this.chats.next(chats);
    });

    this.updateChats();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.chatsInfo.clear();
  }

  updateChats() {
    this
      .rest
      .getAllChats()
      .then(async (res) => {
        const chats = res['data']['chats'];
        await this.normalizeChats(chats);
        this.chats.next(chats);
      })
      .catch(err => console.log(err));
  }

  async openNewChat(toId: string) {
    if (this.socket) {
      const data = {
        from: this.userId,
        to: toId
      };

      this.socket.emit('newchat', data, (status) => {
        console.log(status);
      });
    }
  }

  getChatHistory(chatId: string): Observable<any[]> {
    return Observable.create(async (observer) => {
      try {
        const res = await this.rest.getChatHistory(chatId);
        if (res['meta'].success) {
          observer.next(res['data'].history);
          observer.complete();
        } else {
          console.log(res['meta'].message);
          observer.error(res['meta'].message);
        }
      } catch (error) {
        console.log(error);
        observer.error(error);
      }
    });
  }
}
