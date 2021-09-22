import React from 'react';

class MemberJoin extends React.Component {

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
          document.getElementById("member-join").classList.remove("hidden");
        else {
          document.getElementById("member-join").classList.remove("animate__animated", "animate__fadeInUp");
          document.getElementById("member-join").classList.add("hidden");
        }
      });
    }
  }

  render() {
    return (
      <div className="member-join animate__animated animate__fadeIn" id="member-join">
        <h1 className="sign-title">
          Join group
        </h1>
        <form onSubmit={this.props.handleSubmit}>
          <div className="join-input">
            <input
              type="text"
              placeholder="Enter group number"
              onChange={this.props.handleChange}
              required
            />
          </div>
          <button
            className="big-button join-ready-button"
            style={{transition: "0.2s"}} 
            id="join-ready"
            type="submit"
          >
            Enter
          </button>
        </form>
      </div>
    )
  }
}

export default MemberJoin;