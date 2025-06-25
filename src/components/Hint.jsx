export default function Hint(props){
    const contents = ["Give me a clue!", "I need a Lifeline!", "Help me out!", "One tiny clue?", "I'm stuck... Help"]
    const rand = Math.floor(Math.random() * 5);

    let hintElements
    {props.data ?
     hintElements = props.data.slice(0,props.count).map((item, i) => {
        return (<li key={i}>{item}</li>)
    }): null}
    
    return(
        <section className="hints">
            <button onClick={props.handleClick} disabled = {props.count === 3}>{contents[rand]}</button>
            {props.data && 
            <ul >
                {hintElements}
            </ul>
            }
        </section>
    )
}