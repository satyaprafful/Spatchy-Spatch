import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';


export default class ExactRecipes extends React.Component {
  constructor(props) {
    super(props);
    // default dish, before querying database
    this.state = {
      name : "Lentil Soup"
    }
  }

  gotDishName(dish)
  {
    this.setState ({
      name : dish.dish_name
    });
    console.log(this.state.name);
    this.render();
  }

  componentDidMount() {
    fetch("http://localhost:8081/dishes/dishName",
      {
        method: "GET"
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(dish => {
        this.gotDishName(dish[0]);
        this.render();
      }, err => {
        console.log(err);
      });
  }

  render() {    
    return (
      <div className="Recipes">

        <PageNavbar active="Recipes" />
        <br></br>
        One recipe name is: {this.state.name}
      </div>
    );
  }
}