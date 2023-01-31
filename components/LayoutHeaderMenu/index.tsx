import styles from '@/components/LayoutHeaderMenu/Header.module.less'
import useWidth from "@/hook/useWidth";
import {
    ClusterOutlined,
    DesktopOutlined,
    GlobalOutlined,
    HomeOutlined,
    InteractionOutlined,
    MenuOutlined,
    MobileOutlined, PartitionOutlined, ReadOutlined,
} from '@ant-design/icons'
import {Breadcrumb, Button, Menu, MenuProps} from 'antd'
import Link from 'next/link';
import {useRouter} from "next/router";
import React, {useEffect, useState} from 'react';

export default function LayoutHeader({allData = []}: any) {
    const width = useWidth()
    const router = useRouter()
    const {type = '', sub = ''} = router.query as any;
    const [selectedKeys, setSelectedKeys] = useState<string[]>(['/'])
    const [showNav, setShowNav] = useState(false)
    const [openKeys, setOpenKeys] = useState<string[]>([]);
    const [menuMode, setMenuMode] = useState<'vertical' | 'horizontal' | 'inline'>(width > 768 ? 'horizontal' : 'inline');

    const icons = [
        {icon: <GlobalOutlined />},
        {icon: <MobileOutlined />},
        {icon: <DesktopOutlined />},
        {icon: <InteractionOutlined />},
    ]
    let menu: any = [
        {
            label: <Link href="/" onClick={e => toggleNav(e, false)}>
                <span>首页</span>
            </Link>,
            icon: <HomeOutlined />,
            key: '/',
        }
    ];

    menu = menu.concat(allData.map((item: any, index: number) => {
        return {
            label: item.label,
            key: `/post/${item.label}`,
            icon: icons[index].icon,
            children: item.children.map((sub: any) => ({
                label: <Link href={`/post/${item.label}/${sub.label}`} onClick={e => toggleNav(e, false)}>
                    <span>{sub.label?.replace(/_/g, ' ')}</span>
                    <small>({sub.children.length})</small>
                </Link>,
                key: `/post/${item.label}/${sub.label}`
            }))
        }
    }))
    const onOpenChange: MenuProps['onOpenChange'] = (keys) => {
        const latestOpenKey = keys[keys.length - 1]
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    };

    function toggleNav(e: any, toggle: boolean) {
        e.stopPropagation()
        setShowNav(toggle)
    }

    useEffect(() => {
        setMenuMode(width > 768 ? 'horizontal' : 'inline')
    }, [width])

    useEffect(() => {
        let key: string = router.asPath
        if (key.startsWith('/post')) {
            let open: any = key.match(/\/post\/[^\/]+/)
            let selected: any = key.match(/\/post\/[^\/]+\/[^\/]+/)
            if (open) {
                open = open[0]
                open = decodeURIComponent(open)
            }

            if (width > 768) {
                setSelectedKeys([open])
            } else {
                setOpenKeys([open || key])
                if (selected) {
                    selected = selected[0]
                    selected = decodeURIComponent(selected)
                    setSelectedKeys([selected])
                }
            }
        } else {
            setSelectedKeys([key])
        }
    }, [router, width])

    return <header className={styles.header}>
        <div className={styles.headerContent}>
            <nav className={styles.nav}>
                <div className={styles.left}>
                    <Link href={'/'} className={styles.logo}>
                        首页
                    </Link>
                </div>
                <div className={`${styles.right} ${showNav ? styles.showNav : ''}`} onClick={e => toggleNav(e, false)}>
                    <div className={styles.rightInnerMenu} onClick={e => toggleNav(e, true)}>
                        <div className={styles.menuLogo}>
                            我的博客
                        </div>
                        <Menu
                            selectedKeys={selectedKeys}
                            openKeys={openKeys}
                            onOpenChange={onOpenChange}
                            mode={menuMode}
                            items={menu}
                        />
                    </div>
                </div>
            </nav>

            <div className={styles.BreadcrumbWrap}>
                <div className={styles.mobileNav}>
                    <Link href={'/'} className={styles.logo}>
                        首页
                    </Link>

                    <div className={styles.toggleWrap}>
                        <Button id="toggleHeaderNav" onClick={e => toggleNav(e, true)}>
                            <MenuOutlined />
                        </Button>
                    </div>
                </div>
                <Breadcrumb className={styles.Breadcrumb}>
                    <Breadcrumb.Item>
                        <Link href="/"><HomeOutlined /> 首页</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link href={`/post`}><ReadOutlined /> 我的博客</Link>
                    </Breadcrumb.Item>
                    {type && <Breadcrumb.Item>
                        <Link href={`/post/${type}`}><PartitionOutlined />{type}</Link>
                    </Breadcrumb.Item>
                    }
                    {sub && <Breadcrumb.Item>
                        <Link href={`/post/${type}/${sub}`}><ClusterOutlined />{sub.replace(/_/g, ' ')}</Link>
                    </Breadcrumb.Item>
                    }
                </Breadcrumb>
            </div>
        </div>
    </header>
}
