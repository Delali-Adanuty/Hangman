import Header from "./Header"
import Status from "./Status"
import { useState, useEffect } from "react"
import Word from "./Word"
import Keyboard from "./Keyboard"
import Confetti from "react-confetti"
import LIfeBar from "./LifeBar"
import Difficulty from "./Difficulty"
import Hint from "./Hint"

export default function App(){

    const [currentWord, setCurrentWord] = useState(null);
    const [hints, setHints] = useState(null)
    const [hintCount, setHintCount] = useState(0);
    const [guessedLetters, setGuessedLetters] = useState([])
    const difficulties = ["Easy", "Medium", "Hard"];
    const [difficulty, setDifficulty] = useState("Easy");
    const totalGuesses = difficulty=== "Easy"? 10 : difficulty === "Medium" ? 8 : 7;
    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    const [hintDamage, setHintDamage] = useState(0);
    const wrongGuessCount = guessedLetters.length - guessedLetters.filter(item => new Set(currentWord).has(item)).length;
    const remainingGuesses = totalGuesses - wrongGuessCount - hintDamage
    const isGameWon = currentWord ? currentWord.split('').every(item => guessedLetters.includes(item)): null;
    const isGameLost = remainingGuesses <= 0
    const isGameOver = isGameLost || isGameWon
    const isGameInProgress = !isGameOver && (guessedLetters.length > 0 || hintDamage > 0 || wrongGuessCount > 0);
    const isLastGuessedCorrect = currentWord ? guessedLetters && currentWord.split('').includes(guessedLetters[guessedLetters.length-1]): null;
    console.log(totalGuesses, remainingGuesses)
    function changeHintCount(){
        setHintCount(prev => ++prev)
        setHintDamage(difficulty === "Medium" ? hintCount + 1 : difficulty === "Hard" ? (hintCount+1)*2 : 0)
    }

    async function fetchWord(){
        const response = await fetch(`/.netlify/functions/getWord?type=${difficulty}`)
        const data = await response.json()
        const [word, newHints] = data
        setCurrentWord(word)
        setHints(newHints)
        setHintCount(0)
    }

    useEffect(() => {
        fetchWord()
    }, [])

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
        return <span key={index} onClick={() => !isGameInProgress && changeDifficulty(item)} className={`${difficulty === item ? "current" : null} ${item.toLowerCase()}`}>{item}</span>
    })  

    function changeDifficulty(item){
        !isGameInProgress && setDifficulty(item);
        !isGameInProgress && newGame();
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
        fetchWord();
        setGuessedLetters([])
        setHintDamage(0)
    }

    
    return(
        <>
        {isGameWon && <Confetti/>}
        <Header />
        <Difficulty data={difficultyElements} difficulty={difficulty}/>
        <LIfeBar left={remainingGuesses}/>
        <Status
            over = {isGameOver} 
            won={isGameWon}
            lost = {isGameLost}
            lastGuess= {isLastGuessedCorrect}
        />    
         <Word  data={letterElements}/>
         <Keyboard data={keyboardElements} />
         <Hint data={hints} handleClick={isGameOver ? null: changeHintCount} count={hintCount}/>
         {isGameOver &&
            <section className="bottom">
            <button className="new" onClick={newGame}>New Game</button>
            </section>}
        
        </>
    )
}