import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class PageNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navDivs: []
		}
	}

	componentDidMount() {
		const pageList = [, 'Home', 'Ingredient Search', 'Nutrition Search', 'Dish Search'];

		let navbarDivs = pageList.map((page, i) => {
			if (this.props.active === page) {
				return <a className="nav-item nav-link active" key={i} style={{display: "inline-block",float: "none",paddingLeft:"10px",paddingRight:"10px"}} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			}
			else {
				return <a className="nav-item nav-link" key={i} style={{display: "inline-block",float: "none", paddingLeft:"10px",paddingRight:"10px"}} href={"/" + page}>{page.charAt(0).toUpperCase() + page.substring(1, page.length)}</a>
			}
		})		
		this.setState({
			navDivs: navbarDivs
		});
	}

	render() {
		const navBarStyle = {
			float: "none",
			margin: "0 auto",
			display: "block",
			textAlign: "center",
			backgroundColor: "#EAE7DC"
		}

		const navItemStyle = {
			display: "inline-block",
			float: "none",
			paddingLeft:"10px",
			paddingRight:"10px"
		}

		return (
			<div className="PageNavbar">
				<nav className="navbar navbar-expand-lg navbar-light" style={navBarStyle}>
				  	<div className="navbar-nav" style={navItemStyle}>
			       	 {this.state.navDivs}
			        </div>
			    </nav>
			</div>
        );
	}
}