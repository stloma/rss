
let a = []
await function a () {
  return await setTimeout(function () { a = [1] }, 2000)
}
b()
console.log(a)
