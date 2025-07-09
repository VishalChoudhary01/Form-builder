import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Button from '../atoms/Button';
import { motion, AnimatePresence } from 'framer-motion';

export default function FormGenerator() {
  const templates = useSelector(state => state.template.templates);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

 

  const handleInputChange = (fieldId, value) => {
    setFormData({
      ...formData,
      [fieldId]: value
    });
    
    if (errors[fieldId]) {
      setErrors({
        ...errors,
        [fieldId]: ''
      });
    }
  };

  const validateField = (field, value) => {
    if (field.required && !value) {
      return 'This field is required';
    }
    
    if (field.type === 'number' && value && isNaN(Number(value))) {
      return 'Please enter a valid number';
    }
    
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    if (!selectedTemplate) return false;
    
    selectedTemplate.sections.forEach(section => {
      section.fields.forEach(field => {
        const error = validateField(field, formData[field.id]);
        if (error) {
          newErrors[field.id] = error;
          isValid = false;
        }
      });
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save form data to localStorage
      const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
      const submission = {
        id: Date.now(),
        templateId: selectedTemplateId,
        data: formData,
        submittedAt: new Date().toISOString()
      };
      
      submissions.push(submission);
      localStorage.setItem('formSubmissions', JSON.stringify(submissions));
      
      setIsSubmitted(true);
      setFormData({});
    }
  };

  const renderField = (field) => {
    const value = formData[field.id] || '';
    const error = errors[field.id];
    
    switch (field.type) {
      case 'label-h1':
        return <h1 className="text-2xl font-bold text-gray-800 ">{field.label}</h1>;
      case 'label-h2':
        return <h2 className="text-xl font-bold text-gray-800 ">{field.label}</h2>;
      case 'label-h3':
        return <h3 className="text-lg font-bold text-gray-800 ">{field.label}</h3>;
      case 'text':
        return (
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 ">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-ring-500 bg-white  text-gray-800 `}
              placeholder="Enter text"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      case 'number':
        return (
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 ">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300 '} focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white  text-gray-800 `}
              placeholder="Enter number"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      case 'boolean':
        return (
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id={field.id}
              checked={!!value}
              onChange={(e) => handleInputChange(field.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-slate-500"
            />
            <label htmlFor={field.id} className="ml-2 text-gray-700 ">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      case 'enum':
        return (
          <div className="mb-4">
            <label className="block mb-2 text-gray-700 ">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300 '} focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white  text-gray-800 `}
            >
              <option value="">Select an option</option>
              {field.options.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.h2 
        className="text-2xl font-bold mb-6 text-gray-800 "
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Generate Form
      </motion.h2>
      
      <div className="mb-6">
        <label className="block mb-2 text-gray-700 ">Select Template</label>
        <select
          value={selectedTemplateId}
          onChange={(e) => setSelectedTemplateId(e.target.value)}
          className="w-full p-2 border border-gray-300  rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white  text-gray-800 "
        >
          <option value="">Select a template</option>
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>
      
      <AnimatePresence>
        {isSubmitted ? (
          <motion.div 
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p>Form submitted successfully!</p>
              <Button 
                buttonOnClick={() => {
                  setIsSubmitted(false);
                  setSelectedTemplateId('');
                }}
                buttonStyle="mt-2 md:mt-0 bg-transparent text-green-700 hover:text-green-900 hover:bg-green-200 border border-green-700"
                buttonText={"Create another response"}
              />
            </div>
          </motion.div>
        ) : selectedTemplate ? (
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {selectedTemplate.sections.map(section => (
              <motion.div 
                key={section.id} 
                className="p-5 bg-white  border border-gray-200  rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-bold text-lg mb-4 text-gray-800 ">{section.title}</h3>
                
                <div className="space-y-4">
                  {section.fields.map(field => (
                    <div key={field.id} className="mb-4">
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                buttonType='submit' 
                buttonText={"Submit Form"}
                buttonStyle="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
              />
            </motion.div>
          </motion.form>
        ) : (
          <motion.p 
            className="text-gray-500  text-center py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Select a template to generate a form
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}