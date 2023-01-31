import {getAllFilePath} from "@/lib/api.mjs";
import styles from '@/styles/Home.module.less'
import {List} from "antd";
import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function Home({allData = []}: any) {
    let count;
    let menu: any = []
    allData.map((i: any) => {
        i.children = i.children.map((ii: any) => {
            const subList = ii.children.map((iii: any) => {
                iii.type = i.label;
                iii.sub = ii.label
                iii.path = `/post/${i.label}/${ii.label}/${iii.label}`
                return iii
            })
            menu = menu.concat(subList)
            return ii
        })
        return i
    })
    menu = menu.sort((a: any, b: any) => {
        return new Date(a.data.date) > new Date(b.data.date) ? -1 : 1
    })
    count = menu.length;
    if (menu.length > 10) {
        menu.length = 10;
    }

    return (
        <main className={styles.container}>
            <Head>
                <title>首页</title>
                <meta name={'keywords'} content={''} />
                <meta name={'description'}
                      content={'个人博客网站'} />
            </Head>
            <div className={styles.content}>
                <h3>最新文章：</h3>
                <List
                    bordered
                    dataSource={menu}
                    renderItem={(item: any) => (
                        <List.Item key={item.key}>
                            <Link href={item.path} className={styles.itemBetween}>
                                <span>{item.label}</span>
                                <span>{item.data.date}</span>
                            </Link>
                        </List.Item>
                    )}
                />
                <div>
                    <small>总共：{count} 篇文章</small>
                </div>
            </div>
        </main>
    )
}

export async function getStaticProps() {
    const allData = getAllFilePath({
        needDetail: true,
        fields: ['date']
    })
    return {
        props: {allData}
    }
}
