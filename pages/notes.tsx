import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setNotes(data);
  };

  const addNote = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!input) return;
    await supabase.from('notes').insert({ content: input, user_id: user.id });
    setInput('');
    fetchNotes();
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Notes</h2>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addNote}>Add</button>
      <ul>
        {notes.map(note => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
      <button onClick={logout}>Log Out</button>
    </div>
  );
}
