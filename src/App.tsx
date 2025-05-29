import React, { useEffect, useRef, useState } from 'react'
import { generateRandomArr } from './utils/generateRandomArr'

type Step = {
  low: number
  high: number
  comment: string
}

export const App: React.FC = () => {
  const [arr, setArr] = useState<Array<number> | null>([
    14, 18, 19, 24, 29, 31, 37, 44, 52, 63, 73, 84, 91, 97, 102, 109, 125, 137, 152, 163
  ])
  const [low, setLow] = useState(0)
  const [high, setHigh] = useState(0)
  const [target, setTarget] = useState<number>()
  const [state, setState] = useState<'searching' | 'paused' | 'finished'>('paused')
  const [mid, setMid] = useState(0)
  const [loading, setLoading] = useState(false)
  const [steps, setSteps] = useState<Step[]>([])

  const hasSearchStarted = useRef(false)

  const handleStateChange = () => {
    if (state === 'paused') {
      setState('searching')
      if (!hasSearchStarted.current) {
        hasSearchStarted.current = true
      }
    } else if (state === 'searching') {
      setState('paused')
    } else {
      if (arr) {
        setState('searching')
        setLow(0)
        setMid(0)
        setHigh(arr.length - 1)
        setSteps([])
      }
    }
  }

  useEffect(() => {
    if (arr) {
      setLow(0)
      setHigh(arr.length - 1)
      setMid(0)
      setState('paused')
      hasSearchStarted.current = false
    }
  }, [arr])

  useEffect(() => {
    if (arr && target && state === 'searching') {
      if (low > high) {
        setSteps((prev) => [
          ...prev,
          {
            comment: `Target ${target} not found in the Array.`,
            low,
            high
          }
        ])
        setState('finished')
        return
      }

      let newMid: number
      const newSteps: Step[] = []

      const timeout1 = setTimeout(() => {
        setLoading(true)
        newMid = Math.floor((low + high) / 2)
        newSteps.push({
          low,
          high,
          comment: `Calculated mid = ${newMid} using Math.floor(${low} + ${high} / 2)\nNow, arr[mid] = ${arr[newMid]}, target = ${target}`
        })
        setMid(newMid)
      }, 1000)

      const timeout2 = setTimeout(() => {
        if (arr[newMid] > target) {
          newSteps.push({
            low,
            high,
            comment: `(arr[mid] = ${arr[newMid]}) > (target = ${target}) -> Move high to mid - 1\nhigh = ${newMid - 1}`
          })
          setHigh(newMid - 1)
        } else if (arr[newMid] < target) {
          newSteps.push({
            low,
            high,
            comment: `(arr[mid] = ${arr[newMid]}) < (target = ${target}) -> Move low to mid + 1\nlow = ${newMid + 1}`
          })
          setLow(newMid + 1)
        } else {
          setState('finished')
          newSteps.push({
            low,
            high,
            comment: `(arr[mid] = ${arr[newMid]}) =  (target = ${target})\nElement Found at index ${newMid}`
          })
        }

        setSteps((prev) => [...prev, ...newSteps])
      }, 2000)

      return () => {
        clearTimeout(timeout1)
        clearTimeout(timeout2)
        setLoading(false)
      }
    }
  }, [state, high, low, arr, mid, target])

  return (
    <main className="min-h-dvh max-w-screen w-full bg-neutral-950 text-neutral-200 p-4">
      <h1 className="font-bold text-3xl">
        Binary Search <span className="text-neutral-500">Visulaiser</span>
      </h1>

      <div className="my-12">
        {!arr ? (
          <React.Fragment>
            <div className="w-full grid grid-cols-20">
              {Array.from({ length: 20 }).map((_, idx) => {
                return (
                  <div
                    key={idx}
                    className="border aspect-square border-neutral-400 grid place-items-center text-3xl font-bold"
                  >
                    0
                  </div>
                )
              })}
            </div>
            <button
              className="bg-neutral-100 text-neutral-950 p-4 rounded block mx-auto text-base font-medium px-8 cursor-pointer mt-6 hover:opacity-65 hover:scale-105 active:scale-95 active:opacity-100 transition-all duration-200"
              onClick={() => setArr(generateRandomArr())}
            >
              Generate Random Array
            </button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <section className="space-y-6">
              <div className="w-full grid grid-cols-20">
                {Array.from({ length: 20 }).map((_, idx) => {
                  return (
                    <div key={idx} className="font-medium p-1 text-center">
                      {idx === low ? (
                        <div className="bg-neutral-200 text-neutral-950 font-bold text-base rounded-lg p-4 tip">
                          Low
                        </div>
                      ) : idx === high ? (
                        <div className="bg-neutral-200 text-neutral-950 font-bold text-base rounded-lg p-4 tip">
                          High
                        </div>
                      ) : idx === mid ? (
                        <div className="bg-neutral-200 text-neutral-950 font-bold text-base rounded-lg p-4 tip">
                          Mid
                        </div>
                      ) : (
                        <>&nbsp;</>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="w-full grid grid-cols-20">
                {arr.map((num, idx) => {
                  const isInSearchSpace = idx >= low && idx <= high
                  return (
                    <div
                      onClick={!target ? () => setTarget(num) : () => {}}
                      key={idx}
                      className={`border aspect-square border-neutral-400 grid place-items-center text-3xl font-bold ${
                        hasSearchStarted.current ? (isInSearchSpace ? 'bg-lime-900' : 'bg-rose-950') : ''
                      } ${state === 'finished' && num === target && 'bg-violet-950'}`}
                    >
                      {num}
                    </div>
                  )
                })}
              </div>
              <div className="w-full grid grid-cols-20">
                {Array.from({ length: 20 }).map((_, idx) => {
                  return (
                    <div key={idx} className="font-bold text-center text-neutral-200">
                      {idx}
                    </div>
                  )
                })}
              </div>
            </section>

            <div className="flex items-stretch justify-center gap-6 mt-12">
              <button
                className="bg-transparent text-neutral-100 border-2 border-neutral-200 p-3 rounded-lg text-lg font-medium px-6 cursor-pointer"
                onClick={() => setArr(generateRandomArr())}
              >
                Generate Random Array
              </button>

              <label htmlFor="target">
                <input
                  disabled={hasSearchStarted.current}
                  type="text"
                  inputMode="numeric"
                  name="target"
                  id="target"
                  className="bg-transparent border-2 border-neutral-100 target-input p-3 font-bold text-xl max-w-[260px] rounded-lg focus:outline-neutral-600 placeholder:italic"
                  placeholder="Enter Target Element..."
                  autoComplete="off"
                  value={target ?? ''}
                  onChange={(e) => {
                    let val = e.target.value

                    if (val.trim().length === 0) {
                      return setTarget(undefined)
                    }

                    if (val.length > 1 && val.startsWith('0')) {
                      val = val.slice(1)
                    }

                    if (isNaN(+val)) return

                    setTarget(+val)
                  }}
                />
              </label>
            </div>

            <button
              disabled={!target}
              onClick={handleStateChange}
              className={`block mx-auto uppercase tracking-widest font-bold text-3xl my-12 cursor-pointer border-2 border-neutral-200 rounded-lg bg-neutral-200 text-neutral-950 py-4 px-8 hover:opacity-90 hover:scale-105 active:scale-95 active:opacity-100 transition-all duration-200 ${
                !target && 'cursor-not-allowed active:scale-100 hover:opacity-100 peer'
              }`}
            >
              {state === 'paused' ? 'Start' : state === 'searching' ? 'Pause' : 'Re Start'}
            </button>
            <p className="text-red-500 hidden text-center peer-hover:block font-semibold">
              Please enter a target to start searching...
            </p>

            {steps.length > 0 && (
              <div className="p-4 bg-neutral-900 space-y-4">
                {steps.map((step, idx) => {
                  return (
                    <div key={idx} className="bg-neutral-800 p-4 space-y-3">
                      <h6 className="text-2xl font-bold">Step {idx + 1}</h6>

                      <p className="text-xl font-medium">
                        <span className="font-bold text-neutral-400">Low:</span> {step.low},{' '}
                        <span className="font-bold text-neutral-400">High:</span> {step.high}
                      </p>

                      <pre className="text-lg font-sans">{step.comment}</pre>

                      {idx % 2 === 0 ? (
                        <pre className="bg-gray-900 p-4">
                          const mid = Math.floor({step.low} + {step.high} / 2)
                          <br />
                          console.log(mid){' '}
                          <span className="text-neutral-500">// mid = {Math.floor((step.low + step.high) / 2)}</span>
                          <br />
                          console.log(arr[mid]){' '}
                          <span className="text-neutral-500">
                            // arr[mid] = {arr[Math.floor((step.low + step.high) / 2)]}
                          </span>
                        </pre>
                      ) : (
                        <pre className="bg-gray-900 p-4">
                          <span className="text-neutral-500">// Finding arr[mid]</span>
                          <br />
                          console.log(arr[mid]){' '}
                          <span className="text-neutral-500">
                            // arr[mid] = {arr[Math.floor((step.low + step.high) / 2)]}
                          </span>
                          <br />
                          console.log(target) <span className="text-neutral-500">target = {target}</span>
                          <br />
                          <span className="text-neutral-500">
                            //{' '}
                            {target &&
                              (arr[Math.floor((step.low + step.high) / 2)] > target
                                ? 'arr[mid] > target -> high = mid - 1'
                                : arr[Math.floor((step.low + step.high) / 2)] < target
                                ? 'arr[mid] < target -> low = mid + 1'
                                : `arr[mid] == target -> element found at mid index = ${mid}`)}
                            <br />
                          </span>
                          {target &&
                            (arr[Math.floor((step.low + step.high) / 2)] > target ? (
                              <>if (arr[mid] &gt; target) {<>{'high = mid - 1'}</>}</>
                            ) : arr[Math.floor((step.low + step.high) / 2)] < target ? (
                              <>if (arr[mid] &lt; target) {<>{'low = mid + 1'}</>}</>
                            ) : (
                              <>if (arr[mid] == target) {<>return mid</>}</>
                            ))}
                        </pre>
                      )}
                    </div>
                  )
                })}

                <p>{loading ? 'Loading...' : <>&nbsp;</>}</p>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    </main>
  )
}
