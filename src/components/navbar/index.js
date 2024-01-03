import React from 'react';
import "./index.css"
import { companyLogo } from '../../assets/images';

const Navbar = () => {
  return (
    <div className='navbar-wrap'>
        <img src={companyLogo} alt="logo" />
    </div>
  )
}

export default Navbar;
