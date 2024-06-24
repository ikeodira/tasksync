import CurrentUser from "./current-user"
import { Layout, Space } from "antd"

function Header() {
  const headerStyles:React.CSSProperties = {
    background:'#fff',
    display:'flex',
    justifyContent:'flex-end',
    alignItems:'center',
    padding: '0 24px',
    position:'sticky', 
    top:0,
    zIndex:999,    
  }
  return (
    <Layout.Header style={headerStyles}>
      <Space>
      <CurrentUser />
      </Space> 
    </Layout.Header>

  )
}

export default Header
