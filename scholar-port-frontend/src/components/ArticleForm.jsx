import React, { useState, useEffect } from 'react';

const ArticleForm = ({ onSave, onCancel, articleToEdit, serverError }) => {
  const [formData, setFormData] = useState({
    title: '',
    authors: '', // Gestito come stringa separata da virgole
    publicationDate: '',
    doi: '',
    abstract: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (articleToEdit) {
      setFormData({
        title: articleToEdit.title,
        authors: Array.isArray(articleToEdit.authors) ? articleToEdit.authors.join(', ') : '',
        publicationDate: articleToEdit.publicationDate, // Già in formato YYYY-MM-DD
        doi: articleToEdit.doi,
        abstract: articleToEdit.abstract
      });
    }
  }, [articleToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Il titolo è obbligatorio.';
    if (!formData.authors.trim()) newErrors.authors = 'Almeno un autore è obbligatorio.';
    if (!formData.publicationDate) newErrors.publicationDate = 'La data è obbligatoria.';
    if (!formData.doi.trim().match(/^10\.\d{4,}\/\S+/)) newErrors.doi = 'Il formato del DOI non è valido.';
    if (formData.abstract.trim().length < 50) newErrors.abstract = 'L-abstract deve avere almeno 50 caratteri.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Prepara i dati per l'API
    const articlePayload = {
      ...formData,
      id: articleToEdit?.id,
      authors: formData.authors.split(',').map(author => author.trim()).filter(Boolean),
      // La data viene inviata come stringa YYYY-MM-DD, il backend la convertirà in ISO
    };
    onSave(articlePayload);
  };

  return (
    <div className="card">
      <h2 className="mb-3">{articleToEdit ? 'Modifica Articolo' : 'Aggiungi Nuovo Articolo'}</h2>
      {serverError && <div className="error-message mb-3" style={{border: '1px solid red', padding: '1rem', borderRadius: '8px'}}>{serverError}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="title">Titolo *</label>
          <input type="text" id="title" name="title" className={`form-control ${errors.title ? 'error' : ''}`} value={formData.title} onChange={handleChange} />
          {errors.title && <div className="error-message">{errors.title}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="authors">Autori (separati da virgola) *</label>
          <input type="text" id="authors" name="authors" className={`form-control ${errors.authors ? 'error' : ''}`} value={formData.authors} onChange={handleChange} />
          {errors.authors && <div className="error-message">{errors.authors}</div>}
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label htmlFor="publicationDate">Data di Pubblicazione *</label>
            <input type="date" id="publicationDate" name="publicationDate" className={`form-control ${errors.publicationDate ? 'error' : ''}`} value={formData.publicationDate} onChange={handleChange} />
            {errors.publicationDate && <div className="error-message">{errors.publicationDate}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="doi">DOI *</label>
            <input type="text" id="doi" name="doi" placeholder="Es. 10.1000/xyz" className={`form-control ${errors.doi ? 'error' : ''}`} value={formData.doi} onChange={handleChange} />
            {errors.doi && <div className="error-message">{errors.doi}</div>}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="abstract">Abstract (min. 50 caratteri) *</label>
          <textarea id="abstract" name="abstract" className={`form-control ${errors.abstract ? 'error' : ''}`} value={formData.abstract} onChange={handleChange} rows="6"></textarea>
          {errors.abstract && <div className="error-message">{errors.abstract}</div>}
        </div>
        <div className="article-actions mt-3">
          <button type="submit" className="btn btn-primary">{articleToEdit ? 'Salva Modifiche' : 'Crea Articolo'}</button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>Annulla</button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;