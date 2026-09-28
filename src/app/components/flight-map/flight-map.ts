import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { FlightService } from '../../services/flight.service';
import { Flight } from '../../models/flight.model';

@Component({
  selector: 'app-flight-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-map.html',
  styleUrls: ['./flight-map.scss']
})
export class FlightMapComponent implements AfterViewInit, OnDestroy {
  private L: any;
  private map: any;
  private markersLayer: any;
  private routeLine: any;

  private flightsSub?: Subscription;
  private selectedFlightSub?: Subscription;
  private isBrowser: boolean;

  constructor(
    private flightService: FlightService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) {
      return;
    }

    // Leaflet-ai browser environment-la mattum dynamic-ah import panrom
    this.L = await import('leaflet');
    this.initMap();
    this.listenToFlightUpdates();
    this.listenToSelectedFlight();
  }

  private initMap(): void {
    this.map = this.L.map('map', {
      center: [20.5937, 78.9629],
      zoom: 5
    });

    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.markersLayer = this.L.layerGroup().addTo(this.map);
  }

  private listenToFlightUpdates(): void {
    this.flightsSub = this.flightService.flights$.subscribe(flights => {
      this.updateFlightMarkers(flights);
    });
  }

  private updateFlightMarkers(flights: Flight[]): void {
    if (!this.markersLayer || !this.L) return;

    this.markersLayer.clearLayers();

    flights.forEach(flight => {
      const { lat, lng } = flight.currentPosition;

      const customIcon = this.L.divIcon({
        className: 'flight-pin',
        html: `<div class="plane-marker ${flight.status.toLowerCase()}">✈</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = this.L.marker([lat, lng], { icon: customIcon });

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px;">
          <strong>Flight:</strong> ${flight.flightNumber}<br/>
          <strong>Callsign:</strong> ${flight.callsign}<br/>
          <strong>Route:</strong> ${flight.origin.code} ➔ ${flight.destination.code}<br/>
          <strong>Status:</strong> <span style="font-weight: bold; color: ${this.getStatusColor(flight.status)}">${flight.status}</span>
        </div>
      `);

      marker.on('click', () => {
        this.flightService.selectFlight(flight);
      });

      this.markersLayer.addLayer(marker);
    });
  }

  private listenToSelectedFlight(): void {
    this.selectedFlightSub = this.flightService.selectedFlight$.subscribe(selected => {
      if (!this.map || !this.L) return;

      if (!selected) {
        if (this.routeLine) {
          this.map.removeLayer(this.routeLine);
        }
        return;
      }

      const routeCoordinates = [
        [selected.origin.lat, selected.origin.lng],
        [selected.currentPosition.lat, selected.currentPosition.lng],
        [selected.destination.lat, selected.destination.lng]
      ];

      if (this.routeLine) {
        this.map.removeLayer(this.routeLine);
      }

      this.routeLine = this.L.polyline(routeCoordinates, {
        color: '#2563eb',
        weight: 3,
        opacity: 0.8,
        dashArray: '8, 8'
      }).addTo(this.map);

      this.map.setView([selected.currentPosition.lat, selected.currentPosition.lng], 6, {
        animate: true
      });
    });
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return '#10b981';
      case 'DELAYED': return '#f59e0b';
      case 'ARRIVED': return '#64748b';
      default: return '#2563eb';
    }
  }

  ngOnDestroy(): void {
    if (this.flightsSub) this.flightsSub.unsubscribe();
    if (this.selectedFlightSub) this.selectedFlightSub.unsubscribe();
    if (this.map) this.map.remove();
  }
}