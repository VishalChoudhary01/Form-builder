import React, { useState } from 'react';
import Button from '../atoms/Button';
import { IoIosShareAlt } from "react-icons/io";
import { HiOutlineMenu } from "react-icons/hi";
import Logo from '../atoms/Logo';

const Navbar = ({ onMenuClick }) => {
  return (
    <nav className='md:h-16 fixed w-full h-12 bg-slate-100 flex justify-between items-center px-4 md:px-6'>
      <div className='flex items-center gap-2'>
        {/* Mobile menu button */}
        <button className='md:hidden text-xl' onClick={onMenuClick}>
          <HiOutlineMenu />
        </button>
        <Logo/>
      </div>
      <ul className='hidden md:block'>
        <ul className='hidden md:flex gap-6'>
  <li className='relative after:content-[""] a fter:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px] after:bg-black after:transition-all after:duration-300 after:scale-x-0 hover:after:scale-x-100 hover:after:origin-left'>
    <a
      href="#"
      className='xl:text-[1.1rem]  lg:text-[1.05rem] md:text-[1rem] text-[0.78rem] font-medium text-gray-700'
    >
      Application Form
    </a>
  </li>
</ul>

      </ul>
      <div>
        <Button buttonText={"Share"} rightIcon={<IoIosShareAlt />} buttonStyle={"bg-gray-950 text-slate-50"} />
      </div>
    </nav>
  );
};

export default Navbar;
