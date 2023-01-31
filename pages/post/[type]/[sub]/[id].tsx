import {getAllFilePath, getDetail} from "@/lib/api.mjs";
import styles from '@/styles/Detail.module.less'
import {ClusterOutlined, HistoryOutlined, TagOutlined} from "@ant-design/icons";
import {Menu, MenuProps, Tag, Watermark} from "antd";
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css';
import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.min.css'

export default function Comment({detail, allData}: any) {
    const router = useRouter()
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const [openKeys, setOpenKeys] = useState<string[]>([])
    const {type, sub = ''} = router.query as any;
    const title = `${detail.title?.replace(/_/g, ' ')}-文章详情`
    const leftMenu = allData.find((item: any) => item.label === type)
        .children
        .map((item: any) => {
            return {
                label: item.label,
                key: `/post/${type}/${item.label}`,
                children: item.children.sort((a: any, b: any) => {
                    return new Date(a.data.date) > new Date(b.data.date) ? -1 : 1
                }).map((sub: any) => {
                    return {
                        label: <Link href={`/post/${type}/${item.label}/${sub.label}`}>
                            <span>{sub.label?.replace(/_/g, ' ')}</span>
                        </Link>,
                        key: `/post/${type}/${item.label}/${sub.label}`
                    }
                })
            }
        })

    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys[keys.length - 1]
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    };

    const runImgViewer = () => {
        return new Viewer(document.querySelector('section article') as any, {
            // url: 'data-original'
            loop: false,
            // inline: true,
            // movable: false,
            // filter(image: any) {
            //     return true
            //     // return image.className !== 'copy_icon';
            // }
        })
    }

    const runHighLightJs = () => {
        Array.from(document.querySelectorAll('code[class*="language-"]')).forEach((el: any) => {
            hljs.highlightElement(el);
        });
    }
    useEffect(() => {
        setSelectedKeys([decodeURIComponent(router.asPath)])
        setOpenKeys([decodeURIComponent(router.asPath.replace(/\/[^\/]+$/, ''))])

        document.querySelectorAll('section [data-target="_blank"]').forEach(item => {
            item.setAttribute('target', '_blank')
            item.removeAttribute('data-target')
        })
        runHighLightJs()
        // runComment()
        let viewer = runImgViewer()

        return () => {
            viewer?.destroy?.()
        }
    }, [router])
    return (
        <main>
            <Head>
                <title>{title}</title>
                <meta name={'keywords'} content={`${sub},${type}`} />
                <meta name={'description'} content={`文章详情：${detail.title?.replace(/_/g, ' ')}。`} />
            </Head>
            <section className={styles.section}>
                <div className={styles.leftMenu}>
                    <Menu
                        style={{width: 300}}
                        selectedKeys={selectedKeys}
                        openKeys={openKeys}
                        onOpenChange={onOpenChange}
                        mode="inline"
                        items={leftMenu}
                    />
                </div>
                <div className={styles.rightContent}>
                    <h1 className={styles.title}>{detail.title?.replace(/_/g, ' ')}</h1>
                    <div className={styles.desc}>
                        <span><HistoryOutlined /> {detail.date}</span>
                        <Tag color="blue"><TagOutlined />{detail.tags}</Tag>
                        <Tag color="blue"><ClusterOutlined />{sub.replace(/_/g, ' ')}</Tag>
                    </div>

                    <Watermark content={['我的博客水印']} font={{color: 'rgba(100,100,100,0.05)', fontSize: 20}}>
                        <article
                            className={styles.article}
                            dangerouslySetInnerHTML={{__html: detail.content}}
                        />
                    </Watermark>
                    {detail.url && <div>
                        <p>
                            本文由我的原始笔记迁移而来：原始链接
                        </p>
                        <p>
                            <a href={detail.url} data-target={'_blank'}>{detail.url}</a>
                        </p>
                    </div>}
                </div>
            </section>
        </main>
    )
}

export async function getStaticPaths() {
    const allFile = getAllFilePath()
    const paths: any = []
    allFile.forEach((typeItem: any) => {
        typeItem.children.forEach((subItem: any) => {
            subItem.children.forEach((md: any) => {
                paths.push({
                    params: {
                        type: typeItem.label,
                        sub: subItem.label,
                        id: md.label,
                    }
                })
            })
        })
    })
    return {paths, fallback: false}
}

export async function getStaticProps({params}: any) {
    const detail = getDetail({
        type: params.type,
        sub: params.sub,
        id: params.id
    } as any)
    const allData = getAllFilePath({
        needDetail: true,
        fields: ['date']
    })
    return {
        props: {detail, allData}
    }
}
