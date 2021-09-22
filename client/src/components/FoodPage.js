import React from 'react';

class FoodPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      restaurants: null,
      currentIndex: 0,
      image: null,
      rating: null,
      name: null,
      categories: null,
      distance: null,
      finished: false,
      price: null
    };
    this.like = this.like.bind(this);
    this.dislike = this.dislike.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  componentDidMount() {
    let restaurant = this.props.restaurants[0];
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

    this.setState({
      restaurants: this.props.restaurants,
      image: restaurant.image_url,
      rating: rating,
      name: restaurant.name,
      categories: categories,
      distance: (restaurant.distance / 1000).toFixed(1),
      price: restaurant.price
    });
  }

  like() {
    this.props.changeSelect(this.state.currentIndex, true);
    this.next();
  }

  dislike() {
    this.props.changeSelect(this.state.currentIndex, false);
    this.next();
  }

  next() {
    if (this.state.currentIndex < this.props.restaurants.length - 1) {
      let restaurant = this.state.restaurants[this.state.currentIndex + 1];
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

      this.setState({
        image: restaurant.image_url,
        name: restaurant.name,
        rating: rating,
        currentIndex: this.state.currentIndex + 1,
        categories: categories,
        distance: (restaurant.distance / 1000).toFixed(1),
        price: restaurant.price
      });
    } else {
      this.props.complete();
      this.setState({
        finished: true,
        name: "Wait for everyone to finish"
      });
    }
  }

  previous() {
    if (this.state.currentIndex > 0) {
      let restaurant = this.state.restaurants[this.state.currentIndex - 1];
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

      this.setState({
        image: restaurant.image_url,
        name: restaurant.name,
        rating: rating,
        currentIndex: this.state.currentIndex - 1,
        categories: categories,
        distance: (restaurant.distance / 1000).toFixed(1),
        price: restaurant.price
      });
    } else {
      alert("Already at first item");
    }
  }

  render() {
    return (
      <div className="select-container" id="select-container">
        <img src={this.state.image} alt="" className="full-food-pic"/>
        <div className="food-entry-text-row first">
          <label className="full-food-text">
            {this.state.name}
          </label>
          <label className="full-food-rating">
            {this.state.rating}
          </label>
        </div>
        <div className="food-entry-text-row">
          <label className="full-food-rating">
            {this.state.categories}
          </label>
        </div>
        <div className="food-entry-text-row">
          <label className="full-food-rating">
            {this.state.distance} km away
          </label>
          <label className="full-food-rating">
            {this.state.price}
          </label>
        </div>
        <div className="vote-button-group">
          <button className="round-button previous-button" 
                  onClick={this.previous} disabled={this.state.finished} name="vote-button"/>
          <button className="round-button dislike-button"
                  onClick={this.dislike} disabled={this.state.finished} name="vote-button"/>
          <button className="round-button like-button"
                  onClick={this.like} disabled={this.state.finished} name="vote-button"/>
        </div>
      </div>
    )
  }
}

export default FoodPage;