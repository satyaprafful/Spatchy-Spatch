import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import RecipeRow from './RecipeRow';
import '../App.css';
import {Container, Row, Col, Accordion, Card, Button, Form} from 'react-bootstrap';

export default class RecipePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title : null,
      ingr_desc : null,
      rating : null,
      recipe_descr : null,
      directions : null,
      recDivs : null
    };

    // this.proteinSearch = this.proteinSearch.bind(this);
  }

  componentDidMount()
  {
    var urlWords = window.location.href.split('/')
    if (urlWords.length > 0)
    {
      // display the recipe recipes
      var rID = urlWords[urlWords.length - 1];

        // low calories = <350 cal per serving
      fetch("http://localhost:8081/recipe/full/" + rID,
      {
        method: "GET"
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(recipesList => {
        console.log(recipesList); //delete this

        recipesList.map((recipeObj, i) => {
          this.setState({
            title : recipeObj.title,
            ingr_desc : recipeObj.ingr_desc,
            rating : recipeObj.rating,
            recipe_descr : recipeObj.recipe_descr,
            directions : recipeObj.directions
          });
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });

      // get suggested recipes
      fetch("http://localhost:8081/recipe/recommend/" + rID,
      {
        method: "GET"
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(recipesList => {

        let recipesDiv = recipesList.map((recipeObj, i) => 
          <RecipeRow title = {recipeObj.title}
              ingr_desc = {recipeObj.ingr_desc} 
              recipe_descr = {recipeObj.recipe_descr} 
              rating = {recipeObj.rating} 
              index = {i}
          />
        );

        ///This saves our HTML representation of the data into the state, which we can call in our render function
        this.setState({
          recDivs : recipesDiv
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });
    }
  }

  parseIngredients(raw)
  {
    if (raw === undefined || raw == null)
      return;
    var ingrArr = raw.substring(1,raw.length-1).split(",")

    return ingrArr.map((tuple, i) => {
        var curr = ingrArr[i];
        curr = curr.replace(/\'/g, "");

        return  <Row>
                     <Col>
                          {curr}
                     </Col>
                </Row>
        }
    )
  }  

  render() {   
    const buttonStyle = {
      backgroundColor: "#E98074",
      color: "#D8C3A5"
    };
// @ CHRIS: it would be dope if we could somehow make these commended recipes 
      // as colimns I think
    return (

      <div className="Full Recipe" style={{backgroundColor: "#EAE7DC", height: "100vh"}}>

      <PageNavbar active="Nutrition Search" />
      <div id="recipe">
            <Row>
                <Col>
                    <strong>Recipe Name</strong>: {this.state.title}
                </Col>
            </Row>
            <Row>
                <Col>
                <strong>Rating:</strong> {this.state.rating}
                </Col>
            </Row>
            <Row>
                <Col>
                <strong>Description:</strong> {this.state.recipe_descr}
                </Col>
            </Row>
            <Row>
                <Col>
                    <strong>Ingredients:</strong> {this.parseIngredients(this.state.ingr_desc)}
                </Col>
            </Row>
            <Row>
                <Col>
                    Directions: {this.parseIngredients(this.state.directions)}
                </Col>
            </Row>
      </div>
      <br></br>
      <strong>Like this recipe? Here are more like it</strong>
      <div className="results-container" id="results">
      
                {this.state.recDivs}
          </div>        
      </div>
    );
  }
}