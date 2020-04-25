import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import { Redirect } from "react-router-dom";


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
      age: 0
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
  }

  signup(){
    console.log(this.state);
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
          heightInches:  this.state.heightInches,
          activityLevel:  this.state.activityLevel,
          age:  this.state.age
        })
      }).then(res => {
        console.log(res.json());

      }
    );
  }

  login(){
    console.log(this.state.userEmail);
    console.log(this.state.userPassword);
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
        if(response.result === 'p'){
          console.log("hello")
          this.setState({
            redirect:"/Ingredient Search"
          });
        } else {
          console.log("fail");
        }
      });
  }

  handleEmailChange(event) {
    this.setState({userEmail: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({userPassword: event.target.value});
  }

  changeVegan() {this.setState({isVegan: !this.state.isVegan})}

  changeVegetarian() {this.setState({isVegetarian: !this.state.isVegetarian})}

  changeLactose() {this.setState({isLactose: !this.state.isLactose})}
  
  changeNut() {this.setState({isNut: !this.state.isNut})}

  changeGluten() {this.setState({isGluten: !this.state.isGluten})}

  handleWeightChange(event) {this.setState({weight: event.target.value})}

  handleHeightFeetChange(event) {this.setState({heightFeet: event.target.value})}

  handleHeightInchesChange(event) {this.setState({heightInches: event.target.value})}

  handleActivityLevelChange(event) {this.setState({activityLevel: event.target.value})}

  handleAgeChange(event) {this.setState({age: event.target.value})}

  toggleView() {this.setState(prevState => ({showSignup: !prevState.showSignup}))}

  render() {    
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className="Login" >
        <PageNavbar active="Login" />
        <div className="LoginInfo" hidden={this.state.showSignup}>
          <br></br>
          This is the Login page
          <form>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={this.state.userEmail} onChange={this.handleEmailChange}/>
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input type="password" class="form-control" id="exampleInputPassword1" value={this.state.userPassword} onChange={this.handlePasswordChange}/>
            </div>
          </form>
          <button class="btn btn-primary" onClick={this.login}>Login</button>
          <small id="emailHelp" class="form-text text-muted">Dont have an email? 
            <button type="button" class="btn btn-link btn-sm" onClick={this.toggleView}>Signup</button>
           </small> 
        </div>

        <div className="SignupInfo" hidden={!this.state.showSignup}>
          <br></br>
          This is the Signup page
          <form>
            <div class="form-group">
              <label for="exampleInputEmail1">Email address</label>
              <input type="email" class="form-control" id="signupEmail" aria-describedby="emailHelp" value={this.state.userEmail} onChange={this.handleEmailChange}/>
            </div>
            <div class="form-group">
              <label for="exampleInputPassword1">Password</label>
              <input type="password" class="form-control" id="signupPassword" value={this.state.userPassword} onChange={this.handlePasswordChange}/>
            </div>

            Mark Which Ones you Are:
              <label class="btn btn-secondary active">
                <input type="checkbox" defaultChecked={this.state.isVegan} onChange={this.changeVegan} autocomplete="off"/> Vegan
              </label>
              <label class="btn btn-secondary active">
                <input type="checkbox" defaultChecked={this.state.isVegetarian} onChange={this.changeVegetarian} autocomplete="off"/> Vegetarian
              </label>
              <label class="btn btn-secondary active">
                <input type="checkbox" defaultChecked={this.state.isLactose} onChange={this.changeLactose} autocomplete="off"/> Lactose Intolerant
              </label>
              <label class="btn btn-secondary active">
                <input type="checkbox" defaultChecked={this.state.isNut} onChange={this.changeNut} autocomplete="off"/> Nut Allergies
              </label>
              <label class="btn btn-secondary active">
                <input type="checkbox" defaultChecked={this.state.isGluten} onChange={this.changeGluten} autocomplete="off"/> Gluten Free
              </label>
              <br/>

            Input Data:
            <div class="form-group">
              <label>Weight</label>
              <input type="number" class="form-control" value={this.state.weight} onChange={this.handleWeightChange}/>
              <label>Height Feet</label>
              <input type="number" class="form-control" value={this.state.heightFeet} onChange={this.handleHeightFeetChange}/>
              <label>Height Inches</label>
              <input type="number" pattern="[0-9]*" class="form-control" value={this.state.heightInches} onChange={this.handleHeightInchesChange}/>
              <label>Activity Level (low, moderate, high)</label>
              <input type="text" class="form-control" value={this.state.activityLevel} onChange={this.handleActivityLevelChange}/>
              <label>Age</label>
              <input type="number" pattern="[0-9]*" class="form-control" value={this.state.age} onChange={this.handleAgeChange}/>
            </div>
          </form>

          <button class="btn btn-primary" onClick={this.signup}>Submit</button>
            <button type="button" class="btn btn-link btn-sm" onClick={this.toggleView}>Go Back</button>
        </div>
      </div>
    );
  }
}