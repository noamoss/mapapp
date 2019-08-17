async function getTopics(topic) {
   // read a topic object and extract the site location from its body
    let settings = {
        "url": `https://forum.thepitz.io/t/${topic.id}/posts.json`,
        "method": "GET",
        "headers": {
          "Accept": "application/json",
        }
      };      
    
    await(fetch('https://forum.thepitz.io/t/${topic.id}/posts.json', settings))
    .then((data) => (data.json));
}


export async function getSitesData(){
  let settings = {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  };
  await(fetch("https://forum.thepitz.io/c/mapapp",settings))
  .then((resp) => (resp.json()))
  .then((data) => {
      let topics = data.topic_list.topics.slice(1); // ignore the intro topic
      topics.map(getTopics); // returns only topics with locations
      console.log("from function:")
      console.log(topics);
      return topics;
  });
  }