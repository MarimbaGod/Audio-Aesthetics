import React, { useState, useEffect } from "react";
import axios from "axios";

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/groups/");
        setGroups(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setError("Error fetching groups. Please try again.");
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const renderGroups = () => {
    if (loading) {
      return <p>Loading...</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }

    return (
      <ul>
        {groups.map((group) => (
          <li key={group.id}>
            {group.name} - {group.created_by}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h1>Awesome Groups</h1>
      {renderGroups()}
    </div>
  );
};

//testingsomething

export default Groups;
