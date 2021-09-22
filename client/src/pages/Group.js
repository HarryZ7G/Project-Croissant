import React from 'react';

class Group extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      roomNum: -1,
      members: 0,
      response: ""
    };
  }

  render() {
    return (
      <div className="home-root" id="home-root">
        <div className="background"></div>
        <a href="./group/host" style={{zIndex: 10, marginTop: "30vh"}}>
          <button className="big-button animate__animated animate__fadeIn" onClick={this.createGroup}>
            <h3 className="landing-button-text">
              Create a group
            </h3>
          </button>
        </a>
        <a href="./group/join" style={{zIndex: 10, marginTop: "5vh"}}>
          <button className="big-button animate__animated animate__fadeIn" onClick={this.joinGroup}>
            <h3 className="landing-button-text">
              Join a group
            </h3>
          </button>
        </a>
      </div>
    )
  }
}

export default Group;