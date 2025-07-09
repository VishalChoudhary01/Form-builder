// src/components/templates/TemplatesBuilder.jsx
import { useDispatch, useSelector } from 'react-redux';
import { 
  addSection, 
  addFieldToSection, 
  updateFieldOrder,
  removeFieldFromSection,
  updateField,
  removeSection,
  updateSectionOrder
} from '../../redux/slice/templateSlice';
import { fieldTypes } from '../../utils/fieldTypes';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Select from '../atoms/Select';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useDraggable,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableField from '../organism/SortableField';
import SortableSection from '../organism/SortableSection';
import { useState } from 'react';
import { FaTrash, FaEdit, FaSave, FaEye, FaGripVertical } from 'react-icons/fa';
import { MdPreview } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';

export default function TemplatesBuilder({ templateId }) {
  const dispatch = useDispatch();
   const { attributes, listeners } = useDraggable({ id: 'drag-handle' });
  const template = useSelector((state) =>
    state.template.templates.find((t) => t.id === templateId)
  );
  const [sectionTitle, setSectionTitle] = useState('');
  const [fieldType, setFieldType] = useState('text');
  const [editingSection, setEditingSection] = useState(null);
  const [sectionEditTitle, setSectionEditTitle] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!template) return <p className="text-gray-500 dark:text-gray-400">Template not found</p>;

  const handleAddSection = () => {
    if (sectionTitle.trim()) {
      dispatch(addSection({ templateId, title: sectionTitle }));
      setSectionTitle('');
    }
  };

  const handleAddField = (sectionId) => {
    dispatch(
      addFieldToSection({
        sectionId,
        field: {
          type: fieldType,
          label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
          required: false,
          ...(fieldType === 'enum' && { options: ['Option 1', 'Option 2'] })
        },
      })
    );
  };

  const handleDragEnd = (event, sectionId) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const section = template.sections.find((s) => s.id === sectionId);
      const oldIndex = section.fields.findIndex((f) => f.id === active.id);
      const newIndex = section.fields.findIndex((f) => f.id === over.id);
      const newFields = arrayMove(section.fields, oldIndex, newIndex);

      dispatch(updateFieldOrder({ templateId, sectionId, newFields }));
    }
  };

  const handleSectionDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = template.sections.findIndex((s) => s.id === active.id);
      const newIndex = template.sections.findIndex((s) => s.id === over.id);
      const newSections = arrayMove(template.sections, oldIndex, newIndex);
      
      dispatch(updateSectionOrder({ templateId, newSections }));
    }
  };

  const handleDeleteField = (sectionId, fieldId) => {
    dispatch(removeFieldFromSection({ sectionId, fieldId }));
  };

  const handleUpdateField = (sectionId, fieldId, updates) => {
    dispatch(updateField({ sectionId, fieldId, updates }));
  };

  const startEditSection = (sectionId, title) => {
    setEditingSection(sectionId);
    setSectionEditTitle(title);
  };

  const saveEditSection = (sectionId) => {
    dispatch(updateField({ 
      sectionId, 
      fieldId: null, 
      updates: { title: sectionEditTitle } 
    }));
    setEditingSection(null);
  };

  const handleDeleteSection = (sectionId) => {
    dispatch(removeSection({ templateId, sectionId }));
  };

  const renderFieldPreview = (field) => {
    switch (field.type) {
      case 'label-h1':
        return <h1 className="text-2xl font-bold mt-4 mb-2 text-gray-800 ">{field.label}</h1>;
      case 'label-h2':
        return <h2 className="text-xl font-bold mt-3 mb-1.5 text-gray-800 ">{field.label}</h2>;
      case 'label-h3':
        return <h3 className="text-lg font-bold mt-3 mb-1 text-gray-800 ">{field.label}</h3>;
      case 'text':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700  mb-1">
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white  text-gray-800 "
              placeholder="Enter text"
              required={field.required}
            />
          </div>
        );
      case 'number':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700  mb-1">
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white  text-gray-800 "
              placeholder="Enter number"
              required={field.required}
            />
          </div>
        );
      case 'boolean':
        return (
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              className="h-4 w-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
              required={field.required}
            />
            <label className="ml-2 block text-sm text-gray-700 ">
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        );
      case 'enum':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700  mb-1">
              {field.label}{field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select className="w-full p-2 border border-gray-300  rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent bg-white  text-gray-800 " required={field.required}>
              <option value="">Select an option</option>
              {field.options?.map((option, idx) => (
                <option key={idx} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      default:
        return <div className="mb-4 p-2 bg-gray-100  rounded text-gray-800 ">{field.label}</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Section Title"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            className="w-full"
          />
        </div>
        <Button 
          buttonText={"Add Section"} 
          buttonOnClick={handleAddSection} 
          buttonStyle="bg-blue-600 hover:bg-blue-700 text-white"
        />
        <Button 
          rightIcon={<MdPreview className="text-lg" />}
          buttonOnClick={() => setPreviewMode(!previewMode)} 
          buttonStyle={`flex items-center gap-2 ${previewMode ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
          buttonText={previewMode ? 'Edit Mode' : 'Preview Mode'}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleSectionDragEnd}
      >
        <SortableContext
          items={template.sections.map(section => section.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            <div className="space-y-4">
              {template.sections.map((section) => (
                <SortableSection key={section.id} id={section.id}>
                  <motion.div 
                    className="p-4 border border-gray-200  rounded-lg bg-white  shadow-sm"
                    layout
                  >
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100 ">
                      <div className="flex items-center gap-2">
                        <div {...listeners} {...attributes}>
  <FaGripVertical />
</div>

                        {editingSection === section.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={sectionEditTitle}
                              onChange={(e) => setSectionEditTitle(e.target.value)}
                              className="flex-1"
                            />
                            <Button 
                              leftIcon={<FaSave />}
                              buttonOnClick={() => saveEditSection(section.id)}
                              buttonStyle="bg-green-600 hover:bg-green-700 text-white p-2"
                            />
                          </div>
                        ) : (
                          <h3 className="font-bold text-lg text-gray-800 ">{section.title}</h3>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {editingSection !== section.id && (
                          <Button 
                            buttonText={<FaEdit />} 
                            buttonOnClick={() => startEditSection(section.id, section.title)} 
                            buttonStyle="text-blue-500 hover:text-blue-700 p-1"
                          />
                        )}

                        <Button 
                          buttonText={<FaTrash />} 
                          buttonStyle="text-red-500 hover:text-red-700 p-1" 
                          buttonOnClick={() => handleDeleteSection(section.id)}
                        />
                      </div>
                    </div>

                    {!previewMode && (
                      <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-gray-50  rounded-lg">
                        <div className="flex-1 min-w-[150px]">
                          <Select 
                            options={fieldTypes} 
                            value={fieldType} 
                            onChange={(e) => setFieldType(e.target.value)} 
                            className="w-full"
                          />
                        </div>
                        <Button 
                          buttonText={"Add Field"}
                          buttonOnClick={() => handleAddField(section.id)}
                          buttonStyle="bg-blue-600 hover:bg-blue-700 text-white"
                        />
                      </div>
                    )}

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={(event) => handleDragEnd(event, section.id)}
                    >
                      <SortableContext
                        items={section.fields.map((field) => field.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <AnimatePresence>
                          <div className="space-y-3">
                            {section.fields.map((field) => (
                              previewMode ? (
                                <motion.div 
                                  key={field.id} 
                                  className="mb-3"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {renderFieldPreview(field)}
                                </motion.div>
                              ) : (
                                <SortableField 
                                  key={field.id} 
                                  id={field.id} 
                                  field={field}
                                  onDelete={() => handleDeleteField(section.id, field.id)}
                                  onUpdate={(updates) => handleUpdateField(section.id, field.id, updates)}
                                />
                              )
                            ))}
                          </div>
                        </AnimatePresence>
                      </SortableContext>
                    </DndContext>
                  </motion.div>
                </SortableSection>
              ))}
            </div>
          </AnimatePresence>
        </SortableContext>
      </DndContext>
    </div>
  );
}