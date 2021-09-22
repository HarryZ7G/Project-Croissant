import React from 'react';
import '../style/signup.css';

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      signed: false,
      loader: "hidden"
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState({ loader: null });
    try {
      fetch('/signin',
        {
          method: 'POST',
          credentials: "include", 
          headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            username: this.state.username,
            password: this.state.password
          })
        }).then(response => {
          this.setState({ loader: "hidden" }, () => {
            if (response.ok)
              this.props.history.push('/');
            else if (response.status === 404)
              alert("username does not exist");
            else if (response.status === 401)
              alert("password does not match the username");
            else
              alert("internal error");
          });
        });
    } catch (e) {
      
    }
  }

  render() {
    return (
      <div className="user-root">
        <div className="background"></div>
        <div className={`loader ${this.state.loader}`} id="loader"/>
        <div className="login-box animate__animated animate__fadeIn">
          <h1 className="sign-title">
            Log in
          </h1>
          <form onSubmit={ this.handleSubmit }>
            <div className="inputs" style={{marginTop: "15vh"}}>
              <input
                type="text"
                className="input-bar"
                onChange={this.handleUsernameChange}
                value={this.state.username}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="inputs">
              <input
                type="password"
                className="input-bar"
                name="password"
                onChange={this.handlePasswordChange}
                value={this.state.password}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" className="login-buttons">Sign in</button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login;