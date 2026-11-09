import { AfterViewInit, Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { FeaturesSectionComponent } from './components/features-section/features-section.component';
import { HowItWorksSectionComponent } from './components/how-it-works-section/how-it-works-section.component';
import { SecuritySectionComponent } from './components/security-section/security-section.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    RouterLink,
    TranslateModule,
    NavbarComponent,
    HeroSectionComponent,
    FeaturesSectionComponent,
    HowItWorksSectionComponent,
    SecuritySectionComponent,
    FooterComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {
  private readonly element = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (typeof IntersectionObserver === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          this.observer?.unobserve(entry.target);
        }
      }
    }, { threshold: 0.12 });
    this.element.nativeElement.querySelectorAll('.reveal-on-scroll').forEach((item: Element) => {
      item.classList.add('reveal-ready');
      this.observer?.observe(item);
    });
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }
}
