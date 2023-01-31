import {getAllFilePath} from "@/lib/api.mjs";
import styles from '@/styles/Default.module.less'
import {List} from "antd";
import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router";
import React from "react";

export default function Comment({allData}: any) {
    const router = useRouter()
    const {type, sub} = router.query as any;
    const title = `${sub}-${type}-文章分类`

    const menu: any = allData.find((item: any) => item.label === type).children.find((item: any) => {
        return item.label === sub
    }).children.sort((a: any, b: any) => {
        return new Date(a.data.date) > new Date(b.data.date) ? -1 : 1
    });

    return (
        <main className={styles.container}>
            <Head>
                <title>{title}</title>
                <meta name={'keywords'} content={`${sub},${type}`} />
                <meta name={'description'} content={`所有${type}-${sub}分类下的所有文章`} />
            </Head>
            <div style={{padding: 20}}>
                <List
                    bordered
                    dataSource={menu}
                    renderItem={(item: any) => (
                        <List.Item key={item.label}>
                            <Link href={`/post/${type}/${sub}/${item.label}`} className={styles.itemBetween}>
                                <span>{item.label?.replace(/_/g, ' ')}</span>
                                <span>{item.data.date.split(' ')[0]}</span>
                            </Link>
                        </List.Item>
                    )}
                />
            </div>
        </main>
    )
}

export async function getStaticPaths() {
    const allFile = getAllFilePath()
    const paths: any[] = [/*{params: {type: 'web', sub: 'css'}}*/]

    allFile.forEach((typeItem: any) => {
        typeItem.children.forEach((subItem: any) => {
            paths.push({
                params: {
                    type: typeItem.label,
                    sub: subItem.label,
                }
            })
        })
    })

    return {paths, fallback: false}
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
