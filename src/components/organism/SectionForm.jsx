// src/molecules/SectionForm.jsx

import { useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { useDispatch } from 'react-redux';
import { addSection } from '../redux/templateSlice';
import { RiFileAddLine } from "react-icons/ri";

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
    <div className="flex space-x-2 my-2">
      <Input
        value={sectionTitle}
        onChange={(e) => setSectionTitle(e.target.value)}
        placeholder="Section Title"
      />
      <Button buttonOnClick={handleAdd} buttonText={"Add Section"} rightIcon={<RiFileAddLine/>}/>
    </div>
  );
}
