import React from 'react';

class FoodIcon extends React.Component {

  constructor(props) {
    super(props);
    this.buttonRef = React.createRef();
    this.state = {
      left: '0vw',
      food: null,
      text: "Nothing",
      picked: false,
      button: null,
      outline: ""
    }
  }

  componentDidMount = () => {
    let outline = "";
    if (this.props.dark)
      outline = "inset -0.3vh 0 0 #454545, inset 0 -0.3vh 0 #454545, inset 0.3vh 0 0 #454545, inset 0 0.3vh 0 #454545"
    else
      outline = "inset -0.3vh 0 0 white, inset 0 -0.3vh 0 white, inset 0.3vh 0 0 white, inset 0 0.3vh 0 white"
    this.setState({
      food: this.props.food, 
      left: this.props.left, 
      text: this.props.text,
      outline: outline
    });
  }

  pick = () => {
    this.setState({picked: !this.state.picked}, () => {
      if (this.state.picked)
        this.buttonRef.current.style.boxShadow = this.state.outline;
      else
        this.buttonRef.current.style.boxShadow = "none";
      this.props.changeSelect(this.props.stateName, this.state.picked);
    });
  }

  render() {
    return (
      <div className="food-type" onClick={this.pick}>
        <button 
          className="food-icon" 
          style={{backgroundImage: `url(${this.state.food})`}}
          ref={this.buttonRef}
        />
        <label className="food-text">{this.state.text}</label>
      </div>
    )
  }
}

export default FoodIcon;