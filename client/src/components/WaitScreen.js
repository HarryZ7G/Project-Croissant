import React from 'react';

class WaitScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      display: false
    };
  }

  componentDidUpdate() {
    if (this.props.display !== this.state.display) {
      this.setState({ display: this.props.display }, () => {
        if (this.props.display)
          document.getElementById("wait-screen").classList.remove("hidden");
        else {
          document.getElementById("wait-screen").classList.add("hidden");
        }
      });
    }
  }

  render() {
    return (
      <div className="wait-screen hidden" id="wait-screen">
        <label className="font-large">
          Waiting...
        </label>
        <label className="font-small finished-count">
          {this.props.ready} / {this.props.members} finished
        </label>
      </div>
    )
  }
}

export default WaitScreen;