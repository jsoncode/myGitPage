import Head from "next/head";
import type {AppProps} from 'next/app'
import LayoutHeaderMenu  from '@/components/LayoutHeaderMenu'
import '@/styles/globals.css'
import React from "react";
import { StyleProvider,legacyLogicalPropertiesTransformer } from "@ant-design/cssinjs";

export default function App({Component, pageProps}: AppProps) {
    return <StyleProvider hashPriority={'high'} transformers={[legacyLogicalPropertiesTransformer]}>
        {/*seo信息*/}
        <Head>
            <title>我的博客</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name={'keywords'} content={''}/>
            <meta name={'description'} content={''}/>
        </Head>
        <LayoutHeaderMenu {...pageProps} />
        <Component {...pageProps} />
    </StyleProvider>
}
