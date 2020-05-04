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
      recDivs : null,
      rID : null,
      user: null
    };
    window.addEventListener('locationchange', function(){
        console.log('location changed!');
    })
  }

  componentDidUpdate()
  {
    // this.componentDidMount()
    var urlWords = window.location.href.split('/')
    var rID = urlWords[urlWords.length - 1];
    if (rID != this.state.rID)
    {
      this.componentDidMount()
      this.render()
    }
  }

  componentDidMount()
  {
    console.log("mounted")
    fetch("http://localhost:8081/curruser",
    {
      method: "GET"
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(userInfo => {
      console.log(userInfo); //delete this
      console.log("got user")
      if (userInfo != null)
      {
        userInfo = this.convertBools(userInfo);
      }
      this.setState({
        user : userInfo
      });
    }, err => {
      console.log(err);
    }).then(() => {

      var urlWords = window.location.href.split('/')
      if (urlWords.length > 0)
      {
        // display the recipe recipes
        var rID = urlWords[urlWords.length - 1];
        this.setState({
          rID : rID
        });

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
              ingr_desc : recipeObj.ingr_descr,
              rating : recipeObj.rating,
              recipe_descr : recipeObj.recipe_descr,
              directions : this.deparse(recipeObj.directions)
            });
          });
        }, err => {
          // Print the error if there is one.
          console.log(err);
        });
        fetch("http://localhost:8081/recipe/recommend/" + rID + this.dietaryRestrictions(),
        {
          method: "GET"
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(recipesList => {

          let recipesDiv = recipesList.map((recipeObj, i) => 
            <RecipeRow title = {recipeObj.title}
                ingr_desc = {recipeObj.ingr_descr} 
                recipe_descr = {recipeObj.recipe_descr} 
                rating = {recipeObj.rating} 
                rID = {recipeObj.rID} 
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
    });
  }
  convertBools(userInfo)
  {
    userInfo.isVegan = userInfo.isVegan ? 1 : 0;
    userInfo.isNut = userInfo.isNut ? 1 : 0;
    userInfo.isLactose = userInfo.isLactose ? 1 : 0;
    userInfo.isVegetarian = userInfo.isVegetarian ? 1 : 0;
    userInfo.isGluten = userInfo.isGluten ? 1 : 0;
    return userInfo;
  }

  dietaryRestrictions()
  {
    console.log(this.state);
    return "/" + this.state.user.isVegan + "/" + this.state.user.isNut + "/" + this.state.user.isLactose + "/" + this.state.user.isVegetarian+ "/" + this.state.user.isGluten;
  }

  deparse(parsed)
  {
    var dirArr = parsed.substring(1,parsed.length-1).split(",")
    var output = ""
    dirArr.forEach(element => {output = output.concat(element);});
    return output;
  }

  parseIngredients(raw)
  {
    if (raw === undefined || raw == null)
      return;
    var ingrArr = raw.substring(1,raw.length-1).split(",")
    console.log(raw);
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

      <div className="Full Recipe" style={{backgroundColor: "#EAE7DC", minHeight:"100vh", height: "100%"}}>

      <PageNavbar active="" />
      <div id="recipe">
        <div class="row">
          <div class="col-12">
            <strong>Recipe Name</strong>: {this.state.title}
          </div>
        </div>
        <br></br>
        <div class="row">
          <div class="col-6" style={{right: "20%", textAlign: "right"}}>
            <strong>Rating:</strong> 
          </div>
          <div class="col-6" style={{right: "20%", textAlign: "left"}}>
            {this.state.rating}
          </div>
        </div>
        <div class="row">
          <div class="col-6" style={{right: "20%", textAlign: "right"}}>
            <strong>Description:</strong> 
          </div>
          <div class="col-6" style={{right: "20%", textAlign: "left"}}>
            {this.state.recipe_descr}
          </div>
        </div>
        <div class="row">
          <div class="col-6" style={{right: "20%", textAlign: "right"}}>
            <strong>Ingredients:</strong> 
          </div>
          <div class="col-6" style={{right: "20%", textAlign: "left"}}>
            {this.parseIngredients(this.state.ingr_desc)}
          </div>
        </div>
        <div class="row">
          <div class="col-6" style={{right: "20%", textAlign: "right"}}>
            <strong>Directions:</strong> 
          </div>
          <div class="col-6" style={{right: "20%", textAlign: "left"}}>
            {this.parseIngredients(this.state.directions)}
          </div>
        </div>
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