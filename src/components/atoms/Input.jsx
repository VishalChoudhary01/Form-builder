import React from 'react';
import { motion } from 'framer-motion';

export default function Input({ 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  className = '', 
  ...rest 
}) {
  return (
    <motion.input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border border-gray-300  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white  text-gray-800  ${className}`}
      whileFocus={{ 
        scale: 1.01,
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)" 
      }}
      transition={{ duration: 0.2 }}
      {...rest}
    />
  );
}