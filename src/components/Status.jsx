export default function Section(props){
    return(
        <section className={`game-status ${props.over ? (props.won ? "won":"lost"):"" }`}>
            {props.over ? (
                <>
                <h2>{props.won? "You win": "You Lose"}</h2>
                <p>{props.won? "Well done!": "Prepare to learn assembly!"}</p>
                </>
            ) : 
                <>
                    {!props.lastGuess && 
                    <p>{props.farewell}</p>
                    }
                </>
            }


        </section>
    )
}