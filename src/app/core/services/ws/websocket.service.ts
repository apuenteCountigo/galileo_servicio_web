import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: WebSocket;

  constructor() { }

  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.onopen = (event) => {
      console.log('WebSocket conectado:', event);
    };

    this.socket.onmessage = (event) => {
      console.log('Mensaje recibido:', event.data);
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket cerrado:', event);
    };
  }

  sendMessage(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket no está conectado.');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
