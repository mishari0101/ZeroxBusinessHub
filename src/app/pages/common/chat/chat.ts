import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.scss']
})
export class ChatComponent implements OnInit {

  bookingId!: number;
  messages: any[] = [];
  newMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    // URL la irundhu booking ID edukkurom (e.g., /chat/5)
    this.bookingId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMessages();
  }

  loadMessages() {
    this.isLoading = true;
    this.chatService.getMessages(this.bookingId).subscribe({
      next: (data) => {
        this.messages = data;
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.chatService.sendMessage(this.bookingId, this.newMessage).subscribe({
      next: () => {
        this.newMessage = ''; // Clear input
        this.loadMessages(); // Refresh chat immediately
      },
      error: (err) => alert('Failed to send message')
    });
  }

  // Auto-scroll to latest message
  scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.chat-history');
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);
  }
}