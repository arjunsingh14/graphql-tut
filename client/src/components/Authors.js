import { useMutation } from "@apollo/client";
import { useState } from "react";
import { EDIT_BIRTH, ALL_AUTHORS } from "../queries";
const Authors = ({ show, result }) => {
  const [author, setAuthor] = useState("");
  const [born, setBorn] = useState("");
  const [editAuthor] = useMutation(EDIT_BIRTH, {
    refetchQueries: [{query: ALL_AUTHORS}],
    onError: (error) => {
      console.log(error.graphQLErrors);
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    editAuthor({ variables: { name: author, born } });
    console.log("changing birth year..");
    setAuthor("");
    setBorn("");
  };
  if (!show) {
    return null;
  }

  if (result.loading) {
    return <h2>Loading..</h2>;
  }
  const authors = result.data.allAuthors || [];

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
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleSubmit}>
        <div>
          <h2>Set birthyear</h2>
        </div>
        <div>
          <div>
            <label htmlFor="name">Author</label>
            <input
              type="text"
              id="name"
              name="name"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </div>
          <div>
            <label htmlFor="born">born</label>
            <input
              type="number"
              id="born"
              name="born"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </div>
          <button type="submit">Set birth</button>
        </div>
      </form>
    </div>
  );
};

export default Authors;
