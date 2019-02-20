const talkButton = document.getElementById('talk')
const speechIndicator = document.getElementById('speechIndication')

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const recognition = new SpeechRecognition()
const story = document.querySelector('#storyField')

recognition.interimResults = true
recognition.lang = 'he'

var talk = true

const changeTalkStatus = function () {
  talk = !talk

  if (talk === true) {
    speechIndicator.innerText = 'דבר/י, אנחנו כותבים'
    recognition.start()
    recognition.addEventListener('result', e => {
      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)

      if (e.results[0].isFinal) {
        story.value = transcript
      }

      if (transcript.includes('שליחה')) {
        console.log('שליחה')
      }
    })

    recognition.addEventListener('end', () => {
      recognition.stop()
      speechIndicator.innerText = ''
    })
  } else {
    speechIndicator.innerText = ''
    recognition.stop()
  }
}

talkButton.addEventListener('click', changeTalkStatus)
