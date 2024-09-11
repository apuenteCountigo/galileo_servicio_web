import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  public socket!: WebSocket;

  constructor() { }

  connect(): void {
    this.socket = new WebSocket(environment.WS_URL);

    this.socket.onopen = (event) => {
      console.log('WebSocket conectado:', event);
    };

    // this.socket.onmessage = (event) => {
    //   console.log('Mensaje recibido:', event.data);
    // };

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
