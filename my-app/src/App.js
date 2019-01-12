import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Scatter} from 'react-chartjs-2';
import {FormGroup} from 'react-bootstrap/lib';
import {ControlLabel} from 'react-bootstrap/lib';
import {FormControl} from 'react-bootstrap/lib';

class App extends Component {

  constructor (props) {
    super (props);
    this.state = {
      data: [{ x: 65, y: 75 }, { x: 59, y: 49 }, { x: 80, y: 90 }, { x: 81, y: 29 }, { x: 56, y: 36 }, { x: 55, y: 25 }, { x: 40, y: 18 }],
      dataSet: ""
    };
  }

  render() {

    let data = {
      labels: ['Scatter'],
      datasets: [
        {
          label: 'My First dataset',
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          pointBorderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: this.state.data
        }
      ],
      options:{
        tooltips: {
          
        }
      }
    };      

    return (
      <div className="container mb-5">
        <h1 className="mt-3 text-center">7th WINFO Test</h1>
      
        <FormGroup controlId="formControlsSelect">
          <ControlLabel>Select an option below</ControlLabel>
          <FormControl componentClass="select" placeholder="select">
            <option value="select" selected disabled>Select</option>
            <option value="other">Data Table 1</option>
            <option value="other">Data Graph 1</option>
          </FormControl>
        </FormGroup>
        <Scatter className="m-3" data={data} />

      </div>
    );
  }
}

export default App;


