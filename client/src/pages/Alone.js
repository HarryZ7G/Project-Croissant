import React from 'react';
import Categories from '../components/Categories.js';
import LocationInput from '../components/LocationInput.js';
import 'animate.css';
import '../style/home.css';
import ResultPopup from '../components/ResultPopup';

const ApiKey = "AIzaSyD7oE7UNkxl3lM13HAPNC5gjoFdqmPz6q8";
class Alone extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      location: "",
      latitude: null,
      longitude: null,
      restaurants: null,
      homeOverflow: "overflow-hidden",
      categories: {
        breakfast_brunch: false,
        bubbletea: false,
        cafes: false,
        chinese: false,
        hotdogs: false,
        french: false,
        indpak: false,
        italian: false,
        japanese: false,
        korean: false,
        mexican: false,
        mideastern: false,
        pizza: false,
        chicken_wings: false
      },
      results: null,
      select: "animate__animated animate__fadeInUp",
      loader: "hidden"
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.pickFood = this.pickFood.bind(this);
    this.ready = this.ready.bind(this);
    this.closePopup = this.closePopup.bind(this);
    this.geoPosition = this.geoPosition.bind(this);
  }

  componentDidMount() {
    try {
      fetch('/isloggedin/',
      {
        method: "GET",
        credentials: "include", 
        headers: {
          "Content-Type": "application/json"
      }
      }).then(response => response.json()).then(data =>{
        if(data.username) this.setState({user: data.username});
      });
    } catch (e) {
      alert("Something happened :< please refresh the page");
    }
  }

  geoPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({ loader: null });
      try {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${ApiKey}`)
        .then(response => response.json())
        .then(data => {
          let addressComp = data.results[0].address_components;
          let address = "";
          address += addressComp[0].short_name + " ";
          address += addressComp[1].short_name + " ";
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            location: address,
            loader: "hidden"
          }, () => {
            document.getElementById("locate-fill").style.fill = "#00CA4EDD";
          });
        });
      } catch (error) {
        alert("Something happened :< please refresh the page");
      }
    }, (err) => {
      document.getElementById("locate-fill").style.fill = "#FF605CDD";
      alert("Location premission not given");
    });
  }

  pickFood(food, selection) {
    let update = this.state.categories;
    update[food] = selection;
    this.setState({ categories: update });
  }

  ready() {
    if (this.state.location === "") return alert("Please enter location");
    this.setState({ loader: null });
    let selected = "";
    for (let key in this.state.categories) {
      if (this.state.categories[key])
        selected = selected + key + ",";
    }
    if (selected === '') {
      this.setState({ loader: "hidden" });
      return alert("Please select at least one category");
    }
    selected = selected.substring(0, selected.length - 1);
    try {
      fetch('/yelp/find/',
      {
        method: 'POST',
        credentials: "include",
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "latitude": this.state.latitude,
          "longitude": this.state.longitude,
          "location": this.state.location,
          "categories": selected
        })
      }).then(response => response.json()).then(data => {
        this.setState({
          restaurants: JSON.parse(data),
          homeOverflow: null,
          results: <ResultPopup
                     key={"results"}
                     restaurants={data}
                     votes={null}
                     group={false}
                     close={this.closePopup}
                   />,
          loader: "hidden"
        });
      });
    } catch(e) {
      alert("Something happened :< please refresh the page");
    }
  }
  
  handleChange(event) {
    this.setState({ location: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let locationString = this.state.location.replace(/\s+/g, '+').toLowerCase();
    try {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${locationString}&key=${ApiKey}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === "ZERO_RESULTS") return alert(`Could not find location ${this.state.location}`);
        this.setState({
          latitude: data.results[0].geometry.location.lat,
          longitude: data.results[0].geometry.location.lng,
          bounds: data.results[0].geometry.viewport,
        }, () => {
          document.getElementById("locate-fill").style.fill = "#00CA4EDD";
        });
      });
    } catch (error) {
      alert("Something happened :< please refresh the page");
    }
  }

  closePopup() {
    this.setState({
      results: null,
      homeOverflow: "overflow-hidden"
    });
  }

  render() {
    return (
      <div className={`home-root ${this.state.homeOverflow}`} id="home-root">
        <div className="background"/>
        <div className={`loader ${this.state.loader}`} id="loader"/>

        <LocationInput
          value={this.state.location}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          geo={this.geoPosition}
        />

        <Categories 
          pickFood={this.pickFood}
          display={this.state.select}
          ready={this.ready}
        />

        {this.state.results}
      </div>
    )
  }
}

export default Alone;