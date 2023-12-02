import React, { useEffect, useState } from "react";
import Nav from "./assets/components/Nav";
import UserTable from "./assets/components/UserTable";

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

  return (
    <>
      <Nav />
      <UserTable user={users} />
    </>
  );
};

export default App;
