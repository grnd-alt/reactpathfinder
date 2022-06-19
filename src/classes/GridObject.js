import { GridElement } from "../components/gridElement"

export class GridObject {
    constructor(x,y,goalx,goaly) {
        this.x = x
        this.y = y
        this.mode = ""
        this.calcDistToGoal(goalx,goaly)
        this.path = []
    }
    calcDistToGoal(goalx,goaly) {
        this.distToGoal = Math.sqrt((Math.abs(this.x-goalx)**2) + (Math.abs(this.y-goaly) ** 2))
        return this.distToGoal
    }

    returnHTML(handleElementHover) {
        return (
            <GridElement mode={this.mode} x = {this.x}  y = {this.y} handleElementHover={handleElementHover}></GridElement>
        )
    }
    
}