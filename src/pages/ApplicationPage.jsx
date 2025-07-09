import React, { useState } from 'react';
import TemplateForm from '../components/templates/TemplateForm';
import TemplatesBuilder from '../components/templates/TemplatesBuilder';
import FormGenerator from '../components/templates/FormGenerator';
import { useSelector } from 'react-redux';
import { IoMdBuild } from "react-icons/io";
import { AiOutlineForm } from "react-icons/ai";
import Button from '../components/atoms/Button';
import { motion } from 'framer-motion';

const ApplicationPage = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [activeTab, setActiveTab] = useState('builder');
  const templates = useSelector(state => state.template.templates);

  return (
    <div className='py-24 px-4 flex justify-center min-h-screen'>
      <section className='w-full max-w-6xl flex flex-col bg-white rounded-xl shadow-lg overflow-hidden'>
        <div className="flex flex-wrap border-b border-gray-200">
          <Button 
            buttonText={"Template Builder"} 
            leftIcon={<IoMdBuild className="text-xl"/>} 
            buttonOnClick={() => setActiveTab('builder')} 
            buttonStyle={`py-3 px-6 font-medium flex items-center gap-2 ${
              activeTab === 'builder' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`} 
          />

          <Button 
            buttonText={"Form Generator"} 
            leftIcon={<AiOutlineForm className="text-xl"/>} 
            buttonStyle={`py-3 px-6 font-medium flex items-center gap-2 ${
              activeTab === 'form' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`} 
            buttonOnClick={() => setActiveTab('form')}
          /> 
        </div>
        
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {activeTab === 'builder' ? (
            <motion.div 
              className="flex flex-col gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="bg-white p-5 rounded-lg shadow">
                <TemplateForm />
              </div>
              
              <div className="bg-white p-5 rounded-lg shadow">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Template
                  </label>
                  <select
                    value={selectedTemplateId || ''}
                    onChange={(e) => setSelectedTemplateId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white text-gray-800"
                  >
                    <option value="">Select a template</option>
                    {templates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedTemplateId ? (
                  <TemplatesBuilder templateId={selectedTemplateId} />
                ) : (
                  <motion.div 
                    className="flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-gray-500 text-center">Select or create a template to start building</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <FormGenerator />
          )}
        </div>
      </section>
    </div>
  );
}

export default ApplicationPage;