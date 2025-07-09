// src/molecules/SectionForm.jsx
import { useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { useDispatch } from 'react-redux';
import { addSection } from '../redux/templateSlice';
import { RiFileAddLine } from "react-icons/ri";
import { motion } from 'framer-motion';

export default function SectionForm({ templateId }) {
  const [sectionTitle, setSectionTitle] = useState('');
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (sectionTitle.trim()) {
      dispatch(addSection({ templateId, title: sectionTitle }));
      setSectionTitle('');
    }
  };

  return (
    <motion.div 
      className="flex flex-col md:flex-row gap-3 my-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        value={sectionTitle}
        onChange={(e) => setSectionTitle(e.target.value)}
        placeholder="Section Title"
        className="flex-1"
      />
      <Button 
        buttonOnClick={handleAdd} 
        buttonText={"Add Section"}
        rightIcon={<RiFileAddLine className="text-xl" />}
        buttonStyle="bg-teal-600 hover:bg-teal-700 text-white"
      />
    </motion.div>
  );
}