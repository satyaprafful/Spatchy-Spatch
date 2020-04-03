import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';


export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {    
    return (
      <div className="Login">

        <PageNavbar active="Login" />
        <br></br>
        This is the Login page
      </div>
    );
  }
}