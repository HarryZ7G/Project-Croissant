import React from 'react';
import FoodEntry from './FoodEntry.js';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      restaurants: null,
      button: null,
      loader: "hidden"
    }
  }

  componentDidMount() {
    if (this.props.user) {
      this.setState({ loader: null });
      try {
        fetch(`/user/history/${this.props.user}`,
        {
          credentials: "include",
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json"
        }
        }).then(response => response.json()).then(data => {
          let historyList = data.history;
          let results = [];
          if (historyList && historyList.length > 0) {
            for (const[key, restaurant] of Object.entries(historyList)) {
              results.push(<FoodEntry key={key} restaurant={restaurant} votes={-1}/>);
            }
            this.setState({
              restaurants: results,
              user: this.props.user,
              loader: "hidden"
            });
          }
        });
      } catch (e) {
        alert("Something happened :< please refresh the page");
      }
    }
  }

  componentDidUpdate() {
    if (this.props.user !== this.state.user && this.props.user) {
      this.setState({
        user: this.props.user,
        loader: null
      });
      try {
        fetch(`/user/history/${this.props.user}`,
        {
          credentials: "include",
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json"
        }
        }).then(response => response.json()).then(data => {
          let historyList = data.history;
          let results = [];
          if (historyList && historyList.length > 0) {
            for (const[key, restaurant] of Object.entries(historyList)) {
              results.push(<FoodEntry key={key} restaurant={restaurant} votes={-1}/>);
            }
            this.setState({
              restaurants: results,
              loader: "hidden"
            });
          } else {
            this.setState({
              loader: "hidden",
              restaurants:  <label className="font-large">
                              History is empty
                            </label>
            });
          }
        });
      } catch (e) {
        alert("Something happened :< please refresh the page");
      }
    }
  }

  render() {
    return (
      <div className="home-popup animate__animated animate__fadeIn" id="home-popup">
        <button className={`close-small ${this.state.button}`} onClick={this.props.close}></button>
        <div className={`loader ${this.state.loader}`} id="loader"/>
        <label className="font-small popup-title">
          Here are your top voted restaurants
        </label>
        {this.state.restaurants}
      </div>
    )
  }
}

export default History;