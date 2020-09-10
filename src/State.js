import React, { Component } from 'react'
import {Redirect } from 'react-router-dom';
import { Container, Row, Col, ListGroup, ListGroupItem, Badge, Card } from 'reactstrap';


export default class State extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data: [],
          stateSelected:"",
          redirectTo:false
        };
        this.handleClick = this.handleClick.bind(this);
      }
    componentDidMount() {
        this.fetchData();
    }
    handleClick(item){
      this.setState({
        stateSelected: item,
        redirectTo:true
      });
    }
    fetchData() {
        let request = fetch("./states.json");
    
        request
          .then(r => r.json())
          .then(json => {
            this.setState({
              data: json.name
            });
          }, (error) => {
            console.error(error);
          });
      }
   
    render() {
      if (this.state.redirectTo) {
        return(
            <Redirect  to={{
              pathname: "/county", 
              state: this.state.stateSelected 
            }}
            />
        )
    }
        return (
            
            <Container className="container-list" >
              <Card>

                    <Row>
                        <Col>
                        <ListGroup >
                                    {this.state.data.map(item=>{
                                      return <ListGroupItem tag="a"className="text-center Col-State-List" onClick={() => this.handleClick(item)}>{item} <Badge pill>105</Badge></ListGroupItem>
                                    })
                                  }
                        </ListGroup>
                        </Col>
                    </Row>
                                  </Card>
            </Container>
        )
    }
}
