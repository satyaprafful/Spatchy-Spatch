import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import Gallery from 'react-grid-gallery';
import { Container, Row, Col, Accordion, Card, Button, Form } from 'react-bootstrap';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import '../App.css';
import Select from 'react-select';


export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posters: [],
      theme_word: '',
      feed_username: ' ',
      username: "Satya",
      user: null,
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
      selected_state: '',
      selected_city: '',
      formDiv: <div></div>,
      hideForm: true
    }

    this.getRandomTheme = this.getRandomTheme.bind(this);
    this.showForm = this.showForm.bind(this);
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
    this.editInfo = this.editInfo.bind(this);
    // this.getRandomTwitterFeed = this.getRandomTwitterFeed.bind(this);
  }

  getCities(city) {
    var url_query = "http://localhost:8081/cities/" + city
    console.log(this.state.selected_state);
    console.log(city);

    fetch(url_query,
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
          cityList: cityList
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      });
  }

  componentDidMount() {
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
          statesList: statesList
        });
      }, err => {
        // Print the error if there is one.
        console.log(err);
      }).then(() => {
        fetch("http://localhost:8081/curruser",
        {
          method: "GET"
        }).then(res => {
          return res.json();
        }, err => {
          console.log(err);
        }).then(userInfo => {
          this.setState({
            user: userInfo,
            isVegan: userInfo.isVegan,
            isVegetarian: userInfo.isVegetarian,
            isLactose: userInfo.isLactose,
            isNut: userInfo.isNut,
            isGluten: userInfo.isGluten,
            weight: userInfo.weight,
            heightFeet: userInfo.heightFeet,
            heightInches: userInfo.heightInches,
            activityLevel: userInfo.activityLevel,
            age: userInfo.age,
            selected_city: userInfo.city,
            selected_state: userInfo.state
          });
          console.log(userInfo);
          this.setState({
            cityList: this.getCities(userInfo.state)
          })
          return this.state.cityList
        }, err => {
          console.log(err);
        }).then(cityList => {
          console.log(cityList);
          var userInfoDiv = <div>
          Diet:
          <br></br>
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
          <Row>
                    <Col>Which State are you in?</Col>
                    <Col>
                      <Select
                        options={this.state.statesList}
                        defaultValue={{  label: this.state.selected_state, value: this.state.selected_state }}
                        onChange={(e => {
                          this.setState({
                            selected_state: e.label,
                          });
                          { this.getCities(e.label) }
                        })}
                      />
                    </Col>
                  </Row>
        </div>
        this.setState({
          formDiv: userInfoDiv
        });
        }, err => {
          console.log(err);
        });
      }, err => {
        console.log(err);
      });
    
    // --> Get user information (name  + city). Update Welcome Name + City for Query + Latest Word
    var url_query = "https://developers.zomato.com/api/v2.1/cities?q=" + "Philadelphia"
    fetch(url_query,
      {
        method: "GET",
        headers: { 'user-key': '254acae745cffad9bc4ac35c4612c722' }
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
        var rest_query = 'https://developers.zomato.com/api/v2.1/search?entity_id=' + zomato_city_id + '&entity_type=city&q=' + this.getRandomTheme() + "&sort=rating"
        fetch(rest_query,
          {
            method: "GET",
            headers: { 'user-key': '254acae745cffad9bc4ac35c4612c722' }
          }).then(res => {
            return res.json();
          }, err => {
            console.log(err);
          }).then(resultList2 => {
            var index;
            let out_array = [];
            var rest_array = resultList2.restaurants;
            for (index = 0; index < rest_array.length; ++index) {
              let thumb = rest_array[index].restaurant.thumb
              let feat_image = rest_array[index].restaurant.featured_image
              if (thumb == "" && feat_image == "") {
                continue;
              }
              let img_url = thumb ? thumb : feat_image
              let restObj = {};
              let website = rest_array[index].restaurant.url
              restObj.src = img_url
              restObj.thumbnail = img_url
              restObj['thumbnailWidth'] = 500
              restObj['thumbnailHeight'] = 550
              restObj['caption'] = rest_array[index].restaurant.name
              restObj['tags'] = [{ value: <a href={website} target="_blank">{"Link"}</a>, title: rest_array[index].restaurant.cuisines }]
              out_array.push(restObj);
              if (out_array.length == 14) {
                break;
              }
            }
            return out_array
          }, err => {
            // Print the error if there is one.
            console.log(err);
          }).then((arr) => this.setState({ posters: arr }));
      });

  }

  getRandomTheme() {
    var theme = themes[Math.floor(Math.random() * themes.length)];
    this.setState({ theme_word: theme })
    return theme;
  }

  // getRandomTwitterFeed(){
  //   var feed = feeds[Math.floor(Math.random() * feeds.length)];
  //   this.setState({feed_username : feed})
  //   return feed;
  // }

  setCustomTags(i) {
    return (
      i.tags.map((t) => {
        return (<div
          key={t.value}
          style={customTagStyle}>
          {t.title}
        </div>);
      })
    );
  }

  changeVegan() { this.setState({ isVegan: !this.state.user.isVegan }) }

  changeVegetarian() { this.setState({ isVegetarian: !this.state.isVegetarian }) }

  changeLactose() { console.log(this.state.isLactose); this.setState({ isLactose: !this.state.isLactose }) }

  changeNut() { this.setState({ isNut: !this.state.isNut }) }

  changeGluten() { this.setState({ isGluten: !this.state.isGluten }) }

  handleWeightChange(event) { this.setState({ weight: event.target.value }) }

  handleHeightFeetChange(event) { this.setState({ heightFeet: event.target.value }) }

  handleHeightInchesChange(event) { this.setState({ heightInches: event.target.value }) }

  handleActivityLevelChange(event) { this.setState({ activityLevel: event.target.value }) }

  handleAgeChange(event) { this.setState({ age: event.target.value }) }

  showForm() { console.log("running"); { this.setState({ hideForm: !this.state.hideForm }) } }

  editInfo(e) {
    e.preventDefault();
    console.log(this.state);
    fetch("http://localhost:8081/edituser",
      {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
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
        console.log(res.json());
        return res.json();
      }, err => {
        console.log(err)
      }).then(userInfo => {
        this.setState({
          user: userInfo,
          isVegan: userInfo.isVegan,
          isVegetarian: userInfo.isVegetarian,
          isLactose: userInfo.isLactose,
          isNut: userInfo.isNut,
          isGluten: userInfo.isGluten,
          weight: userInfo.weight,
          heightFeet: userInfo.heightFeet,
          heightInches: userInfo.heightInches,
          activityLevel: userInfo.activityLevel,
          age: userInfo.age,
          city: userInfo.city,
          state: userInfo.state
        });
        console.log(userInfo);
        this.setState ({
          citiesList: this.getCities(userInfo.state)
        })
        var userInfoDiv = <div>
          Diet:
          <br></br>
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
        </div>
        this.setState({
          formDiv: userInfoDiv
        });
      }, err => {
        console.log(err)
      });
  }

  render() {
    const buttonStyle = {
      backgroundColor: "#E98074",
    };


    var images = this.state.posters.map((i) => {
      i.customOverlay = (
        <div style={captionStyle}>
          <div>{i.caption}</div>
          {i.hasOwnProperty('tags') &&
            this.setCustomTags(i)}
        </div>);
      return i;
    });

    return (
      <div>
        <div className="Home" style={{ backgroundColor: "#EAE7DC", minHeight: "100vh", height: "100%" }}>
          <PageNavbar active="Home" />
          <br></br>
          <Container>
            <Row>
              <Col>
                <Container>
                  Explore <strong>{this.state.theme_word}</strong> today?
              </Container>
                <br></br>
                <Container>
                  <Row>
                    <Col>
                      <Gallery
                        images={images}
                        enableImageSelection={false} />
                    </Col>
                  </Row>
                </Container>
              </Col>
              <Col>
                <img src={require('../resources/baby-yoda-clean.png')} class="img-fluid" ></img>
                <Container>
                  <br></br>
                Hey <strong>{this.state.username}</strong>!
              </Container>
                <Container>
                  What would you like to do today?
              </Container>
                <br></br>
                <div class="col-auto" >
                  <a class="btn btn-lg btn-block" type="submit" style={buttonStyle} onClick={this.showForm}>Edit User Information</a>
                </div>
                <br></br>
                <form hidden={this.state.hideForm}>
                  {this.state.formDiv}

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
                Health:
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
                  <button class="btn btn-primary-dark" style={buttonStyle} onClick={this.editInfo}>Submit</button>
                </form>
              </Col>
              <Col>
                <Container>
                  Get <strong>inspired!</strong>
                </Container>
                <br></br>
                <div className="selfCenter standardWidth">
                  <TwitterTimelineEmbed
                    sourceType="profile"
                    screenName="tastykitchen"
                    options={{ height: 1315 }}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className="centerContent">
        </div>
      </div>
    );
  }
}

const captionStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  maxHeight: "240px",
  overflow: "hidden",
  position: "absolute",
  bottom: "0",
  width: "100%",
  color: "white",
  padding: "2px",
  fontSize: "90%"
};

const customTagStyle = {
  wordWrap: "break-word",
  display: "inline-block",
  backgroundColor: "white",
  height: "auto",
  fontSize: "75%",
  fontWeight: "600",
  lineHeight: "1",
  padding: ".2em .6em .3em",
  borderRadius: ".25em",
  color: "black",
  verticalAlign: "baseline",
  margin: "2px"
};

const themes = ['Italian', 'Spanish', 'Chinese', 'Mexican', 'American']
