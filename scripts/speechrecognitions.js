const talkButton = document.getElementById('talk');

talkButton.addEventListener('click',  () => {
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recognition.interimResults = true;
recognition.lang="he";

let p = document.createElement('p');
const story = document.querySelector('#storyField');

recognition.addEventListener('result', e=> {
  const transcript = Array.from(e.results)
  .map(result => result[0])
  .map(result => result.transcript)
  .join('');
  console.log(transcript);

  if(e.results[0].isFinal) {
    story.value = transcript;
  }

  if(transcript.includes('שליחה')) {
    console.log("שליחה");
  }

});

recognition.addEventListener('end', recognition.start);
recognition.start()
});
