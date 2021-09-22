import React from 'react';
import toReactComponent from 'svgr.macro';
const Location = toReactComponent('../media/location.svg');

class LocationInput extends React.Component {
  render() {
    return (
      <div className="input-location animate__animated animate__fadeIn">
        <button className={`locate-button success ${this.props.status}`} id="locate" onClick={this.props.geo}>
          <Location className="locate-icon" id="locate-fill"/>
        </button>
        <div className="locate-seperator"></div>
        <form id="location-form" onSubmit={this.props.handleSubmit}>
          <input
            value={this.props.value}
            onChange={this.props.handleChange}
            type="text"
            placeholder="Enter your location"
            id="home-input"
            required/>
        </form>
      </div>
    )
  }
}

export default LocationInput;