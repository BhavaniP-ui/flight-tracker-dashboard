import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FlightService } from '../../services/flight.service';
import { DashboardMetrics } from '../../models/flight.model';

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kpi-cards.html',
  styleUrls: ['./kpi-cards.scss']
})
export class KpiCardsComponent implements OnInit, OnDestroy {
  // 1. Initial State: Screen start aagum podhu 0 kaata default values vekkuroam
  public metrics: DashboardMetrics = {
    totalFlights: 0,
    activeFlights: 0,
    delayedFlights: 0,
    arrivedFlights: 0
  };

  // 2. Subscription track panna variable (Component destroy aagum podhu memory leak thadukka)
  private metricsSubscription?: Subscription;

  // 3. Dependency Injection: Data thevai, so FlightService-ai inject panrom
  constructor(private flightService: FlightService) {}

  // 4. Lifecycle Hook: Component load aagi ready aagum podhu service kitta irundhu count vangurom
  ngOnInit(): void {
    this.metricsSubscription = this.flightService.getMetrics().subscribe({
      next: (data: DashboardMetrics) => {
        this.metrics = data; // Service thara count-ai local metrics variable-la update panrom
      },
      error: (err) => {
        console.error('Metrics vangaradhula error:', err);
      }
    });
  }

  // 5. Cleanup: User vera page ponaalo component close aanaalo indha connection-ai cut panrom
  ngOnDestroy(): void {
    if (this.metricsSubscription) {
      this.metricsSubscription.unsubscribe();
    }
  }
}