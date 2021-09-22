import React from 'react';
import History from '../components/History.js';
import Settings from '../components/Settings.js';
import '../style/landing.css';
import 'animate.css';

class Landing extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoggedin: false,
      settings: "hidden",
      user: null,
      history: null,
      footer: null,
      preference: null
    }
    this.showSettings = this.showSettings.bind(this);
    this.closeSettings = this.closeSettings.bind(this);
    this.showHistory = this.showHistory.bind(this);
    this.closeHistory = this.closeHistory.bind(this);
    this.signout = this.signout.bind(this);
  }

  componentDidMount() {
    try {
      fetch(`/isloggedin/`,
      {
        credentials: "include", 
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => response.json()).then(data => {
        if (data.username) {
          this.setState({
            isLoggedin: true,
            user: data.username,
            footer: <div className="footer-user animate__animated animate__fadeIn">
                      <button className="footer-button" onClick={this.showSettings}>
                        Settings
                      </button>
                      <button className="footer-button" onClick={this.signout}>
                        Sign out
                      </button>
                      <button className="footer-button" onClick={this.showHistory}>
                        History
                      </button>
                    </div>
          });
        } else {
          this.setState({
            footer: <div className="footer animate__animated animate__fadeIn">
                      <a className="bot-text" style={{color: 'lightblue'}} href="./login">
                        Log in
                      </a>
                      <h4 className="bot-text">
                      &nbsp; or &nbsp;
                      </h4>
                      <a className="bot-text" style={{color: 'lightblue'}} href="./signup">
                        sign up
                      </a>
                      <h4 className="bot-text">
                        &nbsp; to enjoy all features
                      </h4>
                    </div>
          })
        }
      });
    } catch (e) {
      alert("Something happened :< please refresh the page");
    }
  }

  signout() {
    try {
      fetch("/signout/",
      {
        credentials: "include", 
        headers: {
          "Access-Control-Allow-Credentials": "true",
          "Content-Type": "application/json"
        }
      }).then(response => {
        this.setState({
          user: null,
          isLoggedin: false,
          footer: <div className="footer animate__animated animate__fadeIn">
                      <a className="bot-text" style={{color: 'lightblue'}} href="./login">
                        Log in
                      </a>
                      <h4 className="bot-text">
                      &nbsp; or &nbsp;
                      </h4>
                      <a className="bot-text" style={{color: 'lightblue'}} href="./signup">
                        sign up
                      </a>
                      <h4 className="bot-text">
                        &nbsp; to enjoy all features
                      </h4>
                    </div>
        });
      })
    } catch (e) {

    }
  }

  showSettings() {
    this.setState({ settings: null });
  }

  closeSettings() {
    this.setState({ settings: "hidden" });
  }

  showHistory() {
    this.setState({
      history:  <History
                  user={this.state.user}
                  close={this.closeHistory}
                />
    });
  }

  closeHistory() {
    this.setState({ history: null });
  }

  render() {
    return (
      <div className="landing">
        <div className="background"/>
        <div className="croissant animate__animated animate__fadeIn">
          <h2 className="title">
            Croissant
          </h2>
        </div>
        <div className="landing-button-group animate__animated animate__fadeIn">
          <button className="landing-button">
            <a href="./alone">
              <h3 className="landing-button-text">
                Dining alone
              </h3>
            </a>
          </button>
          <button className="landing-button">
            <a href="./group">
              <h3 className="landing-button-text">
                Dining with a group
              </h3>
            </a>
          </button>
        </div>
        {this.state.footer}

        <Settings
          user={this.state.user}
          display={this.state.settings}
          preference={this.state.preference}
          close={this.closeSettings}
        />
        {this.state.history}
      </div>
    )
  }
}

export default Landing;