import { useMutation, useQuery } from "@apollo/client/react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import { useState } from "react";

const Authors = ({ setError }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const result = useQuery(ALL_AUTHORS);
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => setError(error.message),
  });

  if (result.loading) return <p>Loading Authors...</p>;

  const authors = result.data.allAuthors;

  const updateAuthor = () => {
    editAuthor({ variables: { name, setBornTo: Number(born) } });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <div>
        <label for="name">name</label>
        <select
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        >
          {authors.map((author) => (
            <option value={author.name}>{author.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label for="born">born</label>
        <input
          type="number"
          name="born"
          value={born}
          onChange={(e) => setBorn(e.target.value)}
        ></input>
      </div>
      <button type="click" onClick={updateAuthor}>
        Update Author
      </button>
    </div>
  );
};

export default Authors;
