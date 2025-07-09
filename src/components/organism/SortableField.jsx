import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { MdDragIndicator } from 'react-icons/md';
import { MdEditNote } from "react-icons/md";
import { motion, AnimatePresence } from 'framer-motion';

export default function SortableField({ id, field, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [fieldLabel, setFieldLabel] = useState(field.label);
  const [fieldOptions, setFieldOptions] = useState(
    field.type === 'enum' ? (field.options || []).join(', ') : ''
  );
  const [fieldRequired, setFieldRequired] = useState(field.required || false);
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto'
  };

  const handleSave = () => {
    const updates = { 
      label: fieldLabel,
      required: fieldRequired
    };
    
    if (field.type === 'enum') {
      updates.options = fieldOptions.split(',').map(opt => opt.trim()).filter(opt => opt);
    }
    
    onUpdate(updates);
    setIsEditing(false);
  };

  const renderFieldPreview = () => {
    switch (field.type) {
      case 'label-h1':
        return <h1 className="text-2xl font-bold text-gray-800 ">{field.label}</h1>;
      case 'label-h2':
        return <h2 className="text-xl font-bold text-gray-800 ">{field.label}</h2>;
      case 'label-h3':
        return <h3 className="text-lg font-bold text-gray-800 ">{field.label}</h3>;
      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input 
              type="text" 
              className="w-full p-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white  text-gray-800 " 
              placeholder="Enter text"
              required={field.required}
            />
          </div>
        );
      case 'number':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input 
              type="number" 
              className="w-full p-2 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white  text-gray-800 " 
              placeholder="Enter number"
              required={field.required}
            />
          </div>
        );
      case 'boolean':
        return (
          <div className="flex items-center">
            <input 
              type="checkbox" 
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-slate-500"
              required={field.required}
            />
            <label className="ml-2 block text-sm text-gray-700 ">
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );
      case 'enum':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700  mb-1">
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white  text-gray-800 " required={field.required}>
              <option value="">Select an option</option>
              {field.options?.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      default:
        return <div className="text-gray-800 ">{field.label}</div>;
    }
  };

  return (
    <motion.div 
      ref={setNodeRef} 
      style={style}
      {...attributes}
      className="bg-white  p-4 rounded-lg border border-gray-200  mb-3 shadow-sm"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.2 }}
    >
      {isEditing ? (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Input
            value={fieldLabel}
            onChange={(e) => setFieldLabel(e.target.value)}
            placeholder="Field Label"
            className="w-full"
          />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`required-${id}`}
              checked={fieldRequired}
              onChange={(e) => setFieldRequired(e.target.checked)}
              className="h-4 w-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
            />
            <label htmlFor={`required-${id}`} className="ml-2 block text-sm text-gray-700 ">
              Required
            </label>
          </div>
          
          {field.type === 'enum' && (
            <div>
              <label className="block text-sm font-medium text-gray-700  mb-1">
                Options (comma separated)
              </label>
              <Input
                value={fieldOptions}
                onChange={(e) => setFieldOptions(e.target.value)}
                placeholder="Option 1, Option 2, ..."
                className="w-full"
              />
            </div>
          )}
          
          <div className="flex justify-between gap-2">
            <Button 
              buttonText={"Save"}
              rightIcon={<FaSave />}
              buttonOnClick={handleSave}
              buttonStyle="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            />
            <Button 
              onClick={() => setIsEditing(false)} 
              rightIcon={<FaTimes />}
              buttonText={"Cancel"}
              buttonStyle="bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
            />
          </div>
        </motion.div>
      ) : (
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {renderFieldPreview()}
          </div>
          <div className="flex gap-2 ml-4">
            <Button 
              buttonText={<MdEditNote className="text-lg" />} 
              buttonOnClick={() => setIsEditing(true)} 
              buttonStyle="text-blue-500 hover:text-blue-700 p-1"
            />
            <Button  
              buttonText={<FaTrash className="text-lg" />} 
              buttonOnClick={onDelete} 
              buttonStyle="text-red-500 hover:text-red-700 p-1"
            />
            <div 
              {...listeners}
              className="cursor-grab text-gray-400 hover:text-gray-600 p-1"
              title="Drag to reorder"
            >
              <MdDragIndicator className="text-xl" />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}