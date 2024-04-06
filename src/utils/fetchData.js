export async function fetchData({ method, url, param, header, body, returnType }) {
  try {
    const res = await fetch(`${url}${param ? `?${new URLSearchParams(param)}` : ""}`, {
      method: method,
      headers: header,
      body: body
    })

    if (res.status === 200) {
      switch(returnType) {
        case "json":
          return await res.json()
        case "blob":
          return await res.blob()
        default:
          return res
      }
    }
    else {
      throw new Error(JSON.stringify(await res.json()));
    }
  }
  catch (error) {
    alert(`ERROR: ${error}`)
    return null
  }
}