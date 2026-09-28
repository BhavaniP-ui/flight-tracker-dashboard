import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Flight, DashboardMetrics } from '../models/flight.model';
import { MOCK_FLIGHTS } from '../mock-data/mock-flights';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  private readonly allFlights: Flight[] = MOCK_FLIGHTS;

  private flightsSubject = new BehaviorSubject<Flight[]>(this.allFlights);
  public flights$: Observable<Flight[]> = this.flightsSubject.asObservable();

  private selectedFlightSubject = new BehaviorSubject<Flight | null>(null);
  public selectedFlight$: Observable<Flight | null> = this.selectedFlightSubject.asObservable();

  constructor() {}

  selectFlight(flight: Flight | null): void {
    this.selectedFlightSubject.next(flight);
  }

  applyFilters(criteria: { callsign?: string; status?: string; origin?: string; destination?: string }): void {
    let filtered = [...this.allFlights];

    if (criteria.callsign && criteria.callsign.trim() !== '') {
      const search = criteria.callsign.trim().toLowerCase();
      filtered = filtered.filter(f => f.callsign.toLowerCase().includes(search));
    }

    if (criteria.status && criteria.status !== 'ALL') {
      filtered = filtered.filter(f => f.status === criteria.status);
    }

    if (criteria.origin && criteria.origin !== 'ALL') {
      filtered = filtered.filter(f => f.origin.code === criteria.origin);
    }

    if (criteria.destination && criteria.destination !== 'ALL') {
      filtered = filtered.filter(f => f.destination.code === criteria.destination);
    }

    this.flightsSubject.next(filtered);
  }

  resetFilters(): void {
    this.flightsSubject.next(this.allFlights);
  }

  getMetrics(): Observable<DashboardMetrics> {
    return this.flights$.pipe(
      map(flights => ({
        totalFlights: flights.length,
        activeFlights: flights.filter(f => f.status === 'ACTIVE').length,
        delayedFlights: flights.filter(f => f.status === 'DELAYED').length,
        arrivedFlights: flights.filter(f => f.status === 'ARRIVED').length
      }))
    );
  }

  getAirports(): { code: string; name: string }[] {
    const mapObj = new Map<string, string>();
    this.allFlights.forEach(f => {
      mapObj.set(f.origin.code, `${f.origin.city} (${f.origin.code})`);
      mapObj.set(f.destination.code, `${f.destination.city} (${f.destination.code})`);
    });
    return Array.from(mapObj.entries()).map(([code, name]) => ({ code, name }));
  }
}