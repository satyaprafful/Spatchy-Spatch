import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import RecipeRow from './RecipeRow';

export default class NutritionSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes: []
    };

    // this.proteinSearch = this.proteinSearch.bind(this);
  }

  // low sodium = 140mg/serving
  // low calories = <300 cal per serving
  // keto = 75% cal from fat. Fat = 9 cal/gram. .75/9 = gram fat/total cal

  getUserCalPerDay()
  {
    var weight = 135; // this is hard-coded bc the user isn't set up yet  (lbs)
    var activity = 3; // this is hard-coded bc the user isn't set up yet (scale 1-5)
    var isWoman = 1; // this is hard-coded bc the user isn't set up yet (1 = women, 2 = man)
    var age = 21; // this is hard-coded bc the user isn't set up yet (in yrs)
    var height = 66; // this is hard-coded bc the user isn't set up yet (inches)

    var calPerDay = 0;
    // Harris-Benedict BMR equation
    if (isWoman)
      calPerDay = 655.1 + (4.35 * weight) + (4.7 * height) - (4.7 * age);
    else
      calPerDay = 66.47 + (6.24 * weight) + (12.7 * height) - (6.755 * age);
    // above calculation is BMR, now take into account activity level
    calPerDay = calPerDay  *  (1.025 + .175 * activity);
    return calPerDay;
  }

  getUserProteinRatio()
  {
    var weight = 135; // this is hard-coded bc the user isn't set up yet  (lbs)

    var proteinPerDay = weight * .7; // .7 = gram protein/lb body weight/day
    var proteinRatio = proteinPerDay/this.getUserCalPerDay(); 
    return proteinRatio;
  }

  componentDidMount()
  {
    console.log("tadfoto");
    fetch("http://localhost:8081/protein/" + this.getUserProteinRatio(),
      {
        method: "GET"
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(recipesList => {
        console.log("toto");
        console.log(recipesList); //delete this

        let recipesDiv = recipesList.map((recipeObj, i) => 
          <RecipeRow title = {recipeObj.title} />
        );

        ///This saves our HTML representation of the data into the state, which we can call in our render function
        this.setState({
          recipes : recipesDiv
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });
  }
  
  render() {    
    return (
      <div className="Nutrition Search">

        <PageNavbar active="Nutrition" />
        <br></br>
        This is the nutrition pate
      </div>
    );
  }
}