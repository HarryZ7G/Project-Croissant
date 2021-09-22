import React from 'react';
import breakfast from '../media/food type/breakfast.png';
import bubbleTea from '../media/food type/bubble-tea.png';
import cafe from '../media/food type/cafe.jpg';
import chinese from '../media/food type/chinese.png';
import fastFood from '../media/food type/fast-food.png';
import french from '../media/food type/french.png';
import indian from '../media/food type/indian.png';
import italian from '../media/food type/italian.png';
import japanese from '../media/food type/japanese.png';
import korean from '../media/food type/korean.jpg';
import mexican from '../media/food type/mexican.png';
import middleEastern from '../media/food type/middle-eastern.png';
import pizza from '../media/food type/pizza.png';
import wings from '../media/food type/wings.jpg';
import FoodIcon from './FoodIcon';

class Categories extends React.Component {

  render() {
    return (
      <div className={`bottom-container ${this.props.display}`} id="selection-popup">
        <label className="font-small" id="home-greet">Pick your categories</label>
        <div className="food-picker-block">
          <div className="food-picker-row">
            <FoodIcon
              food={breakfast}
              stateName="breakfast_brunch"
              text="Breakfast"
              changeSelect={this.props.pickFood}
              dark={false}
            />
            <FoodIcon 
              food={cafe}
              stateName="cafes"
              text="Cafe"
              changeSelect={this.props.pickFood}
              dark={true}
            />
            <FoodIcon
              food={fastFood}
              stateName="hotdogs"
              text="Fast Food"
              changeSelect={this.props.pickFood}
              dark={false}
            />
            <FoodIcon 
              food={indian}
              stateName="indpak"
              text="Indian"
              changeSelect={this.props.pickFood}
              dark={false}
            />
            <FoodIcon
              food={japanese}
              stateName="japanese"
              text="Japanese"
              changeSelect={this.props.pickFood}
              dark={false}
            />
            <FoodIcon
              food={mexican}
              stateName="mexican"
              text="Mexican"
              changeSelect={this.props.pickFood}
              dark={true}
            />
            <FoodIcon
              food={pizza}
              stateName="pizza"
              text="Pizza"
              changeSelect={this.props.pickFood}
              dark={false}
            />
          </div>
          <div className="food-picker-row">
            <FoodIcon
              food={bubbleTea}
              stateName="bubbletea"
              text="Bubble Tea"
              changeSelect={this.props.pickFood}
              dark={true}
            />
            <FoodIcon 
              food={chinese}
              stateName="chinese"
              text="Chinese"
              changeSelect={this.props.pickFood}
              dark={false}
            />
            <FoodIcon 
              food={french}
              stateName="french"
              text="French"
              changeSelect={this.props.pickFood}
              dark={false}
            />
            <FoodIcon 
              food={italian}
              stateName="italian"
              text="Italian"
              changeSelect={this.props.pickFood}
              dark={true}
            />
            <FoodIcon
              food={korean}
              stateName="korean"
              text="Korean"
              changeSelect={this.props.pickFood}
              dark={true}
            />
            <FoodIcon
              food={middleEastern}
              stateName="mideastern"
              text="Middle Eastern"
              changeSelect={this.props.pickFood}
              dark={false}
            />
            <FoodIcon
              food={wings}
              stateName="chicken_wings"
              text="Wings"
              changeSelect={this.props.pickFood}
              dark={false}
            />
          </div>
        </div>
        <button className="big-button ready-button" id="ready" onClick={this.props.ready}>Ready</button>
      </div>
    )
  }
}

export default Categories;