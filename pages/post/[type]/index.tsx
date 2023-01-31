import {getAllFilePath, getMenuList} from "@/lib/api.mjs";
import styles from '@/styles/Default.module.less'
import {List} from "antd";
import Head from "next/head";
import Link from "next/link";
import {useRouter} from "next/router";
import React from "react";

export default function Comment({allData}: any) {
    const router = useRouter()
    const {type}: any = router.query;
    const title = `${type}-文章分类`

    const menu: any = allData.find((item: any) => item.label === type).children.map((item: any) => {
        return {
            label: item.label,
            children: item.children
        }
    })
    return (
        <main className={styles.container}>
            <Head>
                <title>{title}</title>
                <meta name={'keywords'} content={`${type}`}/>
                <meta name={'description'} content={`所有${type}分类下的所有文章`}/>
            </Head>
            <div style={{padding: 20}}>
                <List
                    bordered
                    dataSource={menu}
                    renderItem={(item: any) => (
                        <List.Item key={item.label}>
                            <Link href={`/post/${type}/${item.label}`} className={styles.itemBetween}>
                                <span>{item.label.replace(/_/g,' ')}</span>
                                <span>（{item.children.length}）</span>
                            </Link>
                        </List.Item>
                    )}
                />
            </div>
        </main>
    )
}

export async function getStaticPaths() {
    const menu = getMenuList()
    const paths: any = []

    menu.forEach((item: string) => {
        paths.push({
            params: {
                type: item,
            }
        })
    })

    return {paths, fallback: false}
}

export async function getStaticProps() {
    const allData = getAllFilePath()
    return {
        props: {allData}
    }
}
