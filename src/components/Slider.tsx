import React from 'react'

type SliderProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
}

const Slider: React.FC<SliderProps> = (props) => {
  const { children, open, setOpen } = props
  return (
    <div
      className={`fixed z-[9999] top-0 left-0 ${
        open ? 'w-screen h-screen bg-black/20' : 'w-0 h-0 bg-transparent'
      } transition-all duration-200`}
    >
      <div className="bg-neutral-800 p-4 absolute right-0 top-0 w-[600px] h-full text-neutral-100 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h6 className="font-bold text-2xl">Searching Steps</h6>
          <button onClick={() => setOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
export default Slider
