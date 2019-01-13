import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Scatter } from 'react-chartjs-2';
import { FormGroup } from 'react-bootstrap/lib';
import { ControlLabel } from 'react-bootstrap/lib';
import { FormControl } from 'react-bootstrap/lib';

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //   data: [{ x: 65, y: 75 }, { x: 59, y: 49 }, { x: 80, y: 90 }, { x: 81, y: 29 }, { x: 56, y: 36 }, { x: 55, y: 25 }, { x: 40, y: 18 }],
            //   dataSet: ""
            data: {},
            min: null,
            max: null,
            equation: null
        };

        this.duration = 25
        this.freqMin = 500
        this.freqMax = 1000
    }

    setData = (e) => {
        e.preventDefault();
        let value = e.target.value;
        let name = e.target.name;
        if (name == "min" || name == "max") {
            value = Number(value);
        }
        this.setState({ [name]: value });
    }

    playToneAt = (percentage) => {
        const { freqMax, freqMin, duration } = this;
        const roundedPercentage = percentage.toFixed(2)
        let freqPerc = this.state.data[roundedPercentage]
        if (freqPerc) {
            let calcFreq = (freqMax - freqMin) * freqPerc + freqMin
            this.playNote(calcFreq, duration, () => { })
        }
    }

    IsMinMaxEqValid = () => {
        const { min, max, equation } = this.state;
        if (min == null || max == null || equation == null) {
            return false;
        }
        return true;
    }

    submitCustomData = () => {
        let { x, y } = this.state;
        let xValues = x.split(',');
        let yValues = y.split(',');

        if (xValues.length !== yValues.length) {
            throw new Error('invalid sizes');
        }

        let finalVals = {}
        let minX, maxX, minY, maxY;
        xValues.forEach((d, i) => {
            let xval = Number(d)
            let yval = Number(yValues[i])
            finalVals[xval] = yval;

            if (!minX || xval < minX) {
                minX = xval;
            }

            if (!maxX || xval > maxX) {
                maxX = xval;
            }

            if (!minY || yval < minY) {
                minY = yval;
            }

            if (!maxY || yval > maxY) {
                maxY = yval;
            }
        });
        this.setState({ data: this.changeDataIntoPercentages(finalVals, minX, maxX, minY, maxY) })
    }

    playNote(frequency, duration, callback) {
        duration = duration / 1000; // seconds

        // create Oscillator node
        var oscillator = audioCtx.createOscillator();

        oscillator.type = 'square';
        oscillator.frequency.value = frequency; // value in hertz
        oscillator.connect(audioCtx.destination);

        oscillator.onended = callback;
        oscillator.start(0);
        oscillator.stop(audioCtx.currentTime + duration);
    }

    playToneAt = (percentage) => {
        const { data } = this.state;
        const { freqMin, freqMax, duration } = this;
        const roundedPercentage = percentage.toFixed(2)
        let freqPerc = data[roundedPercentage]
        if (freqPerc) {
            let calcFreq = (freqMax - freqMin) * freqPerc + freqMin
            this.playNote(calcFreq, duration, () => { })
        }
    }

    changeDataIntoPercentages = (dataIn, minX, maxX, minY, maxY) => {
        let returnObj = {};
        Object.keys(dataIn).forEach(d => {
            let y = dataIn[d];
            let newY = (y - minY) / (maxY - minY);
            let newX = (d - minX) / (maxX - minX);

            returnObj[newX.toFixed(2)] = newY.toFixed(2);
        });
        return returnObj;
    }

    submitEquation = () => {
        const { min, max, equation } = this.state;
        if (this.IsMinMaxEqValid()) {
            let finalvals = {};
            let f = eval("(x) => {return " + equation + "}");
            let minY = undefined;
            let maxY = undefined;

            for (let i = min; i < max; i += (max - min) / 20000) {
                let y = f(i).toFixed(2);
                let roundedi = i.toFixed(2)
                finalvals[roundedi] = y;

                if (minY == undefined || y < minY) {
                    minY = y;
                }

                if (maxY == undefined || y > maxY) {
                    maxY = y;
                }
            }
            this.setState({ data: this.changeDataIntoPercentages(finalvals, min, max, minY, maxY) })
        }
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
                    data: [{ x: 5, y: 10 }]
                }
            ],
            options: {
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

                <div style={{
                    backgroundColor: "green",
                    width: 600,
                    margin: 'auto',
                    // margin: 10,
                    padding: 0,
                    height: 50,
                    marginBottom: 10
                }} onMouseMove={(e) => {
                    // console.log(e.pageX, e.target.offsetLeft)
                    let percentage = (e.pageX - e.target.offsetLeft) / (600)
                    this.playToneAt(percentage);
                }}></div>

                <div style={{ margin: 'auto', textAlign: 'center' }}>
                    {[{
                        name: "equation",
                        placeholder: "Enter an equation"
                    },
                    {
                        name: "min",
                        placeholder: "Enter a min val"
                    },
                    { name: "max", placeholder: "Enter a max value" }
                    ].map(d => {
                        return <input name={d.name} placeholder={d.placeholder} onChange={(e) => {
                            this.setData(e);
                        }} />
                    })}

                    <div>
                        <button onClick={(e) => {
                            e.preventDefault();
                            this.submitEquation();
                        }}>Submit equation</button>
                    </div>
                </div>

                <div style={{ margin: 'auto', textAlign: 'center' }}>
                    {[{
                        name: "x",
                        placeholder: "x values"
                    },
                    {
                        name: "y",
                        placeholder: "y values"
                    }
                    ].map(d => {
                        return <input name={d.name} placeholder={d.placeholder} onChange={(e) => {
                            this.setData(e);
                        }} />
                    })}

                    <div>
                        <button onClick={(e) => {
                            e.preventDefault();
                            this.submitCustomData();
                        }}>use custom data</button>
                    </div>
                </div>




            </div>
        );
    }
}

export default App;


