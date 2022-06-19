import { GridObject } from './GridObject'
import '../css/grid.css'

export class Grid{
    constructor(width,height,handleElementHover,update) {
        this.width = width
        this.height = height
        this.initalizeRows();
        this.rowsEl = []
        this.handleElementHover = handleElementHover
        this.updateParent = update;
    }

    getNeighbours = (x,y) => {
        let calcers = [[1,0],[0,1],[-1,0],[0,-1],[1,1],[0,0],[-1,-1],[1,-1],[-1,1]]
        let neighbours = []
        for (let i = 0; i< calcers.length; i++){
            if (y+calcers[i][1] >= 0 && y+calcers[i][1] < this.rows.length)
                if (x+calcers[i][0] > 0 && x+calcers[i][0] < this.rows[0].length)
                    if (this.rows[y+calcers[i][1]][x+calcers[i][0]].mode === "" || this.rows[y+calcers[i][1]][x+calcers[i][0]].mode === "Endpoint")
                        neighbours.push(this.rows[y+calcers[i][1]][x+calcers[i][0]])
        }
        return neighbours;
    }

    insertInStack = (element) => {
        for (let i = 0; i< this.elementStack.length;i++) {
            if (element.calcDistToGoal(this.endpoint[0],this.endpoint[1]) < this.elementStack[i].calcDistToGoal(this.endpoint[0],this.endpoint[1])) {
                this.elementStack.splice(i,0,element)
                return;
            }
        }
        this.elementStack.push(element);
    }


    aStarAlgorithm= async () => {
        if(!this.startpoint || !this.endpoint) {
            return;
        }
        this.elementStack = [this.rows[this.startpoint[1]][this.startpoint[0]]];
        while (true) {
            let currentEl = this.elementStack[0]
            let neighbours = this.getNeighbours(currentEl.x,currentEl.y);
            for(let j = 0; j < neighbours.length;j++) {
                if (neighbours[j].mode === "" || currentEl.path.length + 1 < neighbours[j].path.length + 1){
                    neighbours[j].path = currentEl.path;
                    if(!neighbours[j].path.includes(currentEl))
                        neighbours[j].path.push(currentEl);
                    this.setMode(neighbours[j].x,neighbours[j].y,"green");
                    this.insertInStack(neighbours[j])
                }
                if (neighbours[j].mode === "Endpoint") {
                    neighbours[j].path = currentEl.path;
                    neighbours[j].path.push(currentEl);
                    console.log(neighbours[j].path);
                    for (let i = 0; i< neighbours[j].path.length;i++) {
                        this.setModeForce(neighbours[j].path[i].x,neighbours[j].path[i].y,"orange")
                    }
                    this.updateParent(this)
                    return
                }
            }
            await new Promise(resolve => setTimeout(resolve,100))
            this.updateParent(this)
            this.elementStack.splice(this.elementStack.indexOf(currentEl),1);

        }
    }

    initalizeRows() {
        this.rows = []
        for (let y = 0; y < this.height;y++) {
            let row = []
            for (let x = 0; x < this.width;x++) {
                let gridObj = new GridObject(x,y,-1,-1)
                row.push(gridObj)
            }
            this.rows.push(row);
        }        
    }

    setModeForce = (x,y,mode) => {
        this.rows[y][x].mode = this.rows[y][x].mode !== mode ? mode: ""
    }
    setMode = (x,y,mode) => {
        this.rows[y][x].mode = this.rows[y][x].mode !== mode ? mode: ""
        if (mode === "StartPoint") {
            if (this.startpoint)this.rows[this.startpoint[1]][this.startpoint[0]].mode = "";
            this.startpoint = [x,y]
        }
        if (mode === "Endpoint") {
            if (this.endpoint)this.rows[this.endpoint[1]][this.endpoint[0]].mode = "";
            this.endpoint = [x,y]
        }
    }

    // renderRow=(y,handleElementHover) => {
    //     let rowEl = []
    //     for (let x = 0; x < this.width;x++) {
    //         let gridObj = new GridObject(x,y,-1,-1)
    //         gridObj.mode=this.rows[y][x].mode
    //         rowEl.push(gridObj.returnHTML(handleElementHover))
    //     }
    //     this.rowsEl[y] = rowEl;
    // }

    renderElement(){
        this.rowsEl = []
        for (let y = 0; y < this.height;y++) {
            let rowEl = []
            for (let x = 0; x < this.width;x++) {
                rowEl.push(this.rows[y][x].returnHTML(this.handleElementHover))
            }
            this.rowsEl.push(<div className="row" >{rowEl}</div>)
        }
        return (
            <div className='grid'>
                {this.rowsEl}
            </div>
        )
    }

    // renderElement() {
    //     this.rows = []
    //     this.rowsEl =[]
    //     for (let y = 0; y < this.height;y++) {
    //         console.log("pushing")
    //         let row = []
    //         let rowEl = []
    //         for (let x = 0; x < this.width;x++) {
    //             let gridObj = new GridObject(x,y,-1,-1)
    //             row.push(gridObj)
    //             rowEl.push(gridObj.returnHTML(this.handleElementHover))
    //         }
    //         this.rowsEl.push(<div className="row" >{rowEl}</div>)
    //         this.rows.push(row);
    //     }
    //     console.log(this.height,this.width);
    //     return (
    //         <div className='grid'>
    //             {this.rowsEl}
    //         </div>
    //     )
    // }
}