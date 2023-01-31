/**
 * 通过node create.js -type 前端 -sub css -title xxx 来创建一篇文章
 */
import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'
import { createInterface } from 'readline/promises'
import { filterName, getMenuList, getSubMenuList } from "./lib/api.mjs";
import * as child_process from "child_process";

let type = '';
let sub = '';
let title = '';
// let tags = '';
// let categories = '';

let typeCan = false;
let subCan = false;
let titleCan = false;

let typeList
let subList
const root = path.resolve('./_posts')
const readline = createInterface({
    input: process.stdin,
    output: process.stdout
})
typeList = getMenuList()

do {
    type = await readline.question(`输入主分类(或数字): ${typeList.map((i, ind) => `${ind}.${i}`).join(', ')}\n`)
    if (!isNaN(type) && !typeList[type * 1] || isNaN(type) && !typeList.includes(type)) {
        let is = await readline.question(`${type}不存在，是否新建一个类型？y/n :`)
        if (is === 'y') {
            typeCan = true
        }
    } else {
        if (!isNaN(type)) {
            type = typeList[type * 1]
        }
        typeCan = true
    }
} while (!typeCan);

subList = getSubMenuList(type)

do {
    sub = await readline.question(`输入子分类(或数字): ${subList.map((i, ind) => `${ind}.${i}`).join(', ')}\n`)
    if (!isNaN(sub) && !subList[sub * 1] || isNaN(sub) && !subList.includes(sub)) {
        let is = await readline.question(`${sub}不存在，是否新建一个分组？y/n :`)
        if (is === 'y') {
            subCan = true
        }
    } else {
        if (!isNaN(sub)) {
            sub = subList[sub * 1]
        }
        subCan = true
    }
} while (!subCan);

// tags = await readline.question(`输入文章标签(可选) :`)
// categories = await readline.question(`输入文章分类(可选) :`)

let hasTitle = false
do {
    title = await readline.question('输入文章标题\n')

    /**
     emoji3 所有emoji
     **/
    let emoji = /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/
    if (title.length > 255) {
        console.log('文件名不能超过255个字符')
    } else if (/^[\s-._]|[\s-._]$/.test(title)) {
        console.log('文件名开头和结尾不能使用：空格、连字符、下划线和英文句号')
    } else if (/(CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9)/i.test(title)) {
        console.log('文件名不能包含Windows保留的任何名称。Windows系统中保留名称包括：CON、PRN、AUX、NUL、COM1、COM2、COM3、COM4、COM5、COM6、COM7、COM8、COM9、LPT1、LPT2、LPT3、LPT4、LPT5、LPT6、LPT7、LPT8 和 LPT9')
    } else if (emoji.test(title)) {
        console.log('文件命中不能使用emoji表情符号')
    } else {
        let file = path.join(root, type, sub, filterName(title) + '.md')
        if (fs.existsSync(file)) {
            hasTitle = true
            let is = await readline.question(`${title}.md 文章已存在, 查看文件(o)或重新输入(r) o/r:`)
            if (is === 'o') {
                titleCan = true
                let cmd = process.platform === 'darwin' ? 'open ' + file : 'start ' + file
                console.log('正在打开文件:', file)
                await child_process.execSync(cmd)
            }
        } else {
            hasTitle = false
            titleCan = true
        }
    }
} while (!titleCan);

if (!fs.existsSync(path.join(root, type))) {
    fs.mkdirSync(path.join(root, type))
}
if (!fs.existsSync(path.join(root, type, sub))) {
    fs.mkdirSync(path.join(root, type, sub))
}
if (!hasTitle) {
    let file = path.join(root, type, sub, filterName(title) + '.md')
    fs.writeFileSync(file, `---
title: ${title}
date: ${dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')}
tags: ${sub}
categories: ${type}
---
...
`, {encoding: 'utf-8'})
    console.log('文章已创建', file)
}
readline.close()
