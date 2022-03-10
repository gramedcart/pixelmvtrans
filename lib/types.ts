interface ProjectTextData{
    id:number,
    name:string,
    folder:boolean
    children?: ProjectTextData[]
    text: ProjectText
}

interface ProjectJSON{
    initialLocale: "en_US" | "ja_JP",
    textList:ProjectTextData
}
interface ProjectText{
    en_US?: string,
    ja_JP?: string
} 