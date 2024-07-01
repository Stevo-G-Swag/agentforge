import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const BrowserContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const SearchInput = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  width: 100%;
`;

const ComponentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ComponentCard = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

function ComponentBrowser() {
  const [components, setComponents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchComponents = async () => {
      const { data } = await axios.get(`/api/components?search=${searchTerm}`);
      setComponents(data.docs); // Adjusted to handle the expected data structure
    };

    fetchComponents();
  }, [searchTerm]);

  return (
    <BrowserContainer>
      <SearchInput
        type="text"
        placeholder="Search components..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ComponentList>
        {components.map(comp => (
          <ComponentCard key={comp._id}>
            <h4>{comp.name}</h4>
            <p>{comp.description}</p>
          </ComponentCard>
        ))}
      </ComponentList>
    </BrowserContainer>
  );
}

export default ComponentBrowser;