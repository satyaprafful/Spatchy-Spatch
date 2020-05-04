import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import RecipeRow from './RecipeRow';
import { Container, Row, Col, Accordion, Card, Button, Form } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel'


const ingrStyle = {
    position: 'absolute', 
    left: '18%',
    height: "490px",
    width: "800px",
    textAlign: "left",
    position: 'relative'
};

const quickAddButtonStyle = {
    width: "300px", 
    margin:"5px",
    display: "center"
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
            otherDivs: [],
            user : null
        }

        this.handleIngrIDChange = this.handleIngrIDChange.bind(this);
        this.submitIngr = this.submitIngr.bind(this);
        this.submitBudget = this.submitBudget.bind(this);
        this.findQuickAdd = this.findQuickAdd.bind(this);
        this.ControlledCarousel = this.ControlledCarousel.bind(this);
        this.handleQuickAddChange = this.handleQuickAddChange.bind(this);
    }

    handleIngrIDChange(e) {
        var value = e.target.value;
        console.log(value);
        var contains = this.state.ingrList.includes(value);

        if (!contains) {
            this.setState({
                ingrList: this.state.ingrList.concat(value)
            });
        } else {
            var newList = this.state.ingrList.filter(function (ingrValue) { return ingrValue != value });
            this.setState({
                ingrList: newList
            });
        }
    }

    handleQuickAddChange(e) {
        var ingrID = e.target.value;
        var element = document.getElementById(ingrID);
        console.log(ingrID);
        console.log(e);
    }

    parseIngrList() {
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
                            <Row style={{justifyContent: "center"}}>
                                <div class="alert alert-success" style={quickAddButtonStyle}>
                                        Hint: add {quickadd.name} for {quickadd.count} new recipes!
                                </div>
                            </Row>
                        </Container>
                    )
                });

                ///This saves our HTML representation of the data into the state, which we can call in our render function
                this.setState({
                    recQuickAdd: quickAddDiv
                });
            }, err => {
                // Print the error if there is one.
                console.log(err);
            });
    }


    submitIngr() {
        if (this.state.ingrList.length == 0) {
            var recipesDiv = [];
            recipesDiv.push(<div className="h3">Please select at least one ingredient!</div>);
            this.setState({
                recRecipes: recipesDiv,
                recQuickAdd: []
            });
        } else {
            this.findQuickAdd();
            fetch("http://localhost:8081/ingredients/" + this.dietaryRestrictions() + this.parseIngrList(),
            {
                method: "GET"
            }).then(res => {
                console.log("http://localhost:8081/ingredients/" +this.dietaryRestrictions(), + this.parseIngrList())
                return res.json();
            }, err => {
                console.log(err);
            }).then(recipesList => {

                console.log(recipesList); //delete this

                var numRecipes = recipesList.length;
                var limitList = recipesList.slice(0,10);

                let recipesDiv = limitList.map((recipeObj, i) =>
                    <RecipeRow title={recipeObj.title}
                        ingr_desc={recipeObj.ingr_descr}
                        recipe_descr={recipeObj.recipe_descr}
                        rating={recipeObj.rating}
                        rID={recipeObj.rID}
                        index={i}
                    />
                );

                recipesDiv.unshift(<div className="h3">We found {numRecipes} recipes! Here are our favorites...</div>);

                ///This saves our HTML representation of the data into the state, which we can call in our render function
                this.setState({
                    recRecipes: recipesDiv
                });
            }, err => {
                // Print the error if there is one.
                console.log(err);
            });
        }

        
    }


    submitBudget() {
        console.log("submit budget");
        if (this.state.ingrList.length == 0) {
            var recipesDiv = [];
            recipesDiv.push(<div className="h3">Please select at least one ingredient!</div>);
            this.setState({
                recRecipes: recipesDiv,
                recQuickAdd: []
            });
        } else {
            this.findQuickAdd();
            fetch("http://localhost:8081/budget/" +this.dietaryRestrictions() + this.parseIngrList(),
            {
                method: "GET"
            }).then(res => {
                return res.json();
            }, err => {
                console.log(err);
            }).then(recipesList => {
                console.log("got resipes");
                console.log(recipesList); //delete this

                var numRecipes = recipesList.length;
                var limitList = recipesList.slice(0,10);

                let recipesDiv = limitList.map((recipeObj, i) =>
                    <RecipeRow title={recipeObj.title}
                        ingr_desc={recipeObj.ingr_descr}
                        recipe_descr={recipeObj.recipe_descr}
                        rating={recipeObj.rating}
                        rID={recipeObj.rID}
                        index={i}
                        price={recipeObj.recipe_cost}
                    />
                );

                recipesDiv.unshift(<div className="h3">We found {numRecipes} recipes! Here are our favorites...</div>);

                ///This saves our HTML representation of the data into the state, which we can call in our render function
                this.setState({
                    recRecipes: recipesDiv
                });
            }, err => {
                // Print the error if there is one.
                console.log(err);
            });
        }

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
    console.log(this.state.user)
    return this.state.user.isVegan + "/" + this.state.user.isNut + "/" + this.state.user.isLactose + "/" + this.state.user.isVegetarian+ "/" + this.state.user.isGluten + "/" ;
  }

    componentDidMount() {

        const meatIngrList = [['bacon', 12], ['beef', 21], ['chicken', 41], ['chicken breast', 209], ['chicken leg', 42], ['chuck roast', 48], ['ground beef', 213], ['ground chuck', 85], ['ham', 88], ['lamb', 99], ['pork', 141], ['prosciutto', 220], ['rib roast', 151], ['round roast', 221], ['sausage', 163], ['short rib', 169], ['steak', 176], ['turkey', 188], ['veal', 191], ['anchovy', 2],['bass', 17], ['clam', 210], ['fish', 73], ['salmon', 161], ['scallop', 165], ['shrimp', 171], ['tuna', 187]];
        const vegIngrList = [['artichoke', 6], ['arugula', 7], ['asparagus', 9], ['avocado', 11], ['bean', 20], ['beet', 206], ['broccoli', 27], ['cabbage', 31], ['carrot', 36], ['cauliflower', 207], ['celery', 38], ['corn', 58], ['cucumber', 63], ['garlic', 76], ['greens', 84], ['jalapeño', 96], ['kale', 215], ['lemon', 100], ['lentil', 101], ['lettuce', 102], ['lime', 103], ['mushroom', 115], ['olive', 120], ['onion', 121], ['pea', 131], ['pepper', 137], ['potato', 143], ['pumpkin', 146], ['radish', 147], ['scallion', 164], ['shallot', 167], ['spinach', 175], ['tomato', 186], ['zucchini', 202]];
        const fruitIngrList = [['apple', 4], ['apricot', 5], ['banana', 15], ['blueberry', 23], ['cherry', 40], ['cranberry', 61], ['currant', 65], ['grape', 83], ['mango', 216], ['orange', 123], ['peach', 132], ['pear', 134], ['raspberry', 149], ['strawberry', 177]];
        const dairyIngrList = [['asiago', 8], ['blue cheese', 22], ['burrata', 29], ['butter', 30], ['camembert', 32], ['cheddar', 39], ['colby', 55], ['cottage cheese', 59], ['cream cheese', 62], ['crème fraîche', 212], ['feta', 72], ['fontina', 75], ['goat cheese', 80], ['gorgonzola', 81], ['gouda', 82], ['gruyère', 86], ['halibut', 87], ['havarti', 89], ['heavy cream', 90], ['ice cream', 94], ['margarine', 107], ['mascarpone', 108], ['milk', 110], ['monterey jack', 113], ['mozzarella', 114], ['parmesan', 128], ['provolone', 144], ['ricotta', 153], ['romano cheese', 156], ['sour cream', 172], ['swiss', 179], ['whipped cream', 196], ['yogurt', 201]];
        const grainIngrList = [['baguette', 204], ['bread', 26], ['couscous', 211], ['cracker', 60], ['linguini', 104], ['macaroni', 105], ['noodle', 117], ['oats', 217], ['pasta', 130], ['penne', 136], ['ravioli', 150], ['rice', 152], ['rigatoni', 154], ['spaghetti', 174]];
        const otherIngrList = [['almond', 1], ['apple sauce', 203], ['beer', 205], ['bourbon', 24], ['broth', 28], ['capers', 33], ['chocolate', 46], ['cocoa', 52], ['coconut', 53], ['coffee', 54], ['cookie', 56], ['curry', 66], ['egg', 68], ['gelatin', 77], ['gin', 78], ['hazelnut', 214], ['honey', 92], ['jelly', 97], ['maple syrup', 106], ['peanut', 133], ['pecan', 135], ['phyllo pastry', 138], ['pine nut', 218], ['potato chip', 219], ['puff pastry', 145], ['raisin', 148], ['rum', 159], ['sherry', 168], ['vodka', 193], ['walnut', 194], ['wine', 198]];
 
        let fruitDivs = fruitIngrList.map((tuple, i) => {

            return  <div class="col-3" >
                        <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet"></link>
                        <div class="form-group">
                            <input type="checkbox" id={tuple[0]} key={i} onChange={this.handleIngrIDChange} name="ingr" value={tuple[1]}>
                            </input>
                            <div class="btn-group">
                                <label for={tuple[0]} class="btn btn-info">
                                    <span class="glyphicon glyphicon-ok"></span>
                                    <span> </span>
                                </label>
                                <label for={tuple[0]} class="btn btn-default active" ><strong>{tuple[0]}</strong>
                                </label>
                            </div>
                        </div>
                    </div>

		})

		let vegDivs = vegIngrList.map((tuple, i) => {
            return  <div class="col-3" >
                    <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet"></link>
                    <div class="form-group">
                        <input type="checkbox"  id={tuple[0]} key={i} onChange={this.handleIngrIDChange} name="ingr" value={tuple[1]}>
                        </input>
                        <div class="btn-group">
                            <label for={tuple[0]} class="btn btn-success">
                                <span class="glyphicon glyphicon-ok"></span>
                                <span> </span>
                            </label>
                            <label for={tuple[0]} class="btn btn-default active" ><strong>{tuple[0]}</strong>
                            </label>
                        </div>
                    </div>
                    </div>
		})

		let meatDivs = meatIngrList.map((tuple, i) => {
            return  <div class="col-3" >
                    <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet"></link>
                    <div class="form-group">
                        <input type="checkbox"  id={tuple[0]} key={i} onChange={this.handleIngrIDChange} name="ingr" value={tuple[1]}>
                        </input>
                        <div class="btn-group">
                            <label for={tuple[0]} class="btn btn-danger">
                                <span class="glyphicon glyphicon-ok"></span>
                                <span> </span>
                            </label>
                            <label for={tuple[0]} class="btn btn-default active" ><strong>{tuple[0]}</strong>
                            </label>
                        </div>
                    </div>
                </div>
		})

		let dairyDivs = dairyIngrList.map((tuple, i) => {
            return  <div class="col-3" >
                    <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet"></link>
                    <div class="form-group">
                        <input type="checkbox"  id={tuple[0]} key={i} onChange={this.handleIngrIDChange} name="ingr" value={tuple[1]}>
                        </input>
                        <div class="btn-group">
                            <label for={tuple[0]} class="btn btn-warning">
                                <span class="glyphicon glyphicon-ok"></span>
                                <span> </span>
                            </label>
                            <label for={tuple[0]} class="btn btn-default active" ><strong>{tuple[0]}</strong>
                            </label>
                        </div>
                    </div>
                </div>
		})

		let grainDivs = grainIngrList.map((tuple, i) => {

            return  <div class="col-3" >
                    <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet"></link>
                    <div class="form-group">
                        <input type="checkbox" id={tuple[0]} key={i} onChange={this.handleIngrIDChange} name="ingr" value={tuple[1]}>
                        </input>
                        <div class="btn-group">
                            <label for={tuple[0]} class="btn btn-default">
                                <span class="glyphicon glyphicon-ok"></span>
                                <span> </span>
                            </label>
                            <label for={tuple[0]} class="btn btn-default active" ><strong>{tuple[0]}</strong>
                            </label>
                        </div>
                    </div>
                </div>
		})

		let otherDivs = otherIngrList.map((tuple, i) => {
            return  <div class="col-3" >
                    <link href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" rel="stylesheet"></link>
                    <div class="form-group">
                        <input type="checkbox"  id={tuple[0]} key={i} onChange={this.handleIngrIDChange} name="ingr" value={tuple[1]}>
                        </input>
                        <div class="btn-group">
                            <label for={tuple[0]} class="btn btn-secondary">
                                <span class="glyphicon glyphicon-ok"></span>
                                <span> </span>
                            </label>
                            <label for={tuple[0]} class="btn btn-default active" ><strong>{tuple[0]}</strong>
                            </label>
                        </div>
                    </div>
                </div>
		})

        fetch("http://localhost:8081/curruser",
        {
          method: "GET"
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(userInfo => {
          console.log(userInfo); //delete this
          if (userInfo != null)
          {
            userInfo = this.convertBools(userInfo);
          }
          this.setState({
            user : userInfo
          });
        }, err => {
          console.log(err);
        });
        this.setState({
            fruitDivs: fruitDivs,
            vegDivs: vegDivs,
            meatDivs: meatDivs,
            grainDivs: grainDivs,
            dairyDivs: dairyDivs,
            otherDivs: otherDivs
        });
    }

    ControlledCarousel() {
        const [index, setIndex] = useState(0);

        const handleSelect = (selectedIndex, e) => {
            setIndex(selectedIndex);
        };

        return (
            <Carousel activeIndex={index} onSelect={handleSelect} >
                <Carousel.Item>
                    <div className='fruitOptions'>
                        <div class="divider" /> <h3> Fruit </h3>
                        <div className="fruit-ingr" style={ingrStyle}>
                            <div class="row">
                                {this.state.fruitDivs}
                            </div>
                        </div>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className='vegOptions' >
                        <div class="divider" /> <h3> Vegetables </h3>
                        <div className="veg-ingr" style={ingrStyle}>
                            <div class="row">
                                {this.state.vegDivs}
                            </div>
                        </div>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className='meatOptions' >
                        <div class="divider" /> <h3> Meat/Fish </h3>
                        <div className="meat-ingr" style={ingrStyle}>
                            <div class="row">
                                {this.state.meatDivs}
                            </div>
                        </div>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className='dairyOptions' >
                        <div class="divider" /> <h3> Dairy </h3>
                        <div className="dairy-ingr" style={ingrStyle}>
                            <div class="row">
                                {this.state.dairyDivs}
                            </div>
                        </div>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className='grainOptions' >
                        <div class="divider" /> <h3> Grain </h3>
                        <div className="grain-ingr" style={ingrStyle}>
                            <div class="row">
                                {this.state.grainDivs}
                            </div>
                        </div>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div className='otherOptions' >
                        <div class="divider" /> <h3> Other </h3>
                        <div className="other-ingr" style={ingrStyle}>
                            <div class="row">
                                {this.state.otherDivs}
                            </div>
                        </div>
                    </div>
                </Carousel.Item>
            </Carousel>
        );
    }


    render() {
        const buttonStyle = {
            backgroundColor: "#E98074",
            width: "300px"
        };

        return (
            <div className="IngrSearch" style={{ backgroundColor: "#EAE7DC", minHeight: "100vh", height: "100%" }}>
                <PageNavbar active="Ingredient Search" />
                <Container>
                        <div className="h1">Ingredient Search</div>
                    <legend><h4><i>Find recipes based off of ingredients you have</i></h4> </legend>
                    <this.ControlledCarousel />
                    <Row>
                        <Col>
                            <button id="submitBtn" className="btn btn-lg" style={buttonStyle} onClick={this.submitIngr}>Search All Recipes</button>
                        </Col>
                        <Col>
                            <button id="budgetBtn" className="btn btn-lg " style={buttonStyle} onClick={this.submitBudget}>Search Budget-Friendly Recipes</button>
                        </Col>
                    </Row>
                    <br></br>
                    <div className="header-container">
                        <div className="quickadd-container" id="quickadd">
                            {this.state.recQuickAdd}
                        </div>
                        <br></br>
                    </div>
                    <div className="results-container" id="results">
                        {this.state.recRecipes}
                    </div>
                </Container>
            </div>
        );
    }

}
