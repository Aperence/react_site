import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';

const Sidebar = (props) => {
  return (
    <div className="sidebar">
      <CDBSidebar textColor="#fff" backgroundColor="#1b1b1b">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
            Profile
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
              <CDBSidebarMenuItem icon="images" onClick={() => props.changePage("img")}>Image</CDBSidebarMenuItem>

              <CDBSidebarMenuItem icon="lock-open" onClick={() => props.changePage("password")}>Passwords</CDBSidebarMenuItem>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
            {props.name}
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
  );
};

export default Sidebar;