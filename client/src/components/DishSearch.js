import React from 'react';
import {Container, Row, Col, Accordion, Card, Button, Form} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import Select from 'react-select'

export default class DishSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.state.statesList = []
    this.state.cityList = []
    this.state.selected_state = ''
    this.state.selected_city = ''
    this.state.results = []
    this.state.dishSearch = ''
    this.state.image_results = []

    //-----------Binds---------------//
    this.getCities = this.getCities.bind(this) 
    this.getRestaurantsBasic = this.getRestaurantsBasic.bind(this) 
    this.getRestaurantImages = this.getRestaurantImages.bind(this) 
    this.dishHandleSubmit = this.dishHandleSubmit.bind(this) 
    this.dishHandleChange = this.dishHandleChange.bind(this) 
    this.getDishSearch = this.getDishSearch.bind(this)
  }

  componentDidMount(){
      fetch("http://localhost:8081/states/",
        {
          method: "GET"
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(resultList => {
          console.log(resultList); 
          let statesList = resultList.map((state, i) => {
            const container = {};

            container.value = state.rest_state;
            container.label = state.rest_state;
            return container;
          });

          ///This saves our HTML representation of the data into the state, which we can call in our render function
          this.setState({
            statesList : statesList
          });
        }, err => {
          // Print the error if there is one.
          console.log(err);
        });
  }


  dishHandleChange(e){
    this.setState({dishSearch: e.target.value});
  }

  dishHandleSubmit(e){    
    this.getDishSearch();
}

  getCities(city){
    var url_query = "http://localhost:8081/cities/"+ city
    console.log(this.state.selected_state);
    console.log(city);

    fetch( url_query,
    {
      method: "GET"
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(resultList => {
      console.log(resultList); 
      let cityList = resultList.map((city, i) => {
        const container = {};

        container.value = city.rest_city;
        container.label = city.rest_city;
        return container;
      });

      ///This saves our HTML representation of the data into the state, which we can call in our render function
      this.setState({
        cityList : cityList
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }

  getRestaurantImages(city, restaurant_name){
    var url_query = "https://developers.zomato.com/api/v2.1/cities?q=" + city
    console.log(url_query);
    fetch( url_query,
    {
      method: "GET",
      headers: {'user-key': '254acae745cffad9bc4ac35c4612c722'}
    }).then(res => {
      return res.json();
    }, err => {
      console.log(err);
    }).then(resultList => {
       return resultList.location_suggestions[0].id
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(zomato_city_id => {
      var rest_query = 'https://developers.zomato.com/api/v2.1/search?entity_id=' + zomato_city_id + '&entity_type=city&q=' + restaurant_name
      fetch( rest_query,
        {
          method: "GET",
          headers: {'user-key': '254acae745cffad9bc4ac35c4612c722'}
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(resultList2 => {
          if (resultList2.results_found > 0){
            let ret_arr = [];
            ret_arr.push(resultList2.restaurants[0].restaurant.featured_image);
            ret_arr.push(resultList2.restaurants[0].restaurant.thumb);
            console.log(ret_arr);
            this.setState({
              image_results : ret_arr
            }); 
          }
          else {
            let ret_arr = [];
            let src1 = "https://loremflickr.com/300/300/food?random=" + getRandomInt(1,1000);
            let src2 = "https://loremflickr.com/300/300/food?random=" + getRandomInt(1,1000);
            this.setState({
              image_results : ret_arr
            }); 
          }
        }, err => {
          // Print the error if there is one.
          console.log(err);
        });    
    });
  }


  
    getRestaurantsBasic(state, city, i){
        var url_query = "http://localhost:8081/restaurants/"+ state + "/" + city + "/"    
        fetch( url_query,
        {
          method: "GET"
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(resultList => {
          let restList = resultList.map((rest, i) => {
              let cuisine = (rest.rest_cuisine == "N/A" ? '' : " || " + rest.rest_cuisine.substring(1, rest.rest_cuisine.length - 1));
              let website = ''
              if (rest.rest_website === "N/A"){
                website = "N/A"
              }
              else if (rest.rest_website.substring(8,10) === "pa") {
                website = 'http://allmenus.com/' + rest.rest_website.substring(8)
              }
              else if (rest.rest_website.substring(4,10) === "google") {
                website = 'http:///' + rest.rest_website
              }
              else {
                website = rest.rest_website
              }
              let src1 = "https://loremflickr.com/300/300/food?random=" + getRandomInt(1,1000);
              let src2 = "https://loremflickr.com/300/300/food?random=" + getRandomInt(1,1000);
  
            return (
                <Row><Col>
                    <Accordion>
                        <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                                {(i+1) + ". " + rest.rest_name + cuisine}
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body style={dishStyle}>
                                <Row>
                                    <Col>
                                    Restaurant Address: {rest.rest_address}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                      Restaurant Website:  {website == "N/A" ? "N/A" :  <a href={website} target="_blank">{" Go to Link"}</a>}
                                    </Col>
                                </Row> 
                                <Row>
                                    <Col>
                                        <img 
                                            src= {src1}
                                            alt="new"
                                            width="200" 
                                            height="200"
                                        />
                                    </Col>
                                    <Col>
                                    <img 
                                            src= {src2}
                                            alt="new"
                                            width="200" 
                                            height="200"
                                        />
                                    </Col>
                                </Row>

                            </Card.Body>
                        </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Col></Row>
            )
          });
          //This saves our HTML representation of the data into the state, which we can call in our render function
          this.setState({
            results : restList
          });
        }, err => {
          // Print the error if there is one.
          console.log(err);
        });   
    }

    getDishSearch(){
        var url_query = "http://localhost:8081/dishes/"+ this.state.selected_state + "/" + this.state.selected_city + "/" + this.state.dishSearch   
        console.log(url_query);
        fetch( url_query,
        {
          method: "GET"
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(resultList => {
          console.log(resultList); 
          let restList = resultList.map((rest, i) => {
              let dish_name= (rest.dish_name == "N/A" ? '' : " || " + rest.dish_name);
              let website = ''
              if (rest.rest_website === "N/A"){
                website = "N/A"
              }
              else if (rest.rest_website.substring(8,10) === "pa") {
                website = 'http://allmenus.com/' + rest.rest_website.substring(8)
              }
              else {
                website = rest.rest_website
              }
              let src1 = "https://loremflickr.com/300/300/food?random=" + getRandomInt(1,1000);
              let src2 = "https://loremflickr.com/300/300/food?random=" + getRandomInt(1,1000);
              return (
                <Row><Col>
                    <Accordion>
                        <Card>
                        <Card.Header>
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                                {(i+1) + ". " + rest.rest_name + dish_name}
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body style={dishStyle}>
                                <Row>
                                    <Col>
                                        <strong>Dish Name</strong>: {rest.dish_name}
                                    </Col>
                                    <Col>
                                    <strong>Dish Price:</strong> ${rest.dish_price}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <strong>Dish Category:</strong> {rest.dish_category}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <strong>Dish Description:</strong> {rest.dish_description}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <strong>Restaurant Cuisine:</strong> {(rest.rest_cuisine == "N/A" ? 'N/A' : rest.rest_cuisine.substring(1, rest.rest_cuisine.length - 1))}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <strong>Restaurant Address:</strong> {rest.rest_address}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <strong>Restaurant Website: </strong>  {website == "N/A" ? "N/A" :  <a href={website} target="_blank">{" Go to Link"}</a>}
                                    </Col>
                                </Row> 
                                <Row>
                                    <Col>
                                        <img 
                                            src= {src1}
                                            alt="new"
                                            width="200" 
                                            height="200"
                                        />
                                    </Col>
                                    <Col>
                                    <img 
                                            src= {src2}
                                            alt="new"
                                            width="200" 
                                            height="200"
                                        />
                                    </Col>
                                </Row>

                            </Card.Body>
                        </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Col></Row>
            )
          });
          //This saves our HTML representation of the data into the state, which we can call in our render function
          this.setState({
            results : restList
          });
        }, err => {
          // Print the error if there is one.
          console.log(err);
        });   
    }

  render() {    
    const buttonStyle = {
      backgroundColor: "#E98074",
    };

    var backgroundURL = require("../resources/background8-clean.png");

    return (
      <div className="DishSearch"  style={{ backgroundColor: "#dde7ec", backgroundImage: `url(${backgroundURL})`, backgroundSize: '950px', backgroundRepeat: "no-repeat",  minHeight: "100vh", height: "100%" }}>
        <PageNavbar active="Dish Search" />
        <div className="h1">Dish Search</div>
        <legend><h4><i>Find restaurants serving your favorite dishes</i></h4> </legend>
        
        <br></br>
      <Container>
        <Row>
          <Col><strong>Where are you from?</strong></Col>
          <Col>
            <Select 
                options={this.state.statesList} 
                defaultValue={{ label: "Select State", value: 0}}
                onChange={(e => {
                    this.setState({
                        selected_state: e.label,
                    });
                    {this.getCities(e.label)}
                 })}
            />            
          </Col>
        </Row>
        <br></br>
        <Row>
          <Col><strong>Choose the cities near you!</strong></Col>
          <Col>
            <Select 
                options={this.state.cityList} 
                defaultValue={{ label: "Cities.." , value: 0}}
                onChange={e => {
                    this.setState({
                        selected_city: e.label
                    });{this.getRestaurantsBasic(this.state.selected_state, e.label)}
                 }}
            />            
          </Col>
        </Row>
        <ColoredLine color = 'gray'/>
      </Container>
      <Container>
        <strong>Look for your favourite dishes here! </strong>
        <p></p>
        <Row>
            <Col>
                <form>
                    <input type="text" name="dish" size="37" placeholder="Pesto Pasta, Chicken Burgers, Pancakes ..." value={this.state.dishSearch} onChange={this.dishHandleChange}/>
                    <button class="btn btn-primary btn-light" style={buttonStyle} type="button" onClick={this.dishHandleSubmit}>Search!</button>
                </form>
            </Col>
        </Row>
        <ColoredLine color = 'gray'/>    
      </Container>

        {/* Results Accordian */}
      <Container>
        {this.state.results.length == 0 ? 'Nothing found yet, Try Another Search!' : 'Here are some results near you!'} 
        {this.state.results}            
      </Container>


      </div>
    );
  }
}

const ColoredLine = ({ color }) => (
    <hr
        style={{
            color: color,
            backgroundColor: "#E98074",
            height: 1
        }}
    />
);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  const dishStyle = {
    textAlign: "left",
    fontSize: "12pt"
};