const random = (min, max) => ~~(Math.random() * (max - min)) + min
const letters = ['а', 'б', 'в', 'г', 'д', 'ђ', 'е', 'ж', 'з', 'и', 'ј', 'к', 'л', 'љ', 'м', 'н', 'њ', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ћ', 'џ', 'ш']
export const convertor = {'A':'а','B':'б','V':'в','G':'г','D':'д','Đ':'ђ','DJ':'ђ','E':'е','Ž':'ж','Z':'з','I':'и','J':'ј','K':'к','L':'л','LJ':'љ','M':'м','N':'н','NJ':'њ','O':'о','P':'п','R':'р','S':'с','T':'т','U':'у','F':'ф','H':'х','C':'ц','Č':'ч','Ć':'ћ','DZ':'џ','DŽ':'џ','Š':'ш'}

export const dictionary = 
    await fetch("baza.json")
      .then(res => res.json())
      .then(data => data)
      .catch(err => console.log(err))

export const findWords = (letters, path, depth, index, possibleWords = new Set()) => {
    if(index == depth){
        const anagram = path.split("").sort().join("")
        if(dictionary[anagram])
            for(let word of dictionary[anagram])
                possibleWords.add(word)
        return 
    }
    findWords(letters, path + letters[index], depth, index + 1, possibleWords)
    findWords(letters, path, depth, index + 1, possibleWords)
    return possibleWords
}


export const generateRandomWord = (option) => {
    const keys = Object.keys(dictionary)
    const index = random(0, keys.length)
    const wordLength = random(option - 4, option + 1)
    
    let chars = []
    let l = index, r = index

    while(l >= 0 || r < keys.length){
        if(l >= 0){
            if(keys[l].length == wordLength){
                chars = [...keys[l]]
                break
            }
            l--
        }
        if(r < keys.length){
            if(keys[r].length == wordLength){
                chars = [...keys[r]]
                break
            }
            r++
        }
    }
    for(let i = 0; i < option - wordLength; i++)
        chars.push(letters[random(0, 30)])
    
    for(let i = 0; i < option; i++){
        let rndIndex = random(0, option)
        let temp = chars[i]
        chars[i] = chars[rndIndex]
        chars[rndIndex] = temp 
    }
    return chars
}
