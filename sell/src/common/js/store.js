// webkit浏览器存储
export function saveToLocal (id, key, value) {
  // 设置本地缓存的localStorage自定义属性__seller__
  let seller = localStorage.__seller__
  if (!seller) {
    seller = {}
    seller[id] = {}
  } else {
    // 因为localStorage本地缓存的默认格式为JSON，所以在获取本地缓存的时候，需要调用JSON.parse方法，将JSON转化为JS的字符串
    seller = JSON.parse(seller)
    if (!seller[id]) {
      seller[id] = {}
    }
  }
  seller[id][key] = value
  // JSON.stringify方法将JS对象或值转换为JSON字符串
  localStorage.__seller__ = JSON.stringify(seller)
}

export function loadFromLocal (id, key, def) {
  let seller = localStorage.__seller__
  if (!seller) {
    return def
  }
  seller = JSON.parse(seller)[id]
  if (!seller) {
    return def
  }
  let ret = seller[key]
  return ret || def
}
