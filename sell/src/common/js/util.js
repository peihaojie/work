// 解析url参数
// @example ?id=peihaojie&qq=784184859
// @return Object {id:peihaojie,qq:784184859}

export function urlParse () {
  // window.location获取url,url.search方法获取问好及后面的内容
  let url = window.location.search
  let obj = {}
  // 正则表达式，获取?和&之后的内容
  let reg = /[?&][^?&]+=[^?&]+/g
  // match方法，接收一个正则，存放匹配结果的数组。
  let arr = url.match(reg)
  // ['?id=peihaojie','&qq=784184859']
  if (arr) {
    arr.forEach((item) => {
      // substring方法提取字符串中介于两个指定下标之间的字符，及去掉？和&
      // split方法将字符串拆分为数组，以=来拆分
      let tempArr = item.substring(1).split('=')
      // decodeURIComponent()方法用于解码由encodeURIComponent方法或者其它类似方法编码的部分统一资源标识符（URI）
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}
