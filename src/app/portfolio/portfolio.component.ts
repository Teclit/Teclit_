import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

interface PortfolioItem {
  title: string;
  image: string;
}

const PORTFOLIO_ASSETS_PATH = 'assets/portfolio/';
const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {title: 'E-commerce Website', image: `${PORTFOLIO_ASSETS_PATH}ecommerce.png`},
  {title: 'Freelance Platform', image: `${PORTFOLIO_ASSETS_PATH}freelance.png`},
  {title: 'Restaurant App', image: `${PORTFOLIO_ASSETS_PATH}restaurant.png`},
  {title: 'Weather App', image: `${PORTFOLIO_ASSETS_PATH}weather.png`},
  {title: 'Job Board', image: `${PORTFOLIO_ASSETS_PATH}jobboard.png`},
  {title: 'Airbnb Clone', image: `${PORTFOLIO_ASSETS_PATH}airbnb.png`},
  {title: 'Freelance Platform', image: `${PORTFOLIO_ASSETS_PATH}freelance.png`},
  {title: 'Restaurant App', image: `${PORTFOLIO_ASSETS_PATH}restaurant.png`},
  {title: 'Weather App', image: `${PORTFOLIO_ASSETS_PATH}weather.png`},
  {title: 'Job Board', image: `${PORTFOLIO_ASSETS_PATH}jobboard.png`},
  {title: 'Airbnb Clone', image: `${PORTFOLIO_ASSETS_PATH}airbnb.png`}
];

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PortfolioComponent {
  readonly portfolioItems: PortfolioItem[] = PORTFOLIO_ITEMS;
}
