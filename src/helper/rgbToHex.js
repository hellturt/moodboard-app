
const convertRGB = rgb => {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};

const rgbToHex = (r, g, b) => {
    const red = convertRGB(r)
    const green = convertRGB(g)
    const blue = convertRGB(b)

    console.log(`Converting rgb(${r}, ${g}, ${b}) into #${red + green + blue}`)

    return red + green + blue;
}

export default rgbToHex;