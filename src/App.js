import List from './Component/List';
import Alert from './Component/Alert';
import { useState, useEffect } from 'react';

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return JSON.parse(localStorage.getItem('list'));
  } else {
    return [];
  }
};

const App = () => {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, 'danger', 'Please Enter Value');
    } else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName('');
      setEditId(null);
      setIsEditing(false);
      showAlert(true, 'success', 'Value Changed');
    } else {
      showAlert(true, 'success', 'Item Added to the List');
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName('');
    }
  };

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };

  const clearList = () => {
    showAlert(true, 'danger', 'Empty List');
    setList([]);
  };

  const removeItem = (id) => {
    showAlert(true, 'danger', 'Item Removed');
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const editItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(editItem.title);
  };

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  return (
    <section className='section-center'>
      <form onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Todo List Using Local Storage</h3>
        <div className='mb-3'>
          <input
            type='text'
            className='form-control mb-2'
            placeholder='e.g. Bread'
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <div className='text-center'>
            <button type='submit' className='btn text-center btn-success'>
              {isEditing ? 'Edit' : 'Submit'}
            </button>
          </div>

        </div>
      </form>
      {list.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <div className='text-center'>
            <button className='btn btn-warning' onClick={clearList}>
              Clear List
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default App;
