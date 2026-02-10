import { Component } from '@angular/core';

interface TeamMember {
  name: string;
  role: string;
  photo: string;
}

@Component({
  selector: 'app-home-carousel',
  templateUrl: './home-carousel.component.html',
  styleUrls: ['./home-carousel.component.scss']
})
export class HomeCarouselComponent {

  readonly team: TeamMember[] = [
    { name: 'Elaine Brito', role: 'Desenvolvedora', photo: 'assets/img/squad/elaine.jpg' },
    { name: 'Alexandre Mercador', role: 'Desenvolvedor', photo: 'assets/img/squad/mercador.jpg' },
    { name: 'Cícero Cristiano', role: 'Desenvolvedor', photo: 'assets/img/squad/cicero.jpg' },
    { name: 'Gabriela Sabrine', role: 'Desenvolvedora', photo: 'assets/img/squad/gabi.jpg' },
    { name: 'João Victor Minervino', role: 'Desenvolvedor', photo: 'assets/img/squad/minervino.jpg' },
    { name: 'Tony Kerisleyk', role: 'Desenvolvedor', photo: 'assets/img/squad/tony.jpg' },
  ];
}
