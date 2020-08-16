import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  currentPage: string = 'home';

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        const selectedPage: string | undefined = this.activatedRoute.snapshot.children[0]?.routeConfig?.path;

        if (selectedPage !== undefined) {
          this.currentPage = selectedPage;
        } else {
          this.currentPage = 'home';
        }
      }
    });
  }
}
