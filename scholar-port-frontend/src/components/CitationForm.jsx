import React, { useState } from 'react';

const CitationForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ title: '', authors: '', year: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Il titolo è obbligatorio.';
    if (!formData.authors.trim()) newErrors.authors = 'L-autore è obbligatorio.';
    const yearNum = parseInt(formData.year);
    if (!yearNum || yearNum < 1800 || yearNum > new Date().getFullYear() + 1) {
      newErrors.year = 'Anno non valido.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit({ ...formData, year: parseInt(formData.year) });
  };

  return (
    <div className="citation-form" style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px', border: '2px solid #e9ecef' }}>
      <h4 className="mb-3">Aggiungi Nuova Citazione</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="citationTitle">Titolo *</label>
          <input type="text" id="citationTitle" name="title" className={`form-control ${errors.title ? 'error' : ''}`} value={formData.title} onChange={handleChange} />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="citationAuthors">Autori *</label>
            <input type="text" id="citationAuthors" name="authors" className={`form-control ${errors.authors ? 'error' : ''}`} value={formData.authors} onChange={handleChange} />
            {errors.authors && <div className="error-message">{errors.authors}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="citationYear">Anno *</label>
            <input type="number" id="citationYear" name="year" className={`form-control ${errors.year ? 'error' : ''}`} value={formData.year} onChange={handleChange} placeholder="2024" />
            {errors.year && <div className="error-message">{errors.year}</div>}
          </div>
        </div>
        <div className="article-actions mt-3">
          <button type="submit" className="btn btn-primary">Aggiungi Citazione</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Annulla</button>
        </div>
      </form>
    </div>
  );
};

export default CitationForm;