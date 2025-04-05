import { useState } from 'react';
import PropTypes from 'prop-types';
import './AddUserForm.css'; // Reuse the same styles

export default function EditUserForm({ onClose, onSubmit, initialData, editableRole }) {
    const [formData, setFormData] = useState({
        first_name: initialData.first_name || '',
        last_name: initialData.last_name || '',
        email: initialData.email || '',
        birth_date: initialData.birth_date?.split('T')[0] || '',
        username: initialData.username || '',
        role: initialData.role || 'Visitor',
        password: '' // Empty by default
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Remove empty password field if not changed
        const submitData = { ...formData };
        if (submitData.password === '') {
            delete submitData.password;
        }

        onSubmit(submitData);
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <input name="first_name" placeholder="First Name" 
                           value={formData.first_name} onChange={handleChange} />
                    
                    <input name="last_name" placeholder="Last Name" 
                           value={formData.last_name} onChange={handleChange} />
                    
                    <input name="email" type="email" placeholder="Email" 
                           value={formData.email} onChange={handleChange} />
                    
                    <input name="birth_date" type="date" 
                           value={formData.birth_date} onChange={handleChange} />
                    
                    <input name="username" placeholder="Username" 
                           value={formData.username} onChange={handleChange} />
                    
                    <input name="password" type="password" 
                           placeholder="New Password" 
                           value={formData.password} onChange={handleChange} />
                    
                    {/* Conditionally render role field only if editableRole is true */}
                    {editableRole && (
                        <select name="role" value={formData.role} onChange={handleChange}>
                            <option value="Visitor">Visitor</option>
                            <option value="Staff">Staff</option>
                            <option value="Admin">Admin</option>
                        </select>
                    )}

                    <div className="modal-buttons">
                        <button type="submit">Update</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditUserForm.propTypes = {
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialData: PropTypes.object.isRequired,
    editableRole: PropTypes.bool // New prop to control role editing
};
