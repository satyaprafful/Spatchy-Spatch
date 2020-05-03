import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Row, Col, Accordion, Card, Button, Form} from 'react-bootstrap';
import {Link} from 'react-router-dom';

export default class RecipeRow extends React.Component {
	constructor(props) {
		super(props);
	}

	parseIngredients(raw)
	{
		if (raw === undefined)
			return;
        var ingrArr = raw.substring(1,raw.length-1).split(",")

        return ingrArr.map((tuple, i) => {
            var curr = ingrArr[i];
            curr = curr.replace(/\'/g, "");

            return  <Row>
                         <Col>
                              {curr}
                         </Col>
                    </Row>
            }
        )
	}

	render() {
        var pathnameV = `/RecipePage/${this.props.rID}`;

        var ingrStyle = {
            textAlign: "left",
            fontSize: "12pt"
        };

        var price = "";
        if (this.props.price) {
            var rounded = this.props.price.toFixed(2);
            price = " (" + rounded + "$)";
        }

		return (
			<div className="recipeResults">
				<Row><Col>
                    <Accordion>
                        <Card>
                        <Card.Header style={{fontSize: "15pt"}}>
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                                {(this.props.index+1) + ". " + this.props.title + price}
                            </Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body style={ingrStyle}>
                                <Row>
                                    <Col>
                                        <strong>Recipe Name</strong>: {this.props.title}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <strong>Rating:</strong> {this.props.rating}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                    <strong>Description:</strong> {this.props.recipe_descr}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <strong>Ingredients:</strong> {this.parseIngredients(this.props.ingr_desc)}
                                    </Col>
                                </Row>
                                <br></br>
                                <Link to={{
                                pathname: pathnameV
                                }}>See Full Recipe</Link>
                            </Card.Body>
                        </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Col></Row>
			</div>
		);
	}
}
