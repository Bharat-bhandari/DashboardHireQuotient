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

// Task to be completed
// 1- completed
// 2- completed
// 3- completed
// 4- half
// 5-
// 6-
// 7- completed
// 8-
// 9- completed
// 10- half
// 11- completed
// 12- completed
// 13-
// 14-
