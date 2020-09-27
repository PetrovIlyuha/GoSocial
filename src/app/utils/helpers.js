// validate form to check if there are any empty fields left by the user
export const emptyFieldCheck = stateToCheck =>
  Object.values(stateToCheck)
    .filter(el => typeof el !== "object")
    .some(elem => elem.trim() === "")

export function delay(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

export function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
}
