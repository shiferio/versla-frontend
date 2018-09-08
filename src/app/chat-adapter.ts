import {ChatAdapter, Message, User, UserStatus} from './ng-chat';
import {from, Observable} from 'rxjs';
import {ChatService} from './chat.service';
import {DataService} from './data.service';

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
     *     'display_name': 'display_name',
     *     'participants': [participants]
     *   },
     *   data: {
     *     'from': 'sender_id',
     *     'message': 'message'
     *   }
     * }
     */
    this.chatService.incomingMessage.subscribe(async (messageData) => {
      const chatId = messageData['chat']['_id'];
      const displayName = messageData['chat']['display_name'];
      const message = messageData['data']['message'];

      this.onMessageReceived(
        {
          id: chatId,
          displayName: displayName,
          status: UserStatus.Online,
          avatar: null
        }, {
          toId: this.chatService.userId,
          fromId: chatId,
          message: message
        }
      );
    });

    /**
     * chat: {
     *   '_id': 'chat_id',
     *   'display_name': 'display_name',
     *   'participants': [participants]
     * }
     */
    this.chatService.newChat.subscribe(async (chat) => {
      const chatId = chat['_id'];
      const displayName = chat['display_name'];

      this.onNewChat({
        id: chatId,
        displayName: displayName,
        status: UserStatus.Online,
        avatar: null
      });
    });
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
      {
        chat: message['toId'],
        from: message['fromId'],
        message: message['message']
      },
      () => { });
  }

  onUserClicker(user: User): void {
    // this.chatService.markChatAsSeen(user.id);
  }
}
