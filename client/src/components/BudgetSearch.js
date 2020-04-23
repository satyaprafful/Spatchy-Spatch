import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';


export default class BudgetSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {    
    return (
      <div className="BudgetSearch">

        <PageNavbar active="Budget based searching" />
        <br></br>
        This is the page for broke bitches
      </div>
    );
  }
}