import { Message } from './message';
import { User } from './user';

export class Window {
    public chattingTo: User;
    public messages: Message[] = [];
    public newMessage = '';

    // UI Behavior properties
    public isCollapsed = false;
    public isLoadingHistory = false;
    public hasFocus = false;
}
