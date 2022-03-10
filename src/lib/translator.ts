import { spawn } from "child_process"
import path from "path"
import detect from "detect-port"
import axios from "axios";

function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
        try {
            const a =  await axios.get(
                'http://localhost:8000/',
                {
                    params: {
                        text: text
                    },
                    timeout: 10000
                }
            )
            return a.data
        } catch (error) {
            console.log(text)
            return text
        }
    }
}