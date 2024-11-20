import { BehaviorSubject } from "rxjs";
import { BASE_SERVICE } from "./Data/CenterData";
import { io } from "socket.io-client";

export const SOCKET_EVENTS = {
  ERROR: "error",
  CONNECT: "connect",
  DISCONNECT: "disconnect",
};

class SocketService {
  constructor() {
    this.socketEvent = new BehaviorSubject(null);
    this.socket = null;
  }

  connectSocket() {
    if (!this.socket || !this.socket.connected) {
      this.socket = io(`${BASE_SERVICE}/`, {
        transports: ["websocket"],
        auth: {
          token: localStorage.getItem("jwtToken"),
        },
      });

      this.socket.on("connect", () => {
        this.socketEvent.next({
          type: SOCKET_EVENTS.CONNECT,
        });
      });

      this.socket.on("disconnect", (reason) => {
        this.socketEvent.next({
          type: SOCKET_EVENTS.DISCONNECT,
          payload: reason,
        });
      });

      this.socket.on("error", (data) => {
        this.socketEvent.next({
          type: SOCKET_EVENTS.ERROR,
          payload: data,
        });
      });
    }
  }

  emit(event, data) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
}

export const socketService = new SocketService();
