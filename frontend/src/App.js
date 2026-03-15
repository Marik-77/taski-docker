import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskEditModal from "./components/TaskEditModal";
import Task from "./components/Task";
import TabList from "./components/TabList";

// Функция для получения CSRF-токена из куки
function getCsrfToken() {
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return '';
}

// Создаем настроенный клиент
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,  // обязательно для отправки кук
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCsrfToken(),  // добавляем CSRF-токен при создании
  }
});

// Обновляем CSRF-токен перед каждым запросом
apiClient.interceptors.request.use((config) => {
  // Получаем свежий токен из куки перед каждым запросом
  const token = getCsrfToken();
  if (token) {
    config.headers['X-CSRFToken'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Интерсептор для проверки формата ответа
apiClient.interceptors.response.use(
  function (response) {
    if (response.headers['content-type'] !== 'application/json') {
      alert('Unsupported data format in server response');
      return Promise.reject(new Error('Unsupported data format'));
    }
    return response;
  },
  function (error) {
    // Если ошибка 403 CSRF, пробуем обновить токен и повторить запрос
    if (error.response && error.response.status === 403 && 
        error.response.data && error.response.data.detail === "CSRF Failed: CSRF token missing.") {
      console.warn('CSRF token missing, retrying with fresh token');
      
      // Получаем новый токен и повторяем запрос
      const originalRequest = error.config;
      originalRequest.headers['X-CSRFToken'] = getCsrfToken();
      return apiClient(originalRequest);
    }
    return Promise.reject(error);
  }
);

const App = () => {
  const [isShowCompleted, setIsShowCompleted] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  // Функция обновления списка задач
  const refreshList = () => {
    apiClient
      .get("/tasks/")
      .then((res) => setTaskList(res.data))
      .catch((err) => console.error('Error fetching tasks:', err));
  };

  // Загружаем задачи при монтировании компонента
  useEffect(() => {
    refreshList();
  }, []);

  // Обработка создания/редактирования задачи
  const handleSubmit = (item) => {
    const request = item.id
      ? apiClient.put(`/tasks/${item.id}/`, item)
      : apiClient.post("/tasks/", item);

    request
      .then((res) => {
        refreshList();
        setActiveTask(null);
      })
      .catch((err) => console.error('Error saving task:', err));
  };

  // Обработка удаления задачи
  const handleDelete = (item) => {
    apiClient
      .delete(`/tasks/${item.id}/`)
      .then(() => refreshList())
      .catch((err) => console.error('Error deleting task:', err));
  };

  // Создание новой задачи (открытие модалки)
  const createTask = () => {
    setActiveTask({ title: "", description: "", completed: false });
  };

  // Фильтрация задач по статусу выполнения
  const showedTasks = taskList.filter(
    (item) => item.completed === isShowCompleted
  );

  return (
    <main className="container">
      <h1 className="text text-uppercase text-center my-4">Taski</h1>
      <div className="row">
        <div className="col-md-6 col-sm-10 mx-auto p-0">
          <div className="card p-3">
            <div className="mb-4">
              <button className="btn btn-primary" onClick={createTask}>
                Add task
              </button>
            </div>
            <TabList
              displayCompleted={setIsShowCompleted}
              isShowCompleted={isShowCompleted}
            />
            <ul className="list-group list-group-flush border-top-0">
              {showedTasks.map((task) => (
                <Task
                  key={task.id}
                  data={task}
                  handleEdit={setActiveTask}
                  handleDelete={handleDelete}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
      {activeTask && (
        <TaskEditModal
          taskData={activeTask}
          toggle={() => setActiveTask(null)}
          onSave={handleSubmit}
        />
      )}
    </main>
  );
};

export default App;