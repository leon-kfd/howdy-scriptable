async function getData() {
    const target = 'https://kongfandong.cn/api/movieLines'
    const { img1, img2, img3, img4, link, name, quotes } = await (new Request(target)).loadJSON()
    const randomImgArr = [img1, img1, img2, img3, img4].filter(Boolean)
    const randomImgIdx = ~~(Math.random() * randomImgArr.length)
    const randomImg = randomImgArr[randomImgIdx]
    const wallpaperImg = randomImg.replace('original', 'w780')
    const img = await (new Request(wallpaperImg)).loadImage()
    return { name, link, quotes, img }
}
  
const widget = new ListWidget()
const { name: movieName, link, quotes, img } = await getData()
widget.backgroundImage = img
widget.url = link

const content = widget.addStack()
content.setPadding(0, 0, 10, 0)
const quotesText = content.addText(quotes)
quotesText.lineLimit = 3
quotesText.textColor = Color.white()
quotesText.font = Font.boldSystemFont(18)
quotesText.shadowRadius = 2
quotesText.shadowOffset = new Point(1, 1)


const footer = widget.addStack()
footer.setPadding(10, 0, 0, 0)
footer.addSpacer()
const footerText = footer.addText(`——『 ${movieName} 』`)
footerText.lineLimit = 1
footerText.shadowRadius = 2
footerText.shadowOffset = new Point(1, 1)
footerText.textColor = Color.white()
footerText.rightAlignText()

if (config.runsInWidget) {
    Script.setWidget(widget)
} else {
    widget.presentMedium()
}
Script.complete()