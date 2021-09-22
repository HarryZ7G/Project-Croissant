import React from 'react';
import Categories from '../components/Categories.js';
import FoodPage from '../components/FoodPage.js';
import GroupWait from '../components/GroupWait';
import LocationInput from '../components/LocationInput.js';
import ResultPopup from '../components/ResultPopup.js';
import WaitScreen from '../components/WaitScreen.js';
import socket from '../components/Socket.js';
const ApiKey = "AIzaSyD7oE7UNkxl3lM13HAPNC5gjoFdqmPz6q8";

class Host extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      numCategories: 1,
      numRestaurants: 10,
      roomNum: -1,
      members: 0,
      ready: 0,
      response: "",
      location: "",
      latitude: null,
      longitude: null,
      bounds: {
        northeast: {
          lat: null,
          lng: null
        },
        southwest: {
          lat: null,
          lng: null
        }
      },
      categories: {
        breakfast: false,
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
      restaurants: null,
      vote: 0,
      results: null,
      bottom: null,
      loader: null,
      homeOverflow: "overflow-hidden",
      groupWait: "animate__animated animate__fadeInUp",
      select: "hidden",
      waitScreen: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.pickFood = this.pickFood.bind(this);
    this.start = this.start.bind(this);
    this.ready = this.ready.bind(this);
    this.geoPosition = this.geoPosition.bind(this);
    this.chooseRestaurant = this.chooseRestaurant.bind(this);
    this.completeSelection = this.completeSelection.bind(this);
  }

  componentDidMount() {
    socket.on("start", () => {
      this.setState({
        groupWait: "hidden",
        select: null
      });
    });
    socket.on("update", data => {
      this.setState({members: data});
    });
    socket.on("created", data => {
      this.setState({
        roomNum: data,
        members: 1,
        loader: "hidden"
      });
    });
    socket.on("requestInfo", () => {
      socket.emit("location", {
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        location: this.state.location,
        bounds: this.state.bounds
      });
    });
    socket.on("memready", () => {
      this.setState({
        ready: this.state.ready + 1
      }, () => {
        if (this.state.ready === this.state.members) {
          socket.emit("all-ready", JSON.stringify({
            position: {
              location: this.state.location,      
              latitude: this.state.latitude,
              longitude: this.state.longitude
            },
            user: this.state.user
          }));
        }
      });
    });
    socket.on("subtract", () => {
      this.setState({
        ready: this.state.ready - 1
      });
    });
    socket.on("category", data => {
      let selection = data;
      for (const key in selection) {
        selection[key].selection = false;
      }
      this.setState({
        waitScreen: false,
        restaurants: selection,
        currentRestaurant: <FoodPage restaurants={data}
                                     changeSelect={this.chooseRestaurant}
                                     complete={this.completeSelection}/>
      });
    });
    socket.on("vote", () => {
      this.setState({ vote: this.state.vote + 1 }, () => {
        if (this.state.vote === this.state.members)
          socket.emit("all-voted");
      });
    });
    socket.on("all-voted", data => {
      this.setState({
        currentRestaurant: null,
        homeOverflow: null,
        results: <ResultPopup
                   key={"results"}
                   restaurants={JSON.stringify(this.state.restaurants)}
                   votes={data}
                   group={true}
                 />
      });
      if (this.state.user) {
        try {
          fetch("/user/history",
          {
            credentials: "include", 
            method: "POST",
            headers: {
              "Access-Control-Allow-Credentials": "true",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username: this.state.user,
              restaurant: this.state.restaurants[data[0][0]]
            })
          });
        } catch(e) {
          alert("This vote was not saved");
        }
      }
    });
    socket.emit("create");
    try {
      fetch("/group/isloggedin",
      { 
        credentials: "include", 
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => response.json()).then(data => {
        if (data.username !== "") {
          this.setState({
            user: data.username,
            numCategories: data.numCategories,
            numRestaurants: data.numRestaurants
          });
        }
      });
    } catch (e) {
      alert("Something happened :< please refresh the page");
    }
  }

  handleChange(event) {
    this.setState({ location: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    let locationString = this.state.location.replace(/\s+/g, '+').toLowerCase();
    try{
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${locationString}&key=${ApiKey}`)
      .then(response => response.json())
      .then(data => {
        if (data.status === "ZERO_RESULTS") return alert(`Could not find location ${this.state.location}`);
        this.setState({
          latitude: data.results[0].geometry.location.lat,
          longitude: data.results[0].geometry.location.lng,
          bounds: data.results[0].geometry.viewport,
        }, () => {
          socket.emit("location", {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            location: this.state.location,
            bounds: this.state.bounds
          });
          document.getElementById("locate-fill").style.fill = "#00CA4EDD";
        });
      });
    } catch (error) {
      alert("Something happened :< please refresh the page");
    }
  }


  geoPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      try {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${ApiKey}`)
        .then(response => response.json())
        .then(data => {
          let addressComp = data.results[0].address_components;
          let address = "";
          let bounds = data.results[0].geometry.viewport;
          address += addressComp[0].short_name + " ";
          address += addressComp[1].short_name + " ";
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            location: address,
            zoom: 15,
            bounds: bounds
          }, () => {
            socket.emit("location", {
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              location: this.state.location,
              bounds: this.state.bounds
            });
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

  chooseRestaurant(index, selection) {
    let update = this.state.restaurants;
    update[index].selection = selection;
    this.setState({
      restaurants: update
    });
  }

  completeSelection() {
    try {
      fetch("/group/vote",
      {
        method: "POST",
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          restaurants: this.state.restaurants,
          roomNum: this.state.roomNum
        })
      }).then(response => {
        if (response.status !== 200) return alert("Something happened :< please refresh the page");
        socket.emit("voted");
      });
    } catch (e) {
      alert("Something happened :< please refresh the page");
    }
  }

  start() {
    if (this.state.members < 2)
      return alert("Cannot start with no members");
    if (this.state.latitude == null || this.state.longitude == null) 
      return alert("Please enter location");
    try {
      fetch("/group/create",
      {
        method: "POST",
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          roomNum: this.state.roomNum,
          members: this.state.members
        })
      }).then(response => {
        if (response.status !== 200) return alert("Something happened :< please refresh the page");
        this.setState({
          select: null
        });
        document.getElementById("locate").disabled = true;
        document.getElementById("locate").className = "locate-button-disable";
        document.getElementById("home-input").disabled = true;
        socket.emit("start");
      });
    } catch (e) {
      alert("Something happened :< please refresh the page");
    }
  }

  ready() {
    let chosen = false;
    for (const value of Object.entries(this.state.categories)) {
      if (value[1]) {
        chosen = true;
        break;
      }
    }
    if (!chosen) return alert("Please select at least one category");
    document.getElementById("ready").disabled = true;
    this.setState({
      ready: this.state.ready + 1,
      select: "hidden",
      waitScreen: true
    }, () => {
      socket.emit("ready");
      try {
        fetch("/group/individual",
        {
          method: "POST",
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            roomNum: this.state.roomNum,
            categories: this.state.categories
          })
        }).then(response => {
          if (response.status !== 200) return alert("Something happened :< please refresh the page");
          if (this.state.ready === this.state.members) {
            socket.emit("all-ready", JSON.stringify({
              position: {
                location: this.state.location,      
                latitude: this.state.latitude,
                longitude: this.state.longitude
              },
              user: this.state.user
            }));
          }
        });
      } catch (e) {
        alert("Something happened :< please refresh the page");
      }
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
        
        <GroupWait
          host={true}
          roomNum={this.state.roomNum}
          members={this.state.members}
          display={this.state.groupWait}
          start={this.start}
          location={this.state.location}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          bounds={this.state.bounds}
        />

        <Categories 
          pickFood={this.pickFood}
          display={this.state.select}
          ready={this.ready}
        />

        <WaitScreen 
          ready={this.state.ready}
          members={this.state.members}
          display={this.state.waitScreen}
        />

        {this.state.currentRestaurant}
        {this.state.results}
      </div>
    )
  }
}

export default Host;