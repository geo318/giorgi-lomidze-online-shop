
const fetchQuery = async (query, variables) => {
    const response =  await fetch('http://localhost:4000/graphql/', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query,
          variables: variables,
        })
      })
      const data = await response.json()
      return data
}

export default fetchQuery;