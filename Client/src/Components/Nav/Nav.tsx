// import { Navbar, NavItem, NavLink } from "react-bootstrap";
// const Nav = () => {
//   return (
//     <Navbar>
//       <NavItem>
//         <NavLink>Home</NavLink>
//       </NavItem>
//     </Navbar>
//   );
// };

// export default Nav;

import Nav from "react-bootstrap/Nav";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../Context";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const LeftNavContainer = styled.div`
  margin-left: auto;
`;
const NavBar = () => {
  const [state, setState] = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setState({ data: null, loading: false, error: null });
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <Nav
      activeKey="/home"
      onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
    >
      <Nav.Item>
        <Nav.Link>
          <Link to={"/"}>Home</Link>
        </Nav.Link>
      </Nav.Item>

      {state.data && (
        <LeftNavContainer>
          <Nav.Item>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav.Item>
        </LeftNavContainer>
      )}
    </Nav>
  );
};

export default NavBar;
