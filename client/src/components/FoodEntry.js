import React from 'react';

class FoodEntry extends React.Component {

  constructor(props) {
    super(props);
    this.voteRef = React.createRef();
    this.state = {
      image: null,
      name: null,
      rating: null,
      categories: null,
      distance: null,
      price: null,
      votes: null,
    };
  }

  componentDidMount() {
    let restaurant = this.props.restaurant;
    let rating = "";
    if (restaurant.rating % 1) {
      rating = "★".repeat(restaurant.rating - 0.5);
      rating = rating + "☆";
    }
    else
      rating = "★".repeat(restaurant.rating);
    
    let categories = "";
    restaurant.categories.forEach(entry => {
      categories = categories + entry.title + " - ";
    });
    categories = categories.substring(0, categories.length - 3);

    if (this.props.votes > -1) {
      this.voteRef.current.style.display = "flex";
    }
    
    this.setState({
      image: restaurant.image_url,
      name: restaurant.name,
      rating: rating,
      categories: categories,
      distance: (restaurant.distance / 1000).toFixed(1),
      price: restaurant.price,
      votes: this.props.votes
    });
  }

  render() {
    return (
      <div className="food-entry">
        <label className="food-entry-votes" ref={this.voteRef}>
          {this.state.votes}
        </label>
        <img src={this.state.image} alt="" className="food-pic"/>
        <div className="food-entry-text-row first">
          <label className="font-small  food-entry-title">
            {this.state.name}
          </label>
          <label className="food-entry-text">
            {this.state.rating}
          </label>
        </div>
        <div className="food-entry-text-row">
          <label className="food-entry-text">
            {this.state.categories}
          </label>
        </div>
        <div className="food-entry-text-row">
          <label className="food-entry-text">
            {this.state.distance} km away
          </label>
          <label className="food-entry-text">
            {this.state.price}
          </label>
        </div>
      </div>
    )
  }
}

export default FoodEntry;