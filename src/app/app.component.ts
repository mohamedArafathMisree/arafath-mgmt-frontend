import { Component } from '@angular/core';
import { SocketService } from './core/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'arafath-mgmt-front-end';

  constructor(private socketService: SocketService) {
    this.socketService.openSocket()
  }
}
