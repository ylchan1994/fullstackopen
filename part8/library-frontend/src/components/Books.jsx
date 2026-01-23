import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS } from "../queries";
import { useState } from "react";

const Books = () => {
  const [genres, setGenres] = useState([]);
  const queryBooks = useQuery(ALL_BOOKS);

  if (queryBooks.loading) return <p>Loading Books...</p>;

  const { allBooks } = queryBooks.data;
  let allGenres = [];
  allBooks.forEach((book) => {
    allGenres = [...allGenres, ...book.genres];
  });
  if (genres.length === 0) setGenres([...new Set(allGenres)]);

  const filterGenre = (e) => {
    e.preventDefault();
    const filterValue = e.target.value;

    if (filterValue === "all") {
      queryBooks.refetch({ genre: null });
      return;
    }
    queryBooks.refetch({ genre: filterValue });
  };

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map((genre) => (
        <>
          <button value={genre} onClick={filterGenre}>
            {genre}
          </button>
        </>
      ))}
      <button value="all" onClick={filterGenre}>
        All genre
      </button>
    </div>
  );
};

export default Books;
