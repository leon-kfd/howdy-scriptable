async function getGreyImg(img) {
  let ctx = new DrawContext()
  ctx.size = img.size
  ctx.drawImageInRect(img, new Rect(0, 0, img.size['width'], img.size['height']))
  ctx.setFillColor(new Color("#000000", 0.7))
  ctx.fillRect(new Rect(0, 0, img.size['width'], img.size['height']))
  let res = await ctx.getImage()
  return res
}

async function loadBackground () {
  const randomImgURL = 'https://hodwz.deno.dev/unsplash/random?w=400&h=200&keyword=Nature'
  const randomImg = await loadImageByURL(randomImgURL)
  const greyImg = await getGreyImg(randomImg)
  return greyImg
}

async function loadJsonByURL (url) {
  const req = new Request(url)
  return await req.loadJSON()
}

const widget = new ListWidget()

const backgroundImg = await loadBackground(imgURL)
widget.backgroundImage = backgroundImg

const sentenceURL = `https://favqs.com/api/qotd`
const { body: text, author } = await loadJsonByURL(sentenceURL) 

const textEl = widget.addText(text)
textEl.textColor = Color.white()
textEl.font = Font.boldSystemFont(18)
textEl.shadowRadius = 2
textEl.shadowOffset = new Point(1, 1)

const authorEl = widget.addText(`${author}`)
authorEl.textColor = Color.white()
authorEl.font = Font.boldSystemFont(18)
authorEl.shadowRadius = 2
authorEl.shadowOffset = new Point(1, 1)
authorEl.rightAlignText()


if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentLarge()
}
Script.complete()