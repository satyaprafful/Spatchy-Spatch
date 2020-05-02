import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import RecipeRow from './RecipeRow';
import {Container, Row, Col, Accordion, Card, Button, Form} from 'react-bootstrap';

  const divStyle = {
      display: 'flex',
      justifyContent: 'space-around'
  };

export default class IngrSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        ingrList: [],
        recRecipes: [],
        recQuickAdd: [],
        fruitDivs: [],
        vegDivs: [],
        meatDivs: [],
        grainDivs: [],
        dairyDivs: [],
        otherDivs: []
    }

    this.handleIngrIDChange = this.handleIngrIDChange.bind(this);
    this.submitIngr = this.submitIngr.bind(this);
    this.submitBudget = this.submitBudget.bind(this);
    this.findQuickAdd = this.findQuickAdd.bind(this);

	}

	handleIngrIDChange(e) {
		var value = e.target.value;
        var contains = this.state.ingrList.includes(value);

        if (!contains) {
            this.setState({
                ingrList: this.state.ingrList.concat(value)
            });
        } else {
            var newList = this.state.ingrList.filter(function(ingrValue){ return ingrValue != value });
            this.setState({
                ingrList: newList
            });
        }
    }

  parseIngrList()
  {
    var ingrList = this.state.ingrList;

    var output = "?" + "ingr0=" + ingrList[0];

    for (var i = 1; i < ingrList.length; i++) {
      output += "&ingr" + i + "=" + ingrList[i];
    }

    console.log(output);

    return output;
  }


  findQuickAdd() {
    fetch("http://localhost:8081/quickadd/" + this.parseIngrList(),
    {
        method: "GET"
    }).then(res => {
        return res.json();
    }, err => {
        console.log(err);
    }).then(quickAddList => {

        console.log("hello!");
        console.log(quickAddList); 
        //delete this

        let quickAddDiv = quickAddList.map((quickadd, i) => {
            
            return (
                <Container>
                    <Row>
                        Add {quickadd.name} for {quickadd.count} new recipes
                    </Row>
                </Container>
            )
        });

        ///This saves our HTML representation of the data into the state, which we can call in our render function
        this.setState({
            recQuickAdd : quickAddDiv
        });
    }, err => {
        // Print the error if there is one.
        console.log(err);
    });
  }


  submitIngr()
  {
    this.findQuickAdd();

    fetch("http://localhost:8081/ingredients/" + this.parseIngrList(),
      {
        method: "GET"
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(recipesList => {

        console.log(recipesList); //delete this

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
          recRecipes : recipesDiv
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });
  }


  submitBudget()
  {
    this.findQuickAdd();

    fetch("http://localhost:8081/budget/" + this.parseIngrList(),
      {
        method: "GET"
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(recipesList => {

        console.log(recipesList); //delete this

        let recipesDiv = recipesList.map((recipeObj, i) => 
            <RecipeRow title = {recipeObj.title}
            ingr_desc = {recipeObj.ingr_desc} 
            recipe_descr = {recipeObj.recipe_descr} 
            rating = {recipeObj.rating} 
            rID = {recipeObj.rID}  
            index = {i}
            />
        );
        ///This saves our HTML representation of the data into the state, which we can call in our render function
        this.setState({
          recRecipes : recipesDiv
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });
  }


  componentDidMount() {
        const vegIngrList = [['artichoke', 6], ['arugula', 7], ['asparagus', 9], ['avocado', 11], ['bean', 20], ['beet', 206], ['blueberry', 23], ['broccoli', 27], ['cabbage', 31], ['carrot', 36], ['cauliflower', 207], ['celery', 38], ['corn', 58]];
        const meatIngrList = [['bacon', 12], ['beef', 21], ['chicken', 41], ['chicken breast', 209], ['chicken leg', 42], ['chuck roast', 48], ['ground beef', 213], ['ground chuck', 85], ['ham', 88], ['lamb', 99], ['pork', 141], ['prosciutto', 220], ['rib roast', 151]];
        const dairyIngrList = [['asiago', 8], ['blue cheese', 22], ['burrata', 29], ['butter', 30], ['camembert', 32], ['cheddar', 39], ['cheddar cheese', 208], ['colby', 55], ['cottage cheese', 59], ['cream cheese', 62], ['crème fraîche', 212], ['feta', 72], ['fontina', 75]];
        const otherIngrList = [['almond', 1], ['apple sauce', 203], ['beer', 205], ['bourbon', 24], ['broth', 28], ['capers', 33], ['chocolate', 46], ['cocoa', 52], ['coconut', 53], ['coffee', 54], ['cookie', 56], ['curry', 66], ['egg', 68], ['gelatin', 77]];
        const fruitIngrList = [['apple', 4], ['apricot', 5], ['banana', 15], ['cherry', 40], ['cranberry', 61], ['currant', 65], ['grape', 83], ['mango', 216], ['orange', 123], ['peach', 132], ['pear', 134], ['raspberry', 149], ['strawberry', 177]];
        const grainIngrList = [['baguette', 204], ['bread', 26], ['couscous', 211], ['cracker', 60], ['linguini', 104], ['macaroni', 105], ['noodle', 117], ['oats', 217], ['pasta', 130], ['penne', 136], ['ravioli', 150], ['rice', 152], ['rigatoni', 154], ['spaghetti', 174]];

		let fruitDivs = fruitIngrList.map((tuple, i) => {
            return  <div>
                    <input type="checkbox" id={tuple[0]} key={i} onChange={this.handleIngrIDChange} name="ingr" value={tuple[1]}/>
                    <label> {tuple[0]} </label>
                    </div>
		})

		let vegDivs = vegIngrList.map((tuple, i) => {
            return  <div>
                    <input type="checkbox" id={tuple[0]} key={i} onChange={this.handleIngrIDChange} name="ingr" value={tuple[1]}/>
                    <label> {tuple[0]} </label>
                    </div>
		})

		let meatDivs = meatIngrList.map((tuple, i) => {
            return  <div>
                    <input type="checkbox" id={tuple[0]} key={i} onChange={this.handleIngrIDChange} name="ingr" value={tuple[1]}/>
                    <label> {tuple[0]} </label>
                    </div>
		})

		let dairyDivs = dairyIngrList.map((tuple, i) => {
            return  <div>
                    <input type="checkbox" id={tuple[0]} key={i} onChange={this.handleIngrIDChange} name="ingr" value={tuple[1]}/>
                    <label> {tuple[0]} </label>
                    </div>
		})

		let grainDivs = grainIngrList.map((tuple, i) => {
            return  <div>
                    <input type="checkbox" id={tuple[0]} key={i} onChange={this.handleIngrIDChange} name="ingr" value={tuple[1]}/>
                    <label> {tuple[0]} </label>
                    </div>
		})

		let otherDivs = otherIngrList.map((tuple, i) => {
            return  <div>
                    <input type="checkbox" id={tuple[0]} key={i} onChange={this.handleIngrIDChange} name="ingr" value={tuple[1]}/>
                    <label> {tuple[0]} </label>
                    </div>
		})

		this.setState({
			fruitDivs: fruitDivs,
			vegDivs: vegDivs,
			meatDivs: meatDivs,
			grainDivs: grainDivs,
			dairyDivs: dairyDivs,
			otherDivs: otherDivs
		});
}



  render() {

		return (
			<div className="IngrSearch">
				<PageNavbar active="Ingredient Search" />
                <br></br>
			<Container>
			    <div className="h1">IngrSearch</div>
                    <legend><h3>Choose your ingredients: </h3> </legend>
                        <div className='ingrOptions' style={divStyle} >
                            <div className='fruitOptions'>
                                <div class="divider"  /> <h5> Fruit </h5>
                                    <div className="fruit-ingr">
                                        {this.state.fruitDivs}
                                    </div>
                            </div>
                            <div className='vegOptions' >
                                <div class="divider" /> <h5> Vegetables </h5>
                                    <div className="veg-ingr">
                                        {this.state.vegDivs}
                                    </div>
                            </div>
                            <div className='meatOptions' >
                                <div class="divider" /> <h5> Meat/Fish </h5>
                                    <div className="meat-ingr">
                                        {this.state.meatDivs}
                                    </div>

                            </div>
                            <div className='dairyOptions' >
                                <div class="divider" /> <h5> Dairy </h5>
                                    <div className="dairy-ingr">
                                        {this.state.dairyDivs}
                                    </div>
                          </div>
                          <div className='grainOptions' >
                                <div class="divider" /> <h5> Grain </h5>
                                    <div className="grain-ingr">
                                        {this.state.grainDivs}
                                    </div>
                          </div>
                          <div className='otherOptions' >
                                <div class="divider" /> <h5> Other </h5>
                                    <div className="other-ingr">
                                        {this.state.otherDivs}
                                    </div>
                                </div>
                            </div>
                        <br></br>
                        <Row>
                            <Col>
                                <button id="submitBtn" className="submit-btn" onClick={this.submitIngr}>Search All Recipes</button>
                            </Col>
                            <Col>
                                <button id="budgetBtn" className="budget-btn" onClick={this.submitBudget}>Search Budget-Friendly Recipes</button>
                            </Col>
                        </Row>
                    <div className="header-container">
                        <div className="quickadd-container" id="quickadd">
                            {this.state.recQuickAdd}
                        </div>
                        <div className="h6">Here are some suggested recipes ...</div>
                        <div className="headers">
                            <div className="header"><strong>Title</strong></div>
                        </div>
                    </div>
                    <div className="results-container" id="results">
                        {this.state.recRecipes}
                    </div>
			    </Container>
			</div>
		);
	}

}