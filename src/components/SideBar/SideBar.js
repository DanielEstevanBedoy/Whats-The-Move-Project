import './SideBar.css'
import SidebarLink from './SideBarLink'

function Sidebar(){
    return(
      <div className="sidebar">
      <SidebarLink text="Home" to="/" />
      <SidebarLink text="Calendar" to="/CalendarPage" />
      <SidebarLink text="Following" to="/FollowingPage" />      
      </div>
    );
  }
  
  export default Sidebar;