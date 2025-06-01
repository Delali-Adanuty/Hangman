import Header from "./Header"
import Status from "./Status"
import { languages } from "../data/languages"
import Chips from "./Chips"
import { useState, useEffect } from "react"
import Word from "./Word"
import Keyboard from "./Keyboard"
import { getRandomWord } from "../data/utils"
import Confetti from "react-confetti"
import LIfeBar from "./LifeBar"

export default function App(){
    const [currentWord, setCurrentWord] = useState(() => getRandomWord());
    const [guessedLetters, setGuessedLetters] = useState([])
    const totalGuesses = 8
    

    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    const wrongGuessCount = guessedLetters.length - guessedLetters.filter(item => new Set(currentWord).has(item)).length;
    const remainingGuesses = totalGuesses - wrongGuessCount
    const isGameWon = currentWord.split('').every(item => guessedLetters.includes(item));
    const isGameLost = languages.length - 1 === wrongGuessCount
    const isGameOver = isGameLost || isGameWon
    const isLastGuessedCorrect = guessedLetters && currentWord.split('').includes(guessedLetters[guessedLetters.length-1])
    
    function letterListener(){
        useEffect(() => {
            if (isGameOver) return;
            const handleKeyDown = (event) => {
                const key = event.key;

                if(/^[a-zA-Z]$/.test(key)){
                    setGuessedLetters(prev => prev.includes(key) ? prev : [...prev, key])
                }
            }

            window.addEventListener("keydown", handleKeyDown);
            
            return () => {
                window.removeEventListener("keydown", handleKeyDown);
            }

        }, [isGameOver])
    }

    letterListener();

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
        <Header  attempt = {remainingGuesses}/>
        <LIfeBar left={remainingGuesses}/>
        <Status
            over = {isGameOver} 
            won={isGameWon}
            lost = {isGameLost}
            lastGuess= {isLastGuessedCorrect}
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