import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import { Container, Row, Col, Accordion, Card, Button, Form } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import Select from 'react-select';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignup: false,
      userEmail: "",
      userPassword: "",
      redirect: null,
      isVegan: false,
      isVegetarian: false,
      isLactose: false,
      isNut: false,
      isGluten: false,
      weight: 0,
      heightFeet: 0,
      heightInches: 0,
      activityLevel: "",
      age: 0,
      statesList: [],
      citiesList: [],
      selected_city: "",
      selected_state: "",
      incorrectCombo: false,
      nonInput: false,
      alreadyExists: false
    }

    this.toggleView = this.toggleView.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.signup = this.signup.bind(this);
    this.login = this.login.bind(this);
    this.changeVegan = this.changeVegan.bind(this);
    this.changeVegetarian = this.changeVegetarian.bind(this);
    this.changeLactose = this.changeLactose.bind(this);
    this.changeNut = this.changeNut.bind(this);
    this.changeGluten = this.changeGluten.bind(this);
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.handleHeightFeetChange = this.handleHeightFeetChange.bind(this);
    this.handleHeightInchesChange = this.handleHeightInchesChange.bind(this);
    this.handleActivityLevelChange = this.handleActivityLevelChange.bind(this);
    this.handleAgeChange = this.handleAgeChange.bind(this);
    this.getCities = this.getCities.bind(this) 
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

  signup() {
    if(!this.state.userEmail || !this.state.userPassword) {
      this.setState({
        nonInput: true
      });
    } else {
      fetch("http://localhost:8081/signup",
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.state.userEmail,
          password: this.state.userPassword,
          isVegan: this.state.isVegan,
          isVegetarian: this.state.isVegetarian,
          isLactose: this.state.isLactose,
          isNut: this.state.isNut,
          isGluten: this.state.isGluten,
          weight: this.state.weight,
          heightFeet: this.state.heightFeet,
          heightInches: this.state.heightInches,
          activityLevel: this.state.activityLevel,
          age: this.state.age,
          city: this.state.selected_city,
          state: this.state.selected_state
        })
      }).then(res => {
        return res.json();
      }).then(response => {
        if (response.result === 'p') {
          this.setState({
            redirect: "/Home"
          });
        } else {
          this.setState({
            nonInput: false,
            alreadyExists: true
          })
        }
      });
    }   
  }

  login() {
    if(!this.state.userEmail || !this.state.userPassword) {
      this.setState({
        nonInput: true
      });
    } else {
      fetch("http://localhost:8081/login",
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.state.userEmail,
          password: this.state.userPassword
        })
      }).then(res => {
        return res.json();
      }).then(response => {
        if (response.result === 'p') {
          console.log("hello")
          this.setState({
            redirect: "/Home"
          });
        } else {
          this.setState({
            nonInput: false,
            incorrectCombo: true
          })
        }
      });
    }
  }

  handleEmailChange(event) {
    this.setState({ userEmail: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ userPassword: event.target.value });
  }

  changeVegan() { this.setState({ isVegan: !this.state.isVegan }) }

  changeVegetarian() { this.setState({ isVegetarian: !this.state.isVegetarian }) }

  changeLactose() { this.setState({ isLactose: !this.state.isLactose }) }

  changeNut() { this.setState({ isNut: !this.state.isNut }) }

  changeGluten() { this.setState({ isGluten: !this.state.isGluten }) }

  handleWeightChange(event) { this.setState({ weight: event.target.value }) }

  handleHeightFeetChange(event) { this.setState({ heightFeet: event.target.value }) }

  handleHeightInchesChange(event) { this.setState({ heightInches: event.target.value }) }

  handleActivityLevelChange(event) { this.setState({ activityLevel: event.target.value }) }

  handleAgeChange(event) { this.setState({ age: event.target.value }) }

  toggleView() { this.setState(prevState => ({ showSignup: !prevState.showSignup })) }

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

  render() {
    const buttonStyle = {
      backgroundColor: "#E98074",
    };

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const ColoredLine = ({ color }) => (
      <hr
          style={{
              color: color,
              backgroundColor: color,
              height: 1
          }}
      />
  );

    return (
      <div className="Login" style={{ backgroundColor: "#EAE7DC", minHeight: "100vh", height: "100%" }}>
        <br></br>
        <div className="h1" style={{fontFamily:"Permanent Marker", fontSize:"75px"}}>Spitchy Spatchy</div>
        <div className="LoginInfo" style={{paddingLeft:"30%", paddingRight:"30%"}} hidden={this.state.showSignup}>
          <br></br>
          
          <form>
            <div class="form-group">
              <div class="row">
                <div class="col-6">
                  <label for="exampleInputEmail1"><strong>Email address:</strong></label>
                </div>
                <div class="col-6">
                  <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={this.state.userEmail} onChange={this.handleEmailChange} />
                </div>
              </div>
            </div>
            <div class="form-group">
            <div class="row">
                <div class="col-6">
                  <label for="exampleInputPassword1"><strong>Password: </strong></label>
                </div>
                <div class="col-6">
                  <input type="password" class="form-control" id="exampleInputPassword1" value={this.state.userPassword} onChange={this.handlePasswordChange} />
                </div>
              </div>
            </div>
          </form>
          <div hidden={!this.state.incorrectCombo}><small>Uh Oh, Looks like that email/password combo is incorrect</small></div>
          <div hidden={!this.state.nonInput}><small>Both fields must be filled out!</small></div>
          <button class="btn btn-primary-dark" style={buttonStyle} onClick={this.login}>Login</button>
          <small id="emailHelp" class="form-text text-muted">Dont have an email?
            <button type="button" class="btn btn-link btn-sm" onClick={this.toggleView}>Signup</button>
          </small>
        </div>

        <div className="SignupInfo" style={{paddingLeft:"30%", paddingRight:"30%"}} hidden={!this.state.showSignup}>
          <br></br>
          <form>
          <div class="form-group">
              <div class="row">
                <div class="col-6">
                  <label for="exampleInputEmail1"><strong>Email address:</strong></label>
                </div>
                <div class="col-6">
                  <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={this.state.userEmail} onChange={this.handleEmailChange} />
                </div>
              </div>
            </div>
            <div class="form-group">
            <div class="row">
                <div class="col-6">
                  <label for="exampleInputPassword1"><strong>Password: </strong></label>
                </div>
                <div class="col-6">
                  <input type="password" class="form-control" id="exampleInputPassword1" value={this.state.userPassword} onChange={this.handlePasswordChange} />
                </div>
              </div>
            </div>
            <div hidden={!this.state.nonInput}><small>Both fields must be filled out!</small></div>
            <div hidden={!this.state.alreadyExists}><small>Email is already in use!</small></div>
        <ColoredLine color =  "#E98074"/>
        <strong>Mark your Diet:</strong> 
            <label class="btn active btn-block">
              <input type="checkbox" defaultChecked={this.state.isVegan} onChange={this.changeVegan} autocomplete="off" /> Vegan
          </label>
            <label class="btn active btn-block">
              <input type="checkbox" defaultChecked={this.state.isVegetarian} onChange={this.changeVegetarian} autocomplete="off" /> Vegetarian
          </label>
            <label class="btn active btn-block">
              <input type="checkbox" defaultChecked={this.state.isLactose} onChange={this.changeLactose} autocomplete="off" /> Lactose Intolerant
          </label>
            <label class="btn active btn-block">
              <input type="checkbox" defaultChecked={this.state.isNut} onChange={this.changeNut} autocomplete="off" /> Nut Allergies
          </label>
            <label class="btn active btn-block">
              <input type="checkbox" defaultChecked={this.state.isGluten} onChange={this.changeGluten} autocomplete="off" /> Gluten Free
          </label>
          <ColoredLine color =  "#E98074"/>
            <Row>
              <Col>Which State are you in?</Col>
              <Col>
                <Select
                  options={this.state.statesList}
                  defaultValue={{ value: this.state.selected_state }}
                  onChange={(e => {
                    this.setState({
                      selected_state: e.label,
                    });
                    { this.getCities(e.label) }
                  })}
                />
              </Col>
            </Row>
            <Row>
              <Col>Choose the cities near you!</Col>
              <Col>
                <Select
                  options={this.state.cityList}
                  defaultValue={{ label: this.state.selected_city, value: this.state.selected_city }}
                  onChange={e => {
                    this.setState({
                      selected_city: e.label
                    });
                  }}
                />
              </Col>
            </Row>
            <ColoredLine color =  "#E98074"/>
                <strong>Health:</strong>
                <div class="row">
              <div class="col-6">
                <label>Weight</label>
              </div>
              <div class="col-6">
                <input type="number" class="form-control" value={this.state.weight} onChange={this.handleWeightChange} />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <label>Height Feet</label>
              </div>
              <div class="col-6">
                <input type="number" class="form-control" value={this.state.heightFeet} onChange={this.handleHeightFeetChange} />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <label>Height Inches</label>
              </div>
              <div class="col-6">
                <input type="number" class="form-control" value={this.state.heightInches} onChange={this.handleHeightInchesChange} />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <label>Activity Level (low, moderate, high)</label>
              </div>
              <div class="col-6">
                <input type="text" class="form-control" value={this.state.activityLevel} onChange={this.handleActivityLevelChange} />
              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <label>Age</label>
              </div>
              <div class="col-6">
                <input type="number" pattern="[0-9]*" class="form-control" value={this.state.age} onChange={this.handleAgeChange} />
              </div>
            </div>
            <br></br>
          </form>

        <button class="btn btn-primary-dark"  style={buttonStyle} onClick={this.signup}>Sign Up</button>
        <small id="emailHelp" class="form-text text-muted">Already Have an Account?
        <button type="button" class="btn btn-link btn-sm" onClick={this.toggleView}>Go Back</button>
          </small>
      </div>
      </div >
    );
  }
}