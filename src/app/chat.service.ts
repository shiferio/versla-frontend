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

  private sockets = new Map<string, any>();

  chats = new BehaviorSubject<any[]>([]);

  incomingMessage = new Subject<any>();

  constructor(
    private rest: RestApiService,
    private data: DataService
  ) {
    this.chats.subscribe(chats => {
      this.connect(chats);
    });
  }

  async getChatDisplayName(chat: any, userId: string) {
    const participants = chat['participants'];

    if (participants.length > 2) { // group chat
      return chat['display_name'];
    } else { // tet-a-tet chat
      const index = participants.findIndex(id => id !== userId);

      const res = await this.rest.getUserById(participants[index]);
      if (res['meta'].success) {
        return res['data'].user.login;
      } else {
        return participants[index];
      }
    }
  }

  sendMessage(chat: string, data: any, cb: (status) => void) {
    const socket = this.sockets.get(chat);

    socket.emit('message', data, (status) => {
      console.log(status);
      cb(status);
    });
  }

  connect(chats: Array<any>) {
    this.disconnect();

    chats.forEach(chat => {
      const socket = io.connect(`${this.apiUrl}?chat=${chat._id}`);

      socket.on('message', (data) => {
        console.log(data);
        this.incomingMessage.next({
          chat: chat,
          data: data
        });
      });

      this.sockets.set(chat._id, socket);
    });
  }

  disconnect() {
    this.sockets.forEach(socket => {
      socket.disconnect();
    });

    this.sockets.clear();
  }

  async updateChats() {
    try {
      const res = await this.rest.getAllChats();
      if (res['meta'].success) {
        const chats = res['data'].chats;
        for (const chat of chats) {
          chat['display_name'] = await this.getChatDisplayName(chat, this.data.user._id);
        }
        this.chats.next(res['data'].chats);
      }
    } catch (error) {

    }
  }

  async openNewChat(user_id: string) {
    try {
      const res = await this.rest.openNewChat(user_id);
      if (res['meta'].success) {
        await this.updateChats();
      }
    } catch (error) {

    }
  }

  getChatHistory(chat_id: string): Observable<any[]> {
    return Observable.create(async (observer) => {
      try {
        const res = await this.rest.getChatHistory(chat_id);
        if (res['meta'].success) {
          observer.next(res['data'].history);
          observer.complete();
        } else {
          return [];
        }
      } catch (error) {
        console.log(error);
        observer.error(error);
      }
    });
  }
}
