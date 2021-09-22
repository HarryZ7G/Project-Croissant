import React from 'react';

class LocationBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      display: true
    };
  }

  componentDidUpdate() {
    if (this.props.display !== this.state.display) {
      this.setState({ display: this.props.display }, () => {
        if (this.props.display)
          document.getElementById("location-bar").classList.remove("hidden");
        else {
          document.getElementById("location-bar").classList.add("hidden");
        }
      });
    }
  }


  render() {
    return (
      <div className="display-location hidden" id="location-bar">
        <form onSubmit={this.props.handleSubmit}>
          <label className="font-small">
            {this.props.location}
          </label>
        </form>
      </div>
    )
  }
}

export default LocationBar;