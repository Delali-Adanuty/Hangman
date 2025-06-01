import Header from "./Header"
import Status from "./Status"
import { languages } from "../data/languages"
import Chips from "./Chips"
import { useState } from "react"
import Word from "./Word"
import Keyboard from "./Keyboard"
import { getFarewellText } from "../data/utils"
import { getRandomWord } from "../data/utils"
import Confetti from "react-confetti"

export default function App(){
    const [currentWord, setCurrentWord] = useState(() => getRandomWord());
    const [guessedLetters, setGuessedLetters] = useState([])

    

    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    const wrongGuessCount = guessedLetters.length - guessedLetters.filter(item => new Set(currentWord).has(item)).length;
    const isGameWon = currentWord.split('').every(item => guessedLetters.includes(item));
    const isGameLost = languages.length - 1 === wrongGuessCount
    const isGameOver = isGameLost || isGameWon
    const isLastGuessedCorrect = guessedLetters && currentWord.split('').includes(guessedLetters[guessedLetters.length-1])
    


    function addGuessedLetter(letter){
        setGuessedLetters(prev => 
            prev.includes(letter) ? prev : [...prev, letter]
        )
    }

    const keyboardElements=alphabet.split('').map((item) => {
        let classname= ""
        if(guessedLetters.includes(item)){
             classname = currentWord.split('').includes(item) ? "green":"red"
        }
        return(
            <button 
            key={item} 
            onClick={() => addGuessedLetter(item)} 
            className={classname} 
            disabled={isGameOver}
            >
                {item.toUpperCase()}
            </button>
        )
    })

    const langugageChips = languages.map((item, index) => {
        const classname = index < wrongGuessCount ? "lost" : ""
        return (
            <span key={index} style={{backgroundColor:item.backgroundColor, color:item.color}} className={classname}>{item.name}</span>
        )
    })

    const letterElements = currentWord.split('').map((item, index) => {
        return(
            <span key={index}>
                
                {isGameLost ? item.toUpperCase() : guessedLetters.includes(item)? item.toUpperCase():""}
                </span>
        )
    })

    function newGame(){
        setCurrentWord(() => getRandomWord())
        setGuessedLetters([])
    }
    return(
        <>
        {isGameWon && <Confetti />}
        <Header />
        <Status
            over = {isGameOver} 
            won={isGameWon}
            lost = {isGameLost}
            farewell={wrongGuessCount > 0 && getFarewellText(languages[wrongGuessCount-1].name)}
            lastGuess= {isLastGuessedCorrect}
        />
        <Chips
        data={langugageChips}
         />
         <Word  data={letterElements}/>
         <Keyboard data={keyboardElements} />
         {isGameOver &&
            <section className="bottom">
            <button className="new" onClick={newGame}>New Game</button>
         </section>}
        </>
    )
}