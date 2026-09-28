import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { FlightService } from '../../services/flight.service';

@Component({
  selector: 'app-flight-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './flight-filters.html',
  styleUrls: ['./flight-filters.scss']
})
export class FlightFiltersComponent implements OnInit, OnDestroy {
  // 1. Reactive FormGroup define panrom (Form controls group)
  filterForm = new FormGroup({
    callsign: new FormControl(''),
    status: new FormControl('ALL'),
    origin: new FormControl('ALL'),
    destination: new FormControl('ALL')
  });

  // Dropdown list fill panna airport array
  airports: { code: string; name: string }[] = [];

  private formSub?: Subscription;

  // FlightService inject panrom
  constructor(private flightService: FlightService) {}

  ngOnInit(): void {
    // Dropdown-kaga dynamic airports list edukrom
    this.airports = this.flightService.getAirports();

    // 2. Real-time form value change listener (RxJS stream)
    this.formSub = this.filterForm.valueChanges
      .pipe(
        debounceTime(300), // User typing gap 300ms wait pannum (performance optimization)
        distinctUntilChanged()
      )
      .subscribe(val => {
        // Values maara maara Service-la filter function call aagum
        this.flightService.applyFilters({
          callsign: val.callsign ?? '',
          status: val.status ?? 'ALL',
          origin: val.origin ?? 'ALL',
          destination: val.destination ?? 'ALL'
        });
      });
  }

  // 3. Reset Button click action
  onReset(): void {
    this.filterForm.reset({
      callsign: '',
      status: 'ALL',
      origin: 'ALL',
      destination: 'ALL'
    });
    this.flightService.resetFilters();
  }

  ngOnDestroy(): void {
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }
}