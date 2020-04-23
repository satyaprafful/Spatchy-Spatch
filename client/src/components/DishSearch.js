import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';


export default class DishSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {    
    return (
      <div className="DishSearch">

        <PageNavbar active="DISHES" />
        <br></br>
        Praff's page
      </div>
    );
  }
}