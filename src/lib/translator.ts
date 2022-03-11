import { spawn } from "child_process"
import path from "path"
import detect from "detect-port"
import axios from "axios";

function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
const reg = /\\.\[.+\]|\\.\[\]/g

export class Translator{
    process = spawn(path.join(oPath,"ext","eztrans","EztransServer.exe"))
    constructor(){
    }
    async init():Promise<boolean>{
        console.log("translator init")
        await sleep(2000)
        if(await detect(8000) !== 8000){
            return false
        }
        return true
    }

    
    async translate(text:string) {
        function checker(str:string) {
            const qstr = (str.normalize())
            return (
                str.includes('\\') ||
                str.includes('?')
            )
        }
        try {
            text = text.replaceAll('？', '■')
            // text = text.replaceAll('?', '■')
            if(checker(text)){
                console.log('skip regex')
                return text
            }
            const a =  await axios.get(
                'http://localhost:8000/',
                {
                    params: {
                        text: text
                    },
                    timeout: 1000
                }
            )
            const c:string = a.data
            // if(c.includes('?')){
            //     console.log('includes unknown')
            //     return text
            // }
            return c.replaceAll('■', '？')
        } catch (error) {
            console.log(text)
            console.log(text.length)
            try {
                console.log(await detect(8000))
                try {
                    this.process.kill()
                } catch (error) {
                    console.log('error when killing')
                }

                this.process = spawn(path.join(oPath,"ext","eztrans","EztransServer.exe"))
                console.log('new pro')
                await sleep(3000)
            } catch (error) {}
            return text
        }
    }
}