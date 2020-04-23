import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';


export default class IngrSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {    
    return (
      <div className="IngrSearch">

        <PageNavbar active="Ingredient based searching" />
        <br></br>
        This is the ingredient pate
      </div>
    );
  }
}