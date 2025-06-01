import {words} from './words'

export function getRandomWord(){
    const random = Math.floor(Math.random() * words.length);
    return words[random]
}
