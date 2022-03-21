import React, { Component } from "react";
import "../css/pathfind.css";

class GridObject{
    constructor(x,y,) {
        this.x = x
        this.y = y
        this.state = "normal"
        this.color = "black"
        this.before = null
    }
    AddToPath(before) {
        this.before = before
        this.color = "green"
        this.state = "path"
    }
    setBoxState(state) {
        if (this.state === state) {
            this.state = "normal"
            this.color = "black"
            // this.that.state.gridelements[this.y][this.x].style.background="black";
            return
        } else if (state === "start"){
            this.color = "green"
            // this.that.state.gridelements[this.y][this.x].style.background="green";
        } else if (state === "end"){
            this.color = "red"
            // this.that.state.gridelements[this.y][this.x].style.background="red";
        } else if (state === "border"){
            this.color = "blue"
            // this.that.state.gridelements[this.y][this.x].style.background="blue";
        }
        this.state = state
    }
}

class Pathfind extends Component {
    constructor() {
        super()
        this.updateInputValueWidth = this.updateInputValueWidth.bind(this)
        this.updateInputValueHeight = this.updateInputValueHeight.bind(this)
        this.switchClickMode = this.switchClickMode.bind(this)
        this.changeBoxState = this.changeBoxState.bind(this)
        this.generateGridObjects = this.generateGridObjects.bind(this)
        this.runPathFinder = this.runPathFinder.bind(this)
        this.pathFindStarter = this.pathFindStarter.bind(this)
        this.gridReset = this.gridReset.bind(this)

        this.state={
            width:10,
            height:10,
            gridelements:[],
            gridobjects: [],
            startpoint:false,
            endpoint:false,
        }
    }
    updateInputValueWidth(event){
        this.setState({
            width:parseInt(event.target.value),
            gridobjects:[]
        })
    }
    updateInputValueHeight(event){
        this.setState({
            height:parseInt(event.target.value),
            gridobjects:[]
        })
    }

    marginWidthCalc(){
        let magicnumber = 0.65;
        let viewportwidth = window.innerWidth;
        let viewportheight  = window.innerHeight;
        let marginfromwidth = parseInt((viewportwidth*(1-magicnumber))/(2*this.state.width))
        let marginfromheight = parseInt((viewportheight*(1-magicnumber))/(2*this.state.height))
        let boxwidthfromwidth = parseInt((viewportwidth*magicnumber)/this.state.width)
        let boxwidthfromheight = parseInt((viewportheight*magicnumber)/this.state.height)
        return{
            margin:boxwidthfromwidth>boxwidthfromheight?marginfromheight:marginfromwidth,
            width:boxwidthfromwidth>boxwidthfromheight?boxwidthfromheight:boxwidthfromwidth,
        }
    }
    switchClickMode(ev) {
        ev.preventDefault()
        this.setState({
            clickmode : ev.target.name
        })

    }
    changeBoxState(ev){
        let x = parseInt(ev.target.getAttribute("x"));
        let y = parseInt(ev.target.parentNode.getAttribute("y"));

        this.setState(
            {
                gridobjects:this.state.gridobjects.map((line,yind) => {
                    if (y === yind) {
                        return line.map((object,xind) => {
                            if (x === xind) {
                                object.setBoxState(this.state.clickmode);
                            }
                            return object

                        })
                    } return line
                }),
                startpoint:this.state.clickmode === "start"?this.state.gridobjects[y][x]:this.state.startpoint,
                endpoint:this.state.clickmode === "end"?this.state.gridobjects[y][x]:this.state.endpoint
            }
        )
    }
    generateGridObjects() {
        this.state.endpoint = false
        this.state.startpoint = false
        this.state.gridobjects = []
        for (let y = 0; y < this.state.height;y++){
            let line = [];
            for (let x = 0; x< this.state.width;x++){
                line.push(new GridObject(x,y))
            }
            this.state.gridobjects.push(line);
        }
    }

    async runPathFinder() {
        let calcers = [[0,1],[1,0],[0,-1],[-1,0]]
        let opentorun = [this.state.startpoint]
        console.log(this.state.endpoint.x)
        console.log(this.state.endpoint.y)
        while (true) {
            let endofpaths = []
            for(let i =0;i<opentorun.length;i++) {
                let item = opentorun[i]
                for (let m = 0; m < calcers.length; m++){
                    try{
                        // alert(item.y + calcers[m][0])
                        let newitem = this.state.gridobjects[item.y + calcers[m][0]][item.x + calcers[m][1]]
                        if(newitem.before === null && newitem !== this.state.startpoint && newitem.state !== "border"){
                            newitem.AddToPath(item)
                            endofpaths.push(newitem)
                            if (endofpaths[endofpaths.length -1].x === this.state.endpoint.x && endofpaths[endofpaths.length-1].y === this.state.endpoint.y) {
                                return endofpaths[endofpaths.length-1]
                            }
                            this.forceUpdate()
                        } else {
                            console.log(newitem.x+","+newitem.y);
                        }
                    } catch{
                        continue;
                    }
                }
            }
            opentorun = endofpaths.map((item)=> {return item})
            console.log(opentorun);
            await new Promise(resolve => setTimeout(resolve,300))
        }
    }
    async pathFindStarter() {
        this.drawpath(await this.runPathFinder())
    }
    drawpath(lastnode) {
        let node = lastnode
        while (true) {
            node.color = "purple"
            if (node.before === null) break
            node = node.before
        }
        this.forceUpdate()
    }
    gridReset(){
        this.generateGridObjects()
        this.forceUpdate()
    }
    render() {
        if(this.state.gridobjects.length !== this.state.height ||this.state.gridobjects[0].length !== this.state.width){
            this.generateGridObjects();
        }
        let boxstyles = this.marginWidthCalc();
        const boxelements = this.state.gridobjects.map(function(line,y) {
            return (<div className="gridline" y={y} style={{height:boxstyles.width,marginBlock:boxstyles.margin}} key={y}>{line.map(function(object){
                return (
                    <div key={object.x} onClick={this.changeBoxState} x={object.x} className="gridRect" style={{background:object.color,width:boxstyles.width + "px",height:boxstyles.width + "px",marginInline:boxstyles.margin + "px"}}></div>
                )
            }.bind(this))}</div>)
        }.bind(this))
        return (
            <div id="pathfind">
                <input type="number" placeholder="höhe" onChange={this.updateInputValueHeight}></input>
                <input type="number" placeholder="breite" onChange={this.updateInputValueWidth}></input>
                <button name = "start" onClick={this.switchClickMode} style={{background:this.state.clickmode === "start"?"green":"lightgrey"}}>START</button>
                <button name = "end" onClick={this.switchClickMode} style={{background:this.state.clickmode === "end"?"green":"lightgrey"}}>END</button>
                <button name = "border" onClick={this.switchClickMode} style={{background:this.state.clickmode === "border"?"green":"lightgrey"}}>BORDER</button>
                <br/>
                <button name="execute" onClick={this.pathFindStarter}>EXECUTE</button>
                <button name="reset" onClick={this.gridReset}>RESET</button>
                <h1>{this.state.height}</h1>
                {boxelements}
            </div>
        )
    }
}
export default Pathfind