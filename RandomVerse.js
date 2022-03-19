const fontSizeMap = {
  small: 16,
  medium: 24,
  large: 32
}
const fontSize = fontSizeMap[config.widgetFamily || 'medium']

const loadImage = async (url) => (await new Request(url)).loadImage()

const getGreyImg = async (img, light = 0.4) => {
  const ctx = new DrawContext()
  ctx.size = img.size
  ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
  ctx.setFillColor(new Color("#000000", light))
  ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
  return await ctx.getImage()
}

const loadRandomBg = async () => {
  const randomImgURL = 'https://howdz.deno.dev/unsplash/random?w=768&keyword=Nature'
  const randomImg = await loadImage(randomImgURL)
  const greyImg = await getGreyImg(randomImg)
  return greyImg
}

const loadVerse = async () => (await new Request('https://v1.jinrishici.com/all.json')).loadJSON()

const { content: randomVerse, origin: title }= await loadVerse()
const widget = new ListWidget()
const randomImg = await loadRandomBg()
widget.setPadding(0, fontSize / 2, 0, fontSize / 2)
widget.backgroundImage = randomImg
widget.url = 'https://hanyu.baidu.com/s?wd=' + encodeURIComponent(title)+ '&from=poem'

const textEl = widget.addText(randomVerse)
textEl.textColor = Color.white()
textEl.font = Font.boldSystemFont(fontSize)
textEl.shadowRadius = 2
textEl.shadowOffset = new Point(1, 1)
textEl.centerAlignText()

if (config.widget !== 'small') {
  const footer = widget.addStack()
  footer.setPadding(fontSize, 0, 0, 0)
  footer.addSpacer()
  const footerText = footer.addText(`——『 ${title} 』`)
  footer.font = Font.boldSystemFont(16)
  footerText.lineLimit = 1
  footerText.shadowRadius = 2
  footerText.shadowOffset = new Point(1, 1)
  footerText.textColor = Color.white()
  footerText.rightAlignText()
}


if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentMedium()
}
Script.complete()