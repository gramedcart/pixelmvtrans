interface ProjectTextData{
    id:number,
    name:string,
    folder:boolean
    children?: ProjectTextData[]
    text: ProjectText
}

interface ProjectJSON{
    initialLocale: "en_US" | "ja_JP",
    textList:ProjectTextData[],
    fontList: ProjectFontData[]
}
interface ProjectText{
    en_US?: string,
    ja_JP?: string
} 

interface ProjectFontData{
    letterLayout: string,
    fontName: string
    imageFontFlag: boolean
    imageId: number,
    ttfName: string,
    antialiasDisabled: boolean,
    localeSettings?: LocaleSettings
}

interface LocaleSettings{
    ja_JP?: ProjectFontData,
    en_US?: ProjectFontData
}