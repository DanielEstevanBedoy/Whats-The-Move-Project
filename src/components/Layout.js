
import Nav from './Nav'

export default function Layout({children}){
  return(
  <div>
    <Nav/>
    <main>{children}</main>
  </div>);
}








// import '../SideBar/SideBar.css';
// import SidebarLink from './SideBar/SideBarLink';

// function Layout({ children }) {
//   return (
//     <div className="layout">
//       <Sidebar />
//       <div className="content">{children}</div>
//     </div>
//   );
// }

// function Sidebar() {
//   return (
//     <div className="sidebar">
//       <SidebarLink text="Home" to="/" />
//       <SidebarLink text="Calendar" to="/CalendarPage" />
//       <SidebarLink text="Following" to="/FollowingPage" />
//     </div>
//   );
// }

// export default Layout;
