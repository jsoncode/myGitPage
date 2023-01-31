import fs from 'fs'
import { join, resolve } from 'path'
import MarkdownIt from 'markdown-it'

const root = process.cwd()
const postsDirectory = join(root, '_posts')

// 读取一级目录
export function getMenuList() {
    return fs.readdirSync(postsDirectory)
}

// 读取二级目录
export function getSubMenuList(type) {
    if (fs.existsSync(join(postsDirectory, type))) {
        return fs.readdirSync(join(postsDirectory, type))
    } else {
        return []
    }
}

export function getDetail({type = '', sub = '', id = '', fullPath: fp}) {
    let fullPath = fp || join(postsDirectory, type, sub, `${id}.md`)
    if (!fs.existsSync(fullPath)) {
        return {}
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    let {data, content} = matter(fileContents)

    // 替换图片地址到公共目录，才能在编译后，通过http访问到。
    content = content.replace(/..\/..\/..\/public/g, '')
    let html = new MarkdownIt({
        html: true, // 气用html标签
        linkify: true, // 将类似URL的文本自动转换为链接
        breaks: true, // 转换段落里的 '\n' 到 <br>
    }).render(content);

    html = html.replace(/<a[^>]*>/g, (result) => {
        result = result.replace(/<a/, '<a referrer-policy="no-referrer"')
        // 添加target会导致 React Waring: Prop `dangerouslySetInnerHTML` did not match
        return result.replace(/<a/, '<a data-target="_blank" ')
    })

    return {
        type,
        sub,
        id,
        content: `<div>${html}</div>`,
        ...data,
    }
}

export function getAllFilePath(params) {
    const {
        dir = postsDirectory,
        parentName = '',
        needDetail = false,
        fields = []
    } = params || {};
    let list = fs.readdirSync(dir)
    list = list.map((i) => {
        let fullPath = resolve(dir, i)
        if (fs.statSync(fullPath).isDirectory()) {
            return {
                label: i,
                key: parentName + i,
                children: getAllFilePath({
                    dir: fullPath,
                    parentName: i,
                    needDetail,
                    fields
                }) || []
            }
        } else {
            if (i.endsWith('.md')) {
                i = i.replace(/\.md$/, '')
                let result = {
                    label: i,
                    key: parentName + i
                }
                if (needDetail) {
                    let obj = {}
                    let data = getDetail({fullPath})
                    fields?.forEach((str) => {
                        obj[str] = data[str]
                    })
                    result.data = obj;
                }
                return result;
            } else {
                return null
            }
        }
    }).filter((i) => i !== null && (!i.children || i.children?.length > 0))
    return list
}

function matter(md) {
    let content = '';
    let data = {}
    let result = md.match(/^\s*-{3,}[\s\S]*?-{3,}/)
    if (result) {
        result = result[0]
        content = md.replace(result, '').trim()
        let list = result.replace(/-{3,}\n?/g, '').trim()
        if (list) {
            list = list.split(/\s*\n\s*/)
            if (list.length > 0) {
                list.forEach((item) => {
                    let [_, key, value] = item.match(/^([^:]+)\s*:\s*(.*)/)
                    try {
                        data[key] = /^['"]|['"]$/.test(value) ? eval(value) : value || ''
                    } catch (e) {
                        data[key] = value
                    }
                })
            }
        }
    }

    return {
        data,
        content,
    }
}

export function filterName(name) {
    return name.replace(/^[\s-._]|[\s-._]$/g, '').replace(/['"*?\\\/|:<>]/)
}
