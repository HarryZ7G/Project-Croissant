import React from 'react';

class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      passwordRpt: "",
      signed: false,
      loader: "hidden"
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordRptChange = this.handlePasswordRptChange.bind(this);
  }

  handleUsernameChange(event) {
    this.setState({ username: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  handlePasswordRptChange(event) {
    this.setState({ passwordRpt: event.target.value });
  }

  handleSubmit(event){
    event.preventDefault();
    if (this.state.password !== this.state.passwordRpt)
      return alert("The two passwords do not match");
    try {
      this.setState({ loader: null });
      fetch("/signup", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Accept": 'application/json'
        },
        body: JSON.stringify({
          "username": this.state.username, 
          "password": this.state.passwordRpt
        })
      }).then(response => {
        this.setState({ loader: "hidden" }, () => {
          if (response.ok)
            this.props.history.push('/');
          else if (response.status === 401)
            alert("username already exists");
          else
            alert ("internal error");
        });
      });
    } catch (e) {
      
    }
  }
  
  render() {
    return (
      <div className="root">
        <div className="background"></div>
        <div className={`loader ${this.state.loader}`} id="loader"/>
        <div className="login-box animate__animated animate__fadeIn">
          <h1 className="sign-title">
            Sign up
          </h1>
          <form onSubmit={ this.handleSubmit }>
            <div className="inputs" style={{marginTop: "8vh"}}>
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
            <div className="inputs">
              <input
                type="password"
                className="input-bar"
                name="password"
                onChange={this.handlePasswordRptChange}
                value={this.state.passwordRpt}
                placeholder="Repeat password"
                required
              />
            </div>
            <button type="submit" className="login-buttons">Sign up</button>
          </form>
        </div>
      </div>
    )
  }
}

export default Signup;