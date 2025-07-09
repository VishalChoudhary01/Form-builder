import { useState } from 'react';
import Select from '../atoms/Select';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import { useDispatch } from 'react-redux';
import { addField } from '../redux/templateSlice';
import { fieldTypes } from '../utils/fieldTypes';
import { MdOutlinePlaylistAddCheck } from "react-icons/md";
import { motion } from 'framer-motion';

export default function FieldForm({ templateId, sectionId }) {
  const [fieldType, setFieldType] = useState('Text');
  const [label, setLabel] = useState('');
  const dispatch = useDispatch();

  const handleAdd = () => {
    if (label.trim()) {
      dispatch(
        addField({
          templateId,
          sectionId,
          field: {
            type: fieldType,
            label,
          },
        })
      );
      setLabel('');
      setFieldType('Text');
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
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Field Label"
        className='flex-1 font-medium'
      />
      <Select
        value={fieldType}
        onChange={(e) => setFieldType(e.target.value)}
        options={fieldTypes}
        className="flex-1"
      />
      <Button 
        buttonOnClick={handleAdd} 
        rightIcon={<MdOutlinePlaylistAddCheck className="text-xl" />} 
        buttonText={"Add Field"}
        buttonStyle="bg-blue-600 hover:bg-blue-700 text-white"
      />
    </motion.div>
  );
}