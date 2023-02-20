import {dictionary, findWords, generateRandomWord, convertor} from './wordChecking.js'

const playBtn = document.querySelector(".play")
const findBtn = document.querySelector(".find")
const options = document.querySelector(".options")
const form = document.querySelector("form")
const timer = document.querySelector(".timer")
const select = document.querySelector('select')
const backBtn = document.querySelector(".backBtn")
const input = document.querySelector(".input")
const messageNote = document.querySelector(".messageNote")
const solveBtn = document.querySelector(".solveBtn")
const result = document.querySelector(".result")

document.addEventListener("contextmenu", e => e.preventDefault());

function initalDisplay(){
    options.style.display = "none"
    form.style.display = "none"
    backBtn.style.display = "block"
}

const play = () => {
    function finish(){
        const words = [...findWords(slova, "", letterNum, 0)]
                      .sort((a, b) => b.length - a.length)
        answer.innerText = "Naša reč ima " + words[0].length + " slova: " + words[0].toUpperCase()
        for(const element of [submitBtn, checkBtn, deleteBtn])
            element.style.pointerEvents = "none"
        for(let element of [...document.querySelectorAll(".letter")])
            element.style.pointerEvents = "none"
    }
    function isWordValid(){
        let wordToCheck = currentWord.innerText
        let key = wordToCheck.split("").sort().join("")
        if(!wordToCheck.length)
            return false

        if(wordToCheck.length && dictionary[key]){
            for(let word of dictionary[key])
                if(word == wordToCheck)
                    return true            
        }
        return false
    }
    //krajnja poruka kad je zavrseno vreme ili je potvrdjena rec
    function writeMessage(){
        if(!currentWord.innerText.length)
            message.innerText = "Vaša reč nema slova!"
        else{
            if(isWordValid())
                message.innerText = `Vaša reč ${currentWord.innerText} je validna i ima ${currentWord.innerText.length} slova!`
            else message.innerText = `Ne znam gde ste našli tu reč`
        }
        finish()
        clearInterval(interval)
        return 
    }
    //resetuje podesavanja
    function reset(){
        clearInterval(interval)
        options.style.display = "grid"
        form.style.display = "block"
        timer.innerText = 60
        for(let element of [timer, word, letters, backBtn, answer, message])
            element.style.display = "none"
    }

    initalDisplay()
    timer.style.display = "block"

    backBtn.addEventListener("click", reset)
    const chars = [] // predstavlja unete karakter u stek redosledu

    const letterNum = parseInt(select.value)
    const letters = document.createElement("div")
    letters.classList.add("letters")

    const word = document.createElement("div")
    word.classList.add("word")

    const currentWord = document.createElement("p")
    const row1 = document.createElement("div")
    const row2 = document.createElement("div")

    const deleteBtn = document.createElement("div")
    deleteBtn.classList.add("btn", "deleteBtn")
    deleteBtn.innerHTML = "&times;"

    deleteBtn.addEventListener("click", () => {
        if(chars.length){
            message.innerText = ""
            const last = chars.pop()
            last.style.opacity = 1
            last.style.pointerEvents = "auto"
            let newWord = chars.slice().map(e => e.innerText).join("")
            currentWord.innerText = newWord
        }
    })

    const checkBtn = document.createElement("div")
    checkBtn.classList.add("btn", "checkBtn")
    checkBtn.innerHTML = "?"
    

    checkBtn.addEventListener("click", () => {
        if(isWordValid())
            message.innerText = "Reč je validna!"
        else {
            if(!currentWord.innerText.length)
                message.innerText = "Nema unetih slova!"
            else message.innerText = "Reč nije validna!"
        }
    })

    const submitBtn = document.createElement("div")
    submitBtn.classList.add("btn", "submitBtn")
    submitBtn.innerHTML = "&#10003;"
    
    submitBtn.addEventListener("click", writeMessage)

    const message = document.createElement("p")
    message.classList.add("message")

    const answer = document.createElement("div")
    answer.classList.add("answer")
    
    word.appendChild(deleteBtn)
    word.appendChild(checkBtn)
    word.appendChild(currentWord)
    word.appendChild(submitBtn)
    
    document.body.appendChild(letters)
    document.body.appendChild(word)
    document.body.appendChild(message)
    document.body.appendChild(answer)

    const slova = generateRandomWord(letterNum)
    
    for(let i = 1; i <= letterNum; i++){
        const letter = document.createElement("div")
        
        letter.classList.add("letter")
        letter.innerText = slova[i-1]

        letter.addEventListener("click", e => {
            message.innerText = ""
            e.target.style.opacity = 0.2
            e.target.style.pointerEvents = "none"
            currentWord.innerText += e.target.innerText
            chars.push(e.target)
        })

        if(i <= letterNum / 2) row1.appendChild(letter)
        else row2.appendChild(letter)
    }
    row1.style.display = "flex"
    row2.style.display = "flex"
    letters.appendChild(row1)
    letters.appendChild(row2)

    const interval = setInterval(() => {
        timer.innerText = timer.innerText - 1
        if(timer.innerText == 0)
            writeMessage()
    }, 1000)
}

const find = () => {
    initalDisplay()
    backBtn.addEventListener("click", () => {
        options.style.display = "grid"
        form.style.display = "block"
        input.style.display = "none"
        input.value = ""
        messageNote.style.display = "none"
        solveBtn.style.display = "none"
        result.innerText = ""
    })
    input.style.display = "block"
    messageNote.style.display = "block"
    solveBtn.style.display = "block"
    
    solveBtn.addEventListener('click', () => {
        const slova = input.value.toUpperCase().split(",")
        const letters = []

        if (!input.value.length){
            result.innerText = ""
            return alert("Unesite karaktere")
        }

        for (let i = 0; i < slova.length; i++) {
            if (!convertor[slova[i]]) {
                result.innerText = ""
                return alert("Uneli ste nevalidan karkter")
            }
            letters.push(convertor[slova[i]])
        }

        if (!input.value.includes(",") && input.value.length != 1)
            return alert("Ne validan sadržaj")

        if (letters.length > 20)
            return alert("Prevelika reč!")
        
        const words = [...findWords(letters, "", slova.length, 0)]
                      .sort((a, b) => b.length - a.length)
        let res = ""
        const end = words.length >= 100 ? 100 : words.length
        for(let i = 0; i < end; i++)
            res += `${words[i]} ----> ${words[i].length} slova` + "\n"
        
        result.innerText = res
    })
}
playBtn.addEventListener("click", play)
findBtn.addEventListener("click", find)
