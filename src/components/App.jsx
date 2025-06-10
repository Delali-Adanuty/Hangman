import Header from "./Header"
import Status from "./Status"
import { languages } from "../data/languages"
import { useState, useEffect } from "react"
import Word from "./Word"
import Keyboard from "./Keyboard"
import Confetti from "react-confetti"
import LIfeBar from "./LifeBar"
import Difficulty from "./Difficulty"
import { getWordAndHint } from "../data/ai"

export default function App(){

    const [currentWord, setCurrentWord] = useState(null);
    const [hints, setHints] = useState(null)
    const [guessedLetters, setGuessedLetters] = useState([])
    const totalGuesses = 8;
    const difficulties = ["Easy", "Medium", "Hard"];
    const [difficulty, setDifficulty] = useState("Medium");
    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    const wrongGuessCount = guessedLetters.length - guessedLetters.filter(item => new Set(currentWord).has(item)).length;
    const remainingGuesses = totalGuesses - wrongGuessCount
    const isGameWon = currentWord ? currentWord.split('').every(item => guessedLetters.includes(item)): null;
    const isGameLost = languages.length - 1 === wrongGuessCount
    const isGameOver = isGameLost || isGameWon
    const isGameInProgress = !isGameOver && remainingGuesses !== totalGuesses;
    const isLastGuessedCorrect = currentWord ? guessedLetters && currentWord.split('').includes(guessedLetters[guessedLetters.length-1]): null

    useEffect(() => {
        async function fetchWord(){
            const [word, newHints] = await getWordAndHint(difficulty);
            setCurrentWord(word)
            setHints(newHints)
        }

        fetchWord()
    }, [difficulty])

    function LetterListener(){
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

        }, [])
    }

    LetterListener();

    function addGuessedLetter(letter){
        setGuessedLetters(prev => 
            prev.includes(letter) ? prev : [...prev, letter]
        )
    }

    const difficultyElements = difficulties.map((item, index) => {
        return <span key={index} onClick={() => changeDifficulty(item)} className={`${difficulty === item ? "current" : null} ${item.toLowerCase()}`}>{item}</span>
    })  

    function changeDifficulty(item){
        !isGameInProgress && setDifficulty(item);
        setGuessedLetters([])
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

    const letterElements = currentWord ? currentWord.split('').map((item, index) => {
        return(
            <span key={index} className={isGameLost && !guessedLetters.includes(item) ? "red":""}>
                
                {isGameLost ? item.toUpperCase() : guessedLetters.includes(item)? item.toUpperCase():""}
                </span>
        )
    }):null

    async function newGame(){
        const [word,  newHints] = await getWordAndHint(difficulty)
        setCurrentWord(word)
        setGuessedLetters([])
        setHints(newHints)
    }
    return(
        <>
        <Header />
        <Difficulty data={difficultyElements}/>
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
        {isGameWon && <Confetti/>}
        </>
    )
}