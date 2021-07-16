import { Component, OnDestroy } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

type CurrentPage =
'home' |
'search' |
'inspect-text' |
'vocabulary-lists' |
'kanji-lists' |
'about' | '';

@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  currentPage: CurrentPage = 'search';
  routerEventsSubscriptions: Subscription | undefined;

  constructor(private router: Router) { }

  ngOnInit() {
    this.routerEventsSubscriptions = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd ) {
        this.selectPage(event.url);
      }
    });

    this.selectPage(this.router.url);
  }

  ngOnDestroy() {
    if (this.routerEventsSubscriptions) {
      this.routerEventsSubscriptions.unsubscribe();
    }
  }

  selectPage(url: string) {
    // Get main page: e.g. home, search, inspect-text, dll.
    const selectedPage: string | undefined =
      this.router.parseUrl(url).root.children.primary.segments?.[1]?.path;

    if (selectedPage !== undefined) {
      this.currentPage = selectedPage as CurrentPage;
    } else {
      this.currentPage = 'search';
      this.router.navigateByUrl('/main/search');
    }
  }
}
