import {  useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";
const App = () => {
  const [page, setPage] = useState("authors");
  const authorQuery = useQuery(ALL_AUTHORS);
  const bookQuery = useQuery(ALL_BOOKS)

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors show={page === "authors"} result = {authorQuery} />

      <Books show={page === "books"} result = {bookQuery}/>

      <NewBook show={page === "add"} />
    </div>
  );
};



export default App
