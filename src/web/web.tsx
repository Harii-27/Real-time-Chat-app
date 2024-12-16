import { io, Socket } from "socket.io-client";
import { store } from "../Store/main";
import { appendMessage, updateUserList } from "../Store/Slice";
import { Message, User } from "../types";

class MessageService {
  private static instance: MessageService;
  private socket: Socket | null = null;
  private currentUser: User | null = null;

  private constructor() {

    this.socket = io("http://localhost:5000", {
      transports: ['websocket'],
    });


    this.socket.on("users", (users: User[]) => {
      store.dispatch(updateUserList(users));
    });


    this.socket.on("message", (message: Message) => {
      store.dispatch(appendMessage(message));
    });


    this.socket.on("connect", () => {
      console.log("Connected to server");
      if (this.currentUser) {

        this.socket?.emit("user:join", this.currentUser);
      }
    });


    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error: ", error);
    });


    this.socket.on("reconnect", () => {
      console.log("Socket reconnected.");
      if (this.currentUser) {
        this.socket?.emit("user:join", this.currentUser);
      }
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });
  }


  static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }


  connect(user: User): void {
    this.currentUser = user;

    if (this.socket?.connected) {
      this.socket.emit("user:join", user);
    } else {
      console.log("Socket is not connected yet. Waiting...");

      this.socket?.once("connect", () => {
        console.log("Socket connected. Emitting user:join.");
        this.socket?.emit("user:join", user);
      });

      this.socket?.connect();
    }
  }


  sendMessage(message: Omit<Message, "id" | "timestamp">): void {
    if (!this.socket?.connected) {
      console.error("Socket is not connected.");
      return;
    }


    this.socket?.emit("message:send", message);


    const timestamp = Date.now();
    const messageWithTimestamp = {
      ...message,
      id: `${message.senderId}-${timestamp}`,
      timestamp,
    };

    store.dispatch(appendMessage(messageWithTimestamp));
  }


  disconnect(): void {
    if (this.currentUser) {
      this.socket?.emit("user:leave", this.currentUser.id);
      this.currentUser = null;
    }
    this.socket?.disconnect();
  }
}


export const messageService = MessageService.getInstance();