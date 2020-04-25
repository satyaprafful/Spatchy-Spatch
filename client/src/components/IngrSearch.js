import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import RecipeRow from './RecipeRow';

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
        fruitDivs: [],
        vegDivs: [],
        meatDivs: [],
        grainDivs: [],
        dairyDivs: [],
        otherDivs: []
    }

    this.handleIngrIDChange = this.handleIngrIDChange.bind(this);
    this.submitIngr = this.submitIngr.bind(this);

	}

	handleIngrIDChange(e) {
		this.setState({
			ingrList: this.state.ingrList.concat(e.target.value)
		});

    }

//  getIngrList()
//  {
//    var ingr1 = 1;
//    var ingr2 = 2;
//    var ingr3 = 3;
//    var ingr4 = 4;
//    var ingr5 = 5;
//
//    return "${ingr1}&${ingr2}&${ingr3}&${ingr4}&${ingr5}";
//  }

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

  submitIngr()
  {
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
          <RecipeRow title = {recipeObj.title} key= {recipeObj.rID} />
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
//		const fruitIngrList = [['Apple', 4], ['Banana', 15], ['Peach', 133], ['Strawberry', 179]];
//		const vegIngrList = [['Avocado', 11], ['Carrot', 36], ['Lettuce', 104], ['Spinach', 177]];


//  FULL INGREDIENT LISTS:
//        const meatIngrList = [['bacon', 12], ['beef', 21], ['chicken', 41], ['chicken breast', 209], ['chicken leg', 42], ['chuck roast', 48], ['ground beef', 213], ['ground chuck', 85], ['ham', 88], ['lamb', 99], ['pork', 141], ['prosciutto', 220], ['rib roast', 151], ['round roast', 221], ['sausage', 163], ['short rib', 169], ['steak', 176], ['turkey', 188], ['veal', 191], ['anchovy', 2],['bass', 17], ['clam', 210], ['fish', 73], ['salmon', 161], ['scallop', 165], ['shrimp', 171], ['tuna', 187]];
//        const vegIngrList = [['artichoke', 6], ['arugula', 7], ['asparagus', 9], ['avocado', 11], ['bean', 20], ['beet', 206], ['blueberry', 23], ['broccoli', 27], ['cabbage', 31], ['carrot', 36], ['cauliflower', 207], ['celery', 38], ['corn', 58], ['cucumber', 63], ['garlic', 76], ['greens', 84], ['jalapeño', 96], ['kale', 215], ['lemon', 100], ['lentil', 101], ['lettuce', 102], ['lime', 103], ['mushroom', 115], ['olive', 120], ['onion', 121], ['pea', 131], ['pepper', 137], ['potato', 143], ['pumpkin', 146], ['radish', 147], ['scallion', 164], ['shallot', 167], ['spinach', 175], ['tomato', 186], ['zucchini', 202]];
        const fruitIngrList = [['apple', 4], ['apricot', 5], ['banana', 15], ['cherry', 40], ['cranberry', 61], ['currant', 65], ['grape', 83], ['mango', 216], ['orange', 123], ['peach', 132], ['pear', 134], ['raspberry', 149], ['strawberry', 177]];
//        const dairyIngrList = [['asiago', 8], ['blue cheese', 22], ['burrata', 29], ['butter', 30], ['camembert', 32], ['cheddar', 39], ['cheddar cheese', 208], ['colby', 55], ['cottage cheese', 59], ['cream cheese', 62], ['crème fraîche', 212], ['feta', 72], ['fontina', 75], ['goat cheese', 80], ['gorgonzola', 81], ['gouda', 82], ['gruyère', 86], ['halibut', 87], ['havarti', 89], ['heavy cream', 90], ['ice cream', 94], ['margarine', 107], ['mascarpone', 108], ['milk', 110], ['monterey jack', 113], ['mozzarella', 114], ['parmesan', 128], ['provolone', 144], ['ricotta', 153], ['romano cheese', 156], ['sour cream', 172], ['swiss', 179], ['whipped cream', 196], ['yogurt', 201]];
        const grainIngrList = [['baguette', 204], ['bread', 26], ['couscous', 211], ['cracker', 60], ['linguini', 104], ['macaroni', 105], ['noodle', 117], ['oats', 217], ['pasta', 130], ['penne', 136], ['ravioli', 150], ['rice', 152], ['rigatoni', 154], ['spaghetti', 174]];
//        const otherIngrList = [['almond', 1], ['apple sauce', 203], ['beer', 205], ['bourbon', 24], ['broth', 28], ['capers', 33], ['chocolate', 46], ['cocoa', 52], ['coconut', 53], ['coffee', 54], ['cookie', 56], ['curry', 66], ['egg', 68], ['gelatin', 77], ['gin', 78], ['hazelnut', 214], ['honey', 92], ['jelly', 97], ['maple syrup', 106], ['peanut', 133], ['pecan', 135], ['phyllo pastry', 138], ['pine nut', 218], ['potato chip', 219], ['puff pastry', 145], ['raisin', 148], ['rum', 159], ['sherry', 168], ['vodka', 193], ['walnut', 194], ['wine', 198]];


// SHORTENED INGREDIENT LISTS:
        const vegIngrList = [['artichoke', 6], ['arugula', 7], ['asparagus', 9], ['avocado', 11], ['bean', 20], ['beet', 206], ['blueberry', 23], ['broccoli', 27], ['cabbage', 31], ['carrot', 36], ['cauliflower', 207], ['celery', 38], ['corn', 58]];
        const meatIngrList = [['bacon', 12], ['beef', 21], ['chicken', 41], ['chicken breast', 209], ['chicken leg', 42], ['chuck roast', 48], ['ground beef', 213], ['ground chuck', 85], ['ham', 88], ['lamb', 99], ['pork', 141], ['prosciutto', 220], ['rib roast', 151]];
        const dairyIngrList = [['asiago', 8], ['blue cheese', 22], ['burrata', 29], ['butter', 30], ['camembert', 32], ['cheddar', 39], ['cheddar cheese', 208], ['colby', 55], ['cottage cheese', 59], ['cream cheese', 62], ['crème fraîche', 212], ['feta', 72], ['fontina', 75]];
        const otherIngrList = [['almond', 1], ['apple sauce', 203], ['beer', 205], ['bourbon', 24], ['broth', 28], ['capers', 33], ['chocolate', 46], ['cocoa', 52], ['coconut', 53], ['coffee', 54], ['cookie', 56], ['curry', 66], ['egg', 68], ['gelatin', 77]];


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
				<PageNavbar active="Ingredient based searching" />

			    <div className="container ingredients-container">
			    	<div className="jumbotron">
			    		<div className="h1">IngrSearch</div>
			    		<div className="input-container">
                            <div className='ingrRow' >
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
                            </div>
                            <br></br>
			    			<button id="submitBtn" className="submit-btn" onClick={this.submitIngr}>Submit</button>
			    		</div>
			    		<br></br>
			    		<div className="header-container">
			    			<div className="h6">Here are some suggested recipes ...</div>
			    			<div className="headers">
			    				<div className="header"><strong>Title</strong></div>
			    			</div>
			    		</div>
			    		<div className="results-container" id="results">
			    			{this.state.recRecipes}
			    		</div>
			    	</div>
			    </div>
		    </div>
		);
	}

}