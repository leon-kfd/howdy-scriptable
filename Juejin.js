const widget = await createWidget()
if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentLarge()
}
Script.complete()

async function loadImg (url) {
  const req = new Request(url)
  return await req.loadImage()
}

async function httpGet (url) {
  const req = new Request(url)
  return await req.loadJSON()
}

async function createWidget() {
  // 获取掘金最新文章列表
  const { list } = await httpGet('https://kongfandong.cn/api/juejinList')

  const articleList = list.map(item => {
    const { title, link_url, article_id, digg_count } = item
    return { title, link_url, article_id, digg_count }
  })

  let widget = new ListWidget()
  widget.setPadding(10, 10, 10, 10)
  widget.backgroundImage = await loadImg(`https://kongfandong.cn/api/randomPhoto?w=800&h=600`)

  // 头部容器显示Logo
  const header = widget.addStack()
  header.size = new Size(0, 36)
  const headerLogoImg = header.addImage(await loadImg('https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/apple-touch-icon.png'))
  headerLogoImg.imageSize = new Size(24,24)
  const headerLogoText = header.addText('掘金')
  headerLogoText.textColor = new Color('#0080FF')
  headerLogoText.font = Font.boldSystemFont(18)

  // S: 当组件设置为2X2时，仅能显示Logo，直接Return
  if(config.widgetFamily === 'small') {
    return widget
  }

  header.addSpacer()

  // 列表容器
  const content = widget.addStack()
  content.layoutVertically()
  const listNum = (!config.runsInWidget || config.widgetFamily === 'large') ? 8: 3
  articleList.slice(0,listNum).map(item => {
    const listItem = content.addStack()
    listItem.size = new Size(0, 28)
    const listItemText = listItem.addText(item.title)
    listItemText.font = Font.regularSystemFont(15)
    listItemText.lineLimit = 1
    listItemText.shadowRadius = 2
    listItemText.shadowOffset = new Point(1, 1)
    listItemText.textColor = Color.white()
    listItem.addSpacer()
    const listItemDigg = listItem.addText(`👍${item.digg_count}`)
    listItemDigg.font = Font.regularSystemFont(14)
    listItemDigg.lineLimit = 1
    listItemDigg.shadowRadius = 2
    listItemDigg.shadowOffset = new Point(1, 1)
    listItemDigg.textColor = Color.white()
    listItem.url = `https://juejin.im/post/${item.article_id}`
  })

  widget.addSpacer()

  // 底部容器
  const footer = widget.addStack()
  footer.size = new Size(0, 20)
  footer.addSpacer()
  const DF = new DateFormatter()
  DF.dateFormat = 'yyyy-MM-dd HH:mm'
  const now = DF.string(new Date())
  const footerText = footer.addText(now)
  footerText.font = Font.regularSystemFont(14)
  footerText.lineLimit = 1
  footerText.shadowRadius = 2
  footerText.shadowOffset = new Point(1, 1)
  footerText.textColor = Color.white()

  return widget
}