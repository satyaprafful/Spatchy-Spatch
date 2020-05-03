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
		console.log(this.props.rID)
		var pathnameV = `/RecipePage/${this.props.rID}`;
		return (
			<div className="recipeResults">
				<Row><Col>
                    <Accordion>
                        <Card>
                        <Card.Header >
                            <Accordion.Toggle as={Card.Header} eventKey="0">
                                {(this.props.index+1) + ". " + this.props.title}
                            </Accordion.Toggle>
                            <Link to={{
							  pathname: pathnameV
							}}>See Full Recipe</Link>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
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

                            </Card.Body>
                        </Accordion.Collapse>
                        </Card>
                    </Accordion>
                </Col></Row>
			</div>
		);
	}
}
