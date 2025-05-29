export const generateRandomArr = (): number[] => {
  const arr: number[] = []

  let num = Math.floor(Math.random() * 25) + 1

  arr.push(num)

  for (let i = 1; i < 20; i++) {
    num +=
      Math.floor(Math.random() * 19) + 1 === i ? 0 : Math.floor(Math.random() * i) + (Math.floor(Math.random() * 5) + 1)
    arr[i] = num
  }

  return arr
}
