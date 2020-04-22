import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';


export default class ExactRecipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name : "Lentil Soup"
    }

    console.log("yo");
  }

  gotDishName(dish)
  {
    console.log("got dishnameCalled");
    this.state = {
      name : dish.dish_name
    };
    console.log("got dishnameCalled");
    
  }

  componentDidMount() {
    console.log("mounted");
    fetch("http://localhost:8081/dishes/dishName",
      {
        method: "GET"
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(dishList => {
        console.log(dishList);
        dishList.map((dish, i) => 
          this.gotDishName(dish)
          );
      }, err => {
        // Print the error if there is one.
        console.log("err2");
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