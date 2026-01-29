import { AddDiary } from "./components/add-diary";
import { Diaries } from "./components/diaries";

const App = () => {
  return (
    <div>
      <h1>Add new entry</h1>
      <AddDiary />
      <h1>Diary Entries</h1>
      <Diaries />
    </div>
  );
};

export default App;
