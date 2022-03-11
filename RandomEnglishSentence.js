async function loadImageByURL (url) {
  const req = new Request(url)
  return await req.loadImage()
}

async function loadJsonByURL (url) {
  const req = new Request(url)
  return await req.loadJSON()
}

const widget = new ListWidget()

const imgURL = `https://hodwz.deno.dev/unsplash/random?w=800&h=600`
const backgroundImg = await loadImageByURL(imgURL)
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