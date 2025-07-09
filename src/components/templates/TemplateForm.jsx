// src/components/templates/TemplateForm.jsx
import { useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { useDispatch, useSelector } from 'react-redux';
import { addTemplate } from '../../redux/slice/templateSlice';
import { MdFormatListBulletedAdd } from "react-icons/md";
import { motion } from 'framer-motion';

export default function TemplateForm() {
  const [title, setTitle] = useState('');
  const dispatch = useDispatch();
  const templates = useSelector(state => state.template.templates);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && templates.length < 5) {
      dispatch(addTemplate(title));
      setTitle('');
    }
  };

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold text-gray-800 ">Create New Template</h2>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <Input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Template Name" 
            className="w-full"
          />
        </div>
        <Button 
          buttonType='submit'
          buttonText={"Create Template"}
          disabled={templates.length >= 5}
          rightIcon={<MdFormatListBulletedAdd className="text-xl"/>}
          buttonStyle={`${templates.length >= 5 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-900'} text-white flex items-center gap-2`}
        />
        {templates.length >= 5 && (
          <p className="text-red-500 text-sm mt-1 w-full">
            Maximum of 5 templates reached. Delete a template to create a new one.
          </p>
        )}
      </form>
    </motion.div>
  );
}