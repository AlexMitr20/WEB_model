import React, { useState, useCallback } from 'react';
import ReactFlow, { MiniMap, Controls, Background, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import './Dialogs.css';

const initialNodes = [
  { id: '1', type: 'input', data: { label: 'Начало' }, position: { x: 250, y: 0 } },
  { id: '2', data: { label: 'Выбор требований к соискателю' }, position: { x: 150, y: 100 } },
  { id: '3', data: { label: 'Запрос к БД' }, position: { x: 350, y: 200 } },
  { id: '4', data: { label: 'Создание диалога' }, position: { x: 250, y: 300 } },
  { id: '5', type: 'output', data: { label: 'Конец' }, position: { x: 250, y: 400 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', markerEnd: { type: 'arrowclosed' } },
  { id: 'e2-3', source: '2', target: '3', markerEnd: { type: 'arrowclosed' } },
  { id: 'e3-4', source: '3', target: '4', markerEnd: { type: 'arrowclosed' } },
  { id: 'e4-5', source: '4', target: '5', markerEnd: { type: 'arrowclosed' } },
  { id: 'e3-2', source: '3', target: '2', animated: true, markerEnd: { type: 'arrowclosed' }, type: 'smoothstep' },
];

function Dialogs() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div className="dialog">
        <div className="introdi">
          <h2>Процесс создания диалогов для соискателей</h2>
          <p>
            Создание диалогов для соискателей включает в себя несколько ключевых этапов. 
            Мы стремимся создать интерактивные и эффективные диалоги, которые помогут 
            оценить квалификацию кандидатов и их соответствие требованиям компании.
          </p>
          <ul>
            <li>Определение целей и задач диалога.</li>
            <li>Разработка сценариев вопросов и ответов.</li>
            <li>Анализ ответов и оценка кандидатов.</li>
            <li>Заключение и предоставление обратной связи.</li>
          </ul>
          <h2>Блок-схема процесса</h2>
          <p>
            Ниже представлена блок-схема, отображающая основные этапы создания диалогов:
          </p>
          <div style={{ height: 500, width: '100%' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <MiniMap />
              <Controls />
              <Background color="#aaa" gap={16} />
            </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default Dialogs;
