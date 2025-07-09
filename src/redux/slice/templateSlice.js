import { createSlice, nanoid } from '@reduxjs/toolkit';

// Load from localStorage
const loadTemplates = () => {
  try {
    const serializedState = localStorage.getItem('templates');
    if (serializedState === null) {
      return { templates: [] };
    }
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn("Could not load templates from localStorage", e);
    return { templates: [] };
  }
};

// Save to localStorage middleware
const saveToLocalStorage = (store) => (next) => (action) => {
  const result = next(action);
  if (action.type?.startsWith('template/')) {
    const state = store.getState().template;
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('templates', serializedState);
    } catch (e) {
      console.warn("Could not save templates to localStorage", e);
    }
  }
  return result;
};

const initialState = loadTemplates();

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    addTemplate: (state, action) => {
      if (state.templates.length >= 5) return;
      
      const newTemplate = {
        id: nanoid(),
        name: action.payload,
        sections: [],
      };
      state.templates.push(newTemplate);
    },

    addSection: (state, action) => {
      const { templateId, title } = action.payload;
      const template = state.templates.find(t => t.id === templateId);
      if (template) {
        template.sections.push({
          id: nanoid(),
          title,
          fields: [],
        });
      }
    },

    addFieldToSection: (state, action) => {
      const { sectionId, field } = action.payload;
      const section = state.templates
        .flatMap(t => t.sections)
        .find(s => s.id === sectionId);

      if (section) {
        section.fields.push({
          id: nanoid(),
          ...field,
        });
      }
    },

    updateFieldOrder: (state, action) => {
      const { templateId, sectionId, newFields } = action.payload;
      const template = state.templates.find(t => t.id === templateId);
      const section = template?.sections.find(s => s.id === sectionId);

      if (section) {
        section.fields = newFields;
      }
    },

    updateSectionOrder: (state, action) => {
      const { templateId, newSections } = action.payload;
      const template = state.templates.find(t => t.id === templateId);
      
      if (template) {
        template.sections = newSections;
      }
    },

    removeFieldFromSection: (state, action) => {
      const { sectionId, fieldId } = action.payload;
      const section = state.templates
        .flatMap(t => t.sections)
        .find(s => s.id === sectionId);

      if (section) {
        section.fields = section.fields.filter(f => f.id !== fieldId);
      }
    },

    updateField: (state, action) => {
      const { sectionId, fieldId, updates } = action.payload;
      const section = state.templates
        .flatMap(t => t.sections)
        .find(s => s.id === sectionId);

      if (section) {
        const field = section.fields.find(f => f.id === fieldId);
        if (field) {
          Object.assign(field, updates);
        } else if (fieldId === null) {
          // Section update
          Object.assign(section, updates);
        }
      }
    },

    removeSection: (state, action) => {
      const { templateId, sectionId } = action.payload;
      const template = state.templates.find(t => t.id === templateId);
      if (template) {
        template.sections = template.sections.filter(s => s.id !== sectionId);
      }
    },
  },
});

export const {
  addTemplate,
  addSection,
  addFieldToSection,
  updateFieldOrder,
  updateSectionOrder,
  removeFieldFromSection,
  updateField,
  removeSection,
} = templateSlice.actions;

export const templateReducer = templateSlice.reducer;
export const localStorageMiddleware = saveToLocalStorage;