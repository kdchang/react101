/**
 * Created by simon on 2017/3/10.
 */

// client side 暂存 store，GraphQL Server reponse 会更新 store，再透过 props 传递给 Component
const STORE = {};

// 中国十大名茶
// 碧螺春、
// 西湖龙井、
// 安徽毛峰、
// 安徽瓜片、
// 恩施玉露、
// 福建铁观音、
// 福建银针、
// 云南普洱茶、
// 福建云茶、
// 江西云雾茶

// 日本三大名茶 [PS: 光听名字就不好喝]
// 宇治茶（京都府）、
// 狭山茶（崎玉县）、
// 静冈茶（静冈县）
const teas = [
  { name: '碧螺春', id: 1 },
  { name: '西湖龙井', id: 2 },
  { name: '安徽毛峰', id: 3 },
  { name: '安徽瓜片', id: 4 },
  { name: '恩施玉露', id: 5 },
  { name: '福建铁观音', id: 6 },
  { name: '福建银针', id: 7 },
  { name: '云南普洱茶', id: 8 },
  { name: '福建云茶', id: 9 },
  { name: '江西云雾茶', id: 10 },
  { name: '宇治茶', id: 11 },
  { name: '狭山茶', id: 12 },
  { name: '静冈茶', id: 13 },
]

const chineseTea = {
  id: '1',
  name: 'China',
  teaIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}

const japaneseTea = {
  id: '10086',
  name: 'japan',
  teaIds: [11, 12, 13]
}

const data = {
  contries: [
    chineseTea,
    japaneseTea
  ],

  teas: teas
}

/**
 * 获取所有国家
 * @returns {Array}
 */
export function getContries(names) {
  return names.map(name => {
    if (name === 'China') {
      return data.contries[0];
    }
    if (name === 'japan') {
      return data.contries[1];
    }
    return null;
  });
}

export function getContry(id) {
  return data.contries.filter(contry => contry.id === id)[0]
}

export function getContryByName(name) {
  console.info(name)
  return data.contries.filter(contry => contry.name === name)[0]
}

/**
 * 获取某一个国家的所有茶叶品种
 * @param contryName
 * @returns {Array}
 */
export function getTeas(contryName) {
  const index = data.contries.find(c => c.name === contryName)
  return data.contries[index].teaIds.map(id => teas[id])
}

export function getTea(teaId) {
  return data.teas.filter(tea => tea.id === teaId)[0]
}

export function createTea(name, contryName) {
  const newTea = { name: name, id: teas.length }
  data.teaIds.push(newTea)

  const index = data.contries.find(c => c.name === contryName)
  data.contries[index].teaIds.push(newTea.id)
}



































