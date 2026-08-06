import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Blogs.css";

const AddBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Blog Post Published!");
    navigate("/blogs");
  };

  return (
    <div className="blogs-container">
      <div className="blogs-card">
        <div className="card-header">
          <h2>Create New Blog Post</h2>
          <p>Publish fresh content to your store's blog section.</p>
        </div>

        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label>Blog Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Summer Maintenance Guide"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Tips & Tricks"
            />
          </div>

          <div className="form-group">
            <label>Content *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="8"
              placeholder="Write blog content here..."
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/blogs")}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Publish Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBlog;