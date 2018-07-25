import { ChatAdapter, User, Message, UserStatus } from 'ng-chat';
import { Observable, from } from 'rxjs';
import {ChatService} from './chat.service';
import { DataService } from './data.service';

export class VerslaChatAdapter extends ChatAdapter {

  constructor(
    private chatService: ChatService,
    private data: DataService
  ) {
    super();

    /**
     * message: {
     *   chat: {
     *     '_id': 'chat_id',
     *     'participants': [participants]
     *   },
     *   data: {
     *     'from': 'sender_id',
     *     'message': 'message'
     *   }
     * }
     */
    this.chatService.incomingMessage.subscribe(async (message) => {
      const displayName = await this
        .chatService
        .getChatDisplayName(
          message['chat'],
          this.data.user._id
        );
      const chatId = message['chat']['_id'];

      this.onMessageReceived(
        {
          id: chatId,
          displayName: displayName,
          status: UserStatus.Online,
          avatar: null
        }, {
          toId: this.data.user._id,
          fromId: chatId,
          message: message['data']['message']
        }
      );
    });

    this.chatService.updateChats();
  }

  listFriends(): Observable<User[]> {
    const sub = from<any[]>(this.chatService.chats)
      .map(chats => {
        return chats.map(chat => ({
          id: chat['_id'],
          displayName: chat['display_name'],
          status: UserStatus.Online,
          avatar: null
        }));
      });
    this.chatService.updateChats();
    return sub;
  }

  getMessageHistory(userId: any): Observable<Message[]> {
    const currentUserId = this.data.user._id;
    return this
      .chatService
      .getChatHistory(userId)
      .map(messages => {
        return messages.map(message => {
          const toId = currentUserId === message['from'] ? message['chat'] : message['from'];
          const fromId = currentUserId !== message['from'] ? message['chat'] : message['from'];

          return {
            toId: toId,
            fromId: fromId,
            message: message['message'],
            seenOn: new Date(message['date'])
          };
        });
      });
  }

  sendMessage(message: Message): void {
    this.chatService.sendMessage(
      message.toId,
      {
        from: message['fromId'],
        message: message['message']
      },
      () => { });
  }
}
