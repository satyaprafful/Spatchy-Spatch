import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import Gallery from 'react-grid-gallery';
import {Container, Row, Col, Accordion, Card, Button, Form} from 'react-bootstrap';


export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posters: [],
      theme_word: '',
      username: "Satya"
    }
    this.getRandomTheme = this.getRandomTheme.bind(this)
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
              restObj['thumbnailWidth'] = 300
              restObj['thumbnailHeight'] = 330
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
          Hey <strong>{this.state.username}</strong>, Explore <strong>{this.state.theme_word}</strong> today?
          </Container>
        </div>
        <br></br>
        <div>
          <Container>
          <Row>
            <Col>
            <Gallery
              images={images}
              enableImageSelection={false}/>
            </Col>
          </Row>
          </Container>
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