import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import Gallery from 'react-grid-gallery';
import { Container, Row, Col, Accordion, Card, Button, Form } from 'react-bootstrap';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import '../App.css';


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
    // this.getRandomTwitterFeed = this.getRandomTwitterFeed.bind(this);
  }

  componentDidMount() {
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

    fetch("http://localhost:8081/curruser",
      {
        method: "GET"
      }).then(res => {
        return res.json();
      }, err => {
        console.log(err);
      }).then(userInfo => {
        this.setState({
          // CHANGE THIS FROM FAKE PERSON!!!!
          user: userInfo.fakePerson,
          isVegan: userInfo.fakePerson.isVegan,
          isVegetarian: userInfo.fakePerson.isVegetarian,
          isLactose: userInfo.fakePerson.isLactose,
          isNut: userInfo.fakePerson.isNut,
          isGluten: userInfo.fakePerson.isGluten,
          weight: userInfo.fakePerson.weight,
          heightFeet: userInfo.fakePerson.heightFeet,
          heightInches: userInfo.fakePerson.heightInches,
          activityLevel: userInfo.fakePerson.activityLevel,
          age: userInfo.fakePerson.age,
        });
        console.log(userInfo);
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
        </div>
        this.setState({
          formDiv: userInfoDiv
        });
      }, err => {
        console.log(err);
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
                </form>
                {/* <button class="btn btn-primary" onClick={this.editInfo}>Submit</button> */}
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
