
async function loadBackground () {
  const randomImgURL = 'https://kongfandong.cn/api/randomPhoto?w=400&h=200&keyword=Nature'
  const randomImg = await loadImageByURL(randomImgURL)
  return randomImg
}

async function loadVerse () {
  const url = 'https://v1.jinrishici.com/all.json'
  const req = new Request(url)
  const data = await req.loadJSON()
  return data
}

async function loadImageByURL (url) {
  const req = new Request(url)
  return await req.loadImage()
}

const widget = new ListWidget()

const randomImg = await loadBackground()
widget.backgroundImage = randomImg
const {content:randomVerse, origin: title}= await loadVerse()
const url = 'https://hanyu.baidu.com/s?wd=' + encodeURIComponent(title)+ '&from=poem'
widget.url = url
textEl = widget.addText(randomVerse)
textEl.textColor = Color.white()
textEl.font = Font.boldSystemFont(18)
textEl.shadowRadius = 2
textEl.shadowOffset = new Point(1, 1)
textEl.centerAlignText()

if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentMedium()
}
Script.complete()