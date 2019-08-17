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
            topic['body'] = response.post_stream.posts[0].cooked.replace('<br>','').replace('\n','');
            const matchArray = topic['body'].match(/.+קו אורך:\s*(\d+\.\d+).+קו רוחב:\s+(\d+\.\d+)/)
            let extractedLngLat = {};
            if(matchArray !== null && typeof(matchArray[1]) !== 'undefined') {
              extractedLngLat['lng'] = matchArray[1];
            };
            if(matchArray !== null && typeof(matchArray[2]) !== 'undefined') {
              extractedLngLat['lat'] = matchArray[2];
            };

            if ( extractedLngLat !==  {} && "lng" in extractedLngLat && "lat" in extractedLngLat) {
                topic["location"] = {};
                topic["location"]['lng'] = extractedLngLat["lng"];
                topic["location"]['lat'] = extractedLngLat["lat"];
                console.log(topic);
                return topic["location"];
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
                topics = Object.keys(topics).map(function(key) {
                    return topics[key];
                });
                return topics;
        });
    }