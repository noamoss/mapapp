function addPostsBody(topic) {
    let settings = {
        "url": `https://forum.thepitz.io/t/${topic.id}/posts.json`,
        "method": "GET",
        "headers": {
          "Accept": "application/json",
        }
      };      
    
    $.getJSON(settings.url, function(response){
        // check for the topic body, for lan/lat data
          if('post_stream' in response) {
            topic['body'] = response.post_stream.posts[0].cooked;
            let extractedLngLat = topic['body'].match(/קו אורך:\s+(?<lng>\d+\.\d+)<br>\nקו רוחב:\s+(?<lat>\d+\.\d+)/);
            if ( extractedLngLat !== null && "lng" in extractedLngLat.groups && "lat" in extractedLngLat.groups) {
                topic["location"] = {};
                topic["location"]['lng'] = extractedLngLat.groups["lng"];
                topic["location"]['lat'] = extractedLngLat.groups["lat"];
                return topic;
            }
          }
      });
}

function getTopics() {
    $.ajax({
        url: "https://forum.thepitz.io/c/mapapp",
        method: "GET",
        headers: {
            "Accept": "application/json",
        }}).done(function(resp){
                let topics = resp.topic_list.topics.slice(1); // ignore the intro topic
                topics.map(addPostsBody);
                console.log(topics);
                return topics;
        });
    }