import { Component, OnInit } from '@angular/core';
import { FlightService } from 'src/app/shared/Services/flight.service';
import { FlightDTO } from 'src/app/Models/flight';
import { CityDTO } from 'src/app/Models/city';
import { faExchangeAlt, faExclamationCircle, faPlaneArrival, faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';
import { CountryDTO } from 'src/app/Models/country';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UnregUserDTO } from 'src/app/Models/unregisteredUser';
import { BookingDTO } from 'src/app/Models/booking.dto';
import { HeaderMenusService } from 'src/app/shared/Services/header-menus.service';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.component.html',
  styleUrls: ['./flight.component.css']
})
export class FlightComponent implements OnInit {
  faPlaneUp = faPlaneDeparture;
  faPlaneDown = faPlaneArrival;
  faChange = faExchangeAlt;
  faAviso = faExclamationCircle;
  flights!: FlightDTO[];
  cities!: CityDTO[];
  countries!: CountryDTO[];
  condicion: string;
  filteredFlights!: any[];
  searchStatus: boolean = false;
  validateForm: boolean = false;
  flightStatus: boolean = true;
  valueStatus: boolean = false;
  source!: string;
  destination!: string;
  price!: any;
  tax!: any;
  reservation_code!: string;
  startDate!: Date;
  endDate!: Date;
  nextFlight!: FlightDTO[];
  heightCaja!: string;
  errorMessage!: string;  
  users: UnregUserDTO;
  booked: boolean = false;
  name: FormControl;
  email: FormControl; 
  user!: UnregUserDTO[];
  booking!: BookingDTO[];
  userForm: FormGroup;
  bookings: BookingDTO;
  reservas!: BookingDTO;
  userConfirmado: boolean = false;

  constructor(public flightService: FlightService,
    public router: Router,
    public fb: FormBuilder,
    public headerMenusService: HeaderMenusService
    ) {
    this.condicion = 'B';
    this.users = new UnregUserDTO( '', '');
    this.bookings = new BookingDTO(1,'','','',1,'', new Date, '', '', 1, 1, '' )
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.name = new FormControl('', [
      Validators.required
    ]);

    this.userForm = this.fb.group({
      email: this.email,
      name: this.name,
    });
  }
  ngOnInit() { 
    this.flightService.getFlight().subscribe((flights: FlightDTO[]) => (this.flights = flights));
    this.flightService.getCities().subscribe((cities: CityDTO[]) => (this.cities = cities));
    this.flightService.getCountries().subscribe((countries: CountryDTO[]) => (this.countries = countries));
    this.flightService.getUnregUser().subscribe((users: UnregUserDTO[]) => (this.user = users));
    this.flightService.getBooking().subscribe((bookings: BookingDTO[]) => (this.booking = bookings));
  }
  onChangeSource(newValue:string){ 
    this.source = newValue;
    this.compareValue();
  }
  onChangedestination(newValue:string){ 
    this.destination = newValue;
    this.compareValue();
  }
  compareValue(){
    if (this.source == this.destination) {
      this.valueStatus = true;
    } else {
      this.valueStatus = false;
    }
  }
  change(source: any, destination: any) {
    this.source = destination;
    this.destination = source;
  }
  onSubmit(SearchPara: any) { 
    this.flightStatus = false;
    this.source = SearchPara.source;
    this.destination = SearchPara.destination;
    this.startDate = SearchPara.startDate;
    this.endDate = SearchPara.endDate;
    this.userForm.reset();
    this.userConfirmado = false;
    let values = Object.values(this.flights);
    let merged = values.flat(1);
    let listaVuelos = merged.sort((a,b)=>new Date(b.boarding_time).valueOf() - new Date(a.boarding_time).valueOf());
    console.log(listaVuelos) 
   
    if (this.endDate) {
      this.filteredFlights = listaVuelos.filter((x) => {
        return (x.origin == this.source) &&
          (x.destination == this.destination)  &&
          (x.boarding_time == this.startDate) &&
          (x.arrival_time == this.endDate) 
      });
    } else if(this.startDate) {
      this.filteredFlights = listaVuelos.filter((x) => {
        return (x.origin == this.source) &&
          (x.boarding_time == this.startDate)
      });
    }
    else {
      this.filteredFlights = listaVuelos.filter((x) => {
        return ((x.origin == this.source) &&
          (x.destination == this.destination)) ||
          (x.boarding_time == this.startDate)
      });
    }
    if(this.filteredFlights.length == 0){
      this.searchStatus = true;
    }else{ 
      this.searchStatus = false;
    }

    if(this.filteredFlights.length > 1){
      let height = 1000;
      for(var i = 0; i < this.filteredFlights.length; i++) {        
        height += 220;    
      }
      this.heightCaja = height.toString() + "px"
    } else if(this.filteredFlights.length > 0) {
      this.heightCaja = "1000px";
    }
    console.log("Ok..."+ this.filteredFlights.length);
    console.log(this.filteredFlights);
}
  biggerDiv() {
    if(this.filteredFlights == undefined) {
      this.heightCaja = "580px";
    } else if(this.filteredFlights.length == 0  && this.searchStatus == true) {
      this.heightCaja = "580px";
    }
  }
  smallerDiv() {
    if(this.filteredFlights == undefined) {
      this.heightCaja = "450px";
    } else if(this.filteredFlights.length == 0 && this.searchStatus == true) {
      this.heightCaja = "500px"; 
    } 
  }
  checkUnregUser( ) {
    this.validateForm = true;
    this.booked = true;
    this.users.email = this.email.value;
    this.users.name = this.name.value;
    this.users = this.userForm.value;
    this.flightService.createUnregUser(this.users)
      .subscribe(()=> {},  () => {
        this.userConfirmado = false;
      })
    console.log(this.users);
    this.userConfirmado = true;

  }
 
  bookFlight(flight: any) {
    //esto encuentra el booking con la info
    /* let reserva;
    let origen1: any = this.filteredFlights.map((x) => { return x.origin} )
    let origen2 = this.booking.map((x) => { return x.origin} )
    let destino2 = this.booking.map((x) => { return x.destination} )
    let destino1: any = this.filteredFlights.map((x) => { return x.destination} )
    let origenEcontrado = origen2.find(element => element == origen1);
    let destinoEncontrado = destino2.find(element => element == destino1);
    reserva = this.booking.filter((x) => {
        return (x.origin == origen1) &&
          (x.destination == destino1) }) */
        
    console.log(this.booking)

    this.bookings.email = this.users.email;
    this.bookings.name = this.users.name;
    this.bookings.status = 'Active';
    this.bookings.passengers = 1;
    this.bookings.airline = flight.airline;
    this.bookings.origin = flight.origin;
    this.bookings.destination = flight.destination;
    this.bookings.price = flight.price;
    this.bookings.tax = 1;
    this.bookings.promo_code = flight.reservation_code;
     
    this.flightService.createBooking(this.bookings)
    .subscribe()
    console.log(this.bookings)
}
}

/* let vuelo = this.filteredFlights.map((x) => { return x.boarding_time} )

console.log(vuelo) */
 /* var loc = listaVuelos.indexOf(vuelo); */
   /*  var index = 0;
    let esto = true;
    if(esto && this.filteredFlights.length > 0){
      index = ++index >= listaVuelos.length ? 0 : index;
      console.log(listaVuelos[index].boarding_time);
    } //next
    
    if(!esto && this.filteredFlights.length > 0){
      index = --index <= 0 ? listaVuelos.length - 1 : index;
      console.log(listaVuelos[index].boarding_time);
    } //previous */