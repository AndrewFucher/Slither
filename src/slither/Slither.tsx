import * as React from 'react';
import * as ReactDOM from 'react-dom';
import bg from 'src/images/bg.jpg';
import slither_body_img_1 from 'src/images/slither_body_img_1.svg';

// tslint:disable-next-line:interface-name
interface SlitherSpeed {
    normal: number;
    fast: number;
}

// tslint:disable-next-line:interface-name
interface WindowSize {
    originalWindowSize: number[]
    windowSize: number[];
}

// tslint:disable-next-line:interface-name
interface State {
    headVector: number[];
    segmentCoords: number[][];
    segmentSize: number;
    segmentDistance: number;
    slitherWeight: number;
    segmentNumber: number;
    mouseCoords: number[];
    slitherSpeed: number;
    segmentWeigth: number;
}


// tslint:disable-next-line:interface-name
interface Background {
    coords: number[][];
    image: any;
    imageSize: number[];
}

// tslint:disable-next-line:interface-name
interface Food {
    size: number;
    coords: number[][];
    amount: number;
}

// tslint:disable-next-line:interface-name
interface Map {
    size: number[];
}

class Test extends React.Component <{}, State> {

    private timerID: any
    private lastSegment: number[]
    private array: any // this array i use for everything. Just need it
    private fps: number
    private segmentSize: number
    private food: Food
    private gameMap: Map
    private backGround: Background
    private speed: SlitherSpeed
    private windowSize: WindowSize

    constructor(props: any) {
        super(props)

        /**
         * Setting background proporties and slither proporties
         */

        this.speed = {
            fast: 8,
            normal: 4
        }

        this.backGround = {
            coords: [],
            image: bg,
            imageSize: [599, 519]
        }
        this.array = [];
        for(let i = -2; i < 4; i++) {
            for(let j = -2; j < 4; j++){
                this.array.push([j * this.backGround.imageSize[0], i * this.backGround.imageSize[1]]);
            }
        }
        this.backGround.coords = this.array;

        this.segmentSize = 50;

        this.gameMap = {
            size: [3000, 3000]
        }

        this.food = {
            amount: 0,
            coords: [],
            size: 20
        }

        // tslint:disable-next-line:no-console
        console.log(this.gameMap, bg.size)

        this.array = [];
        for(let i = 0; i < 50; i++) {
            this.array.push([(window.innerWidth / 2 - this.segmentSize/2), (window.innerHeight/2 - this.segmentSize/2) + i*15]);
        }

        this.fps = 1000 / 60; // setting FPS

        this.state = {
            headVector: [1, 1],
            mouseCoords: [(window.innerWidth / 2 - 20), 0],
            segmentCoords: this.array,
            segmentDistance: 15,
            segmentNumber: 50,
            segmentSize: this.segmentSize,
            segmentWeigth: 10,
            slitherSpeed: this.speed.normal,
            slitherWeight: 500
        }

        this.windowSize = {
            originalWindowSize: [window.innerWidth, window.innerHeight],
            windowSize: [window.innerWidth, window.innerHeight]
        }

        // connecting evyry single controler for mouse( moving, speeding etc. )
        document.addEventListener('mousemove', this.directionMouse);
        document.addEventListener('mousedown', this.speedingSlither);
        document.addEventListener('mouseup', this.slowingSlither)
        document.addEventListener("touchmove", this.directionTouch);
        document.addEventListener("touchstart", this.directionTouch);
        document.addEventListener('mouseover', this.directionMouse);
        
        // this.direction.bind(this)
    }

    /**
     * Adding control to smartphones
     */
    public directionTouch = (event: any) => {
        event.preventDefault();
        this.setState({
            mouseCoords: [event.targetTouches[0].clientX - this.state.segmentSize/2, event.targetTouches[0].clientY - this.state.segmentSize/2]
        })
    }

    public slowingSlither = (event: any) => {
        event.preventDefault()
        this.setState({
            slitherSpeed: this.speed.normal
        })
    }

    /**
     * speedingSlither
     */
    public speedingSlither = (event: any) => {
        event.preventDefault()
        this.setState({
            slitherSpeed: this.speed.fast
        })
    }

    /**
     * direction - changing direction toward mouse(just updating mouse coordinates)
     */
    public directionMouse = (event: any) => {
        event.preventDefault()
        this.setState({
            mouseCoords: [event.clientX - this.state.segmentSize/2, event.clientY - this.state.segmentSize/2]
        })  
    }

    /**
     * food - adding new food
     */
    public addFood() {

        this.food.coords.push([Math.floor(Math.random() * (this.windowSize.windowSize[0] - this.food.size)), Math.floor(Math.random() * (this.windowSize.windowSize[1] - this.food.size)), this.food.amount])
        this.food.amount++;
    
    }

    /**
     * deleteSegment
     */
    public deleteSegment() {
        const variable = this.state.segmentCoords;
        variable.pop();
        this.setState({
            segmentCoords: variable,
            segmentNumber: this.state.segmentNumber - 1
        })
    }

    /**
     * addSement - adding new segment to slither
     */
    public addSegment() {
        this.lastSegment = this.state.segmentCoords[this.state.segmentCoords.length - 1];
        this.setState({
            segmentCoords: this.state.segmentCoords.concat([[this.lastSegment[0], this.lastSegment[1] + this.state.segmentDistance, this.state.segmentCoords.length]]),
            segmentNumber: this.state.segmentNumber + 1
        })
    }

    /**
     * movebg - moving background
     */
    public movebg(vx: number, vy: number) {
        let kx: number = 0;
        let ky: number = 0;
        // vx = Math.round(vx);
        // vy = Math.round(vy);

        const firstbg = this.backGround.coords[0];

        // slither moving right
        if(firstbg[0] <= this.backGround.imageSize[0] * -1) {
            kx = 1;
        }
        // slither moving left
        if(firstbg[0] >= 0) {
            kx = -1;
        }
        // slither moving down
        if(firstbg[1] <= this.backGround.imageSize[1] * -1) {
            ky = 1; 
        }
        // slither moving up
        if(firstbg[1] >= 0) {
            ky = -1;
        }

        for(let i = 0; i < this.backGround.coords.length; i++) {
            this.backGround.coords[i] = [this.backGround.coords[i][0] - vx + this.backGround.imageSize[0]*kx, this.backGround.coords[i][1] - vy + this.backGround.imageSize[1]*ky];
        }

    }

    /**
     * moveFood
     */
    public moveFood(vx: number, vy: number) {
        // vx = Math.round(vx);
        // vy = Math.round(vy);
        let i: number = 0;
        let j: boolean = true;
        while(j !== false) {
            this.food.coords[i] = [this.food.coords[i][0] - vx, this.food.coords[i][1] - vy];
            if (this.food.coords[i][0] > this.windowSize.windowSize[0] ||
                this.food.coords[i][0] < 0 ||
                this.food.coords[i][1] > this.windowSize.windowSize[1] ||
                this.food.coords[i][1] < 0) {
                    this.food.coords.splice(i, 1);
                    j = false;
                    this.food.amount--;
                    this.addFood();
            }
            i++;
            if (i >= this.food.amount) {
                j = false;
            }
        }
    }

    /**
     * Here we moving our snake toward mouse
     * Also here we are checking is slither ate food or no. And if it's true then adding mass
     */
    public move() {
        /**
         * Moving head of slither
         */
        this.array = this.state.segmentCoords;
        
        const vector = [this.state.mouseCoords[0] - this.array[0][0], this.state.mouseCoords[1] - this.array[0][1]];

        let k: number = this.state.slitherSpeed / (vector[0]**2 + vector[1]**2)**0.5; // coeficient for vector

        if(vector[0] !== 0 && vector[1] !== 0) {
            this.setState({
                headVector: [vector[0]*k, vector[1]*k]
            });
        }
        const kHead = k; // coeficient for head of snake

        // moving background
        this.movebg(this.state.headVector[0], this.state.headVector[1]);

        // moving food
        this.moveFood(this.state.headVector[0], this.state.headVector[1]);

        this.array[0] = [this.array[0][0] + this.state.headVector[0], this.array[0][1] + this.state.headVector[1]]

        /**
         * Checking collision of head and food
         */

        for(let i = 0; i < this.food.amount; i++) {
            if (((this.array[0][0] - this.food.coords[i][0]) ** 2 + (this.array[0][1] - this.food.coords[i][1]) ** 2 < (this.food.size**2)*2 + (this.state.segmentSize**2))) {
                this.food.amount--;
                this.food.coords.splice(i, 1);
                this.setState({
                    slitherWeight: this.state.slitherWeight + 2
                })
            }
        }

        /**
         * Moving body of slither
         */

        for(let i = 1; i < this.array.length; i++) {
            
            k = (((this.array[i-1][0]-this.array[i][0])**2 + (this.array[i-1][1]-this.array[i][1])**2)**0.5 - this.state.segmentDistance) / ((this.array[i-1][0]-this.array[i][0])**2 + (this.array[i-1][1]-this.array[i][1])**2)**0.5;
            this.array[i] = [
            (this.array[i-1][0]-this.array[i][0])*k + this.array[i][0],
            (this.array[i-1][1]-this.array[i][1])*k + this.array[i][1], 
            this.array[i][2]];
        
        }

        for(let i = 0; i < this.array.length; i++) {
            this.array[i] = [this.array[i][0] - vector[0]*kHead, this.array[i][1] - vector[1]*kHead]
        }

        this.setState({
            segmentCoords: this.array
        })

    }

    public update() {

        // Checking if size of the player`s window hase changed
        if (this.windowSize.windowSize[0] !== window.innerWidth || this.windowSize.windowSize[1] !== window.innerHeight) {
            this.windowSize.windowSize = [window.innerWidth, window.innerHeight];
        }

        // Adding sgment to slither if mass allow us to do it
        if (this.state.slitherWeight - this.state.segmentNumber * 10 >= this.state.segmentWeigth) {
            this.addSegment()
        }

        /**
         * If slither speed = fast(8)(normal(4) - main speed ) then weight of slither must decrease
         */
        if (this.state.slitherSpeed > this.speed.normal) {

            this.setState({
                slitherWeight: this.state.slitherWeight - 0.5
            })
            if(this.state.slitherWeight - this.state.segmentNumber * 10 < this.state.segmentWeigth && this.state.segmentNumber >= 10) {
                this.deleteSegment()
            }
        }

        /**
         * We are must add some food
         * So below a code that adds food to window
         */

        if (this.food.amount < 20) {
            this.addFood()
        }

        /**
         * If there is not enough weight in slither then speed dropping to normal
         */
        if (this.state.segmentNumber <= 10 && this.state.slitherSpeed > this.speed.normal) {
            {this.setState({
                slitherSpeed: this.speed.normal
            })}
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
            <div className="window" id="window" style={{overflow: "hidden"}}>
                <div style={{
                    backgroundColor: "red",
                    height: "50px",
                    left: "-50px",
                    position: "absolute",
                    width: "50px"
                }} />
                {this.backGround.coords.map((x, i) => <img src={this.backGround.image} style={{
                    left: `${x[0]}px`,
                    position: "absolute",
                    top: `${x[1]}px`,
                    zIndex: -2
                }} key={i}/>)}
                {this.state.segmentCoords.map((x, i) => <img src={slither_body_img_1} style={{
                    left: `${x[0]}px`,
                    position: "absolute",
                    top: `${x[1]}px`,
                    width: `${this.state.segmentSize}px`,
                    zIndex: this.state.segmentNumber - i
                }} key={i} />)}
                {this.food.coords.map((x, i) => <div style={{
                    backgroundColor: `rgb(${x[0] / 5}, ${x[1] / 4}, ${(x[1]+x[2]) / 7})`,
                    border: "none",
                    height: "20px",
                    left: `${x[0]}px`,
                    position: "absolute",
                    top: `${x[1]}px`,
                    width: "20px",
                    zIndex: -1
                }} key={i} />)}
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