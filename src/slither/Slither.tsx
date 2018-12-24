import * as React from 'react';
import * as ReactDOM from 'react-dom';
import slither_body_img_1 from 'src/images/slither_body_img_1.svg';
/*
let bodyArray: any[];
// tslint:disable-next-line:prefer-const
let bodySegmentsNumber: number = 10;
const segmentSize: number = 30; // segment radius
const segmentsDistance: number = segmentSize / 2;
// tslint:disable-next-line:prefer-const
let windowSize = [window.innerWidth, window.innerHeight];
// tslint:disable-next-line:prefer-const
let bodySegmentsCoords: number[][] = []; // there is MAP in wich we have coordinates of every segment of slither, so it is global coordinates
let styleSegment: any;
let bodyMass: number = 100;
*/
// tslint:disable-next-line:interface-name
interface State {
    segmentCoords: number[][];
    segmentSize: number;
    segmentDistance: number;
    windowSize: number[];
    slitherWeight: number;
    segmentNumber: number;
    mouseCoords: number[];
    slitherSpeed: number;
}

class Test extends React.Component <{}, State> {

    private timerID: any
    private lastSegment: number[]
    private array: any
    private fps: number

    constructor(props: any) {
        super(props)

        this.array = [];
        for(let i = 0; i < 50; i++) {
            this.array.push([(window.innerWidth / 2 - 30), (window.innerHeight/2 - 30) + i*15, i])
        }

        // tslint:disable-next-line:no-console
        // console.log(this.array)

        this.fps = 1000 / 60; // setting FPS

        this.state = {
            mouseCoords: [(window.innerWidth / 2 - 30), 0],
            segmentCoords: this.array,
            segmentDistance: 15,
            segmentNumber: 50,
            segmentSize: 60,
            slitherSpeed: 3,
            slitherWeight: 500,
            windowSize: [window.innerWidth, window.innerHeight]
        }

        document.addEventListener('mousemove', this.direction);
        document.addEventListener('over', this.direction);
        this.direction.bind(this)
    }

    /**
     * direction
     */
    public direction = (event: any) => {
        this.setState({
            mouseCoords: [event.clientX - this.state.segmentSize/2, event.clientY - this.state.segmentSize/2]
        })  
        // tslint:disable-next-line:no-console
        // console.log(this.state.mouseCoords)
    }

    /**
     * addSement
     */
    public addSegment() {
        this.lastSegment = this.state.segmentCoords[this.state.segmentCoords.length - 1];
        this.setState({
            segmentCoords: this.state.segmentCoords.concat([[this.lastSegment[0], this.lastSegment[1] + this.state.segmentDistance, this.state.segmentCoords.length]]),
            segmentNumber: this.state.segmentNumber + 1,
            slitherWeight: this.state.slitherWeight + 10
        })
    }

    public move() {

        this.array = this.state.segmentCoords;
        
        const vector = [this.state.mouseCoords[0] - this.array[0][0], this.state.mouseCoords[1] - this.array[0][1]];
        // tslint:disable-next-line:prefer-const
        let k: number = this.state.slitherSpeed / (vector[0]**2 + vector[1]**2)**0.5; // coeficient for vector

        this.array[0] = [this.array[0][0] + vector[0]*k, this.array[0][1] + vector[1]*k, this.array[2]]

        for(let i = 1; i < this.array.length; i++) {
            
            // k = this.state.slitherSpeed / ((this.array[i-1][0]-this.array[i][0])**2 + (this.array[i-1][1]-this.array[i][1])**2)**0.5;
            k = (((this.array[i-1][0]-this.array[i][0])**2 + (this.array[i-1][1]-this.array[i][1])**2)**0.5 - this.state.segmentDistance) / ((this.array[i-1][0]-this.array[i][0])**2 + (this.array[i-1][1]-this.array[i][1])**2)**0.5;
            this.array[i] = [
            (this.array[i-1][0]-this.array[i][0])*k + this.array[i][0],
            (this.array[i-1][1]-this.array[i][1])*k + this.array[i][1], 
            this.array[i][2]];
        
        }

        this.setState({
            segmentCoords: this.array
        })

        // alert(k)
        // tslint:disable-next-line:no-console
        console.log(this.state.segmentCoords)

    }

    public update() {

        /*this.setState({
            slitherWeight: this.state.slitherWeight + 10
        })*/

        if(this.state.slitherWeight / 10 !== this.state.segmentNumber) {
            this.addSegment()
        }

        this.move()

    }

    public componentDidMount() {
        this.timerID = setInterval(
            () => this.update(), this.fps
        )
    }

    public componentWillUnmount() {
        clearInterval(this.timerID)
    }

    /**
     * render
     */
    public render() {
        return (
            // tslint:disable-next-line:jsx-no-lambda
            <div className="window" id="window">
                {this.state.segmentCoords.map((x) => <img src={slither_body_img_1} style={{
                    left: `${x[0]}px`,
                    position: "absolute",
                    top: `${x[1]}px`,
                    width: `${this.state.segmentSize}px`,
                    zIndex: -x[2]
                }} key={x[2]} />)}
            </div>
        );
    }
}

function start() {
    ReactDOM.render(
        <Test />,
        document.getElementById('root')
    );
}

export default start;