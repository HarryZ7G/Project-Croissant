import React from 'react';
import GoogleMaps from './GoogleMaps.js';

class GroupWait extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      display: true,
      host: false,
      startButton: null,
      roomNum: -1,
      roomDisplay: "Creating...",
      members: 0,
      memberDisplay: "No members yet"
    };
  }

  componentDidMount() {
    this.setState({ host: this.props.host });
    if (!this.props.host)
      this.setState({ startButton: "hidden" });
  }

  componentDidUpdate() {
    if (this.props.roomNum !== this.state.roomNum) {
      this.setState({
        roomNum: this.props.roomNum,
        roomDisplay: this.props.roomNum
      });
    }
    if (this.props.members !== this.state.members) {
      if (this.props.members === 0) {
        this.setState({
          members: this.props.members,
          memberDisplay: "No members yet"
        });
      } else if (this.props.members === 1) {
        this.setState({
          members: this.props.members,
          memberDisplay: "You're the only member"
        });
      } else {
        this.setState({
          members: this.props.members,
          memberDisplay: `${this.props.members} members in your group`
        });
      }
    }
  }

  render() {
    return (
      <div className={`bottom-container ${this.props.display}`} id="host-wait">
        <label className="font-large" id="host-id">
          {this.state.roomDisplay}
        </label>
        <label className="font-small" id="member-count" style={{marginTop: 0}}>
          {this.state.memberDisplay}
        </label>
        <GoogleMaps
          center={{lat: this.props.latitude, lng: this.props.longitude}}
          bounds={this.props.bounds}
        />
        <button className={`big-button ready-button ${this.state.startButton}`} onClick={this.props.start} id="start-button">Ready</button>
      </div>
    )
  }
}

export default GroupWait;