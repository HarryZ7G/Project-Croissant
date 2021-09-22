import React from 'react';
import FoodEntry from './FoodEntry.js';

class ResultPopup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      restaurants: null,
      button: null,
    }
  }

  componentDidMount() {
    let results = [];
    let restaurants = JSON.parse(this.props.restaurants)
    if (this.props.votes) {
      for (const [key, votes] of Object.entries(this.props.votes)) {
        results.push(<FoodEntry key={key} votes={votes[1]} restaurant={restaurants[votes[0]]}/>)
      }
    } else {
      for (const [key, restaurant] of Object.entries(restaurants)) {
        results.push(<FoodEntry key={key} restaurant={restaurant} votes={-1}/>);
      }
    }
    let group = this.props.group ? "hidden" : null;
    this.setState({
      restaurants: results,
      button: group
    });
  }

  render() {
    return (
      <div className="home-popup animate__animated animate__fadeIn" id="home-popup">
        <button className={`close-small ${this.state.button}`} onClick={this.props.close}></button>
        <label className="font-small popup-title">
          Here are your recommendations
        </label>
        {this.state.restaurants}
      </div>
    )
  }
}

export default ResultPopup;