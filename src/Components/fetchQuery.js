
const fetchQuery = async (query, variables) => {
    return await fetch('http://localhost:4000/graphql/', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        variables: variables,
      })
    }).then(res => res.json())
}

export default fetchQuery;