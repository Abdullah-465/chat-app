import axios from "axios";
import UserContextProvider from "./UserContext"; // Changed import statement
import Route from "./Route";

function App() {
  axios.defaults.baseURL = 'http://localhost:4040';
  axios.defaults.withCredentials = true;

  return (
    <div>
      <UserContextProvider> 
        <Route/>
      </UserContextProvider>
    </div>
  );
}

export default App;
