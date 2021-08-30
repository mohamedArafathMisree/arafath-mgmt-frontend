import { io } from "socket.io-client";

import { Injectable } from "@angular/core";

@Injectable()
export class SocketService {

    private socket: any;
    public data: any;
    // Connect Socket with server URL

    startSocket() {
        this.socket = io('http://localhost:8000');
    }

    getData() {
        this.startSocket();
        this.socket.on('notification', (data: any) => {
            this.data = data;
        });
    }

}