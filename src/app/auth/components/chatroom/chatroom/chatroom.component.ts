import { Component, OnInit } from '@angular/core';
import { ChannelService, ChatClientService, StreamI18nService } from 'stream-chat-angular';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { catchError, Observable, of, switchMap, map } from 'rxjs';


@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss'],
})
export class ChatroomComponent implements OnInit {

  chatIsReady$!: Observable<boolean>

  constructor(
    private chatService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.streamI18nService.setTranslation();
    console.log(this.authService.uid);
    
    this.chatIsReady$ = this.authService.getStreamToken().pipe(
      switchMap((streamToken) => this.chatService.init(
        "xcxwgh3qsqxw",
        this.authService.uid!,
        streamToken
        )),
      switchMap(() =>  this.channelService.init({
        type: 'messaging',
        members: { $in: [this.authService.uid!] },
      })),
      map(() => true),
      catchError(() => of(false))
    )
  }
}
