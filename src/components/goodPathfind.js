import { Component } from "react";
import {Grid} from '../classes/Grid'
import '../css/goodpathfind.css'

class GoodPathFind extends Component{
    constructor(props) {
        super(props)
        this.oldheight = 60
        this.oldwidth = 60
        this.width = 16*2
        this.height = parseInt(this.width / (window.innerWidth/window.innerHeight))
        this.clickmode = "border"
        this.grid = new Grid(this.width,this.height,this.handleElementHover,this.updateMe)
        this.gridEl = this.grid.renderElement(this.handleElementHover)
        this.HandleModeChange = this.HandleModeChange.bind(this);

        this.state = {grid:this.grid}
    }

    updateMe =(grid) =>  {
        this.setState({grid:grid})
    }
    onHeightChange(event) {
        this.oldwidth = this.width
        this.height = event.target.value;
    }
    onWidthChange(event) {
        this.oldheight = this.height
        this.height = event.target.value;
    }

    handleElementHover = (event,x,y) => {
        if (event.buttons || event.type==="click") {
            this.grid.setMode(x,y,this.clickmode)
            // this.gridEl = this.grid.renderElement(y,this.handleElementHover);
            this.setState({grid:this.grid})
        }
    }

    HandleModeChange(event) {
        this.clickmode = event.target.value;
        let activeButtons = document.querySelector('.activeButton')
        if(activeButtons && activeButtons !== undefined){
            activeButtons.classList.remove('activeButton');
        }
        event.target.classList.add('activeButton')
    }

    startPathFinder = async () => {
        await this.grid.aStarAlgorithm();
    }

    render() {
        // this.gridEl = this.grid.renderElement(this.handleElementHover)
        console.log("Render");
        return (
            <div>
                <div className="controls">
                    <button onClick={this.HandleModeChange} value="StartPoint">StartPoint</button>
                    <button onClick={this.HandleModeChange} value="Endpoint">Endpoint</button>
                    <button onClick={this.HandleModeChange} value="border">Border</button>
                    <button onClick={this.startPathFinder} value="Execute">Execute</button>
                    <button onClick={() =>  {
                        this.grid = new Grid(this.width,this.height,this.handleElementHover,this.updateMe)
                        this.forceUpdate();
                        this.setState({grid:this.grid})
                    }} value="Reset">Reset</button>
                </div>
                {this.grid.renderElement()}
            </div>
        )
    }
}
export default GoodPathFind