import React, { useEffect, useMemo, useState } from "react";
import Nav from "./components/Nav";
import UserTable from "./components/UserTable";

const App = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.log("Error", error);
      }
    };
    fetchData();
  }, []);

  const data = useMemo(() => users, [users]);

  return (
    <>
      <Nav />
      <UserTable data={data} />
    </>
  );
};

export default App;
