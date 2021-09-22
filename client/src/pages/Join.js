import React from 'react';
import FoodPage from '../components/FoodPage.js';
import LocationBar from '../components/LocationBar.js';
import MemberJoin from '../components/MemberJoin.js';
import ResultPopup from '../components/ResultPopup.js';
import WaitScreen from '../components/WaitScreen.js';
import socket from '../components/Socket.js';
import GroupWait from '../components/GroupWait.js';
import Categories from '../components/Categories.js';

class Join extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      roomNum: -1,
      members: 0,
      ready: 0,
      response: "",
      location: "Waiting on host",
      latitude: null,
      longitude: null,
      resturants: null,
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
      loader: "hidden",
      locationBar: false,
      groupWait: "hidden",
      memberJoin: true,
      select: "hidden",
      waitScreen: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.pickFood = this.pickFood.bind(this);
    this.ready = this.ready.bind(this);
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
    socket.on("location", data => {
      if (data.location === "")
        return this.setState({location: "Waiting on host"});
      this.setState({
        location: data.location,
        latitude: data.latitude,
        longitude: data.longitude,
        bounds: data.bounds
      });
    });
    socket.on("memready", () => {
      this.setState({
        ready: this.state.ready + 1
      });
    });
    socket.on("exist", data => {
      if (data === -1) return alert("Group does not exist");
      this.setState({
        locationBar: true,
        memberJoin: false,
        groupWait: null
      });
    });
    socket.on("destory", () => {
      document.getElementById("member-count").innerHTML = "Your Host has left the room";
      alert("Host left");
    });
    socket.on("subtract", () => {
      this.setState({ready: this.state.ready - 1});
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
      this.setState({ vote: this.state.vote + 1 });
    });
    socket.on("all-voted", data => {
      this.setState({
        currentRestaurant: null,
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
    try {
      fetch(`/group/isloggedin`,
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
    this.setState({ roomNum: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    socket.emit("join", this.state.roomNum);
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
        });
      } catch (e) {
        alert("Something happened :< please refresh the page");
      }
    });
  }

  render() {
    return (
      <div className="home-root" id="home-root">
        <div className="background"/>
        <div className={`loader ${this.state.loader}`} id="loader"/>

        <LocationBar
          display={this.state.locationBar}
          location={this.state.location}
        />

        <MemberJoin 
          members={this.state.members}
          display={this.state.memberJoin}
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
        />

        <GroupWait
          host={false}
          roomNum={this.state.roomNum}
          members={this.state.members}
          display={this.state.groupWait}
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

export default Join;