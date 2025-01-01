import { MESSAGE_TYPE } from '@msw-devtools/connect'

const saveTo = async (...asd: any[]) => {
  const jsonData = asd[0]
  return new Promise<void>((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: MESSAGE_TYPE.setJsonConfig, payload: jsonData },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            'Error sending message:',
            chrome.runtime.lastError.message
          )
          reject(chrome.runtime.lastError)
        } else if (response?.status === 'success') {
          resolve()
        } else {
          reject(new Error('Failed to process the JSON in background.'))
        }
      }
    )
  })
}

document.getElementById('uploadButton')?.addEventListener('click', () => {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement
  const file = fileInput.files?.[0]

  if (!file) {
    alert('Please select a JSON file.')
    return
  }
  const reader = new FileReader()

  reader.onload = function (event) {
    try {
      const jsonData = JSON.parse(event.target?.result as string)

      saveTo(jsonData)
        .then(() => {
          document.getElementById('status')!.textContent =
            'JSON uploaded successfully!'
        })
        .catch((error) => {
          document.getElementById('status')!.textContent =
            'Failed to upload JSON.'
        })
    } catch (error) {
      console.error(error)
      document.getElementById('status')!.textContent = 'Invalid JSON file.'
    }
  }

  reader.readAsText(file)
})
