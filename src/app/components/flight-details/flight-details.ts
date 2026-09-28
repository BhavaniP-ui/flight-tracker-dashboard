import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FlightService } from '../../services/flight.service';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-flight-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-details.html',
  styleUrls: ['./flight-details.scss']
})
export class FlightDetailsComponent implements OnInit, OnDestroy {
  // Currently selected flight store panna variable
  selectedFlight: Flight | null = null;
  private flightSub?: Subscription;

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    // Service-la irundhu selected flight stream-ai subscribe panrom
    this.flightSub = this.flightService.selectedFlight$.subscribe(flight => {
      this.selectedFlight = flight;
    });
  }

  // Close button click panna selection clear aagum
  clearSelection(): void {
    this.flightService.selectFlight(null);
  }

  // Status colors helper
  getStatusBadgeClass(status: string): string {
    return status.toLowerCase();
  }

  ngOnDestroy(): void {
    if (this.flightSub) {
      this.flightSub.unsubscribe();
    }
  }
}