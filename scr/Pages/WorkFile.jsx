import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WorkFile.css';
import { useUser } from './UserContext';
import ProjectList from './ProjectList';
import SaveDocx from './SaveDocx';

const WorkFile = () => {
  const { userId } = useUser();
  const [requirements, setRequirements] = useState([]);
  const [parameters, setParameters] = useState({});
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [selectedRequirementNames, setSelectedRequirementNames] = useState({});
  const [selectedParameters, setSelectedParameters] = useState([]);
  const [fileName, setFileName] = useState('Название проекта');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [showProjectList, setShowProjectList] = useState(false);
  const [projectListMode, setProjectListMode] = useState(''); // Add this line
  const [skillAssessments, setSkillAssessments] = useState([]);
  const [selectedSkillAssessments, setSelectedSkillAssessments] = useState([]);
  const [assessmentCriteria, setAssessmentCriteria] = useState({});
  const [criteriaSearchTerm, setCriteriaSearchTerm] = useState('');
  const [selectedCriteria, setSelectedCriteria] = useState([]);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await axios.get('/requirements');
        setRequirements(response.data);
      } catch (err) {
        console.error('Ошибка при получении требований:', err);
      }
    };

    fetchRequirements();
    console.log('Selected Requirements updated:', selectedRequirements);
  }, []);

  useEffect(() => {
    const fetchSkillAssessments = async () => {
      try {
        const response = await axios.get('/skill');
        setSkillAssessments(response.data);
      } catch (err) {
        console.error('Ошибка при получении оценок умения:', err);
      }
    };
    fetchSkillAssessments();
    console.log('Selected Skill Assessments updated:', selectedSkillAssessments);
  }, []);
  
  useEffect(() => {
    const fetchParametersAndNames = async () => {
      const newParameters = {};
      const newRequirementNames = {};

      for (const requirement of selectedRequirements) {
        const response = await axios.get(`/parameters/${requirement}`);
        newParameters[requirement] = response.data;

        const nameResponse = await axios.get(`/requirements/${requirement}`);
        newRequirementNames[requirement] = nameResponse.data.name;
      }

      setParameters(newParameters);
      setSelectedRequirementNames(newRequirementNames);
    };

    if (selectedRequirements.length > 0) {
      fetchParametersAndNames();
    } else {
      setParameters({});
      setSelectedRequirementNames({});
    }
    console.log('Selected Parameters updated:', selectedParameters);
  }, [selectedRequirements, userId]);

  useEffect(() => {
    const fetchCriteria = async () => {
      const newCriteria = {};
      if (selectedSkillAssessments.length > 0) {
        try {
          for (const skillAssessmentId of selectedSkillAssessments) {
            const response = await axios.get(`/skill/${skillAssessmentId}`);
            newCriteria[skillAssessmentId] = response.data;
          }
          setAssessmentCriteria(newCriteria);
        } catch (err) {
          console.error('Ошибка при получении критериев оценивания:', err);
        }
      }
    };
    fetchCriteria();
    console.log('Selected Criteria updated:', selectedCriteria);
  }, [selectedSkillAssessments]);

  const handleRequirementChange = (reqId) => {
    setSelectedRequirements((prevSelectedRequirements) => {
      if (prevSelectedRequirements.includes(reqId)) {
        return prevSelectedRequirements.filter((id) => id !== reqId);
      } else {
        return [...prevSelectedRequirements, reqId];
      }
    });
  };

  const handleParameterChange = (paramId) => {
    setSelectedParameters((prevSelectedParameters) => {
      if (prevSelectedParameters.includes(paramId)) {
        return prevSelectedParameters.filter((id) => id !== paramId);
      } else {
        return [...prevSelectedParameters, paramId];
      }
    });
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCriteriaSearchChange = (e) => {
    setCriteriaSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleClearCriteriaSearch = () => {
    setCriteriaSearchTerm('');
  };

  const handleCreateFile = () => {
    setSelectedRequirements([]);
    setSelectedParameters([]);
    setSelectedSkillAssessments([]);
    setSelectedCriteria([]);
    setFileName('Название проекта');
  };

  const handleSaveProject = async () => {
    if (!userId) {
      console.error('Идентификатор пользователя не найден!');
      return;
    }

    const projectData = {
      userId,
      name: fileName,
      requirements: selectedRequirements,
      parameters: selectedParameters,
      skillAssessments: selectedSkillAssessments,
      criteria: selectedCriteria,
    };

    try {
      const response = await axios.post('/save-project', projectData);
      if (response.status === 200) {
        console.log('Проект успешно сохранен');
      } else {
        console.error('Ошибка сохранения проекта');
      }
    } catch (err) {
      console.error('Ошибка сохранения проекта:', err);
    }
  };

  const handleLoadForDownloadProject = async (projectId) => {
    try {
      const response = await axios.get(`/project/${userId}/${projectId}`);
      const projectToLoad = response.data;
     
      const loadedRequirements = projectToLoad.requirements.map(req => req.applicant_requirement_id);
      const loadedParameters = projectToLoad.parameters.map(param => param.requirement_parameter_id);
      const loadedSkillAssessments = projectToLoad.skillAssessments.map(skill => skill.id_scale);
      const loadedCriteria = projectToLoad.criteria.map(criteria => criteria.value);
      console.log('projectToLoads:', loadedCriteria);

      const fetchParametersAndNames = async () => {
        const newParameters = {};
        const newRequirementNames = {};

        for (const parameter of loadedParameters) {
          const response = await axios.get(`/parametersload/${parameter}`);
          newParameters[parameter] = response.data;
        }
        for (const requirement of loadedRequirements) {
          const nameResponse = await axios.get(`/requirements/${requirement}`);
          newRequirementNames[requirement] = nameResponse.data.name;
        }

        const newCriteriaAssessment = {};
        const newCriteria = {};
        if (loadedSkillAssessments.length > 0) {
          try {
            for (const skillAssessmentId of loadedCriteria) {
              const response = await axios.get(`/Criteria//${skillAssessmentId}`);
              newCriteriaAssessment[skillAssessmentId] = response.data;
            }
            for (const skillAssessmentId of loadedSkillAssessments) {
              const response2 = await axios.get(`/skillload/${skillAssessmentId}`);
              newCriteria[skillAssessmentId] = response2.data;
            }
          } catch (err) {
            console.error('Ошибка при получении критериев оценивания:', err);
          }
        }

        SaveDocx(newRequirementNames,newParameters,newCriteriaAssessment,newCriteria,projectToLoad);
      }
      fetchParametersAndNames();

      
    } catch (err) {
      console.error('Ошибка при загрузке проекта:', err);
    }
  };

  const handleLoadProject = async (projectId) => {
    try {
      const response = await axios.get(`/project/${userId}/${projectId}`);
      const projectToLoad = response.data;
  
      setFileName(projectToLoad.name);
      console.log('projectToLoads:', projectToLoad);
  
      const loadedRequirements = projectToLoad.requirements.map(req => req.applicant_requirement_id);
      setSelectedRequirements(loadedRequirements);
      console.log('Loaded Requirements:', loadedRequirements); // Отладочная точка
  
      const loadedParameters = projectToLoad.parameters.map(param => param.requirement_parameter_id.toString());
      setSelectedParameters(loadedParameters);
      console.log('Loaded Parameters:', loadedParameters); // Отладочная точка
    
      const loadedSkillAssessments = projectToLoad.skillAssessments.map(skill => skill.id_scale.toString());
      setSelectedSkillAssessments(loadedSkillAssessments);
      console.log('Loaded Skill Assessments:', loadedSkillAssessments); // Отладочная точка
  
      const loadedCriteria = projectToLoad.criteria.map(criteria => criteria.value.toString());
      setSelectedCriteria(loadedCriteria);
      console.log('Loaded Criteria:', loadedCriteria); // Отладочная точка

      const fetchParametersAndNames = async () => {
        const newParameters = {};
        const newRequirementNames = {};

        for (const requirement of loadedRequirements) {
          const response = await axios.get(`/parameters/${requirement}`);
          newParameters[requirement] = response.data;

          const nameResponse = await axios.get(`/requirements/${requirement}`);
          newRequirementNames[requirement] = nameResponse.data.name;
        }

        setParameters(newParameters);
        setSelectedRequirementNames(newRequirementNames);
        
      };

      fetchParametersAndNames();

      const fetchCriteria = async () => {
        const newCriteria = {};
        if (loadedSkillAssessments.length > 0) {
          try {
            for (const skillAssessmentId of loadedSkillAssessments) {
              const response = await axios.get(`/skill/${skillAssessmentId}`);
              newCriteria[skillAssessmentId] = response.data;
            }
            setAssessmentCriteria(newCriteria);
          } catch (err) {
            console.error('Ошибка при получении критериев оценивания:', err);
          }
        }
      };
      fetchCriteria();
      
    } catch (err) {
      console.error('Ошибка при загрузке проекта:', err);
    }
  };

  const handleOpenProjectList = () => {
    setProjectListMode('open'); // Set mode to 'open'
    setShowProjectList(true);
  };

  const handleOpenLoadProjectList = () => {
    setProjectListMode('load'); // Set mode to 'load'
    setShowProjectList(true);
  };

  const handleProjectSelect = (project) => {
    setShowProjectList(false);

    if (projectListMode === 'open') {
      setSelectedProjectId(project.id_proj);
      handleLoadProject(project.id_proj);
    }
    if (projectListMode === 'load') {
      setSelectedProjectId(project.id_proj);
      handleLoadForDownloadProject(project.id_proj);
    }
    
    // If mode is 'load', do nothing
  };

  const handleCloseProjectList = () => {
    setShowProjectList(false);
  };

  const handleSkillAssessmentChange = (skillAssessmentId) => {
    setSelectedSkillAssessments((prevSelectedSkillAssessments) => {
      if (prevSelectedSkillAssessments.includes(skillAssessmentId)) {
        return prevSelectedSkillAssessments.filter((id) => id !== skillAssessmentId);
      } else {
        return [...prevSelectedSkillAssessments, skillAssessmentId];
      }
    });
  };

  const handleCriteriaChange = (criteriaId) => {
    setSelectedCriteria((prevSelectedCriteria) => {
      if (prevSelectedCriteria.includes(criteriaId)) {
        return prevSelectedCriteria.filter((id) => id !== criteriaId);
      } else {
        return [...prevSelectedCriteria, criteriaId];
      }
    });
  };

  const filteredParameters = (params) => {
    if (searchTerm === '') {
      return params;
    }
    return params.filter((param) =>
      param.name.toLowerCase().includes(searchTerm.toLowerCase()))
  };

  const filteredCriteria = (criteria) => {
    if (criteriaSearchTerm === '') {
      return criteria;
    }
    return criteria.filter((crit) =>
      crit.value.toLowerCase().includes(criteriaSearchTerm.toLowerCase()))
  };

  return (
    <div className="outer-container">
      {showProjectList && (
        <div className="modal-overlay">
          <div className="modal">
            <ProjectList userId={userId} onSelectProject={handleProjectSelect} onClose={handleCloseProjectList} />
          </div>
        </div>
      )}
      <div className="project-info">
        <input 
          type="text" 
          value={fileName} 
          onChange={handleFileNameChange} 
          className="file-name-input" 
        />
        <div className="buttons-container">
          <button className="square-button" title="Создать новый проект" onClick={handleCreateFile}></button>
          <button className="square-button" title="Сохранить текущий проект" onClick={handleSaveProject}>&#128190;</button>
          <button className="square-button" title="Открыть существующий проект" onClick={handleOpenProjectList}>&#128193;</button>
          <button className="square-button" title="Загрузить текущий проект" onClick={handleOpenLoadProjectList}>&#x2B07;</button>
        </div>
      </div>
      <div className="workfile-container">
        <div className="top-row">
          <div className="requirements-container">
            <h2>Требования</h2>      
            {requirements.map((req) => (
              <div key={req.applicant_requirement_id} className="checkbox-container">
                <input
                  type="checkbox"
                  id={`req-${req.applicant_requirement_id}`}
                  value={req.applicant_requirement_id}
                  checked={selectedRequirements.includes(req.applicant_requirement_id)}
                  onChange={() => handleRequirementChange(req.applicant_requirement_id)}
                  className="styled-checkbox"
                />
                <label htmlFor={`req-${req.applicant_requirement_id}`}>{req.name}</label>
              </div>
            ))}
          </div>
          <div className="parameters-container">
            <h2>Характеристики требований</h2>
            <div className="search-container">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Поиск параметров"
                className="search-input"
              />
              {searchTerm && (
                <button onClick={handleClearSearch} className="clear-button">Очистить</button>
              )}
            </div>
            {selectedRequirements.length > 0 ? (
              selectedRequirements.map((reqId) => {
                const filteredParams = filteredParameters(parameters[reqId] || []);
                return (
                  <div key={reqId} className={`requirement-parameters ${filteredParams.length === 0 ? 'hidden' : ''}`}>
                    <h3>{selectedRequirementNames[reqId] || 'Загрузка...'}</h3>
                    {filteredParams.length > 0 ? (
                      filteredParams.map((param) => (
                        <div key={param.requirement_parameter_id} className="parameter-item">
                          <input
                            type="checkbox"
                            id={`param-${param.requirement_parameter_id}`}
                            value={param.requirement_parameter_id}
                            checked={selectedParameters.includes(param.requirement_parameter_id)}
                            onChange={() => handleParameterChange(param.requirement_parameter_id)}
                            className="styled-checkbox"
                          />
                          <label htmlFor={`param-${param.requirement_parameter_id}`}>{param.name}</label>
                        </div>
                      ))
                    ) : (
                      <p>Нет параметров для этого требования</p>
                    )}
                  </div>
                );
              })
            ) : (
              <p>Пожалуйста, выберите требования, чтобы отразились соответствующие параметры.</p>
            )}
          </div>
        </div>
        <div className="bottom-row">
          <div className="assessment-container">
            <h2>Шкалы оценок</h2>
            {skillAssessments.map((assessment) => (
              <div key={assessment.id} className="checkbox-container">
                <input
                  type="checkbox"
                  id={`assessment-${assessment.id}`}
                  value={assessment.id}
                  checked={selectedSkillAssessments.includes(assessment.id)}
                  onChange={() => handleSkillAssessmentChange(assessment.id)}
                  className="styled-checkbox"
                />
                <label htmlFor={`assessment-${assessment.id}`}>{assessment.name}</label>
              </div>
            ))}
          </div>
          <div className="criteria-container">
            <h2>Оценки</h2>
            <div className="search-container">
              <input
                type="text"
                value={criteriaSearchTerm}
                onChange={handleCriteriaSearchChange}
                placeholder="Поиск критериев"
                className="search-input"
              />
              {criteriaSearchTerm && (
                <button onClick={handleClearCriteriaSearch} className="clear-button">Очистить</button>
              )}
            </div>
            {selectedSkillAssessments.length > 0 ? (
              Object.keys(assessmentCriteria).map((assessmentId) => {
                const filteredCriteriaList = filteredCriteria(assessmentCriteria[assessmentId] || []);
                const assessmentName = skillAssessments.find(assess => assess.id === assessmentId.toString())?.name;

                return (
                  <div key={assessmentId} className="criteria-list">
                    <h3>{assessmentName}</h3>
                    {filteredCriteriaList.length > 0 ? (
                      <ul>
                        {filteredCriteriaList.map((criterion) => (
                          <li key={criterion.id} className="criterion-item">
                            <input
                              type="checkbox"
                              id={`criterion-${criterion.id}`}
                              value={criterion.id}
                              checked={selectedCriteria.includes(criterion.id)}
                              onChange={() => handleCriteriaChange(criterion.id)}
                              className="styled-checkbox"
                            />
                            <label htmlFor={`criterion-${criterion.id}`}>{criterion.value}</label>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Нет критериев для этой оценки умения</p>
                    )}
                  </div>
                );
              })
            ) : (
              <p>Выберите оценку умения, чтобы отобразить соответствующие критерии.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkFile;
