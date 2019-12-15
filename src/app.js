import React from 'react'
import { ConfigProvider, Layout, Menu, Icon, Tabs } from 'antd'
import { StickyContainer, Sticky } from 'react-sticky'
import { DndProvider, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import zhCN from 'antd/es/locale/zh_CN'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabList: []
        }
        this.menuClick = this.menuClick.bind(this)
        this.addTabs = this.addTabs.bind(this)
        this.changeTab = this.changeTab.bind(this)
        this.editTab = this.editTab.bind(this)
        this.remove = this.remove.bind(this)
    }
    menuClick(item) {
        this.addTabs(item)
    }
    addTabs(target) {
        const tabIndex = this.state.tabList.findIndex(tabPane => tabPane.key === target.key)
        const stateSetObj = {
            currentTabKey: target.key,
        }
        if (tabIndex === -1) {
            this.state.tabList.push({
                title: `${target.item.props.title}`,
                key: target.key,
                content:<div>this is tab{this.state.tabList.length}page {target.item.props.title}</div>,
            })
            stateSetObj.tabList = this.state.tabList
        }
        this.setState(stateSetObj)
    }
    changeTab(targetTabKey) {
        this.setState({
            currentTabKey: targetTabKey,
        })
    }
    editTab(targetKey, action) {
        this[action](targetKey)
    }
    remove(targetKey) {
        const stateSetObj = {}
        if (targetKey === this.state.currentTabKey) {
            const targetIndex = this.state.tabList.findIndex(tabPane => tabPane.key === targetKey)
            stateSetObj.currentTabKey = this.state.tabList[(this.state.tabList.length + targetIndex - 1) % this.state.tabList.length].key
        }
        stateSetObj.tabList = this.state.tabList.filter(tabPane => tabPane.key !== targetKey)
        this.setState(stateSetObj)
    }
    render() {
        return (
            <ConfigProvider locale={zhCN}>
                <Layout>
                    <Layout.Sider collapsible
                                  style={{position: 'fixed', left: 0, height: 'calc(100vh - 48px)', overflowY: 'scroll', overflowX: 'hidden'}}
                    >
                        <SiderMenu onSiderMenuClick={this.menuClick}></SiderMenu>
                    </Layout.Sider>
                    <Layout.Content style={{marginLeft: 200}}>
                        <StickyContainer>
                            <Tabs hideAdd
                                  renderTabBar={(props, DefaultTabBar) => (
                                    <Sticky bottomOffset={80}>
                                      {({ style }) => (
                                        <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff' }} />
                                      )}
                                    </Sticky>
                                  )}
                                  onChange={this.changeTab} 
                                  activeKey={this.state.currentTabKey} 
                                  type="editable-card" 
                                  onEdit={this.editTab}
                                  style={{minHeight: '100vh'}}
                            >
                                {this.state.tabList.map(pane => (
                                    <Tabs.TabPane tab={pane.title} key={pane.key}>
                                        {pane.content}
                                        <div style={{height: 2000}}></div>
                                    </Tabs.TabPane>
                                ))}
                            </Tabs>
                        </StickyContainer>
                    </Layout.Content>
                </Layout>
            </ConfigProvider>
        )
    }
}

class SiderMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            menuList: [
                {
                    title: '系统设置',
                    icon: 'setting',
                    key: '1',
                    children: [
                        {
                            title: '参数设置',
                            icon: 'control',
                            key: '2',
                        }
                    ]
                },
                {
                    title: '项目监控',
                    icon: 'dashboard',
                    key: '4',
                    children: [
                        {
                            title: '监控基本设置',
                            icon: 'tool',
                            key: '8',
                        }
                    ]
                },
                {
                    title: '商城管理',
                    icon: 'shopping-cart',
                    key: '16',
                    children: [
                        {
                            title: '商城首页轮播图',
                            icon: 'picture',
                            key: '32',
                        }
                    ]
                },
                {
                    title: '卡系统管理',
                    icon: 'credit-card',
                    key: '64',
                    children: [
                        {
                            title: '产品管理',
                            icon: 'gift',
                            key: '128',
                        }
                    ]
                },
                {
                    title: '统一支付平台',
                    icon: 'pay-circle',
                    key: '256',
                    children: [
                        {
                            title: '商家管理',
                            icon: 'shop',
                            key: '512',
                        },
                        {
                            title: '商家分组',
                            icon: 'apartment',
                            key: '1024',
                        },
                        {
                            title: '认证中心',
                            icon: 'audit',
                            key: '2048',
                            children: [
                                {
                                    title: '商家查询',
                                    icon: 'search',
                                    key: '4096',
                                },
                            ]
                        },
                    ]
                },
            ]
        }
        this.menuClick = this.menuClick.bind(this)
    }
    menuClick(item) {
        if (typeof this.props.onSiderMenuClick === 'function') {
            this.props.onSiderMenuClick(item)
        }
    }
    getChildrenMenu(menuList) {
        return menuList.map(menu => {
            if (menu.children && menu.children.length > 0) {
                return <Menu.SubMenu key={menu.key} 
                                     title={
                                               <span>
                                                   <Icon type={menu.icon}/>
                                                   <span>{menu.title}</span>
                                               </span>
                                           }    
                >
                    {this.getChildrenMenu(menu.children)}
                </Menu.SubMenu>
                
            } else {
                return <Menu.Item key={menu.key} onClick={this.menuClick} title={menu.title}>
                    <Icon type={menu.icon}/>
                    <span>{menu.title}</span>
                </Menu.Item>
            }
        })
    }
    render() { 
        return <Menu theme="dark" mode="inline">
            {this.getChildrenMenu(this.state.menuList)}
        </Menu>
    }
}

export default App