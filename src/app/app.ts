import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Sariyaana file names: .component illama direct file names
import { KpiCardsComponent } from './components/kpi-cards/kpi-cards';
import { FlightFiltersComponent } from './components/flight-filters/flight-filters';
import { FlightMapComponent } from './components/flight-map/flight-map';
import { FlightDetailsComponent } from './components/flight-details/flight-details';
import { FlightListComponent } from './components/flight-list/flight-list';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    KpiCardsComponent,
    FlightFiltersComponent,
    FlightMapComponent,
    FlightDetailsComponent,
    FlightListComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {
  title = 'Aviation Flight Tracking & Operations Dashboard';
}