import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Scatter } from 'react-chartjs-2';

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

        let dataForChart = this.state.data;

        let dataForChartArr = Object.keys(dataForChart).map(d => {
            return {
                x: d,
                y: dataForChart[d]
            }
        });

        let data = {
            labels: ['Scatter'],
            datasets: [
                {
                    label: 'dataset',
                    fill: true,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: 'rgba(75,192,192,1)',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,

                    pointRadius: 5,
                    pointHitRadius: 10,
                    data: dataForChartArr.length == 0 ? [] : dataForChartArr
                }
            ],
            options: {
                tooltips: {

                }
            }
        };

        return (
            <div className="container mb-5">
                <h1 className="mt-3 text-center">DataAud</h1>
                <h3 className="text-center">By Elisa Truong, Zhuo Shan, Anni Yan, William Kwok</h3>

                {/* <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Select an option below</ControlLabel>
                    <FormControl componentClass="select" placeholder="select">
                        <option value="select" selected disabled>Select</option>
                        <option value="other">Data Table 1</option>
                        <option value="other">Data Graph 1</option>
                    </FormControl>
                </FormGroup> */}
                <Scatter className="m-3" data={data} />

                <div style={{
                    backgroundColor: "rgba(75,192,192,1)",
                    width: '100%',
                    margin: 'auto',
                    // margin: 10,
                    padding: 0,
                    height: 50,
                    marginBottom: 10
                }} onMouseMove={(e) => {
                    let percentage = (e.pageX - e.target.offsetLeft) / (e.target.offsetWidth)
                    this.playToneAt(percentage);
                }}></div>

                <div style={{ margin: 'auto', textAlign: 'center', width: '50%' }}>
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
                        return <input name={d.name} className="form-control" style={{ marginBottom: 10 }} placeholder={d.placeholder} onChange={(e) => {
                            this.setData(e);
                        }} />
                    })}

                    <div>
                        <button className="btn btn-primary" onClick={(e) => {
                            e.preventDefault();
                            this.submitEquation();
                        }}>Submit equation</button>
                    </div>
                </div>

                <div style={{ margin: 'auto', textAlign: 'center', width: '50%', marginTop: 10 }}>
                    {[{
                        name: "x",
                        placeholder: "x values"
                    },
                    {
                        name: "y",
                        placeholder: "y values"
                    }
                    ].map(d => {
                        return <input name={d.name} className="form-control" style={{ marginBottom: 10 }} placeholder={d.placeholder} onChange={(e) => {
                            this.setData(e);
                        }} />
                    })}

                    <div>
                        <button className="btn btn-primary" onClick={(e) => {
                            e.preventDefault();
                            this.submitCustomData();
                        }}>Submit custom data</button>
                    </div>
                </div>

                <div>
                    <h2>How to use equation</h2>
                    <ol>
                        <li>Enter an equation in JavaScript format</li>
                        <li>Enter the start of your x range</li>
                        <li>Enter the end of your x range</li>
                    </ol>
                    <h2>How to use custom data</h2>
                    <ol>
                        <li>Enter your x and y values comma separated with no spaces</li>
                    </ol>
                </div>
            </div>
        );
    }
}

export default App;


