import React from 'react';
import {Link} from 'react-router-dom';
import "./SideBarLink.css";


function SidebarLink({ text,to }) {
  return(
    <div className="link" >
        <Link to={to}>
        <h2>{text}</h2>
        </Link>
    </div>
  );
}
export default SidebarLink;