import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Blogs.css";

const BlogList = () => {
  const navigate = useNavigate();
  const [blogs] = useState([
    {
      id: "1",
      title: "Top 5 Tips to Maintain Electronic Appliances",
      author: "Admin",
      date: "2026-03-15",
      status: "Published",
    },
    {
      id: "2",
      title: "How to Choose the Right Cooler for Summer",
      author: "Technician",
      date: "2026-04-01",
      status: "Published",
    },
  ]);

  return (
    <div className="blogs-container">
      <div className="blogs-card">
        <div className="card-header">
          <div>
            <h2>Blog Articles</h2>
            <p>Manage store articles and news posts.</p>
          </div>
          <button className="add-btn" onClick={() => navigate("/add-blog")}>
            + Add New Blog
          </button>
        </div>

        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="font-bold">{blog.title}</td>
                  <td>{blog.author}</td>
                  <td>{blog.date}</td>
                  <td>
                    <span className="status-pill active">{blog.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogList;