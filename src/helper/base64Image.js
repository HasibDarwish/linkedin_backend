import axios from "axios"

export const convertUrlToBase64Image = async (link) => {
    const breakIt = link.split("/")
    const image = breakIt[breakIt.length - 1]
    const breakItAgain = image.split(".")
    const {name, extension} = breakItAgain

    const request = await axios.get(link, { responseType: "arraybuffer" })
    const convert = await request.data.toString("base64")
    const base64Image = `data:image/${extension};base64,${convert}`
    return base64Image
}