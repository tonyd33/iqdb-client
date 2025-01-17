export function parseSimilarity(txt: string): number | null {
    const result = txt.match(/(-?\d+\.?\d*)(%?)/)
    if (result) {
        return (result[2] == undefined || result[2] == '') ? parseFloat(result[1]) : parseFloat(result[1]) / 100
    } else {
        return null//couldn't parse similarity
    }
}
export function parseSizeAndType(txt: string) {
    const result = txt.match(/(\d+)×(\d+)(?: \[([A-z]*)\])?/)
    if (result) {
        return {
            size: {
                width: parseInt(result[1]),
                height: parseInt(result[2])
            }, type: result[3]
        }
    } else {
        return txt
    }
}
const baseArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "@", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "_"]
export function randomFileName() {
    const length = 5 + (Math.random() * 10 | 0)
    const baseArrayLength = baseArray.length
    let str = ''
    for (let i = 0; i < length; i++) {
        str += baseArray[Math.random() * baseArrayLength | 0]
    }
    return str + '.jpg'
}
