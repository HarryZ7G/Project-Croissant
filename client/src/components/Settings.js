import React from 'react';
import '../style/landing.css';

class Settings extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      numCategories: 3,
      numRestaurants: 10,
      user: null,
    }
    this.changeCategory = this.changeCategory.bind(this);
    this.changeRestaurant = this.changeRestaurant.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {
    if (this.props.user) {
      try {
        fetch(`/user/preference/${this.props.user}`,
        {
          credentials: "include", 
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json"
        }
        }).then(response => response.json()).then(data => {
          this.setState({
            numCategories: data.numCategories,
            numRestaurants: data.numRestaurants,
            user: this.props.user
          });
        });
      } catch (e) {
        alert("Something happened :< please refresh the page");
      }
    }
  }

  componentDidUpdate() {
    if (this.props.user !== this.state.user && this.props.user != null) {
      try {
        fetch(`/user/preference/${this.props.user}`,
        {
          credentials: "include", 
          headers: {
            "Access-Control-Allow-Credentials": "true",
            "Content-Type": "application/json"
        }
        }).then(response => response.json()).then(data => {
          this.setState({
            numCategories: data.numCategories,
            numRestaurants: data.numRestaurants,
            user: this.props.user
          });
        });
      } catch (e) {
        alert("Something happened :< please refresh the page");
      }
    }
  }

  submit () {
    try{
      fetch("/user/preference",
      {
        method: "PATCH",
        credentials: "include", 
        headers: {
        "Access-Control-Allow-Credentials": "true",
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.props.user,
          preference:{
            numCategories: this.state.numCategories,
            numRestaurants: this.state.numRestaurants
          }
        })
      }).then(response => {
        if (response.ok) this.props.close()
        else alert("Error");
      });
    } catch(e) {
        alert("something happened :< refresh the page");
    }
  }

  changeCategory(add) {
    if (add)
      this.setState({ numCategories: Math.min(this.state.numCategories + 1, 14) });
    else
      this.setState({ numCategories: Math.max(this.state.numCategories - 1, 1) });
  }

  changeRestaurant(add) {
    if (add)
      this.setState({ numRestaurants: Math.min(this.state.numRestaurants + 1, 20) });
    else
      this.setState({ numRestaurants: Math.max(this.state.numRestaurants - 1, 5) });
  }

  render() {
    return(
      <div className={`home-popup ${this.props.display}`} id="setting-page">
        <button className="close-small" onClick={this.props.close}></button>
        <label className="font-large settings-title">
          Settings
        </label>
        <label className="font-small settings-text">
          Take the top {this.state.numCategories} categories
        </label>
        <div className="settings-button-group">
          <button className="settings-button" onClick={() => this.changeCategory(false)}>-</button>
          <button className="settings-button" onClick={() => this.changeCategory(true)}>+</button>
        </div>
        <label className="font-small settings-text">
          Show {this.state.numRestaurants} restaurants
        </label>
        <div className="settings-button-group">
          <button className="settings-button" onClick={() => this.changeRestaurant(false)}>-</button>
          <button className="settings-button" onClick={() => this.changeRestaurant(true)}>+</button>
        </div>
        <button className="big-button settings-submit" onClick={this.submit}>Submit</button>
      </div>
    )
  }
}

export default Settings;