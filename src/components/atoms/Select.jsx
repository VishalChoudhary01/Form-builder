import React from 'react';
import { motion } from 'framer-motion';

export default function Select({ 
  options = [], 
  value, 
  onChange, 
  placeholder = 'Select an option', 
  className = '', 
  ...rest 
}) {
  return (
    <motion.select
      value={value}
      onChange={onChange}
      whileFocus={{ 
        scale: 1.01,
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.5)" 
      }}
      className={`border border-gray-300  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white  text-gray-800  appearance-none ${className}`}
      {...rest}
    >
      <option value="" disabled className="text-gray-400">{placeholder}</option>
      {options.map((option, index) => (
        <option 
          key={index} 
          value={option.type || option.value}
          className="text-gray-800 "
        >
          {option.label}
        </option>
      ))}
    </motion.select>
  );
}