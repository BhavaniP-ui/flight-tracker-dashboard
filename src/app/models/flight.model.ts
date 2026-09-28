export interface Airport {
  code: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
}

export type FlightStatus = 'SCHEDULED' | 'ACTIVE' | 'DELAYED' | 'ARRIVED' | 'CANCELLED';

export interface Flight {
  id: string;
  flightNumber: string;
  callsign: string;
  aircraftType: string;
  origin: Airport;
  destination: Airport;
  currentPosition: {
    lat: number;
    lng: number;
    altitude: number;
    speed: number;
  };
  status: FlightStatus;
  departureTime: string;
  estimatedDepartureTime: string;
  arrivalTime: string;
  estimatedArrivalTime: string;
}

export interface DashboardMetrics {
  totalFlights: number;
  activeFlights: number;
  delayedFlights: number;
  arrivedFlights: number;
}