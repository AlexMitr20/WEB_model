import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProjectList.css';

const ProjectList = ({ userId, onSelectProject, onClose }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`/project/${userId}`);
        setProjects(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке списка проектов:', error);
      }
    };

    fetchProjects();
  }, [userId]);

  const handleProjectSelect = (project) => {
    onSelectProject(project);
  };

  if (isLoading) {
    return <p>Загрузка проектов...</p>;
  }

  if (projects.length === 0) {
    return <p>У вас пока нет сохраненных проектов.</p>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Список проектов:</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id_proj}>
              <button onClick={() => handleProjectSelect(project)}>{project.name}</button>
            </li>
          ))}
        </ul>
        <button className="close-button" onClick={onClose}>Выйти</button>
      </div>
    </div>
  );
};

export default ProjectList;
