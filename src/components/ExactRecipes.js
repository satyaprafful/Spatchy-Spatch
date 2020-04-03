import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';


export default class ExactRecipes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {    
    return (
      <div className="Recipes">

        <PageNavbar active="Recipes" />
        <br></br>
        This is a recipes Page
      </div>
    );
  }
}