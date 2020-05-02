import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import Gallery from 'react-grid-gallery';
import {Container, Row, Col, Accordion, Card, Button, Form} from 'react-bootstrap';
import { TwitterTimelineEmbed } from 'react-twitter-embed';
import '../App.css';


export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posters: [],
      theme_word: '',
      feed_username: ' ',
      username: "Satya"
    }
    this.getRandomTheme = this.getRandomTheme.bind(this);
    // this.getRandomTwitterFeed = this.getRandomTwitterFeed.bind(this);
  }

  componentDidMount(){
    // --> Get user information (name  + city). Update Welcome Name + City for Query + Latest Word
    var url_query = "https://developers.zomato.com/api/v2.1/cities?q=" + "Philadelphia"
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
        var rest_query = 'https://developers.zomato.com/api/v2.1/search?entity_id=' + zomato_city_id + '&entity_type=city&q=' + this.getRandomTheme() + "&sort=rating"
        fetch( rest_query,
          {
            method: "GET",
            headers: {'user-key': '254acae745cffad9bc4ac35c4612c722'}
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
              if (thumb == "" && feat_image == ""){
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
              restObj['tags'] = [{value: <a href={website} target="_blank">{"Link"}</a>, title: rest_array[index].restaurant.cuisines}]
              out_array.push(restObj);
              if (out_array.length == 14){
                break; 
              }
            }
            return out_array
          }, err => {
            // Print the error if there is one.
            console.log(err);
          }).then((arr) => this.setState({posters: arr}));    
      });
  }

populatePosterArray(results){
  // var poster_array = this.state.movies.map(movie => {
  //   let newObj = {};
  //   var website = "https://www.imdb.com/title/" + movie["imdbID"];
  //   newObj.src = movie["Poster"] ? movie["Poster"] : "http://www.4motiondarlington.org/wp-content/uploads/2013/06/No-image-found.jpg"
  //   newObj.thumbnail = movie["Poster"] ? movie["Poster"] : "http://www.4motiondarlington.org/wp-content/uploads/2013/06/No-image-found.jpg"
  //   newObj['thumbnailWidth'] = 300
  //   newObj['thumbnailHeight'] = 330
  //   newObj['tags'] = [{value: <a href={website} target="_blank">{"Link"}</a>, title: movie["Genre"]}]
  //   newObj['caption'] = movie["Title"] + ", " + movie["Year"]
  //   return newObj
  // });
  // return poster_array; 
}

getRandomTheme(){
  var theme = themes[Math.floor(Math.random() * themes.length)];
  this.setState({theme_word : theme})
  return theme;
}

// getRandomTwitterFeed(){
//   var feed = feeds[Math.floor(Math.random() * feeds.length)];
//   this.setState({feed_username : feed})
//   return feed;
// }


setCustomTags (i) {
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

  render() {    

    const buttonStyle = {
      backgroundColor: "#E98074",
      color: "#D8C3A5"
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
        <div className="Home">
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
                  enableImageSelection={false}/>
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
                <a class="btn btn-lg btn-block" type="submit" style={buttonStyle} href={'/Ingredient Search'} >Ingredient Search</a>
              </div>
              <br></br>
              <div class="col-auto" >
                <a class="btn btn-lg btn-block" type="submit" style={buttonStyle} href={'/Nutrition Search'} >Nutrition Search</a>
              </div>
              <br></br>
              <div class="col-auto" >
                <a class="btn btn-lg btn-block" type="submit" style={buttonStyle} href={'/Dish Search'} >Dish Search</a>
              </div>
              <br></br>
              <div class="col-auto" >
                <a class="btn btn-lg btn-block" type="submit" style={buttonStyle} >Edit User Information</a>
              </div>
            </Col>
            <Col>
            <Container>
              Get <strong>inspired!</strong>
              </Container>
              <div className="selfCenter standardWidth">
              <TwitterTimelineEmbed
                sourceType="profile"
                screenName="tastykitchen"
                options={{height: 1315}}
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
