import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking-flight',
  templateUrl: './booking-flight.component.html',
  styleUrls: ['./booking-flight.component.css']
})
export class BookingFlightComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
/* onBookFlight(flight: any) {
    if (this.name == "" && this.last == "") {
      alert("Enter your first and last name")
      return;
    }
    const data = { flight: flight };
    const name = {
      first: this.first,
      last: this.last
    }
    const dataForBookingFlight = { flight: flight, name: name }
    fetch('http://localhost:5000/flight-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(dataObject => {
      console.log('Success:', dataObject.data.flightOffers);
      const data = { flight: flight };
      console.log(data);
      fetch('http://localhost:5000/flight-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataForBookingFlight),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        this.booked  = true;
        this.flightTemplate = false
        this.flights = []
      })
      .catch((error) => {
        alert(error)
      });
    })
    .catch((error) => {
      console.error('Error:', error);
      alert(error)
    });
}  */
}
