import '../css/gridElement.css'

export function GridElement(props) {
    const { handleElementHover,x,y,mode} = props;
    return (
            <div onMouseEnter={(event) => handleElementHover(event,x,y)} onMouseDown={(event) => handleElementHover(event,x,y)} className={"gridelement " + mode}>
            </div>
    )
}