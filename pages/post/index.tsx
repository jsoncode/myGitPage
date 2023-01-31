import {getAllFilePath} from "@/lib/api.mjs";
import styles from '@/styles/Default.module.less'
import {List} from "antd";
import Head from "next/head";
import Link from "next/link";
import React from "react";

export default function Comment({allData}: any) {
    const menu: any = allData.map((item: any) => {
        return {
            label: item.label,
            children: item.children
        }
    })
    return (
        <main className={styles.container}>
            <Head>
                <title>我的博客-文章分类</title>
                <meta name={'keywords'} content={'我的博客,文章分类'}/>
                <meta name={'description'} content={'我的博客：列出了所有文章的一级目录。'}/>
            </Head>
            <div style={{padding: 20}}>
                <List
                    bordered
                    dataSource={menu}
                    renderItem={(item: any) => (
                        <List.Item key={item.label}>
                            <Link href={`/post/${item.label}`} className={styles.itemBetween}>
                                <span>{item.label}</span>
                                <span>（{item.children.length}）</span>
                            </Link>
                        </List.Item>
                    )}
                />
            </div>
        </main>
    )
}

export async function getStaticProps() {
    const allData = getAllFilePath()
    return {
        props: {allData}
    }
}
