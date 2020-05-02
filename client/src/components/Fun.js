import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';


export default class Fun extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {    
    return (
      <div className="Fun">

        <PageNavbar active="Just For Fun" />
        <br></br>
        Just for fun lmao 
      </div>
    );
  }
}