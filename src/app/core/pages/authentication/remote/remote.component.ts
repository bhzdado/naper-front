import { CommonModule } from '@angular/common';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-remote',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './remote.component.html',
  styleUrl: './remote.component.scss'
})

@Injectable({
  providedIn: 'root',
  })

export default class RemoteComponent implements OnInit {
  
  ngOnInit() { 
    alert('ola');
  }

}
