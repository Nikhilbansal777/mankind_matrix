import { useState } from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";

function Sidebar() {
  const [sidebars] = useState([
    { item: "AI and Deep Learning", link: "AI" },
    { item: "Cloud Computing", link: "cloud" },
    { item: "Networking and Interconnect", link: "network" },
    { item: "Automotive solutions", link: "automotive" },
    { item: "Data Center", link: "dataCenter" },
    { item: "Graphics Processing Unit (GPUs)", link: "gpu" },
    { item: "Gaming Products", link: "gaming" },
    { item: "AI SoftwareHardware Products", link: "aiSoftwareAndHardware" },
    { item: "Microchips", link: "microchips" },
  ]);

  return (
    <>
      <div className="sidenav">
        <ul className="sidenav-list">
          <li>
            <h6> PRODUCT CATEGORY </h6>
          </li>
          {sidebars.map((item, index) => {
            return (
              <li key={index} className="sidenav-list-item">
                <Link className="sidenav-content" to={`/${item.link}`} >{item.item}</Link>
              </li>
            );
          })}

        </ul>
      </div>
    </>
  );
}

export default Sidebar;
