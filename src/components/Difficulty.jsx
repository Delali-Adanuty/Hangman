export default function Difficulty(props){
    return(
        <>
            <section className="difficulty">
                {props.data}
            </section>        
            <section className="difficulty-info">
                <p>You lose a life for every incorrect guess</p>
                {props.difficulty === "Medium" ? 
                <p>Every hint costs a life</p> : 
                props.difficulty === "Hard" ? 
                <p>Every hint costs 2 lives!</p> : 
                <p>Hints are free!</p>}
            </section>
        </>
    )
}