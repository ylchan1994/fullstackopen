import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, ME } from "../queries";
import { useState } from "react";

const Recommend = ({ setError }) => {
  const [books, setBooks] = useState([]);
  const { loading, data } = useQuery(ALL_BOOKS);
  const { loading: userLoading, data: userData } = useQuery(ME);
  let me = {};
  if (!userLoading) me = userData.me;

  if (!me) return setError("User not found");
  if (loading) return <p>Loading Books...</p>;
  const { allBooks } = data;

  if (allBooks && books.length === 0) {
    const filterValue = me.favoriteGenre;
    console.log(filterValue, allBooks);

    const filteredBooks = allBooks.filter((book) => {
      return book.genres.includes(filterValue);
    });

    console.log(filteredBooks);
  }

  return (
    <div>
      <h2>Recommendations</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommend;
