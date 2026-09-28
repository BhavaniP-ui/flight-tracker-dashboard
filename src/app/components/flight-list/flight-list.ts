import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FlightService } from '../../services/flight.service';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-list.html',
  styleUrls: ['./flight-list.scss']
})
export class FlightListComponent implements OnInit, OnDestroy {
  flights: Flight[] = [];
  selectedFlightId: string | null = null;

  private flightsSub?: Subscription;
  private selectedSub?: Subscription;

  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    // Filtered flights stream receive panrom
    this.flightsSub = this.flightService.flights$.subscribe(flights => {
      this.flights = flights;
    });

    // Currently selected flight ID track panni row highlight panrom
    this.selectedSub = this.flightService.selectedFlight$.subscribe(flight => {
      this.selectedFlightId = flight ? flight.id : null;
    });
  }

  // Row click panna service-ku inform panrom
  onSelectFlight(flight: Flight): void {
    this.flightService.selectFlight(flight);
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  ngOnDestroy(): void {
    if (this.flightsSub) this.flightsSub.unsubscribe();
    if (this.selectedSub) this.selectedSub.unsubscribe();
  }
}